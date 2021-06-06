const { Storage } = require('@google-cloud/storage');
const parse = require('csv-parse');
const stream = require('stream');
const util = require('util');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const { parse: parseWkt } = require('wkt');
const ValidationError = require('./validation-error');

const pipeline = util.promisify(stream.pipeline);
dayjs.extend(utc);
const storage = new Storage();

const DataTypes = Object.freeze({
  INTEGER: 'INTEGER',
  FLOAT: 'FLOAT',
  BOOL: 'BOOL',
  TIMESTAMP: 'TIMESTAMP',
  GEOGRAPHY: 'GEOGRAPHY',
  STRING: 'STRING',
});

const LOCAL_FILES_BUCKET_NAME = process.env.LOCAL_FILES_BUCKET_NAME;

const createReadGCSFileStream = (organizationName, analysisName, fileName) => {
  const bucket = storage.bucket(LOCAL_FILES_BUCKET_NAME);
  const GCSFileName = `${organizationName}/${analysisName}/${fileName}`;
  const file = bucket.file(GCSFileName);

  const GCSReadStream = file
    .createReadStream()
    .on('error', function (err) {
      console.error(err);
    })
    .on('end', function () {
      console.log('file stream ended');
    });

  return GCSReadStream;
};

const createParseCSVContentsStream = result => {
  const parserStream = parse({
    delimiter: [',', '\t', ';'],
    columns: true,
    cast: true,
  });
  parserStream.on('readable', function () {
    while ((record = parserStream.read())) {
      if (result.recordsCount === 0) {
        Object.keys(record).forEach(key => (result.columns[key] = {}));
      }
      Object.keys(record).forEach(key =>
        inferColumnType(result.columns[key], record[key])
      );
      result.recordsCount++;
    }
  });
  parserStream.on('end', () => console.log('parser stream ended'));
  return parserStream;
};

const inferColumnType = (columnTypesMap, value) => {
  const type = getCellType(value);
  columnTypesMap[type] = columnTypesMap[type] ? columnTypesMap[type] + 1 : 1;
};

const getCellType = value => {
  if (typeof value === 'number') {
    if (Number.isSafeInteger(value)) {
      return DataTypes.INTEGER;
    }
    return DataTypes.FLOAT;
  }
  if (typeof value === 'boolean') {
    return DataTypes.BOOL;
  }
  if (dayjs.utc(value).isValid()) {
    return DataTypes.TIMESTAMP;
  }
  if (parseWkt(value)) {
    return DataTypes.GEOGRAPHY;
  }
  return DataTypes.STRING;
};

const getColumnTypesMap = async (organizationName, analysisName, fileName) => {
  const result = {
    recordsCount: 0,
    columns: {},
  };
  try {
    await pipeline(
      createReadGCSFileStream(organizationName, analysisName, fileName),
      createParseCSVContentsStream(result)
    );
  } catch (err) {
    if (err.code === 'CSV_INVALID_COLUMN_DEFINITION') {
      throw new ValidationError(
        "CSV file is missing headers row or it's format is invalid."
      );
    }
    throw err;
  }

  return result;
};

const validate = ({ columns }) => {
  const columnsToValidate = Object.keys(columns).map(key => {
    const types = Object.keys(columns[key]);
    const counts = Object.values(columns[key]);
    return {
      name: key,
      type: types[counts.indexOf(Math.max(...counts))],
    };
  });

  checkTimestampColumnExistence(columnsToValidate);
  checkCoordinatesColumnsExistence(columnsToValidate);

  return columnsToValidate;
};

const checkTimestampColumnExistence = columns => {
  if (columns.some(column => column.type === DataTypes.TIMESTAMP)) {
    return;
  }
  throw new ValidationError('File does not contain any timestamp columns');
};

const checkCoordinatesColumnsExistence = columns => {
  if (
    columns.some(
      column =>
        column.type === DataTypes.GEOGRAPHY || column.type === DataTypes.FLOAT
    )
  ) {
    return;
  }
  throw new ValidationError('File does not contain enough float columns');
};

const handleError = (err, res) => {
  console.error('Validation pipeline failed', err);

  if (err instanceof ValidationError) {
    res.status(400).send(
      JSON.stringify({
        status: 'VALIDATION_ERROR',
        error: err.message,
      })
    );
  }
  res.status(500).send(
    JSON.stringify({
      status: 'ERROR',
      error: err,
    })
  );
};

exports.main = async (req, res) => {
  const { organizationName, analysisName, fileName } = req.body;

  if (!fileName || !analysisName || !organizationName) {
    res.status(400).send('Invalid request');
  }

  console.log(
    `Starting validation for: ${organizationName}/${analysisName}/${fileName}`
  );

  try {
    const typesMap = await getColumnTypesMap(
      organizationName,
      analysisName,
      fileName
    );
    console.log('Pipeline succeeded');
    res.status(200).send(
      JSON.stringify({
        status: 'OK',
        columns: validate(typesMap),
      })
    );
  } catch (err) {
    handleError(err, res);
  }
};

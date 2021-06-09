import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Prediction } from '../types/prediction';

interface WindFarmDataProps {
  prediction: Prediction;
}

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    maxWidth: 800,
  },
});

function createData(name: string, value: number | string) {
  return { name, value };
}

const WindFarmData: FC<WindFarmDataProps> = ({ prediction }: WindFarmDataProps) => {
  const classes = useStyles();

  const rows = [
    createData('Электростанция', prediction.windFarm),
    createData('Широта', prediction.latitude),
    createData('Долгота', prediction.longitude),
    createData('Путь к данным прогноза', prediction.dataLocation),
    createData('Путь к данным наблюдений', prediction.sourceData),
  ];

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label='simple table'>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component='th' scope='row'>
                {row.name}
              </TableCell>
              <TableCell align='right'>{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WindFarmData;

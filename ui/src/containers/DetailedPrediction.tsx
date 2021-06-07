import { Box, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import PredictionChart from '../components/PredictionChart';
import WindFarmData from '../components/WindFarmData';
import { Prediction } from '../types/prediction';
import parse from 'csv-parse';

interface DetailedPredictionProps {
  activePrediction: Prediction;
}

export interface ChartData {
  predicted: number;
  Date_time: string;
}

const useStyles = makeStyles({
  root: {
    paddingLeft: '50px',
    paddingTop: '7px',
  },
  farmData: {
    marginTop: '20px',
  },
  chart: {
    marginTop: '30px',
    marginBottom: '30px',
  },
});

const parseChartData = (data: string): Promise<ChartData[]> => {
  return new Promise((resolve, reject) => {
    parse(data, { columns: true, cast: true }, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};

export default function DetailedPrediction({ activePrediction }: DetailedPredictionProps) {
  const classes = useStyles();
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetch(activePrediction.dataLocation, { headers: { 'Content-type': 'text/plain' } })
      .then((data) => data.text())
      .then((data) => parseChartData(data))
      .then((data) => setData(data));
  }, [activePrediction.dataLocation]);

  return (
    <Box className={classes.root}>
      <Typography variant='h5'>{activePrediction.name}</Typography>
      <Box className={classes.farmData}>
        <WindFarmData></WindFarmData>
      </Box>
      <Box className={classes.chart}>{data.length ? <PredictionChart chartData={data}></PredictionChart> : null}</Box>
    </Box>
  );
}

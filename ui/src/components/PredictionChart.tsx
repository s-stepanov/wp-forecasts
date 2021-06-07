import { Box, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Label, Line, Tooltip, CartesianGrid, Brush } from 'recharts';
import theme from '../shared/theme';

export interface ChartData {
  predicted: number;
  Date_time: string;
}

interface PredictionChartProps {
  chartData: ChartData[];
}

const useStyles = makeStyles({
  chartContainer: {
    minHeight: '450px',
  },
});

export default function PredictionChart({ chartData }: PredictionChartProps) {
  const classes = useStyles();

  return (
    <Box className={classes.chartContainer}>
      <Typography>График результатов прогноза</Typography>
      <ResponsiveContainer minHeight={450} width={800} className={classes.chartContainer}>
        <LineChart
          data={chartData}
          margin={{
            top: 16,
            right: 16,
            bottom: 24,
            left: 24,
          }}
        >
          <XAxis dataKey='Date_time' stroke={theme.palette.text.secondary}>
            <Label position='bottom' style={{ fill: theme.palette.text.primary }}>
              Время
            </Label>
          </XAxis>
          <CartesianGrid strokeDasharray='3 3' />
          <Tooltip />
          <Brush dataKey='Date_time' height={30} stroke='#8884d8' />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label angle={270} position='left' style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}>
              Вырабатываемая мощность, кВт
            </Label>
          </YAxis>
          <Line type='monotone' dataKey='predicted' stroke={theme.palette.primary.main} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

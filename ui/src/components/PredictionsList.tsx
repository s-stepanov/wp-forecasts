import { Box, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import { PredictionsContext } from '../contexts/PredictionsContext';
import { Prediction } from '../types/prediction';

interface PredictionsListProps {
  predictions: Prediction[];
}

export default function PredictionsList({ predictions }: PredictionsListProps) {
  const { state, dispatch } = useContext(PredictionsContext);

  const handleListItemClick = (_: any, prediction: Prediction) => {
    dispatch({ activePrediction: prediction });
  };

  return (
    <Box>
      <Typography variant='h5'>Выполненные прогнозы</Typography>
      <List component='nav'>
        {predictions.map((prediction) => (
          <ListItem
            key={prediction.name}
            button
            selected={state.activePrediction?.name === prediction.name}
            onClick={(event) => handleListItemClick(event, prediction)}
          >
            <ListItemText primary={prediction.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

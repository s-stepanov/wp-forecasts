import { useMutation, useQuery } from '@apollo/client';
import { Box, Button, CircularProgress, Grid, makeStyles, Snackbar } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import PredictionsList from '../components/PredictionsList';
import { Prediction } from '../types/prediction';
import MuiAlert from '@material-ui/lab/Alert';
import { PredictionsContext } from '../contexts/PredictionsContext';
import DetailedPrediction from './DetailedPrediction';
import CreatePrediction from './CreatePrediction';
import { PREDICTIONS_QUERY } from '../shared/queries';
import { CREATE_PREDICTION_MUTATION } from '../shared/mutations';
import { CreatePredictionContext } from '../contexts/CreatePredictionContext';

interface PredictionsResponse {
  predictions: Prediction[];
}

const DEFAULT_AUTO_HIDE_DURATION = 6000;

const useStyles = makeStyles({
  root: {
    marginTop: '30px',
    position: 'relative',
  },
  spinner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  content: {
    marginBottom: '40px',
  },
  createPrediction: {
    display: 'block',
    marginLeft: 'auto',
  },
});

export default function PredictionsContainer() {
  const classes = useStyles();
  const { state } = useContext(PredictionsContext);
  const { state: createPredictionState } = useContext(CreatePredictionContext);

  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, error, loading } = useQuery<PredictionsResponse>(PREDICTIONS_QUERY);
  const [createPrediction] = useMutation(CREATE_PREDICTION_MUTATION, {
    refetchQueries: [{ query: PREDICTIONS_QUERY }],
    variables: {
      prediction: {
        analysisName: createPredictionState.analysisName,
        csvPath: createPredictionState.csvPath,
        model: createPredictionState.model,
        latitude: createPredictionState.latitude,
        longitude: createPredictionState.longitude,
        windFarm: createPredictionState.windFarm,
      },
    },
    onCompleted: () => setDialogOpen(false),
  });

  const handleCreatePrediction = () => {
    createPrediction();
  };

  if (!data && loading) {
    return <CircularProgress className={classes.spinner}></CircularProgress>;
  }

  if (!data) {
    return (
      <Snackbar open={!data && !!error} autoHideDuration={DEFAULT_AUTO_HIDE_DURATION}>
        <MuiAlert severity='error'>Не удалось загрузить данные.</MuiAlert>
      </Snackbar>
    );
  }

  return (
    <Box className={classes.root}>
      <Button
        onClick={() => setDialogOpen(true)}
        className={classes.createPrediction}
        variant='contained'
        color='primary'
      >
        Новый Прогноз
      </Button>
      <CreatePrediction
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        handleCreate={handleCreatePrediction}
      ></CreatePrediction>
      <Grid container>
        <Grid item>
          <PredictionsList predictions={data?.predictions}></PredictionsList>
        </Grid>
        <Grid item>
          {state.activePrediction && (
            <DetailedPrediction activePrediction={state.activePrediction}></DetailedPrediction>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

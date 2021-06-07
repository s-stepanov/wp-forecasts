import { useQuery } from '@apollo/client';
import { Box, Button, CircularProgress, Grid, makeStyles, Snackbar } from '@material-ui/core';
import gql from 'graphql-tag';
import React, { useContext } from 'react';
import PredictionsList from '../components/PredictionsList';
import { Prediction } from '../types/prediction';
import MuiAlert from '@material-ui/lab/Alert';
import { PredictionsContext } from '../contexts/PredictionsContext';
import DetailedPrediction from './DetailedPrediction';

interface PredictionsResponse {
  predictions: Prediction[];
}

const PREDICTIONS_QUERY = gql`
  query predictions {
    predictions {
      name
      dataLocation
    }
  }
`;

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

  const { data, error, loading } = useQuery<PredictionsResponse>(PREDICTIONS_QUERY);

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
      <Button className={classes.createPrediction} variant='contained' color='primary'>
        Новый Прогноз
      </Button>
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

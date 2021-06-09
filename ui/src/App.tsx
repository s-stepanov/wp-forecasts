import { Container } from '@material-ui/core';
import React, { useReducer } from 'react';
import './App.css';
import Header from './components/Header';
import PredictionsContainer from './containers/PredictionsContainer';
import { CreatePredictionContext } from './contexts/CreatePredictionContext';
import { PredictionsContext } from './contexts/PredictionsContext';
import { PredictionModel } from './types/prediction';

export const reducer = (state: any, data: any) => {
  return {
    ...state,
    ...data,
  };
};

function App() {
  const [state, dispatch] = useReducer(reducer, { activePrediction: null });
  const [createState, createDispatch] = useReducer(reducer, {
    csvPath: null,
    analysisName: null,
    model: PredictionModel.GRADIENT_BOOSTING,
    file: null,
    latitude: null,
    windFarm: null,
    longitude: null,
  });

  return (
    <div className='App'>
      <Header></Header>
      <Container>
        <PredictionsContext.Provider value={{ dispatch, state }}>
          <CreatePredictionContext.Provider value={{ dispatch: createDispatch, state: createState }}>
            <PredictionsContainer></PredictionsContainer>
          </CreatePredictionContext.Provider>
        </PredictionsContext.Provider>
      </Container>
    </div>
  );
}

export default App;

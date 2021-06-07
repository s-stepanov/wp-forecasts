import { Container } from '@material-ui/core';
import React, { useReducer } from 'react';
import './App.css';
import Header from './components/Header';
import PredictionsContainer from './containers/PredictionsContainer';
import { PredictionsContext } from './contexts/PredictionsContext';

export const reducer = (state: any, data: any) => {
  return {
    ...state,
    ...data,
  };
};

function App() {
  const [state, dispatch] = useReducer(reducer, { activePrediction: null });

  return (
    <div className='App'>
      <Header></Header>
      <Container>
        <PredictionsContext.Provider value={{ dispatch, state }}>
          <PredictionsContainer></PredictionsContainer>
        </PredictionsContext.Provider>
      </Container>
    </div>
  );
}

export default App;

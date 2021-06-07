import { createContext } from 'react';
import { Prediction } from '../types/prediction';

interface ContextTuple<StateType, DispatchType> {
  state: StateType;
  dispatch: DispatchType;
}

interface PredictionsContextState {
  activePrediction: Prediction | null;
}

type PredictionsContextDispatch = (p: Partial<PredictionsContextState>) => void;

type PredictionsContextTuple = ContextTuple<PredictionsContextState, PredictionsContextDispatch>;

export const PredictionsContext = createContext<PredictionsContextTuple>({
  state: { activePrediction: null },
  dispatch: () => {},
});

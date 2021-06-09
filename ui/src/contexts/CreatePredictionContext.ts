import { createContext } from 'react';
import { PredictionModel } from '../types/prediction';

interface ContextTuple<StateType, DispatchType> {
  state: StateType;
  dispatch: DispatchType;
}

interface CreatePredictionContextState {
  csvPath: string | null;
  analysisName: string | null;
  model: PredictionModel;
  file: File | null;
  latitude: number | null;
  longitude: number | null;
  windFarm: string | null;
}

type CreatePredictionContextDispatch = (p: Partial<CreatePredictionContextState>) => void;

type PredictionsContextTuple = ContextTuple<CreatePredictionContextState, CreatePredictionContextDispatch>;

export const CreatePredictionContext = createContext<PredictionsContextTuple>({
  state: {
    csvPath: null,
    analysisName: null,
    model: PredictionModel.GRADIENT_BOOSTING,
    file: null,
    latitude: null,
    longitude: null,
    windFarm: null,
  },
  dispatch: () => {},
});

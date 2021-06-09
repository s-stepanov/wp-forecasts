export interface Prediction {
  name: string;
  dataLocation: string;
  windFarm: string;
  latitude: number;
  longitude: number;
  sourceData: string;
  model: string;
}

export enum PredictionModel {
  GRADIENT_BOOSTING = 'GRADIENT_BOOSTING',
  NEURAL_NETWORK = 'NEURAL_NETWORK',
  RANDOM_FOREST = 'RANDOM_FOREST',
}

import { gql } from '@apollo/client';

export const CREATE_PREDICTION_MUTATION = gql`
  mutation createPrediction($prediction: PredictionPayload!) {
    createPrediction(predictionPayload: $prediction) {
      name
      dataLocation
    }
  }
`;

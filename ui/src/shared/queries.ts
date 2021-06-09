import { gql } from '@apollo/client';

export const PREDICTIONS_QUERY = gql`
  query predictions {
    predictions {
      name
      dataLocation
      windFarm
      latitude
      longitude
      sourceData
      model
    }
  }
`;

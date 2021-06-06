import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Prediction, PredictionPayload } from './prediction';
import { PredictionsService } from './predictions.service';

@Resolver()
export class PredictionsResolver {
  constructor(private predictionsService: PredictionsService) {}

  @Query(() => [Prediction])
  async predictions() {
    return this.predictionsService.getPredictions();
  }

  @Mutation(() => Prediction)
  async createPrediction(
    @Args('predictionPayload') predictionPayload: PredictionPayload,
  ): Promise<Prediction> {
    return this.predictionsService.createPrediction(predictionPayload);
  }
}

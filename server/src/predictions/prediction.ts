import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Prediction {
  @Field()
  name: string;

  @Field()
  dataLocation: string;
}

@InputType()
export class PredictionPayload {
  @Field()
  analysisName: string;

  @Field()
  csvPath: string;
}

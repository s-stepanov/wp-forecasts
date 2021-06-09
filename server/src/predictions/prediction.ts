import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Prediction {
  @Field()
  name: string;

  @Field()
  dataLocation: string;

  @Field({ nullable: true })
  latitude: number | null;

  @Field({ nullable: true })
  longitude: number | null;

  @Field({ nullable: true })
  model: string;

  @Field({ nullable: true })
  sourceData: string;

  @Field({ nullable: true })
  windFarm: string;
}

@InputType()
export class PredictionPayload {
  @Field()
  analysisName: string;

  @Field({ nullable: true })
  latitude: number | null;

  @Field({ nullable: true })
  longitude: number | null;

  @Field()
  model: string;

  @Field({ nullable: true })
  windFarm: string;

  @Field()
  csvPath: string;
}

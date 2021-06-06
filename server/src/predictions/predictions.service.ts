import { HttpService, Injectable } from '@nestjs/common';
import { Prediction, PredictionPayload } from './prediction';
import { map } from 'rxjs/operators';
import { PrismaService } from 'src/prisma.service';

const PREDICT_CLOUD_FUNCTION_URL =
  'https://us-central1-wind-power-forecasting.cloudfunctions.net/predict';

@Injectable()
export class PredictionsService {
  constructor(
    private httpService: HttpService,
    private prismaService: PrismaService,
  ) {}

  async getPredictions(): Promise<Prediction[]> {
    const predictions = await this.prismaService.prediction.findMany();
    return predictions;
  }

  async createPrediction(data: PredictionPayload): Promise<Prediction> {
    const { csvPath, analysisName } = data;

    const result = await this.httpService
      .post(PREDICT_CLOUD_FUNCTION_URL, {
        csvPath,
        analysisName,
      })
      .pipe(map(({ data }) => data))
      .toPromise();

    const savedPrediction = await this.prismaService.prediction.create({
      data: result,
    });

    return savedPrediction;
  }
}

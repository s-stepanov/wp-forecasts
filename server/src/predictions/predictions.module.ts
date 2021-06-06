import { HttpModule, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PredictionsResolver } from './predictions.resolver';
import { PredictionsService } from './predictions.service';

@Module({
  imports: [HttpModule],
  providers: [PredictionsResolver, PredictionsService, PrismaService],
})
export class PredictionsModule {}

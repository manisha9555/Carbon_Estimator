import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstimateController } from './controllers/estimate.controller';
import { HealthController } from './controllers/health.controller';
import { EstimateService } from './services/estimate.service';
import { AiService } from './services/ai.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController, EstimateController, HealthController],
  providers: [AppService, EstimateService, AiService],
})
export class AppModule {}

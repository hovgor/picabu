import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigEnum } from './config/config.enum';
import { ConfigService } from './config/config.service';
import { useSwagger } from './swagger/swagger';
import { setConfig } from './app.config';
import * as dotenv from 'dotenv';
import { convertQueryToNumberMiddleware } from './shared/middlewares/concat.query.middleware';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
    cors: {
      origin: process.env.ALLOWED_ORIGINS,
      credentials: true,
    },
  });

  app.use(convertQueryToNumberMiddleware);
  app.useGlobalPipes(new ValidationPipe());
  setConfig(app);
  useSwagger(app);
  app.enableCors();
  const PORT = app.get(ConfigService).get(ConfigEnum.PORT);
  await app.listen(process.env.PORT || PORT);
  console.log(`Server is listening on http://localhost:${PORT}`);
}
bootstrap();

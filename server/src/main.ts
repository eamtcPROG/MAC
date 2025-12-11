import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './app/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  if (!port) {
    throw new Error('PORT is not set');
  }
  const corsOrigins =
    configService
      .get<string>('cors.origins')
      ?.split(',')
      .map((o) => o.trim()) ?? [];
  if (corsOrigins.length === 0) {
    throw new Error('CORS_ORIGINS is not set');
  }
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });
  const version = configService.get<string>('version');
  if (!version) {
    throw new Error('version is not set');
  }
  const config = new DocumentBuilder()
    .setTitle('API IaaS')
    .setDescription('HTTP API for the IaaS service.')
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(port);
}
void bootstrap();

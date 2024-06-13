import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  
  /* Create app */
  const app = await NestFactory.create(AppModule);

  /* Get Env Variables To Upload App */
  const configService = app.get<ConfigService>(ConfigService);
  const appPort: number = configService.get('app.port') || 3000;
  const appHost: string = configService.get('app.host') || 'localhost';
  const appSwaggerRoute: string = configService.get('app.swaggerRoute') || 'swagger';
  
  /* Upload Swagger Documentation Page */
  const swagger = new DocumentBuilder()
    .setTitle('SCO - Kubide backend')
    .setDescription('Documentación sobre endpoints de la prueba técnica Kubide Backend')
    .setVersion('1.0')
    .addTag('Kubide')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup(appSwaggerRoute, app, document);

  /* Use Global Validation Pipe */
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = Object.values(validationErrors[0].constraints).join(',');
        const splitErrors: string[] = errors.split(',');
        throw new HttpException(splitErrors[splitErrors.length-1], HttpStatus.BAD_REQUEST);
      },
    }),
  );

  /* Start App */
  await app.listen(appPort).then(() => {
    console.log(`[bootstrap] Swagger started in url 'http://${appHost}:${appPort}/${appSwaggerRoute}'`);
    console.log(`[bootstrap] App started in 'http://${appHost}:${appPort}'`);
  });
}
bootstrap();

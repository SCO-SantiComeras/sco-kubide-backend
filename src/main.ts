import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  const appPort: number = configService.get('app.port') || 3000;
  const appHost: string = configService.get('app.host') || 'localhost';
  const appSwaggerRoute: string = configService.get('app.swaggerRoute') || 'swagger';
  
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

  await app.listen(appPort).then(() => {
    console.log(`[bootstrap] Swagger started in url 'http://${appHost}:${appPort}/${appSwaggerRoute}'`);
    console.log(`[bootstrap] App started in 'http://${appHost}:${appPort}'`);
  });
}
bootstrap();

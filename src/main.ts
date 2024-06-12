import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
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
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000).then(() => {
    console.log(`[bootstrap] Swagger started in url 'http://localhost:3000/swagger'`);
    console.log(`[bootstrap] App started in 'http://localhost:3000'`);
  });
}
bootstrap();

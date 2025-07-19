/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:4200', // Reemplaza con la URL de tu frontend de Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

    //lo siguiente es la configuracion para la documentacion SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Documentación del proyecto paypal') //agregamos el titulo 
    .setDescription('Aqui veremos la documentacón Swagger del proyec (controller, Dto)')
    .setVersion('1.0') 
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

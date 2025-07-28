/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Importa SwaggerModule y DocumentBuilder

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuración de archivos estáticos (si los tienes)
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Prefijo global para todas las rutas de la API
  app.setGlobalPrefix('api');

  // Configuración de CORS para permitir solicitudes desde tu frontend de Angular
  app.enableCors({
    origin: '*', // Reemplaza con la URL de tu frontend de Angular en producción
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configuración global de ValidationPipe para validación de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no están definidas en el DTO
      forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no definidas
      transform: true, // Transforma los payloads a instancias de DTO
    }),
  );

  // --- Configuración de Swagger ---
  const config = new DocumentBuilder()
    .setTitle('API de Tu Aplicación Bancaria') // Título de tu API
    .setDescription('Documentación de la API para la aplicación de gestión bancaria.') // Descripción de tu API
    .setVersion('1.0') // Versión de tu API
    .addBearerAuth( // Añade soporte para autenticación con Bearer Token (JWT)
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Introduce tu token JWT aquí',
        in: 'header',
      },
      'access-token' // Nombre para referenciar este esquema de seguridad en los decoradores
    )
    .build();

  // Crea el documento Swagger basado en la aplicación y la configuración
  const document = SwaggerModule.createDocument(app, config);

  // Configura la ruta donde se servirá la UI de Swagger (ej. http://localhost:3000/api/docs)
  SwaggerModule.setup('api/docs', app, document);
  // --- Fin de la Configuración de Swagger ---

  // Inicia la aplicación en el puerto especificado (o 3000 por defecto)
  await app.listen(process.env.PORT ?? 3000);
}

// Llama a la función bootstrap para iniciar la aplicación
bootstrap();

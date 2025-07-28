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
    .setTitle('API de Plataforma de Finanzas Personales Inteligente – PayPal') // Título de tu API
    .setDescription(`
      Este proyecto 💸 Plataforma de Finanzas Personales Inteligente – PayPal fue desarrollado como parte del Taller de Aplicaciones Web de la carrera de Ingeniería Civil en Computación e Informática (Universidad de Tarapacá).

      📋 **Descripción**
      Una aplicación web que actúa como asistente financiero personal para ayudar a los usuarios a gestionar sus ingresos, gastos y hábitos de ahorro mediante visualizaciones interactivas, recomendaciones personalizadas y alertas automáticas.

      🔧 **Tecnologías Utilizadas**
      **Frontend**
      - Angular
      - Bootstrap
      - JWT (seguridad)
      - RxJS (Observables)
      **Backend**
      - NestJS
      - TypeORM
      - PostgreSQL
      - JWT, Hashing, Guards
      - Swagger (documentación API)

      📂 **Estructura del Proyecto**
      \`\`\`
      finanzas-inteligentes-paypal/
      ├── backend/ → Servidor NestJS
      ├── frontend/ → Aplicación Angular
      ├── docs/ → Documentos técnicos y planificación
      \`\`\`

      🚀 **Instrucciones de Instalación**
      **Requisitos Previos**
      - Node.js v18+
      - Angular CLI
      - PostgreSQL
      - Nest CLI

      **Clonar el repositorio**
      \`\`\`bash
      git clone https://github.com/GaboNto/Proyecto_PayPal.git
      cd finanzas-inteligentes-paypal
      \`\`\`
    `) // Descripción de tu API
    .setVersion('3.0') // Versión de tu API
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

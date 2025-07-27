"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API de Plataforma de Finanzas Personales Inteligente – PayPal')
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
    `)
        .setVersion('3.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Introduce tu token JWT aquí',
        in: 'header',
    }, 'access-token')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map
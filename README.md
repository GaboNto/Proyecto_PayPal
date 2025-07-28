# Plataforma de Finanzas Personales Inteligente – PayPal

Este proyecto es una plataforma de finanzas personales inspirada en servicios como PayPal. Desarrollada como parte del Taller de Aplicaciones Web en la Universidad de Tarapacá, permite a los usuarios gestionar sus cuentas, realizar transferencias, controlar sus movimientos y recibir recomendaciones inteligentes de ahorro y gasto.

---

## Estructura del Proyecto

```
Proyecto_PayPal/
├── backend/           # API RESTful desarrollada con NestJS
├── paypal/            # Aplicación web frontend desarrollada en Angular
└── README.md          # Este archivo
```

---

## Tecnologías Principales

### Backend (NestJS)
- NestJS + TypeORM
- PostgreSQL
- JWT + bcrypt
- Swagger

### Frontend (Angular)
- Angular + RxJS + Bootstrap
- Ngx-Charts para gráficos
- JWT para autenticación
- Angular Router + Guards

---

## Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/GaboNto/Proyecto_PayPal.git
cd Proyecto_PayPal-main
```

### 2. Backend
```bash
cd backend
npm install
npm run start:dev
```
La API estará disponible en `http://localhost:3000` y la documentación Swagger en `http://paypai.sytes.net:3000/api/docs`.

### 3. Frontend
```bash
cd paypal
npm install
ng serve
```
La app estará disponible en `http://localhost:4200`.

---

## 📘 Backend

### Objetivo

- Procesar operaciones financieras como ingresos y egresos.
- Autenticar y autorizar usuarios con JWT.
- Proveer datos al frontend para visualización de estadísticas y gráficas.
- Generar recomendaciones personalizadas.

### Estructura del Backend

```
backend/
├── src/
│   ├── auth/              # Módulo de autenticación (JWT, login, registro)
│   ├── users/             # Gestión de usuarios
│   ├── cuentas/           # Módulo de cuentas bancarias
│   ├── card/              # Gestión de tarjetas de crédito/débito
│   ├── movimientos/       # Registro de transacciones financieras
│   ├── movimiento/        # (Módulo duplicado, revisar si se unifican)
│   ├── destinatarios/     # Gestión de destinatarios para transferencias
│   ├── transfers/         # Transferencias entre cuentas
│   ├── pagos/             # Procesamiento de pagos
│   ├── chatbot/           # Chatbot para asistencia financiera
│   └── ...
├── main.ts, app.module.ts, etc.
```

### Testing

Las pruebas están en desarrollo utilizando Jest. Ejecutar con:
```bash
ng test
```

---

## Frontend

### Descripción

Aplicación Angular que permite a los usuarios:
- Gestionar ingresos, egresos, transferencias.
- Visualizar estadísticas financieras interactivas.
- Recibir recomendaciones y alertas automáticas.
- Autenticarse de forma segura y acceder a funcionalidades avanzadas.

### Estructura del Frontend

```
src/
├── app/
│   ├── components/
│   ├── configuracion/
│   ├── paypal/
│   ├── services/
│   ├── utils/
│   ├── app.routes.ts
│   └── auth.guard.ts
├── assets/
├── main.ts, index.html, styles.scss, etc.
```

### Scripts Útiles

```bash
ng serve                          # Servidor de desarrollo
ng build                          # Compila la app
ng build --configuration production  # Compila para producción
```

---

## Licencia

Este proyecto tiene fines **educativos** exclusivamente.

---

## Créditos

Desarrollado como parte del Taller de Aplicaciones Web - Universidad de Tarapacá  
Carrera: Ingeniería Civil en Computación e Informática
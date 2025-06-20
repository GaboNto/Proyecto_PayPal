# Proyecto_PayPal

# 💸 Plataforma de Finanzas Personales Inteligente – PayPal

Este proyecto fue desarrollado como parte del Taller de Aplicaciones Web de la carrera de Ingeniería Civil en Computación e Informática (Universidad de Tarapacá).

## 📋 Descripción

Una aplicación web que actúa como asistente financiero personal para ayudar a los usuarios a gestionar sus ingresos, gastos y hábitos de ahorro mediante visualizaciones interactivas, recomendaciones personalizadas y alertas automáticas.

## 🚀 Tecnologías Utilizadas

- **Frontend**: Angular 16, Bootstrap 5, Chart.js
- **Backend**: NestJS, TypeORM, PostgreSQL
- **Seguridad**: JWT, Google Authenticator
- **Dev Tools**: Git, GitHub, Visual Studio Code

---

## 📦 Funcionalidades Principales

- ✅ Autenticación segura con JWT
- 🔐 Verificación en dos pasos con Google Authenticator
- 📊 Dashboard financiero con gráficos interactivos
- 💸 Transferencias entre cuentas con validaciones
- 💳 Gestión de tarjetas (agregar, visualizar tipo/estado)
- 📂 Historial de transacciones con filtros por fecha y categoría
- 🔄 Recuperación de contraseña
- ⚙️ Configuración de seguridad del usuario
- 🔒 Protección de rutas según sesión activa

 ---
 
## 🛠️ Instalación y Ejecución

### 📍 Requisitos Previos

- Node.js (v18+)
- Angular CLI
- NestJS CLI
- PostgreSQL (con base de datos creada)
- Git

---

## 🖥️ Frontend - Angular

```bash
cd frontend
npm install
ng serve
```
Abre http://localhost:4200 en tu navegador.

---

## 🔙 Backend - NestJS

```bash
cd backend
npm install
npm run start:dev
```
Asegúrate de configurar el archivo .env con tu base de datos y clave secreta para JWT.

### 🔧 Clonación del Repositorio

```bash
git clone https://github.com/tu-usuario/finanzas-personales.git
cd finanzas-personales
```
## 📌 Metodología
El proyecto se gestiona mediante Kanban, con roles separados para frontend, backend y líder de equipo.

## 👥 Autores
- [Manuel Lopez, Kevin Rojas, Sebastian Cayupi] – Frontend
- [Felipe Guzman, Bryan Vidaurre, Juan Meneses] – Backend
- [Gabriel Pailamilla] – Líder de Proyecto

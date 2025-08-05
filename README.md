# GEOTRACAR 🚗🔍

**Sistema de Gestión y Rastreo Vehicular**  
Proyecto académico | Ingeniería en Tecnologías de Información  
Universidad Técnica Nacional, San Carlos, Costa Rica

---

## 📖 Descripción

**GEOTRACAR** es una solución híbrida para gestionar vehículos, órdenes de rastreo, localización geoespacial y clientes, usando **PostgreSQL** y **MongoDB**.  
Incluye panel de administración, autenticación JWT, pagos y visualización de rutas en tiempo real.

---

## 📂 Estructura general

```plaintext
proyecto_bd_geotracar/
│
├── geotracar-api/          # Backend Node.js + Express
│   ├── src/
│   ├── package.json
│   ├── .env
│   └── ...
│
├── geotracar-frontend/     # Frontend React
│   ├── src/
│   ├── package.json
│   ├── .env
│   └── ...
│
├── docs/                   # Documentación, scripts SQL, ERD, manuales
│   └── ...
│
└── README.md               # Este archivo
```

---

## 🚀 Instalación rápida

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/proyecto_bd_geotracar.git
cd proyecto_bd_geotracar
```

### 2. Configura las variables de entorno

Copia los archivos de ejemplo y edítalos con tus credenciales:

```bash
# Backend
cp geotracar-api/.env.example geotracar-api/.env

# Frontend
cp geotracar-frontend/.env.example geotracar-frontend/.env
```
> Edita ambos `.env` con los datos de tus bases de datos, puertos, claves, etc.

### 3. Instala dependencias

**Backend**
```bash
cd geotracar-api
npm install
```

**Frontend**
```bash
cd ../geotracar-frontend
npm install
```

### 4. Configura la base de datos

- **PostgreSQL:**  
  Ejecuta los scripts SQL (ej. `/docs/proyectobd_1_esquema.sql`) usando PgAdmin o consola.
- **MongoDB:**  
  Asegúrate de tener MongoDB corriendo localmente o en la nube (según tu `.env`).

### 5. Corre el backend

```bash
cd geotracar-api
npm run dev
```

### 6. Corre el frontend

```bash
cd ../geotracar-frontend
npm run dev
```

---

## 🧰 Dependencias principales

**Backend**
- Node.js / Express
- Sequelize (ORM PostgreSQL)
- Mongoose (ODM MongoDB)
- jsonwebtoken
- bcryptjs
- multer
- cors
- dotenv
- qrcode
- node-geocoder

**Frontend**
- React
- react-router-dom
- axios
- react-icons
- leaflet y react-leaflet (mapas)
- tailwindcss

---

## 🛡️ Seguridad

- Autenticación con JWT y rutas protegidas
- Encriptación de contraseñas con bcrypt
- Validación de formularios (frontend & backend)

---

## 🗄️ Scripts SQL

Incluidos en `/docs/proyectobd_1_esquema.sql` para crear tablas, relaciones y llaves foráneas en PostgreSQL.

---

## 📚 Manual de usuario y documentación

- Manual de usuario: `/docs/Manual_Usuario.pdf`
- Diagrama ERD y documentación adicional en `/docs/`

---

## 👨‍💻 Créditos y autores

Desarrollado por:
- Jairo Rodríguez
- Sebastián Valverde
- Jefry Morera

Docente: **Efren Jiménez Delgado**

---

## 💡 Notas

- Si ves advertencias CRLF/LF, revisa el archivo `.gitattributes` incluido.
- Para soporte, abre un issue o contacta a los autores.

---

¡Gracias por usar GEOTRACAR! 🚚📡

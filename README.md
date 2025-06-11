# SuperPrecios

Sistema de gestión de precios especiales para productos, desarrollado con React, TypeScript, Node.js y MongoDB.

## Funcionamiento de la Aplicación

### Nivel Cliente (Frontend)

La aplicación frontend está construida como una Single Page Application (SPA) que proporciona una interfaz intuitiva para gestionar productos y precios especiales. Los usuarios pueden:

- Visualizar un catálogo de productos con información detallada
- Buscar productos por nombre o categoría
- Ver precios especiales asignados a usuarios específicos
- Gestionar precios especiales a través de un formulario dedicado
- Recibir feedback inmediato sobre sus acciones mediante notificaciones
- Navegar entre diferentes secciones sin recargas de página

### Nivel Servidor (Backend)

El backend proporciona una API RESTful que maneja:

- Gestión de productos (CRUD)
- Gestión de precios especiales
- Verificación de salud del sistema
- Conexión con la base de datos MongoDB
- Manejo de errores y validaciones
- Respuestas optimizadas para el cliente

### Experiencia de Usuario

La aplicación está diseñada pensando en la experiencia del usuario:

- **Interfaz Responsiva**: Se adapta a diferentes tamaños de pantalla
- **Feedback Visual**: Notificaciones claras para acciones exitosas y errores
- **Carga Optimizada**: Lazy loading de imágenes y paginación eficiente
- **Navegación Intuitiva**: Menú claro y rutas bien definidas
- **Estados de Carga**: Indicadores visuales durante operaciones asíncronas
- **Validaciones en Tiempo Real**: Feedback inmediato en formularios

## Justificación de Elecciones Técnicas

### Frontend

- **React + TypeScript**:

  - TypeScript proporciona tipado estático, mejorando la mantenibilidad y reduciendo errores
  - React permite una UI reactiva y eficiente con su modelo de componentes

- **Redux Toolkit**:

  - Gestión centralizada del estado
  - Reducción de boilerplate code
  - Mejor manejo de operaciones asíncronas

- **Tailwind CSS**:

  - Desarrollo rápido de interfaces
  - Consistencia en el diseño
  - Optimización automática de estilos

- **Vite**:
  - Desarrollo más rápido que Next.js
  - Mejor rendimiento en desarrollo
  - Hot Module Replacement eficiente

### Backend

- **Node.js + Express**:

  - JavaScript en ambos lados (frontend y backend)
  - Gran ecosistema de paquetes
  - Fácil de escalar

- **MongoDB**:

  - Flexibilidad en el esquema de datos
  - Buen rendimiento para operaciones de lectura/escritura
  - Fácil integración con Node.js

- **TypeScript**:
  - Consistencia con el frontend
  - Mejor mantenibilidad del código
  - Detección temprana de errores

## Pasos para ejecutar el proyecto localmente

## Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/hneudev/SuperPrecios.git
   cd SuperPrecios
   ```

2. **Instalar dependencias del backend**

   ```bash
   cd server
   npm install
   ```

3. **Instalar dependencias del frontend**
   ```bash
   cd ../client
   npm install
   ```

## Configuración del Proyecto

### 1. Configuración del Backend

1. **Crear archivo `.env` en el directorio `server`**

   ```env
   PORT=5000
   MONGODB_URI=tu_uri_de_mongodb
   ```

   - `PORT`: Puerto donde se ejecutará el servidor (por defecto: 5000)
   - `MONGODB_URI`: URL de conexión a MongoDB (ejemplo: mongodb+srv://usuario:contraseña@cluster.mongodb.net/database)

### 2. Configuración del Frontend

1. **Configuración para Desarrollo**
   Crear archivo `.env` en el directorio `client`:

   ```env
   VITE_API_URL=http://localhost:5000
   ```

2. **Asegurarse que los archivos .env estén en .gitignore**
   Verificar que el archivo `.gitignore` incluya:
   ```
   # Environment variables
   .env
   .env.local
   .env.development
   .env.production
   ```

## Ejecución del Proyecto

### Desarrollo Local

1. **Iniciar el Backend**

   ```bash
   cd server
   npm run dev
   ```

   El servidor estará disponible en `http://localhost:5000`

2. **Iniciar el Frontend**
   ```bash
   cd client
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`

### Producción

1. **Construir el Frontend**

   ```bash
   cd client
   npm run build
   ```

   Esto generará una versión optimizada en el directorio `dist`

2. **Previsualizar la versión de producción**
   ```bash
   cd client
   npm run preview
   ```

## Estructura del Proyecto

```
SuperPrecios/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/        # Páginas de la aplicación
│   │   ├── store/        # Estado global (Redux)
│   │   └── utils/        # Utilidades
│   └── public/           # Archivos estáticos
└── server/               # Backend Node.js
    ├── src/
    │   ├── controllers/  # Controladores
    │   ├── models/      # Modelos de MongoDB
    │   ├── routes/      # Rutas de la API
    │   └── middleware/  # Middleware
    └── config/          # Configuración
```

## Tecnologías Utilizadas

### Frontend

- React 18
- TypeScript
- Redux Toolkit
- Tailwind CSS
- Vite
- React Router
- Lucide Icons

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- TypeScript

## Servidores desplegados

- [https://superprecios.onrender.com/](https://superprecios.onrender.com/) (backend)
- [https://super-precios.vercel.app/](https://super-precios.vercel.app/) (frontend)

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## Contacto

Hector Neudert - hneudev@gmail.com

Link del Proyecto: [https://github.com/hneudev/SuperPrecios/](https://github.com/hneudev/SuperPrecios/)

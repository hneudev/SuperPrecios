# SuperPrecios - Desafío DRENVÍO

## Introducción

SuperPrecios es una aplicación web desarrollada como parte del desafío técnico de DRENVÍO. La aplicación permite gestionar productos y sus precios especiales, ofreciendo una interfaz intuitiva para visualizar y administrar precios personalizados para diferentes usuarios.

## Características Principales

- Visualización de productos con precios especiales
- Gestión de precios especiales por usuario
- Interfaz de usuario moderna y responsiva
- Monitoreo de estado de conexión en tiempo real
- Búsqueda y filtrado de productos
- Validación de datos en tiempo real

## Requisitos Previos

- Node.js (v18 o superior)
- npm (v9 o superior)
- MongoDB Atlas (cuenta gratuita)

## Pasos para Ejecutar Localmente

1. **Clonar el Repositorio**

```bash
git clone [URL_DEL_REPOSITORIO]
cd SuperPrecios
```

2. **Instalar Dependencias**

```bash
# Instalar dependencias del proyecto principal
npm install

# Instalar dependencias del cliente
cd client
npm install

# Instalar dependencias del servidor
cd ../server
npm install
```

3. **Configurar Variables de Entorno**
   Crear un archivo `.env` en la carpeta `server` con las siguientes variables:

```env
MONGODB_URI=mongodb+srv://drenviochallenge:m1jWly3uw42cBwp6@drenviochallenge.2efc0.mongodb.net/
PORT=5000
```

4. **Iniciar la Aplicación**

```bash
# Desde la raíz del proyecto
npm run dev
```

La aplicación estará disponible en:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Justificación de Elecciones Técnicas

### TypeScript

Se eligió TypeScript por las siguientes razones:

- Tipado estático que ayuda a prevenir errores en tiempo de desarrollo
- Mejor autocompletado y documentación en el IDE
- Interfaces y tipos que mejoran la mantenibilidad del código
- Facilita la refactorización y el mantenimiento a largo plazo

### React

- Biblioteca moderna y eficiente para construir interfaces de usuario
- Componentes reutilizables y mantenibles
- Gran ecosistema de herramientas y bibliotecas
- Excelente rendimiento con el Virtual DOM

### Redux Toolkit

- Gestión centralizada del estado de la aplicación
- Reducción de código boilerplate
- Herramientas integradas para manejar efectos secundarios
- Mejor organización del código y separación de responsabilidades

### MongoDB

- Base de datos NoSQL flexible y escalable
- Esquema dinámico que permite adaptarse a cambios en los requisitos
- Excelente rendimiento para operaciones de lectura/escritura
- Fácil integración con Node.js

## Estructura del Proyecto

```
SuperPrecios/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── store/         # Configuración de Redux
│   │   │   └── slices/    # Reducers y acciones
│   │   └── assets/        # Recursos estáticos
│   └── package.json
├── server/                 # Backend Node.js
│   ├── src/
│   │   ├── controllers/   # Controladores de la API
│   │   ├── models/        # Modelos de MongoDB
│   │   ├── routes/        # Rutas de la API
│   │   └── config/        # Configuración
│   └── package.json
└── package.json           # Scripts y dependencias principales
```

## API Endpoints

### Productos

- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos?idUsuario={id}` - Obtener productos con precios especiales

### Precios Especiales

- `GET /api/precios-especiales` - Obtener todos los precios especiales
- `POST /api/precios-especiales` - Crear un nuevo precio especial

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Autor

Hector Francisco Neudert Rocha

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

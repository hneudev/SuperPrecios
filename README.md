# SuperPrecios

Aplicación web para gestionar precios especiales de productos, desarrollada con React, TypeScript, Node.js y MongoDB.

## Características

### Gestión de Productos

- Visualización de productos en un grid de tarjetas responsive
- Búsqueda por nombre o categoría
- Filtrado de productos
- Paginación configurable (12, 24 o todos los productos)
- Lazy loading de imágenes con placeholders
- Indicadores de stock y precios especiales

### Precios Especiales

- Asignación de precios especiales por usuario
- Visualización de precios originales y especiales
- Historial de precios especiales
- Notas y comentarios para cada precio especial

### Interfaz de Usuario

- Diseño moderno y responsive
- Tarjetas de producto con animaciones y efectos hover
- Indicadores de estado de conexión
- Mensajes de error y éxito intuitivos
- Paginación con controles intuitivos
- Selector de cantidad de items por página

### Características Técnicas

- Lazy loading de imágenes
- Debounce en búsquedas
- Manejo de estados de carga y error
- Verificación de salud del backend
- Optimización de rendimiento
- Diseño responsive para todos los dispositivos

## Tecnologías Utilizadas

### Frontend

- React 18
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Router
- Lucide Icons

### Backend

- Node.js
- Express
- MongoDB
- Mongoose

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/hneudev/SuperPrecios/
cd superprecios
```

2. Instala las dependencias:

```bash
# Instalar dependencias del cliente
cd client
npm install

# Instalar dependencias del servidor
cd ../server
npm install
```

3. Configura las variables de entorno:

```bash
# En el directorio server
cp .env.example .env
```

4. Inicia la aplicación:

```bash
# Iniciar el servidor (desde el directorio server)
npm run dev

# Iniciar el cliente (desde el directorio client)
npm run dev
```

## Estructura del Proyecto

```
superprecios/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/        # Páginas principales
│   │   ├── hooks/        # Custom hooks
│   │   ├── utils/        # Utilidades y helpers
│   │   └── store/        # Estado global Redux
│   └── public/           # Archivos estáticos
│
└── server/                # Backend Node.js
    ├── src/
    │   ├── controllers/  # Controladores de rutas
    │   ├── models/       # Modelos de MongoDB
    │   ├── routes/       # Definición de rutas
    │   └── utils/        # Utilidades del servidor
    └── .env             # Variables de entorno
```

## Características de la UI

### Grid de Productos

- Diseño responsive con 1-4 columnas según el tamaño de pantalla
- Tarjetas con efecto hover y sombras
- Imágenes con lazy loading y placeholders
- Indicadores de stock y precios especiales
- Paginación configurable

### Sistema de Paginación

- Selector de items por página (12, 24, todos)
- Navegación intuitiva con números de página
- Indicador de rango actual de productos
- Botones de navegación con estados disabled

### Manejo de Imágenes

- Lazy loading para mejor rendimiento
- Placeholders durante la carga
- Mensaje de error cuando la imagen no está disponible
- Efecto zoom al hover

### Estados de Carga y Error

- Spinners de carga
- Mensajes de error descriptivos
- Indicadores de estado de conexión
- Feedback visual para acciones del usuario

## Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## Contacto

Tu Nombre - [@tutwitter](https://twitter.com/tutwitter) - email@ejemplo.com

Link del Proyecto: [https://github.com/hneudev/SuperPrecios/](https://github.com/hneudev/SuperPrecios/)

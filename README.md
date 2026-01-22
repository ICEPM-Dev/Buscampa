# Buscampa

Plataforma web para conectar iglesias con personas interesadas en campamentos cristianos en Argentina. Permite a las iglesias publicar y gestionar campamentos, mientras que los usuarios pueden explorar, inscribirse y participar.

## Características

### Para Iglesias

- **Publicación de Campamentos**: Crear y gestionar campamentos con detalles completos (fechas, ubicación, precio, descripción)
- **Gestión de Inscripciones**: Ver y administrar todas las inscripciones recibidas
- **Dashboard Interactivo**: Estadísticas en tiempo real y gestión centralizada
- **Control de Acceso**: Solo administradores de iglesia pueden gestionar sus campamentos

### Para Usuarios

- **Exploración de Campamentos**: Buscar y filtrar campamentos disponibles
- **Inscripción Fácil**: Proceso simple para registrarse en campamentos
- **Perfil Personal**: Gestión de datos personales y ver inscripciones activas

## Tecnologías

### Backend (NestJS)

- **Framework**: NestJS con TypeScript
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: JWT con Passport
- **Validación**: Class-validator
- **Hashing**: bcrypt para contraseñas

### Frontend (React)

- **Framework**: React 18 con TypeScript
- **Enrutamiento**: React Router
- **Estilos**: Tailwind CSS
- **Estado**: Context API para autenticación
- **Notificaciones**: React Hot Toast
- **Iconos**: Lucide React

### Infraestructura

- **Build**: Vite para desarrollo rápido
- **Linting**: ESLint para calidad de código
- **Formateo**: Prettier

## Estructura del Proyecto

```
buscampa/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── app.module.ts    # Módulo raíz
│   │   ├── main.ts          # Punto de entrada
│   │   ├── auth/            # Módulo de autenticación
│   │   │   ├── auth.service.ts      # Lógica de auth
│   │   │   ├── auth.controller.ts   # Endpoints de auth
│   │   │   ├── guards/              # Guards JWT
│   │   │   └── strategies/          # Estrategias Passport
│   │   ├── campamento/      # Módulo de campamentos
│   │   ├── inscription/     # Módulo de inscripciones
│   │   ├── prisma/          # Configuración BD
│   │   └── types/           # Tipos compartidos
│   └── prisma/
│       ├── schema.prisma    # Esquema de BD
│       └── migrations/      # Migraciones
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── main.tsx         # Punto de entrada React
│   │   ├── App.tsx          # Componente principal
│   │   ├── contexts/        # Contextos React
│   │   ├── hooks/           # Hooks personalizados
│   │   ├── services/        # Servicios API
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas de la app
│   │   ├── types/           # Definiciones TypeScript
│   │   └── utils/           # Utilidades
│   └── vite.config.ts       # Configuración Vite
└── README.md               # Este archivo
```

## Modelo de Datos

### Usuario (User)

- ID único
- Email único
- Nombre
- Contraseña hasheada
- Tipo: USER o IGLESIA
- Teléfono opcional
- ID de iglesia (para usuarios de iglesia)

### Iglesia (Church)

- ID único
- Nombre
- Denominación
- Teléfono opcional
- ID del usuario administrador

### Campamento (Camp)

- ID único
- Nombre
- Descripción opcional
- Ubicación
- Fechas de inicio y fin
- Precio
- ID de iglesia organizadora

### Inscripción (Registration)

- ID único
- ID de usuario
- ID de campamento
- Nombre completo del participante
- Email
- Teléfono

## Autenticación

La aplicación utiliza JWT (JSON Web Tokens) para autenticación:

1. **Registro**: Usuarios normales o iglesias crean cuenta
2. **Login**: Validación de credenciales y emisión de token
3. **Protección**: Guards verifican tokens en rutas protegidas
4. **Refresh**: Actualización automática de datos de usuario

## Instalación y Uso

### Prerrequisitos

- Node.js 18+
- PostgreSQL
- npm

### Backend

```bash
cd backend
npm install
# Configurar .env con DATABASE_URL
npx prisma generate
npx prisma migrate
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Configuración Inicial

Configurar las variables de entorno en `backend/.env` y `frontend/` según sea necesario.

### Variables de Entorno

```env
# Base de datos (PostgreSQL local o remota)
DATABASE_URL="postgresql://buscampa_user:buscampa_pass@localhost:5432/buscampa"

# Puerto del backend
PORT=3000

# JWT Secret (cambiar en producción)
JWT_SECRET="tu-super-secret-jwt-key-cambiar-en-produccion"

# Frontend (URL de la API)
VITE_API_URL="http://localhost:3000"
```

## API Endpoints

### Autenticación

- `POST /auth/register` - Registro de usuario
- `POST /auth/register/church` - Registro de iglesia
- `POST /auth/login` - Login
- `GET /auth/me` - Datos del usuario actual
- `PUT /auth/me` - Actualizar perfil
- `PUT /auth/password` - Cambiar contraseña
- `PUT /auth/delete-account` - Eliminar cuenta

### Campamentos

- `GET /campamentos` - Listar campamentos
- `GET /campamentos/:id` - Detalles de campamento
- `POST /campamentos` - Crear campamento (iglesias)
- `PUT /campamentos/:id` - Actualizar campamento
- `DELETE /campamentos/:id` - Eliminar campamento
- `POST /campamentos/:id/inscribirse` - Inscribirse
- `GET /campamentos/:id/inscripciones` - Ver inscripciones

### Inscripciones

- `GET /inscription/me` - Mis inscripciones

## Testing

```bash
# Backend
npm run test
npm run test:e2e

# Frontend
npm run test
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia GNU AGPLv3.

## Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

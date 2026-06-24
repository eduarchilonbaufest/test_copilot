# JWT Auth App

Aplicación full-stack de autenticación con JWT compuesta por un backend **FastAPI** y un frontend **React**. Incluye login protegido con tokens de acceso y refresco, y una página de bienvenida de acceso restringido.

---

## Estructura del proyecto

```
test_copilot/
├── backend/                 # API REST — FastAPI + JWT
│   ├── app/
│   │   ├── __init__.py
│   │   ├── auth.py          # Hashing, creación y validación de tokens
│   │   ├── config.py        # Variables de entorno
│   │   ├── models.py        # Esquemas Pydantic
│   │   └── main.py          # Rutas FastAPI + CORS
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── pyproject.toml
│   └── README.md
├── frontend/                # SPA — React + Vite
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Estado de sesión (sessionStorage)
│   │   ├── services/
│   │   │   └── auth.js            # Llamadas HTTP al backend
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx # Guard de rutas privadas
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx      # Pantalla de login
│   │   │   ├── LoginPage.module.css
│   │   │   ├── WelcomePage.jsx    # Pantalla de bienvenida (protegida)
│   │   │   └── WelcomePage.module.css
│   │   ├── App.jsx                # Router principal
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Design tokens globales
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── DESIGN.md                # Sistema de diseño Apple-inspired
└── README.md                # Este archivo
```

---

## Requisitos previos

| Herramienta | Versión mínima |
|-------------|---------------|
| Python      | 3.11          |
| Poetry      | 1.8           |
| Node.js     | 20 LTS        |
| npm         | 10            |
| Docker *(opcional)* | 24   |

---

## Instalación y puesta en marcha

### 1 — Backend

#### Opción A: con Docker Compose (recomendada)

```bash
cd backend
docker compose up --build
```

La API quedará disponible en `http://localhost:8000`.

#### Opción B: con Poetry

```bash
cd backend
poetry install
poetry run uvicorn app.main:app --reload --port 8000
```

#### Variables de entorno (opcionales)

| Variable           | Valor por defecto                          | Descripción                          |
|--------------------|--------------------------------------------|--------------------------------------|
| `SECRET_KEY`       | `supersecretkey-change-in-production-please` | Clave de firma JWT                   |
| `ALLOWED_ORIGINS`  | `http://localhost:3000`                    | Orígenes CORS permitidos (separados por coma) |

### 2 — Frontend

```bash
cd frontend
npm install        # solo la primera vez
npm run dev        # servidor de desarrollo en http://localhost:3000
```

> El servidor de desarrollo de Vite actúa como proxy hacia el backend: todas las peticiones a `/api/*` se reenvían a `http://localhost:8000`.

---

## Endpoints del backend

| Método | Ruta             | Descripción                                    |
|--------|------------------|------------------------------------------------|
| GET    | `/health`        | Verificación de disponibilidad del servicio    |
| POST   | `/token`         | Autenticación — devuelve access + refresh token |
| POST   | `/token/refresh` | Renueva el par de tokens con el refresh token  |

### Credenciales por defecto

| Usuario | Contraseña |
|---------|------------|
| admin   | admin123   |

---

## Flujo de autenticación

```
Usuario            Frontend           Backend
  │                   │                  │
  │── credenciales ──►│                  │
  │                   │── POST /token ──►│
  │                   │◄── access_token ─┤
  │                   │    refresh_token │
  │                   │                  │
  │                   │ sessionStorage   │
  │                   │ guarda tokens    │
  │                   │                  │
  │◄── redirige a ────┤                  │
  │    /welcome       │                  │
```

1. El usuario ingresa sus credenciales en `/login`.
2. El frontend llama a `POST /api/token` con `{ username, password }`.
3. El backend responde con `access_token` y `refresh_token` (JWT).
4. El frontend almacena los tokens en **`sessionStorage`** (la sesión se borra al cerrar la pestaña).
5. Cualquier intento de navegar a `/welcome` sin sesión redirige automáticamente a `/login`.
6. Al cerrar sesión los tokens se eliminan de `sessionStorage` y el usuario es redirigido a `/login`.

---

## Diseño visual

La interfaz sigue el estándar definido en [`DESIGN.md`](DESIGN.md) — un sistema de diseño **Apple-inspired** con:

- Paleta monocromática con único color de acción `#0066cc`
- Tipografía **SF Pro Display / SF Pro Text** (fallback `system-ui`)
- Botones tipo *pill* y *utility*
- Superficies sin sombras en el chrome; solo las tarjetas de contenido reciben `box-shadow` suave
- Fondo canvas-parchment `#f5f5f7`

---

## Producción

Para un despliegue en producción:

1. **Backend**: ajustar `SECRET_KEY` y `ALLOWED_ORIGINS` como variables de entorno reales.
2. **Frontend**: ejecutar `npm run build` y servir la carpeta `dist/` con Nginx u otro servidor estático.
3. Configurar `ALLOWED_ORIGINS` en el backend con el dominio real del frontend.

```bash
# Build del frontend
cd frontend
npm run build
# La carpeta dist/ contiene los archivos estáticos listos para deploy
```

---

## Scripts disponibles

### Backend

| Comando                                       | Descripción                     |
|-----------------------------------------------|---------------------------------|
| `poetry run uvicorn app.main:app --reload`    | Servidor de desarrollo          |
| `docker compose up --build`                   | Levantar con Docker             |

### Frontend

| Comando         | Descripción                              |
|-----------------|------------------------------------------|
| `npm run dev`   | Servidor de desarrollo (puerto 3000)     |
| `npm run build` | Build optimizado para producción         |
| `npm run preview` | Preview del build de producción        |

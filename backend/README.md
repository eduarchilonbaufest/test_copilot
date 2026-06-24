# JWT Auth API

FastAPI application that demonstrates JWT (JSON Web Token) authentication with **access tokens** and **refresh tokens**.

## Stack

| Component | Technology |
|-----------|-----------|
| Framework | [FastAPI](https://fastapi.tiangolo.com/) |
| ASGI server | [Uvicorn](https://www.uvicorn.org/) |
| JWT | [python-jose](https://python-jose.readthedocs.io/) |
| Password hashing | [passlib\[bcrypt\]](https://passlib.readthedocs.io/) (bcrypt ≥3.2,<4.0) |
| Dependency manager | [Poetry](https://python-poetry.org/) |
| Containerisation | Docker / Docker Compose |

---

## Project structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py       # Environment-based settings
│   ├── models.py       # Pydantic request/response schemas
│   ├── auth.py         # Password hashing, token creation & validation
│   └── main.py         # FastAPI application and route definitions
├── pyproject.toml
├── poetry.lock
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Endpoints

### `GET /health`
Liveness check – returns `{"status": "ok"}`.

---

### `POST /token`
Authenticate a user and obtain a token pair.

**Request body (JSON):**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "bearer"
}
```

| Token | Expiry |
|-------|--------|
| `access_token` | **300 seconds** |
| `refresh_token` | **7 days** |

**Error responses:**
- `401 Unauthorized` – invalid credentials.

---

### `POST /token/refresh`
Exchange a valid refresh token for a new token pair.

**Request body (JSON):**
```json
{
  "refresh_token": "<refresh_jwt>"
}
```

**Response:** same schema as `/token`.

**Error responses:**
- `401 Unauthorized` – token expired, invalid, or not a refresh token.

---

## Running locally (without Docker)

### Prerequisites
- Python 3.11+
- [Poetry](https://python-poetry.org/docs/#installation)

### Steps

```bash
cd backend

# Install dependencies
poetry install

# Start the development server
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The interactive API docs are available at <http://localhost:8000/docs>.

---

## Running with Docker Compose

```bash
cd backend

# Build and start the container
docker compose up --build

# Stop and remove the container
docker compose down
```

### Overriding the secret key

Pass a custom `SECRET_KEY` via the environment:

```bash
SECRET_KEY=my-very-secret-key docker compose up --build
```

Or create a `.env` file next to `docker-compose.yml`:

```env
SECRET_KEY=my-very-secret-key
```

---

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | `supersecretkey-change-in-production-please` | HMAC secret used to sign tokens. **Must be changed in production.** |

---

## Example usage with `curl`

```bash
# 1. Login
TOKEN_RESPONSE=$(curl -s -X POST http://localhost:8000/token \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

ACCESS=$(echo $TOKEN_RESPONSE | python -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
REFRESH=$(echo $TOKEN_RESPONSE | python -c "import sys,json; print(json.load(sys.stdin)['refresh_token'])")

echo "Access token:  $ACCESS"
echo "Refresh token: $REFRESH"

# 2. Refresh
curl -s -X POST http://localhost:8000/token/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refresh_token\":\"$REFRESH\"}" | python -m json.tool
```

---

## Security notes

- The default `SECRET_KEY` is **not safe for production**. Always override it with a long, random secret (e.g. `openssl rand -hex 32`).
- User credentials are stored in memory for demonstration purposes. Replace `FAKE_USERS_DB` in `app/auth.py` with a real database in production.
- bcrypt is pinned to `>=3.2,<4.0` because passlib 1.7.x is incompatible with bcrypt 4.x.

import os

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError

from app.auth import (
    authenticate_user,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.models import LoginRequest, Token, TokenRefreshRequest

app = FastAPI(
    title="JWT Auth API",
    description="FastAPI application demonstrating JWT authentication with access and refresh tokens.",
    version="1.0.0",
)

_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
_allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Health"])
def health_check() -> dict:
    return {"status": "ok"}


@app.post("/token", response_model=Token, tags=["Auth"])
def login(request: LoginRequest) -> Token:
    """
    Authenticate with username and password.
    Returns an access token (expires in 300 s) and a refresh token (expires in 7 days).
    """
    user = authenticate_user(request.username, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["username"]})
    refresh_token = create_refresh_token(data={"sub": user["username"]})
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
    )


@app.post("/token/refresh", response_model=Token, tags=["Auth"])
def refresh_token(request: TokenRefreshRequest) -> Token:
    """
    Exchange a valid refresh token for a new pair of access/refresh tokens.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(request.refresh_token)
        username: str = payload.get("sub")
        token_type: str = payload.get("type")
        if username is None or token_type != "refresh":
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    new_access_token = create_access_token(data={"sub": username})
    new_refresh_token = create_refresh_token(data={"sub": username})
    return Token(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer",
    )

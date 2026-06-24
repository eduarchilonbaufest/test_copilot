import os

SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey-change-in-production-please")
ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS: int = 300
REFRESH_TOKEN_EXPIRE_DAYS: int = 7

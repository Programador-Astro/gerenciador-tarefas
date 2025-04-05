import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "minha-chave-secreta"
    SQLALCHEMY_DATABASE_URI = 'sqlite:///db.sqlite3'  # por enquanto SQLite
    SQLALCHEMY_TRACK_MODIFICATIONS = False
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Citește URL-ul din Environment (setat pe Render)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Fallback pentru local (dacă testezi pe laptop)
if not SQLALCHEMY_DATABASE_URL:
    # Asigură-te că ai .env încărcat dacă rulezi local
    from dotenv import load_dotenv
    load_dotenv()
    SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dreams.db")

# FIX PENTRU URL-uri NEON / RENDER
# SQLAlchemy cere "postgresql://", dar Neon dă uneori "postgres://"
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# CONFIGURARE ENGINE
if "sqlite" in SQLALCHEMY_DATABASE_URL:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    # AICI ESTE FIX-UL PENTRU SSL ERROR:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,  # Verifică dacă conexiunea e vie înainte de query
        pool_size=10,        # Număr maxim de conexiuni
        max_overflow=20      # Conexiuni extra permise la trafic mare
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
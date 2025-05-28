import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev'
    PERMANENT_SESSION_LIFETIME = timedelta(days=7) 
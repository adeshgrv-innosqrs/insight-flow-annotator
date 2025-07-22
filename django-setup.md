# Django Backend Setup Guide

## 📋 Requirements (`requirements.txt`)

```txt
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
django-oauth-toolkit==1.7.1
python-social-auth==0.3.6
social-auth-app-django==5.4.0
openai==1.3.5
python-decouple==3.8
psycopg2-binary==2.9.9
celery==5.3.4
redis==5.0.1
```

## 🚀 Setup Instructions

### 1. Create Django Project
```bash
# Create virtual environment
python -m venv query_evaluation_env
source query_evaluation_env/bin/activate  # On Windows: query_evaluation_env\Scripts\activate

# Install Django
pip install django
django-admin startproject query_evaluation_backend
cd query_evaluation_backend
python manage.py startapp evaluations

# Install requirements
pip install -r requirements.txt
```

### 2. Database Setup
```bash
# PostgreSQL setup (recommended)
# Install PostgreSQL and create database
createdb query_evaluation_db

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 3. Environment Variables (`.env`)
```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/query_evaluation_db

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# SSO Settings
GOOGLE_OAUTH2_KEY=your-google-client-id
GOOGLE_OAUTH2_SECRET=your-google-client-secret
MICROSOFT_AUTH_CLIENT_ID=your-microsoft-client-id
MICROSOFT_AUTH_CLIENT_SECRET=your-microsoft-client-secret

# CORS Settings
FRONTEND_URL=http://localhost:8080
```

### 4. Settings Configuration (`settings.py`)
```python
import os
from decouple import config

# CORS & CSRF
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",
    config('FRONTEND_URL', default='http://localhost:3000'),
]

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:8080",
    config('FRONTEND_URL', default='http://localhost:3000'),
]

# Social Auth Settings
AUTHENTICATION_BACKENDS = (
    'social_core.backends.google.GoogleOAuth2',
    'social_core.backends.microsoft.MicrosoftOAuth2',
    'django.contrib.auth.backends.ModelBackend',
)

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = config('GOOGLE_OAUTH2_KEY')
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = config('GOOGLE_OAUTH2_SECRET')

SOCIAL_AUTH_MICROSOFT_OAUTH2_KEY = config('MICROSOFT_AUTH_CLIENT_ID')
SOCIAL_AUTH_MICROSOFT_OAUTH2_SECRET = config('MICROSOFT_AUTH_CLIENT_SECRET')

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}
```

### 5. Run Development Server
```bash
# Start Django development server
python manage.py runserver

# In another terminal, start Celery (for background tasks)
celery -A query_evaluation_backend worker --loglevel=info
```

## 🔄 API Endpoints

### Questions
- `GET /api/questions/` - Get all active questions
- `POST /api/questions/` - Create new question (admin only)

### Search & Evaluation
- `POST /api/search/` - Search with OpenAI
- `POST /api/submit/` - Submit evaluation
- `GET /api/history/` - Get user's evaluation history

### Authentication
- `POST /auth/sso/callback/` - SSO authentication callback
- `POST /auth/logout/` - Logout user

## 🛡️ Security Features

1. **CORS Protection** - Configured for your frontend domain
2. **CSRF Protection** - Django CSRF middleware enabled
3. **Authentication** - Token-based auth with SSO support
4. **Rate Limiting** - Can be added with django-ratelimit
5. **Input Validation** - DRF serializers validate all inputs

## 📊 Database Schema

```sql
-- Questions table
CREATE TABLE questions (
    id UUID PRIMARY KEY,
    text TEXT NOT NULL,
    category VARCHAR(100),
    order_num INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Query evaluations table
CREATE TABLE query_evaluations (
    id UUID PRIMARY KEY,
    user_id INTEGER REFERENCES auth_user(id),
    question_id UUID REFERENCES questions(id),
    search_query TEXT,
    gpt_response TEXT,
    submitted_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

-- User sessions table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY,
    user_id INTEGER REFERENCES auth_user(id),
    session_token VARCHAR(255) UNIQUE,
    sso_provider VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    last_activity TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);
```

## 🔧 Testing

```bash
# Run tests
python manage.py test

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

## 🚀 Production Deployment

1. **Environment Setup**
   - Set `DEBUG=False`
   - Configure proper `ALLOWED_HOSTS`
   - Use PostgreSQL database
   - Set up Redis for caching/sessions

2. **Static Files**
   ```bash
   python manage.py collectstatic
   ```

3. **Database**
   ```bash
   python manage.py migrate
   ```

4. **Web Server**
   - Use Gunicorn + Nginx
   - Configure SSL certificates
   - Set up health checks
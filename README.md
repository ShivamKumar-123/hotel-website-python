# Aurum Grand — Luxury Hotel Platform

Production-style full-stack demo: a **React (Vite)** marketing site with **GSAP** motion, **Tailwind CSS**, and a **staff dashboard**, backed by **Django REST Framework** with **JWT** authentication and role-aware APIs.

## Prerequisites

- **Node.js** 20+ (for Vite 8)
- **Python** 3.12+ (tested with 3.14)
- **pip** / **venv**

## Backend setup (`backend/`)

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
# Edit backend/.env if needed (defaults are set for local dev).
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

API base: `http://127.0.0.1:8000/api/`

### Demo accounts (after `seed_demo`)

| Role  | Email                     | Password     |
|-------|---------------------------|--------------|
| Admin | `admin@aurumgrand.com`    | `admin12345` |
| Staff | `concierge@aurumgrand.com`| `staff12345` |
| Guest | `guest@example.com`       | `guest12345` |

### Useful endpoints

- `POST /api/auth/register/` — guest signup  
- `POST /api/auth/token/` — JWT (`email`, `password`)  
- `POST /api/auth/token/refresh/` — refresh token  
- `GET /api/auth/me/` — current user (Bearer)  
- `GET/POST /api/rooms/` — public list; staff CRUD  
- `GET/PATCH /api/bookings/` — guest owns; staff sees all  
- `GET /api/dashboard/stats/` — staff KPIs + chart series  
- `GET/PATCH /api/users/` — staff list; **admin** may change roles  
- `GET/PATCH /api/reviews/` — approved public list; staff moderation  

Create a real superuser anytime: `python manage.py createsuperuser` (use an email as username).

## Frontend setup (`frontend/`)

```powershell
cd frontend
# Optional: edit frontend/.env or .env.development for VITE_* vars.
npm install
npm run dev
```

Vite dev server proxies `/api` to `http://127.0.0.1:8000` (see `vite.config.js`).  
Production: set `VITE_API_URL` to your API origin (e.g. `https://api.example.com/api`).

### Staff dashboard

Sign in as **staff** or **admin**, then open `/dashboard` for operations (rooms, bookings, users, reviews, charts).

## Project layout

- `frontend/src/components` — UI, layout, GSAP helpers, shared widgets  
- `frontend/src/pages` — public marketing + auth  
- `frontend/src/dashboard` — admin layout and pages  
- `frontend/src/services/api.js` — Axios client + JWT refresh  
- `backend/apps/*` — `users`, `rooms`, `bookings`, `reviews` DRF apps  
- `backend/config` — settings, URLs, pagination  

## Build for production

```powershell
cd frontend
npm run build
# static output in frontend/dist — serve behind your CDN / reverse proxy
```

Deploy Django with `DEBUG=False`, a strong `DJANGO_SECRET_KEY`, proper `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and a production database (e.g. PostgreSQL) by editing `DATABASES` in `settings.py`.

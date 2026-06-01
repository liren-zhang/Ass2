# E‑Commerce Shopping Cart (Assignment 2)

**Student:** Liren Zhang (25603958)  
**GitHub:** [liren-zhang/Ass2](https://github.com/liren-zhang/Ass2)  
**Individual submission** – approved by tutor.

## Problem solved

A full‑stack e‑commerce single‑page application where users can browse products, search in real time, manage a persistent shopping cart (JWT‑protected), and administrators can view all users’ carts.

## Tech stack

- **Frontend:** React (functional components, Hooks), React Router, Axios, custom CSS  
- **Backend:** Django, Django REST Framework, SimpleJWT  
- **Database:** MySQL  

## Folder structure
Ass2/
├── BackEnd/ # Django project
│ ├── ass2/ # main app (models, views, serializers, permissions)
│ ├── backend/ # project settings
│ └── manage.py
├── FrontEnd/ # React project (Vite)
│ ├── src/ # components, API client, auth context
│ ├── public/
│ └── package.json
├── ass2_db.sql # MySQL dump (structure + data)
├── requirements.txt # Python dependencies
├── .gitignore
└── README.md

## How to run

### Backend
1. `cd BackEnd`
2. Create and activate virtual environment:  
   `.venv\Scripts\activate` (Windows)
3. Install dependencies:  
   `pip install -r requirements.txt`
4. Create MySQL database `ass2_db`
5. Run migrations:  
   `python manage.py migrate`
6. Create superuser:  
   `python manage.py createsuperuser`
7. Start server:  
   `python manage.py runserver`

### Frontend
1. `cd FrontEnd`
2. Install dependencies:  
   `npm install`
3. Start dev server:  
   `npm run dev`
4. Open `http://localhost:5173`

> The frontend proxies `/api` requests to `http://127.0.0.1:8000`. Both servers must run simultaneously.

## Features

- User registration & login (JWT authentication)
- Browse products (public access)
- Real‑time product search (name/description)
- Add to cart, update quantity, remove items (requires login)
- Persistent cart per user
- Admin panel to view all users’ carts (role‑based access)
- Single‑page navigation with React Router

## Challenges overcome

- Setting up JWT authentication and securing API endpoints.  
- Isolating cart data per user and building the admin permission system.  
- Handling CORS between React (port 5173) and Django (port 8000).  
- Implementing real‑time search without page reloads.  
- Designing a responsive, consistent UI with pure CSS.
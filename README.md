# ✦ Inkwell — MERN Blog Platform

A full-stack blog platform built with MongoDB, Express, React, and Node.js.

## Pages
- **Home** — Landing page with hero, features, recent posts
- **Blog List** — Paginated post list with search
- **Blog Detail** — Full post view with comments
- **Create / Edit Post** — Protected post editor
- **Dashboard** — User stats and post management
- **Profile** — Edit name, bio, avatar
- **Admin Panel** — Manage users, posts (admin only)
- **Login / Register** — JWT authentication

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET
npm install
npm run dev
```

Backend runs on **http://localhost:5000**

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on **http://localhost:3000**

### 3. Create an Admin User

Register via the app, then in MongoDB shell or Compass:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

## Environment Variables

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blogplatform
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | — | Register user |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | ✓ | Get current user |
| GET | /api/posts | — | List posts |
| GET | /api/posts/:id | — | Get post |
| POST | /api/posts | ✓ | Create post |
| PUT | /api/posts/:id | ✓ | Update post |
| DELETE | /api/posts/:id | ✓ | Delete post |
| GET | /api/posts/:id/comments | — | List comments |
| POST | /api/comments | ✓ | Add comment |
| DELETE | /api/comments/:id | ✓ | Delete comment |
| GET | /api/users/profile | ✓ | Get profile |
| PUT | /api/users/profile | ✓ | Update profile |
| GET | /api/admin/stats | Admin | Platform stats |
| GET | /api/admin/users | Admin | All users |
| PUT | /api/admin/users/:id/role | Admin | Change role |
| DELETE | /api/admin/users/:id | Admin | Delete user |
| GET | /api/admin/posts | Admin | All posts |
| DELETE | /api/admin/posts/:id | Admin | Delete post |

## Tech Stack

- **Frontend**: React 18, React Router v6, Axios, CSS (no UI library)
- **Backend**: Node.js, Express 4, Mongoose, JWT, bcryptjs
- **Database**: MongoDB
- **Auth**: JWT tokens stored in localStorage

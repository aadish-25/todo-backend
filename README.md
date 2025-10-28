# Todo App

A full-stack todo application with Node.js/Express backend and React frontend.

## Project Structure

```
├── backend/          # Node.js/Express API
│   ├── src/
│   │   ├── models/   # MongoDB models
│   │   ├── routes/   # API routes
│   │   └── db/       # Database connection
│   ├── package.json
│   └── index.js
└── frontend/         # React + Vite + Tailwind
    ├── src/
    │   ├── App.jsx   # Main todo component
    │   └── main.jsx
    └── package.json
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on http://localhost:5001

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Todos (Protected Routes)

- `GET /todo` - Get user's todos
- `POST /todo` - Create new todo
- `PATCH /todo/:id` - Update todo
- `DELETE /todo/:id` - Delete todo

All todo endpoints require `Authorization: Bearer <token>` header.

## Features

### Authentication

- ✅ User registration with password hashing
- ✅ User login with JWT tokens
- ✅ Protected routes with authentication middleware
- ✅ Automatic logout on token expiration
- ✅ Persistent login sessions

### Todo Management

- ✅ Add new todos (name, title, content)
- ✅ View user-specific todos only
- ✅ Edit existing todos (inline editing)
- ✅ Mark todos as complete/incomplete
- ✅ Delete todos
- ✅ Real-time UI updates

### UI/UX

- ✅ Responsive design with Tailwind CSS
- ✅ Clean, modern interface
- ✅ Loading states and error handling
- ✅ Form validation
- ✅ Status indicators for todos

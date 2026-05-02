# 🔐 Secure User Authentication System
### B.Tech Academic Assignment — Web Technology / Full Stack Development

---

## 📋 Project Overview

This project implements a **Secure User Authentication System** using:
- **Frontend:** AngularJS (v1.8) — Single Page Application
- **Backend:** Node.js + Express — REST API with JWT Authentication

Users can log in with credentials, receive a **JSON Web Token (JWT)**, access a **protected dashboard**, and securely log out.

---

## 🗂️ Project Structure

```
secure-auth-system/
│
├── frontend/
│   ├── index.html       → Main SPA shell (AngularJS entry point)
│   ├── app.js           → App module, routing, controllers
│   ├── authService.js   → Login, logout, token storage
│   ├── interceptor.js   → Auto-attach JWT to API requests
│   ├── login.html       → Login page template
│   └── dashboard.html   → Protected dashboard template
│
├── backend/
│   ├── server.js        → Express server with /api/login & /api/dashboard
│   └── package.json     → Node.js dependencies
│
└── README.md            → This file
```

---

## ⚙️ How to Run

### Prerequisites
- Node.js installed (v14 or higher)
- A web browser

---

### Step 1 — Install Backend Dependencies

```bash
cd secure-auth-system/backend
npm install
```

This installs: **express**, **jsonwebtoken**, **cors**

---

### Step 2 — Start the Backend Server

```bash
node server.js
```

You should see:
```
  ✅  Server is running at http://localhost:3000
  📌  POST /api/login      → Login endpoint
  🔒  GET  /api/dashboard  → Protected endpoint
```

---

### Step 3 — Open the Frontend

Open `frontend/index.html` directly in your browser.

> **Important:** Use a local file server or VS Code Live Server extension for best results.  
> With Live Server: Right-click `index.html` → "Open with Live Server"

The app will open at `http://127.0.0.1:5500/frontend/index.html`

---

### Step 4 — Test the Application

Use these demo credentials:
| Field    | Value  |
|----------|--------|
| Username | admin  |
| Password | 1234   |

---

## 🔑 API Endpoints

### POST `/api/login`
- **Request Body:** `{ "username": "admin", "password": "1234" }`
- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Login successful! Welcome, admin.",
    "token": "<JWT_TOKEN>"
  }
  ```
- **Failure Response (401):**
  ```json
  {
    "success": false,
    "message": "Invalid credentials. Please try again."
  }
  ```

---

### GET `/api/dashboard`
- **Headers Required:** `Authorization: Bearer <JWT_TOKEN>`
- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Welcome to the secure dashboard, admin!",
    "data": {
      "user": "admin",
      "loginTime": "...",
      "info": "This data is protected..."
    }
  }
  ```
- **No Token Response (403):**
  ```json
  { "success": false, "message": "Access denied. No token provided." }
  ```

---

## 🧠 Key Concepts Explained (for Viva)

### 1. What is JWT?
JWT (JSON Web Token) is a compact, URL-safe token used for authentication. It consists of three parts: **Header.Payload.Signature**, all Base64 encoded and signed with a secret key.

### 2. What is an AngularJS HTTP Interceptor?
An interceptor is a service that intercepts every HTTP request/response. Our interceptor automatically adds `Authorization: Bearer <token>` to all `/api/*` requests.

### 3. How is the route protected?
The `/dashboard` route uses a **resolve** in `$routeProvider`. Before loading the dashboard view, AngularJS runs `AuthService.isLoggedIn()`. If no token is found, the user is redirected to `/login`.

### 4. Why localStorage?
`localStorage` persists data across browser sessions. When the user closes and reopens the browser, they remain logged in until they explicitly logout or the token expires (1 hour).

### 5. What happens on Logout?
`AuthService.logout()` calls `localStorage.removeItem()` to delete both the token and username, then AngularJS redirects to `/login`.

---

## 📸 Application Flow

```
1. User opens app → redirected to /login
2. User enters admin / 1234 → POST /api/login
3. Server validates → returns JWT token
4. Token stored in localStorage
5. User redirected to /dashboard
6. Dashboard loads → GET /api/dashboard (token auto-attached by interceptor)
7. Server verifies token → returns secure data
8. User clicks Logout → token cleared → back to /login
9. If user tries /dashboard without token → redirected to /login
```

---

## 🛠️ Technologies Used

| Technology    | Purpose                          |
|---------------|----------------------------------|
| AngularJS 1.8 | Frontend SPA framework           |
| ngRoute       | Client-side routing              |
| Node.js       | JavaScript runtime (backend)     |
| Express.js    | Web server framework             |
| jsonwebtoken  | JWT creation and verification    |
| cors          | Cross-origin resource sharing    |
| localStorage  | Token persistence in browser     |

---

## 👨‍💻 Author

**B.Tech Student**  
Department of Computer Science & Engineering  
Academic Year: 2024–25

---

*Assignment submitted as part of Web Technology / Full Stack Development course.*

# 🔐 PassVault — Secure Password Manager

> End-to-end encrypted password vault built with React, Node.js, Express, and MongoDB.  
> Your master password never leaves your device. We mathematically cannot see your data — ever.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![React](https://img.shields.io/badge/react-19-61DAFB.svg)

**🚀 Live Demo:** [Pass-Vault](https://pass-vault-frontend-one.vercel.app/)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Zero-Knowledge Encryption** | AES-256 encryption/decryption happens entirely in the browser. The server only stores encrypted blobs. |
| **Vault CRUD** | Create, read, update, and delete encrypted passwords, credit cards, and secure notes. |
| **Password Generator** | Cryptographically strong password generation using `crypto.getRandomValues()`. |
| **Security Audit** | Analyzes all stored passwords for weakness (via `zxcvbn`), reuse, and staleness. |
| **BreachWatch** | Checks passwords against HaveIBeenPwned's database using k-anonymity (SHA-1 prefix). |
| **Favorites & Categories** | Organize entries with custom categories and mark favorites for quick access. |
| **JWT Auth + Refresh Tokens** | Short-lived access tokens (15m) with auto-refresh for seamless sessions. |
| **Rate Limiting** | Brute-force protection on auth endpoints (10 attempts/15 min). |
| **Security Headers** | Helmet.js for HTTP security headers out of the box. |

---

## 🏗️ Architecture

```
pass-Vault/
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authcontroller.js   # Register, Login, Refresh, Logout
│   │   ├── vaultController.js  # CRUD for vault entries
│   │   └── utilsController.js  # Password strength & breach check
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification
│   │   ├── errorHandler.js     # Global error handler
│   │   └── rateLimiter.js      # Rate limiting (global + auth)
│   ├── models/
│   │   ├── User.js             # User schema (email, hash, refreshToken)
│   │   └── VaultEntry.js       # Vault entry schema (encrypted data)
│   ├── routes/
│   │   ├── auth.routes.js      # /api/auth/*
│   │   ├── vault_routes.js     # /api/vault/*
│   │   └── utils.routes.js     # /api/utils/*
│   ├── utils/
│   │   ├── passwordStrength.js # zxcvbn wrapper
│   │   └── breachCheck.js      # HIBP k-anonymity check
│   ├── main.js                 # Express app entry point
│   ├── .env                    # Environment variables
│   ├── Dockerfile              # Node.js container blueprint
│   ├── .dockerignore           # Docker build exclusions
│   └── package.json
│
├── frontend/                   # React + Vite SPA
│   ├── public/
│   │   └── vault-hero.png      # Landing page hero image
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosInstance.js # Axios with auto-refresh interceptor
│   │   │   ├── auth.api.js     # Auth API calls
│   │   │   ├── vault.api.js    # Vault CRUD API calls
│   │   │   ├── breach.api.js   # Client-side HIBP breach check
│   │   │   └── utils.api.js    # Strength/breach via backend
│   │   ├── components/
│   │   │   ├── AddEntryModal.jsx    # Create new vault entry
│   │   │   ├── EditEntryModal.jsx   # Edit existing entry
│   │   │   ├── VaultEntry.jsx       # Entry card (password/card/note)
│   │   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   │   ├── StrengthMeter.jsx    # Password strength bar
│   │   │   └── MouseGlow.jsx        # Cursor glow effect (GSAP)
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth state + masterKey management
│   │   ├── crypto/
│   │   │   ├── cryptoUtils.js  # AES encrypt/decrypt, key derivation
│   │   │   └── auditUtils.js   # Security audit scoring logic
│   │   ├── hooks/
│   │   │   └── useVault.js     # Reusable vault fetch/decrypt hook
│   │   ├── pages/
│   │   │   ├── Landing.jsx         # Marketing landing page
│   │   │   ├── Login.jsx           # Login
│   │   │   ├── Register.jsx        # Registration with strength meter
│   │   │   ├── Dashboard.jsx       # Main vault view
│   │   │   ├── SecureNotes.jsx     # Notes editor (split pane)
│   │   │   ├── CreditCards.jsx     # Credit card vault
│   │   │   ├── PasswordGenerator.jsx # Password generator tool
│   │   │   ├── SecurityAudit.jsx   # Vault health score
│   │   │   └── BreachWatch.jsx     # HIBP breach scanner
│   │   ├── App.jsx             # Routing + PrivateRoute
│   │   ├── main.jsx            # React entry point
│   │   ├── index.css           # Global styles + design system
│   ├── .env                    # Frontend environment variables
│   ├── Dockerfile              # Multi-stage Nginx build
│   ├── nginx.conf              # Nginx SPA routing
│   ├── .dockerignore           # Docker build exclusions
│   └── package.json
│
├── docker-compose.yml          # Local container orchestration
└── README.md
```

---

## 🔒 Security Design

```
┌──────────────────────────────────────────────┐
│                   BROWSER                     │
│                                               │
│  Master Password ──► SHA-256 ──► Master Key   │
│                        │                      │
│              ┌─────────┴─────────┐            │
│              │                   │            │
│     AES-256 Encrypt      SHA-256 + Salt       │
│     (for vault data)     (for server auth)    │
│              │                   │            │
│      Ciphertext blob      Password Hash       │
│              │                   │            │
└──────────────┼───────────────────┼────────────┘
               │                   │
               ▼                   ▼
┌──────────────────────────────────────────────┐
│                   SERVER                      │
│                                               │
│  Stores: bcrypt(hash)    Stores: ciphertext   │
│  Never sees: password    Never sees: plaintext│
│                                               │
└──────────────────────────────────────────────┘
```

**Key principles:**
- The **master password** is never sent to the server
- The server receives a **salted SHA-256 hash** for authentication (then bcrypt-hashed on the server)
- Vault data is **AES-256 encrypted** in the browser before being sent to the server
- The server only stores **encrypted blobs** — it cannot decrypt them
- Decryption happens **locally** using the master key derived from the master password

---

## 🚀 Quick Start

### 🐳 The Easy Way (Docker)
1. Install [Docker](https://www.docker.com/).
2. Clone the repository and create the `.env` files in both the frontend and backend folders (see the Manual Way below for the variables).
3. Run the following command in the root folder:
```bash
docker compose up --build
```
4. Open your browser and go to `http://localhost:3000`.

---

### 💻 The Manual Way

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** or **yarn**

### 1. Clone the repository

```bash
git clone https://github.com/adityajain-27/pass-Vault.git
cd pass-Vault
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/passvault
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

### 4. Open the app

Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Reference

### Auth Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create a new account | ❌ |
| `POST` | `/api/auth/login` | Login and receive tokens | ❌ |
| `POST` | `/api/auth/refresh` | Refresh access token | ❌ |
| `POST` | `/api/auth/logout` | Invalidate refresh token | ❌ |

### Vault Endpoints (Protected)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/vault/` | Get all encrypted entries | ✅ Bearer |
| `POST` | `/api/vault/` | Create a new entry | ✅ Bearer |
| `PUT` | `/api/vault/:id` | Update an entry | ✅ Bearer |
| `DELETE` | `/api/vault/:id` | Delete an entry | ✅ Bearer |

### Utility Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/utils/strength` | Check password strength | ❌ |
| `GET` | `/api/utils/breach-check` | Check if password is breached | ❌ |
| `GET` | `/api/health` | Server health check | ❌ |

### Request/Response Examples

**Register:**
```json
// POST /api/auth/register
// Request
{ "email": "user@example.com", "masterPasswordHash": "sha256_hash_here" }

// Response (201)
{ "message": "User Created Successfully", "accessToken": "...", "refreshToken": "..." }
```

**Create Vault Entry:**
```json
// POST /api/vault/
// Headers: Authorization: Bearer <accessToken>
// Request
{
  "label": "Gmail",
  "encryptedData": "U2FsdGVkX1...",
  "category": "Personal",
  "isFavorite": false
}

// Response (201)
{ "_id": "...", "label": "Gmail", "category": "Personal", "isFavorite": false, "createdAt": "..." }
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Express 5 | Web framework |
| Mongoose 9 | MongoDB ODM |
| jsonwebtoken | JWT auth tokens |
| bcrypt | Password hashing |
| zxcvbn | Password strength estimation |
| helmet | Security headers |
| cors | Cross-origin support |
| express-rate-limit | Brute-force protection |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool / dev server |
| React Router 7 | Client-side routing |
| Axios | HTTP client with interceptors |
| CryptoJS | AES-256 encryption |
| zxcvbn | Password strength (client-side) |
| GSAP | Animations & scroll effects |

---

## 📸 Screenshots

### Landing Page
The marketing page with animated scroll reveals and feature showcase.

### Vault Dashboard
The main password vault with search, category filtering, and card-based entry display.

### Security Audit
Real-time vault health scoring — detects weak, reused, and old passwords.

### BreachWatch
Scans all stored passwords against HaveIBeenPwned's database of billions of leaked credentials.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

**Aditya Jain**  
GitHub: [@adityajain-27](https://github.com/adityajain-27)

---

<p align="center">
  <strong>🔐 PassVault</strong> — Your passwords, your rules.
</p>

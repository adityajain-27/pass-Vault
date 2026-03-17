# Pass-Vault Backend — Build Guide

> You write all the code. Follow each step in order. Every section tells you exactly what to create and what logic to put inside.

---

## Step 1 — Project Setup

### 1.1 Create folder structure

Inside `d:\Project\Tiny Project`, create these folders and files manually:

```
src/
  config/
    db.js
  models/
    User.js
    VaultEntry.js
  controllers/
    authController.js
    vaultController.js
    utilsController.js
  routes/
    auth.routes.js
    vault.routes.js
    utils.routes.js
  middleware/
    authMiddleware.js
    errorHandler.js
    rateLimiter.js
  utils/
    passwordStrength.js
    breachCheck.js
server.js
.env
.env.example
README.md
```

### 1.2 Initialize and install packages

```bash
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv helmet cors express-rate-limit express-validator zxcvbn axios crypto
npm install --save-dev nodemon
```

In `package.json`, add to `scripts`:
```json
"dev": "nodemon server.js",
"start": "node server.js"
```

---

## Step 2 — Environment Variables

### `.env.example` (commit this)
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/passvault
JWT_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRES_IN=15m
FRONTEND_URL=http://localhost:3000
```

Copy `.env.example` → `.env` and fill in real values. **Never commit `.env`.**

---

## Step 3 — `src/config/db.js`

**Purpose:** Connect Mongoose to MongoDB.

```js
// Import mongoose
// Export an async function connectDB()
// Inside: call mongoose.connect(process.env.MONGO_URI)
// On success: console.log('MongoDB connected')
// On error: console.error and process.exit(1)
```

---

## Step 4 — Models

### `src/models/User.js`

Schema fields:
| Field | Type | Rules |
|---|---|---|
| `email` | String | required, unique, lowercase, trim |
| `masterPasswordHash` | String | required |
| `refreshToken` | String | default null (for logout blacklisting) |
| `createdAt` | Date | default now |

> Add `timestamps: true` to the schema options.

### `src/models/VaultEntry.js`

Schema fields:
| Field | Type | Rules |
|---|---|---|
| `userId` | ObjectId | ref: 'User', required, indexed |
| `label` | String | required, trim, maxlength 100 |
| `encryptedData` | String | required — **never log this field** |

> Add `timestamps: true`. Add an index on `userId` for fast lookups.

---

## Step 5 — Middleware

### `src/middleware/rateLimiter.js`

Create **two** limiters using `express-rate-limit`:

1. **`globalLimiter`** — 100 requests per 15 minutes
2. **`authLimiter`** — 10 requests per 15 minutes

Export both. Each limiter should have a clear `message` property in JSON format.

### `src/middleware/authMiddleware.js`

**Logic:**
1. Read `Authorization` header → extract Bearer token
2. If missing → 401 error
3. `jwt.verify(token, process.env.JWT_SECRET)`
4. Attach decoded payload to `req.user`
5. Call `next()`
6. On error → 401 "Invalid or expired token"

### `src/middleware/errorHandler.js`

**Logic:**
- Signature: `(err, req, res, next)`
- Log `err.message` to console (not `err.stack` in production, not sensitive data)
- If `err.statusCode` exists use it, else default to 500
- Return JSON: `{ success: false, message: err.message }`

Create a helper `createError(message, statusCode)` utility and export it too — you'll use this in controllers.

---

## Step 6 — Utils

### `src/utils/passwordStrength.js`

Use the `zxcvbn` npm package.

**Export a function `checkStrength(password)`:**
- Call `zxcvbn(password)`
- Return:
  ```js
  {
    score: result.score * 25,   // 0–100 scale
    feedback: result.feedback.suggestions,
    crackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second
  }
  ```

### `src/utils/breachCheck.js`

Implement [HaveIBeenPwned k-anonymity](https://haveibeenpwned.com/API/v3#SearchingPwnedPasswordsByRange):

**Export async function `checkBreach(password)`:**
1. SHA-1 hash the password using Node's `crypto` module
2. Take first 5 chars as `prefix`, rest as `suffix`
3. GET `https://api.pwnedpasswords.com/range/${prefix}`
4. Parse the response — each line is `HASH_SUFFIX:COUNT`
5. Find if `suffix` (uppercase) appears in the list
6. Return `{ breached: true/false, count: N }` (count = 0 if not found)

> If the API call fails, catch the error and return `{ breached: false, count: 0, error: "check unavailable" }`.

---

## Step 7 — Controllers

### `src/controllers/authController.js`

#### `register`
1. Validate input (use express-validator results)
2. Check if email already exists → 409 error
3. Hash the incoming `masterPasswordHash` again with `bcrypt.hash(..., 12)`
4. Create new User in DB
5. Sign an `accessToken` (payload: `{ userId: user._id }`, expires: `JWT_EXPIRES_IN`)
6. Sign a `refreshToken` (expires: `7d`) using `JWT_REFRESH_SECRET`
7. Save `refreshToken` to user document
8. Return 201: `{ accessToken, refreshToken, userId }`

#### `login`
1. Find user by email → 401 if not found (don't reveal which field is wrong)
2. `bcrypt.compare(masterPasswordHash, user.masterPasswordHash)`
3. If mismatch → 401 "Invalid credentials"
4. Generate new `accessToken` + `refreshToken`
5. Save new refreshToken to user
6. Return 200: `{ accessToken, refreshToken }`

#### `refresh`
1. Accept `{ refreshToken }` from body
2. Find user where `refreshToken === stored token`
3. If not found → 403 "Invalid refresh token"
4. `jwt.verify(refreshToken, JWT_REFRESH_SECRET)`
5. Sign new `accessToken`
6. Return 200: `{ accessToken }`

#### `logout`
1. Get `refreshToken` from body
2. Find user by refreshToken, set `user.refreshToken = null`, save
3. Return 200: `{ message: "Logged out" }`

---

### `src/controllers/vaultController.js`

> All routes are protected — `req.user.userId` is available.

#### `getEntries`
- Find all VaultEntry where `userId === req.user.userId`
- Return array (omit `__v`)
- **Never log `encryptedData`**

#### `createEntry`
- Validate: `label` required, `encryptedData` required (string, non-empty)
- Create VaultEntry `{ userId: req.user.userId, label, encryptedData }`
- Return 201 with the new entry (omit `encryptedData` from response — return only `_id, label, userId, createdAt`)

> Return only metadata in the response, not the encrypted blob.

#### `updateEntry`
- Find entry by `_id` AND `userId` (prevents users accessing others' entries)
- If not found → 404
- Update `encryptedData` and `label`
- Return 200 with updated metadata

#### `deleteEntry`
- Find and delete by `_id` AND `userId`
- If not found → 404
- Return 200: `{ message: "Entry deleted" }`

---

### `src/controllers/utilsController.js`

#### `strengthCheck`
- Validate: `password` is required string
- Call `checkStrength(password)` from utils
- Return 200: `{ score, feedback, crackTime }`

#### `breachCheck`
- Read `password` from `req.query.password`
- Validate it exists
- Call `checkBreach(password)` from utils
- Return 200: `{ breached, count }`

---

## Step 8 — Input Validation Rules

Use `express-validator`'s `body()` and `query()`. Apply these as middleware arrays before each controller.

| Route | Validate |
|---|---|
| POST /register | `email` isEmail, `masterPasswordHash` isString minLength(8) |
| POST /login | same as register |
| POST /refresh | `refreshToken` isString notEmpty |
| POST /vault/ | `label` isString notEmpty, `encryptedData` isString notEmpty |
| PUT /vault/:id | same as POST vault |
| POST /utils/strength | `password` isString notEmpty |
| GET /utils/breach-check | `query('password')` isString notEmpty |

At the top of each controller handler, check:
```js
const errors = validationResult(req);
if (!errors.isEmpty()) return next(createError(errors.array()[0].msg, 400));
```

---

## Step 9 — Routes

### `src/routes/auth.routes.js`
```
POST /register  → [authLimiter, validation, authController.register]
POST /login     → [authLimiter, validation, authController.login]
POST /refresh   → [authController.refresh]
POST /logout    → [authController.logout]
```

### `src/routes/vault.routes.js`
All routes use `[authMiddleware]` first.
```
GET    /     → vaultController.getEntries
POST   /     → [validation, vaultController.createEntry]
PUT    /:id  → [validation, vaultController.updateEntry]
DELETE /:id  → vaultController.deleteEntry
```

### `src/routes/utils.routes.js`
```
POST /strength      → [validation, utilsController.strengthCheck]
GET  /breach-check  → [validation, utilsController.breachCheck]
```

---

## Step 10 — `server.js`

Wire everything together in this order:

```js
// 1. Load dotenv
// 2. Import express, helmet, cors, body-parser
// 3. Import connectDB, globalLimiter, errorHandler, all route files

// 4. Call connectDB()

// 5. app.use(helmet())
// 6. app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
// 7. app.use(express.json())
// 8. app.use(globalLimiter)

// 9. Mount routes:
//    app.use('/api/auth', authRoutes)
//    app.use('/api/vault', vaultRoutes)
//    app.use('/api/utils', utilsRoutes)

// 10. Health check: GET /api/health → 200 { status: "ok" }

// 11. 404 handler: app.use((req, res) => res.status(404).json({ message: "Route not found" }))

// 12. app.use(errorHandler)  ← must be LAST

// 13. app.listen(PORT, ...)
```

---

## Step 11 — Testing Your API

Use [Postman](https://postman.com) or `curl`.

### Smoke test order:
1. `POST /api/auth/register` → get tokens
2. `POST /api/auth/login` → confirm login
3. `POST /api/vault/` with `Authorization: Bearer <token>` → create entry
4. `GET /api/vault/` → list entries
5. `POST /api/utils/strength` with `{ "password": "hello" }` → score
6. `GET /api/utils/breach-check?password=123456` → should be breached

---

## Common Mistakes to Avoid

> [!WARNING]
> Never log `encryptedData` anywhere. Not in console.log, not in error messages.

> [!IMPORTANT]
> Always query vault entries with **both** `_id` AND `userId` to prevent IDOR (insecure direct object reference) attacks.

> [!TIP]
> When returning vault entry responses, **omit** `encryptedData` — send only metadata (`_id`, `label`, `createdAt`, `updatedAt`). The frontend already has the data.

> [!NOTE]
> The frontend sends a bcrypt hash to `/register`. You hash it **again** server-side. This means even if your DB leaks, the attacker only has a hash-of-a-hash, not the real master password.

---

## File Order to Write (Recommended)

1. `.env` + `.env.example`
2. `src/config/db.js`
3. `src/models/User.js` → `VaultEntry.js`
4. `src/middleware/errorHandler.js` (needed by everything)
5. `src/middleware/rateLimiter.js`
6. `src/middleware/authMiddleware.js`
7. `src/utils/passwordStrength.js` → `breachCheck.js`
8. `src/controllers/authController.js`
9. `src/controllers/vaultController.js`
10. `src/controllers/utilsController.js`
11. `src/routes/auth.routes.js` → `vault.routes.js` → `utils.routes.js`
12. `server.js`
13. Test everything
14. Write `README.md`

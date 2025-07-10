# flex-auth-core

A flexible, plug-and-play authentication middleware for Node.js & Express. Supports multiple credential strategies like:

- Email + Password
- Email + Username + Password
- Mobile + Username + Password
- Google OAuth
- GitHub OAuth

Designed for developers who want to drop in secure, customizable authentication logic into any Node.js backend.

---

## 📚 Table of Contents

- [📦 Installation](#-installation)
- [✨ Features](#-features)
- [📖 Docs & Community](#-docs--community)
- [⚡ Quick Start](#-quick-start)
- [🔐 Authentication Methods](#-authentication-methods)
- [🧪 Running Tests](#-running-tests)
- [💡 Philosophy](#-philosophy)
- [🧩 Examples](#-examples)
- [🙌 Contributing to flex-auth-core](#-contributing-to-flex-auth-core)
- [👨‍🔬 TC (Technical Committee)](#-tc-technical-committee)
- [📄 License](#-license)

---

## 📦 Installation

```bash
npm install flex-auth-core
```

Or from GitHub:

```bash
npm install git+https://github.com/AdarshYadav04/flex-auth.git
```

---

## ✨ Features

- 🔐 Multiple auth strategies: email, username, mobile
- 🌐 Built-in OAuth login via Google and GitHub
- 🔧 Configurable with JWT and MongoDB
- 🔄 Pluggable design for adding OTP in future versions
- 📦 Easy Express integration
- 🧰 Lightweight, fast, and dependency-friendly

---

## 📖 Docs & Community

- Raise issues or ideas via [GitHub Issues](https://github.com/AdarshYadav04/flex-auth/issues)

---

## ⚡ Quick Start

```js
const express = require('express');
const flexAuth = require('flex-auth-core');
require('dotenv').config();

const app = express();
app.use(express.json());

const auth = flexAuth({
  jwtSecret: process.env.JWT_SECRET,
  mongoUri: process.env.MONGO_URI,
  enableOAuth: true
});

app.post('/register', (req, res) => auth.register({ ...req, method: req.body.method }, res));
app.post('/login', (req, res) => auth.login({ ...req, method: req.body.method }, res));

// Enable OAuth routes
auth.useOAuth(app);

app.listen(3000, () => console.log('Auth running at http://localhost:3000'));
```

---

## 🔐 Authentication Methods

### 📌 Credential-Based

- **email-password**
- **email-username-password**
- **mobile-username-password**

Each request to `/register` or `/login` must include a `method` field and the relevant credentials in the request body.

### 🌐 OAuth-Based

#### ✅ Google Login
- Visit: `GET /auth/google`
- Callback: `GET /auth/callback/google`

#### ✅ GitHub Login
- Visit: `GET /auth/github`
- Callback: `GET /auth/callback/github`

📦 On success, you’ll receive a JWT token:

```json
{
  "message": "OAuth login success",
  "token": "your.jwt.token"
}
```

Add the following to your `.env`:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
OAUTH_CALLBACK=http://localhost:3000/auth/callback
```

Ensure the callback URLs are registered in Google/GitHub developer settings:
- Google: `http://localhost:3000/auth/callback/google`
- GitHub: `http://localhost:3000/auth/callback/github`

---

## 🧪 Running Tests

```bash
npm test
```

*Tests are currently basic and will be extended in future versions with Jest/Mocha.*

---

## 💡 Philosophy

- Minimal configuration, maximum flexibility
- Secure by design using bcrypt and JWT
- Easy to extend with additional auth methods (e.g. Google, GitHub, OTP)
- Zero vendor lock-in

---

## 🧩 Examples

Example usage in a standalone Express app:
- See `example-app.js` in the repo

---

## 🙌 Contributing to flex-auth-core

We welcome contributions! To get started:

1. Fork the repo
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make changes and commit: `git commit -m 'Add XYZ feature'`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Create a Pull Request

---

## 👨‍🔬 TC (Technical Committee)

The initial maintainer and current decision-maker:

- **Adarsh Yadav** – [@AdarshYadav04](https://github.com/AdarshYadav04)

Future contributors and collaborators welcome.

---

## 📄 License

MIT © [Adarsh Yadav](https://github.com/AdarshYadav04)

# CodeBoard – Backend Authentication System
A TypeScript + Express backend implementing GitHub OAuth authentication with JWT-based session management and PostgreSQL integration.

<img width="1919" height="995" alt="image" src="https://github.com/user-attachments/assets/5aa28311-7014-448d-a3dd-a1b146842c7c" />

---

## What This Project Demonstrates

- Manual GitHub OAuth flow implementation (no third-party auth libraries)
- JWT-based authentication with access and refresh tokens
- Layered backend architecture with separation of concerns
- PostgreSQL integration using Drizzle ORM
- TypeScript backend structuring
- JavaScript to TypeScript Migration

---

## Features

**GitHub OAuth Authentication**  
Complete OAuth pipeline from authorization to token exchange to user creation.

**Dual-Token System**  
- Access tokens (short-lived)
- Refresh tokens (longer-lived)
- Token refresh endpoint
- Logout functionality

**User Management**  
- Create user on first GitHub login
- Link GitHub account to existing email
- Prevent duplicate accounts

**Structured Architecture**  
Routes → Controllers → Services → Models → Database

---

## Tech Stack

- **Runtime:** Node.js  
- **Framework:** Express  
- **Language:** TypeScript  
- **Database:** PostgreSQL  
- **ORM:** Drizzle ORM  
- **Authentication:** GitHub OAuth (manual)
- **Session:** JWT (Access + Refresh)

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- GitHub OAuth App ([create one](https://github.com/settings/developers))

### Installation

```bash
git clone <repository-url>
cd server
npm install
```

### Environment Setup

Create `.env`:

```bash
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/codeboard
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback
```

### Run

```bash
npm run dev
```

Server runs at `http://localhost:3000`

---

## Project Structure

```
server/
├── src/
│   ├── routes/          # API route definitions
│   ├── controllers/     # Request handling
│   ├── services/        # Business logic
│   ├── models/          # Database operations
│   ├── middleware/      # Auth validation & error handling
│   ├── utils/           # JWT helpers
│   ├── app.ts
│   └── index.ts
├── drizzle.config.ts
└── tsconfig.json
```

---

## Authentication Flow

1. Client requests `/auth/github`
2. Redirect to GitHub authorization page
3. GitHub returns authorization code
4. Backend exchanges code for GitHub access token
5. Fetch GitHub user profile
6. Validate email presence
7. Database operation:
   - If user doesn't exist → create user
   - If user exists → update GitHub ID if needed
8. Generate access token and refresh token
9. Return authentication response

**Endpoints:**

- `GET /auth/github` – Initiate OAuth
- `GET /auth/github/callback` – OAuth callback
- `POST /auth/refresh` – Refresh access token
- `POST /auth/logout` – Invalidate session

---

## Development

```bash
npm run dev          # Development mode
npm run build        # Compile TypeScript
npm run start        # Production mode
```

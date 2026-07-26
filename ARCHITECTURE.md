# Architecture

## Overview

Box Office Inc follows a modern client-server architecture where the frontend handles user interaction and state management, while the backend exposes REST APIs responsible for business logic, authentication, and database operations.

This separation allows the frontend and backend to be developed, tested, and deployed independently.

```
                    +-----------------------+
                    |      Web Browser      |
                    +-----------+-----------+
                                |
                                | HTTP / HTTPS
                                |
                    +-----------v-----------+
                    | React + Vite Client   |
                    | Redux Toolkit         |
                    | API Layer             |
                    +-----------+-----------+
                                |
                                | REST API
                                |
                    +-----------v-----------+
                    | Express.js Backend    |
                    | Routes                |
                    | Controllers           |
                    | Services              |
                    +-----------+-----------+
                                |
                                |
                    +-----------v-----------+
                    | MongoDB Atlas         |
                    | Database              |
                    +-----------------------+
```

---

# System Components

## Frontend

The frontend is a Single Page Application (SPA) built using React and Vite.

### Responsibilities

- Rendering the user interface
- Client-side routing
- Managing global application state
- Communicating with backend APIs
- Displaying simulation data
- Managing game interactions

### Main Modules

```
frontend/
└── src/
    ├── api/          # API requests
    ├── app/          # App configuration
    ├── components/   # Reusable UI components
    ├── features/     # Redux Toolkit slices
    └── pages/        # Route-level pages
```

---

## Backend

The backend exposes RESTful APIs that manage authentication, business logic, and data persistence.

### Responsibilities

- API routing
- User authentication
- Business logic
- Movie simulation processing
- Database operations
- Utility functions

### Main Modules

```
backend/
├── api/
└── src/
    ├── config/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── services/
    └── utils/
```

---

# Request Lifecycle

Every request follows the layered architecture shown below.

```
Browser
   │
   ▼
React Page
   │
   ▼
React Component
   │
   ▼
Redux Toolkit
   │
   ▼
API Layer
   │
   ▼
Express Route
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
MongoDB Model
   │
   ▼
MongoDB Atlas
   │
   ▼
JSON Response
   │
   ▼
Redux Store Update
   │
   ▼
UI Re-render
```

---

# Authentication Flow

Authentication uses JWT-based access and refresh tokens.

```
User Login / Register
          │
          ▼
Validate Credentials
          │
          ▼
Generate JWT Tokens
          │
          ▼
Return Access & Refresh Tokens
          │
          ▼
Authenticated API Requests
          │
          ▼
Protected Backend Routes
```

---

# Game Simulation Flow

The core gameplay revolves around managing a movie studio.

```
Player
   │
   ▼
Manage Studio
   │
   ├────────► Hire Talent
   │
   ├────────► Purchase Scripts
   │
   ├────────► Start Production
   │
   ├────────► Launch Marketing
   │
   └────────► Release Movie
                    │
                    ▼
          Simulation Engine
                    │
                    ▼
      Revenue & Ratings Updated
                    │
                    ▼
        Studio Statistics Updated
```

---

# Backend Architecture

The backend follows a layered architecture.

```
Client Request
      │
      ▼
Routes
      │
      ▼
Controllers
      │
      ▼
Services
      │
      ▼
Models
      │
      ▼
MongoDB
```

Each layer has a single responsibility:

- **Routes** map incoming requests.
- **Controllers** validate requests and coordinate processing.
- **Services** contain business logic.
- **Models** interact with MongoDB.

---

# Data Flow

```
User Action
      │
      ▼
Frontend Page
      │
      ▼
Component
      │
      ▼
Redux State
      │
      ▼
API Request
      │
      ▼
Express Route
      │
      ▼
Controller
      │
      ▼
Service
      │
      ▼
Database
      │
      ▼
Service
      │
      ▼
Controller
      │
      ▼
JSON Response
      │
      ▼
Redux Update
      │
      ▼
User Interface
```

---

# Database Design

The project revolves around several core entities.

```
Player
 │
 ├──────── Studio
 │
 ├──────── Finances
 │
 └──────── Progress

Studio
 │
 ├──────── Movies
 ├──────── Staff
 ├──────── Reputation
 └──────── Revenue

Movie
 │
 ├──────── Script
 ├──────── Cast
 ├──────── Crew
 ├──────── Marketing
 ├──────── Rating
 └──────── Box Office
```

> **Note:** This represents the conceptual relationships described in the project overview. The actual MongoDB schema may evolve as development progresses.

---

# Security Architecture

Current security features include:

- JWT authentication
- Access token & refresh token mechanism
- Protected API endpoints
- Environment variable configuration
- Server-side validation
- MongoDB Atlas security

---

# Folder Responsibilities

| Folder | Responsibility |
|---------|----------------|
| `frontend/src/api` | API communication |
| `frontend/src/app` | Application configuration |
| `frontend/src/components` | Reusable UI components |
| `frontend/src/features` | Redux state management |
| `frontend/src/pages` | Application pages |
| `backend/src/config` | Environment and configuration |
| `backend/src/controllers` | Request handling |
| `backend/src/models` | MongoDB models |
| `backend/src/routes` | API routes |
| `backend/src/services` | Business logic |
| `backend/src/utils` | Shared helper functions |

---

# Deployment Architecture

```
                  Internet
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
Frontend (Vercel)          Backend (Vercel)
        │                           │
        └─────────────┬─────────────┘
                      │
                MongoDB Atlas
```

---

# Scalability Considerations

The architecture supports future enhancements such as:

- AI-powered simulation systems
- Multiplayer support
- Awards and achievements
- Seasonal events
- Dynamic market trends
- Background job processing
- Caching
- Containerisation with Docker
- CI/CD pipelines
- Cloud-native deployment

---

# Design Principles

The project follows modern software engineering principles:

- Separation of Concerns
- Layered Architecture
- Modular Code Organisation
- RESTful API Design
- Component-Based Frontend
- Service-Oriented Backend
- Reusable Business Logic
- Scalable and Maintainable Codebase

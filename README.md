This is a simple REST API project built with Node.js and Express, designed to serve as a backend for a film management application. It uses a **SQLite** database for data persistence and implements **JWT (JSON Web Token) Authentication** and **Role-Based Access Control (RBAC)** to secure its endpoints.

This project was created as part of the **Module 5 (Authentication)** and **Module 6 (Authorization)** curriculum.

## ✨ Key Features

- **Full CRUD** functionality for `Movies` and `Directors` resources.
- **Lightweight SQLite Database** for easy setup and portability.
- **JWT Authentication** (`jsonwebtoken`) to verify user identity.
- **Secure Password Hashing** using `bcryptjs`.
- **Role-Based Access Control (RBAC)** to distinguish between `user` and `admin` permissions.
- **Route Protection (Middleware)** to secure endpoints based on authentication status and user role.
- **Clean Project Structure** with separation of concerns (Routes, Controllers, Middleware).

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** SQLite 3
- **Security:** `jsonwebtoken`, `bcryptjs`
- **Utilities:** `dotenv`, `cors`

## 🚀 Installation & Setup

To get this project running on your local machine, follow these steps.

**1. Clone the Repository**

```bash
git clone https://github.com/bugkey24/api-film-sqlite-jwt.git
cd YOUR_REPO_NAME
```

**2. Install Dependencies**

```bash
npm install
```

**3. Create the Environment File (`.env`)**

You must create a `.env` file in the project's root folder. This file holds your secret keys.

```.env
# Server port
PORT=3300

# Filename for the SQLite database
DB_SOURCE="movies.db"

# JWT Secret Key - Replace this with a long, random, and strong string
JWT_SECRET="REPLACE_THIS_WITH_A_VERY_STRONG_AND_UNIQUE_SECRET_KEY"
```

**4. Run the Server**

```bash
node server.js
```

Your server is now running at `http://localhost:3300`. On the first run, it will automatically create the `movies.db` file and all necessary tables with the new `role` column.

## 🔐 API Workflow & Endpoints

This API now has two levels of security: **Authentication** (Are you logged in?) and **Authorization** (What are you allowed to do?).

### User Roles

- **`user`**: The default role for new registrations. Can view all data and create new items.
- **`admin`**: A privileged role. Can do everything a `user` can, _plus_ update and delete data.

### Workflow

1.  **Register a User:** `POST /auth/register` (gets the `user` role by default).
2.  **Register an Admin (Dev Only):** `POST /auth/register-admin` to create an `admin` user for testing.
3.  **Login:** `POST /auth/login` (with either account) to receive a JWT. The token's payload now includes your `role`.
4.  **Access Routes:** Use this token in the `Authorization: Bearer <token>` header to access the API. Your access will be limited based on the `role` in your token.

### Endpoint List

#### 1. Authentication (`/auth`)

| Method | Endpoint               | Description                                                             |
| :----- | :--------------------- | :---------------------------------------------------------------------- |
| `POST` | `/auth/register`       | Registers a new user (default role: `user`).                            |
| `POST` | `/auth/register-admin` | Registers a new admin (role: `admin`).                                  |
| `POST` | `/auth/login`          | Logs in and returns a JWT containing the user's ID, username, and role. |

#### 2. Movies (`/movies`)

| Method   | Endpoint      | Security Policy    |
| :------- | :------------ | :----------------- |
| `GET`    | `/movies`     | **Public**         |
| `GET`    | `/movies/:id` | **Public**         |
| `POST`   | `/movies`     | **Login Required** |
| `PUT`    | `/movies/:id` | **Admin Only**     |
| `DELETE` | `/movies/:id` | **Admin Only**     |

#### 3. Directors (`/directors`) - (Module 6 Task)

| Method   | Endpoint         | Security Policy    |
| :------- | :--------------- | :----------------- |
| `GET`    | `/directors`     | **Public**         |
| `GET`    | `/directors/:id` | **Public**         |
| `POST`   | `/directors`     | **Login Required** |
| `PUT`    | `/directors/:id` | **Admin Only**     |
| `DELETE` | `/directors/:id` | **Admin Only**     |

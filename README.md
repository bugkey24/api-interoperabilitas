# Film Management API (Node.js, SQLite, JWT)

This is a simple REST API project built with Node.js and Express, designed to serve as a backend for a film management application. It uses a **SQLite** database for data persistence and implements **JWT (JSON Web Token) Authentication** to secure its endpoints.

This project was created as part of the **Module 5 : Securing an API - Authentication and Authorization with JWT** curriculum.

## ✨ Key Features

- **Full CRUD** functionality for `Movies` and `Directors` resources.
- **Lightweight SQLite Database** for easy setup and portability.
- **JWT Authentication & Authorization** to protect routes.
- **User Registration** with secure password hashing using `bcryptjs`.
- **Route Protection (Middleware)** to secure write-endpoints (POST, PUT, DELETE).
- **Clean Project Structure** with separation of concerns (Routes, Controllers, Middleware).

## 🛠️ Tech Stack

- **Backend :** Node.js, Express.js
- **Database :** SQLite 3
- **Authentication :** `jsonwebtoken`, `bcryptjs`
- **Utilities :** `dotenv`, `cors`

## 🚀 Installation & Setup

To get this project running on your local machine, follow these steps.

**1. Clone the Repository**

```bash
git clone git remote add origin https://github.com/bugkey24/api-film-sqlite-jwt.git
cd api-film-sqlite-jwt
```

**2. Install Dependencies**

This project uses `npm`. Run the following command to install all required libraries (like `express`, `sqlite3`, `jsonwebtoken`, etc.).

```bash
npm install
```

**3. Create the Environment File (`.env`)**

You must create a `.env` file in the project's root folder. This file holds your secret keys and is required for the app to run.

_(This file is already listed in `.gitignore`, so it will not be uploaded to GitHub)._

```.env
# Server port
PORT=3300

# Filename for the SQLite database
DB_SOURCE="movies.db"

# JWT Secret Key - Replace this with a long, random, and strong string
JWT_SECRET="REPLACE_THIS_WITH_A_VERY_STRONG_AND_UNIQUE_SECRET_KEY"
```

**4. Run the Server**

Once dependencies are installed and the `.env` file is created, start the server:

```bash
node server.js
```

Your server is now running at `http://localhost:3300`.
On the first run, the server will automatically create the `movies.db` file and all necessary tables (`movies`, `directors`, `users`).

## 🔐 API Workflow & Endpoints

To use the protected API routes, you must follow the authentication workflow.

### Workflow

1.  **Register** a new account using `POST /auth/register`.
2.  **Login** using `POST /auth/login` to receive a JWT `token`.
3.  **Use the Token** in the `Authorization` Header (as `Bearer <token>`) to access protected routes.

### Endpoint List

#### 1. Authentication (`/auth`)

| Method | Endpoint         | Description                       |
| :----- | :--------------- | :-------------------------------- |
| `POST` | `/auth/register` | Registers a new user.             |
| `POST` | `/auth/login`    | Logs in a user and returns a JWT. |

#### 2. Movies (`/movies`)

| Method   | Endpoint      | Protected? | Description                     |
| :------- | :------------ | :--------- | :------------------------------ |
| `GET`    | `/movies`     | **No**     | Get a list of all movies.       |
| `GET`    | `/movies/:id` | **No**     | Get details for a single movie. |
| `POST`   | `/movies`     | **Yes**    | Add a new movie.                |
| `PUT`    | `/movies/:id` | **Yes**    | Update an existing movie.       |
| `DELETE` | `/movies/:id` | **Yes**    | Delete a movie.                 |

#### 3. Directors (`/directors`) - (Module 5 Task)

| Method   | Endpoint         | Protected? | Description                        |
| :------- | :--------------- | :--------- | :--------------------------------- |
| `GET`    | `/directors`     | **No**     | Get a list of all directors.       |
| `GET`    | `/directors/:id` | **No**     | Get details for a single director. |
| `POST`   | `/directors`     | **Yes**    | Add a new director.                |
| `PUT`    | `/directors/:id` | **Yes**    | Update an existing director.       |
| `DELETE` | `/directors/:id` | **Yes**    | Delete a director.                 |

# 🍳 Recipe Management

A self-hosted recipe management application built with Next.js. Organize your personal recipe collection, keep track of ingredients and cooking instructions, and easily find your next meal.

Recipe Management is designed to give you control over your recipes and data, with user authentication, personal collections, and locally stored images. It can be deployed using Docker Compose or run locally for development.

![Main Page](docs/screenshots/mainpage.png)

## ✨ Features

### Recipe Management

- Create, edit, and delete recipes.
- Add detailed descriptions, preparation times, cooking times, and serving sizes.
- Organize ingredients with quantities, units, and optional notes.
- Split cooking instructions into numbered steps.
- Attach images to recipes and individual cooking steps.
- Automatically manage uploaded images when recipes or steps are updated or deleted.

### Organization & Discovery

- Categorize recipes using searchable tags.
- Filter recipes by one or multiple tags.
- Sort recipes by title or creation/update date.
- Browse recipes using numbered pagination.
- Mark recipes as favorites.
- Create personal collections and add or remove recipes.
- Discover something to cook with the random recipe picker.

### Authentication & Security

- User registration and login.
- Password hashing with Argon2.
- User-owned recipes, favorites, and collections.
- Server-side authentication and authorization checks.
- Protected application pages and API endpoints.
- Users cannot access another user's private recipes or images.

### Self-hosting

- Dockerized production deployment.
- PostgreSQL database with Prisma migrations.
- Persistent database and image storage.
- No third-party image hosting service required.

## 🛠️ Technology Stack

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![daisyUI](https://img.shields.io/badge/daisyUI-1AD1A5?style=for-the-badge&logo=daisyui&logoColor=white)

### Backend & Database

![Next.js API](https://img.shields.io/badge/Next.js_API_Routes-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Auth.js](https://img.shields.io/badge/Auth.js-000000?style=for-the-badge&logo=auth0&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)

### Development & Deployment

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

## 🐳 Docker Deployment

Docker Compose is the recommended way to run the production application.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- Docker Compose (included with modern Docker installations)

### 1. Clone the repository

```bash
git clone <repository-url>
cd recipe-mangement
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
POSTGRES_USER=recipe_app
POSTGRES_PASSWORD=your_secure_database_password
POSTGRES_DB=recipe_management

AUTH_SECRET=your_generated_auth_secret

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Generate a secure Auth.js secret:

```bash
openssl rand -base64 32
```

Replace `AUTH_SECRET` with the generated value.

The Docker Compose configuration constructs `DATABASE_URL` automatically using the PostgreSQL environment variables. You do not need to define it separately.

### 3. Prepare persistent image storage

The Compose configuration mounts the following host directory:

```yaml
../recipe-uploads:/app/recipe-uploads
```

Create it relative to the project directory:

```bash
mkdir -p ../recipe-uploads
```

This keeps uploaded recipe and step images outside the application container.

### 4. Build and start the application

```bash
docker compose up -d --build app
```

Docker Compose will:

1. Start PostgreSQL.
2. Wait for the database health check to pass.
3. Build and run the migration service.
4. Apply pending Prisma migrations.
5. Start the Next.js application.

### 5. Access the application

Open:

```text
http://localhost:3000
```

The application is now running in production mode.

### Useful Docker commands

View running containers:

```bash
docker compose ps
```

View application logs:

```bash
docker compose logs -f app
```

Stop the application:

```bash
docker compose down
```

Rebuild after changing application code:

```bash
docker compose up -d --build app
```

**Important:** `docker compose down` preserves named volumes. Avoid `docker compose down -v` unless you intentionally want to delete the PostgreSQL database volume.

### Changing the exposed port

The application listens on port `3000` inside its container. You can change the host port in the Compose file:

```yaml
ports:
  - "8080:3000"
```

The application will then be accessible through port `8080` on the host machine.

The container's internal port does not need to change.

## 💻 Local Development

If you want to contribute, modify the application, or run it without Docker, follow these instructions.

### Prerequisites

- [Node.js 22](https://nodejs.org/) or a compatible newer version.
- npm.
- PostgreSQL 17.
- Git.

### 1. Clone the repository

```bash
git clone <repository-url>
cd recipe-mangement
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/recipe_management?schema=public

NEXT_PUBLIC_APP_URL=http://localhost:3000

AUTH_SECRET=your_generated_auth_secret
```

Generate an Auth.js secret if you haven't already:

```bash
openssl rand -base64 32
```

Make sure PostgreSQL is running and that the database specified in `DATABASE_URL` exists.

For local development, `DATABASE_URL` should point to your host-accessible PostgreSQL instance rather than the Docker Compose service hostname `db`.

### 4. Apply database migrations

Run Prisma migrations:

```bash
npx prisma migrate dev
```

If Prisma Client has not been generated yet:

```bash
npx prisma generate
```

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The application will run in development mode with Next.js hot reloading.

### Available npm scripts

| Command            | Description                       |
| ------------------ | --------------------------------- |
| `npm run dev`      | Start the development server.     |
| `npm run build`    | Build the production application. |
| `npm run start`    | Start the production server.      |
| `npm run lint`     | Run ESLint.                       |
| `npm test`         | Run Vitest in watch mode.         |
| `npm run test:run` | Run Vitest once.                  |

## 🗄️ Data Persistence

Recipe Management stores its data in two separate locations:

| Data                                            | Storage          |
| ----------------------------------------------- | ---------------- |
| Users, recipes, ingredients, steps, collections | PostgreSQL       |
| Recipe and cooking-step images                  | Local filesystem |

For Docker deployments:

- PostgreSQL data is stored in the `postgres_data` named volume.
- Uploaded images are stored in the host's `../recipe-uploads` directory.

Both locations should be included in your backup strategy.

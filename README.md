# Pokedex API

REST API built with NestJS, MongoDB, and Mongoose. Provides full CRUD for Pokémon with pagination, flexible lookup by ID/name/number, and a seed endpoint to populate the database from PokéAPI.

## Stack

- **NestJS 11** — framework
- **MongoDB 7** — database (via Docker)
- **Mongoose 9** — ODM
- **class-validator / class-transformer** — DTO validation
- **Joi** — environment variable validation
- **Axios** — HTTP client for PokéAPI

## Requirements

- Node.js 20+
- pnpm
- Docker & Docker Compose

## Setup

**1. Clone the repository**

```bash
git clone https://github.com/alomia/pokedex-api.git
cd pokedex-api
```

**2. Install dependencies**

```bash
pnpm install
```

**3. Configure environment variables**

```bash
cp .env.example .env
```

| Variable      | Required | Default                              | Description          |
|---------------|----------|--------------------------------------|----------------------|
| `NODE_ENV`    | No       | `development`                        | Environment          |
| `PORT`        | No       | `3000`                               | HTTP port            |
| `MONGODB_URI` | **Yes**  | —                                    | MongoDB connection string |

**4. Start the database**

```bash
docker compose up -d
```

**5. Start the development server**

```bash
pnpm start:dev
```

The API will be available at `http://localhost:3000/api/v1`.

## Seed the database

Once the server is running, populate the database with the first 650 Pokémon from PokéAPI:

```bash
curl -X POST http://localhost:3000/api/v1/seed
```

## API Endpoints

### Pokémon

| Method   | Endpoint                    | Description                                      |
|----------|-----------------------------|--------------------------------------------------|
| `POST`   | `/api/v1/pokemon`           | Create a Pokémon                                 |
| `GET`    | `/api/v1/pokemon`           | List Pokémon (paginated)                         |
| `GET`    | `/api/v1/pokemon/:term`     | Find by Mongo ID, Pokémon number, or name        |
| `PATCH`  | `/api/v1/pokemon/:term`     | Update by Mongo ID, Pokémon number, or name      |
| `DELETE` | `/api/v1/pokemon/:id`       | Delete by Mongo ID                               |

### Seed

| Method | Endpoint        | Description                              |
|--------|-----------------|------------------------------------------|
| `POST` | `/api/v1/seed`  | Populate DB with 650 Pokémon from PokéAPI |

### Query parameters for `GET /api/v1/pokemon`

| Parameter | Type   | Default | Description              |
|-----------|--------|---------|--------------------------|
| `limit`   | number | `10`    | Number of results        |
| `offset`  | number | `0`     | Number of results to skip |

**Example:**
```
GET /api/v1/pokemon?limit=20&offset=40
```

## Scripts

```bash
pnpm start:dev     # Development with hot reload
pnpm build         # Production build
pnpm start:prod    # Run production build
pnpm lint          # Lint and auto-fix
pnpm test          # Unit tests
pnpm test:e2e      # End-to-end tests
pnpm test:cov      # Test coverage
```

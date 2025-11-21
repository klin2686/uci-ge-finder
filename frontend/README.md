# Frontend

React + TypeScript + Vite application for the UCI GE Finder.

## Prerequisites

- Node.js (LTS recommended)
- npm or yarn

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   Copy the example environment file and modify as needed:

   **Windows (Command Prompt):**

   ```cmd
   copy .env.example .env
   ```

   **macOS/Linux:**

   ```bash
   cp .env.example .env
   ```

3. **Update `.env` values:**

   | Variable       | Description                          | Default                  |
   |----------------|--------------------------------------|--------------------------|
   | `VITE_API_URL` | Backend API URL                      | `http://localhost:5000`  |

   For local development, the default value will work if you're running the backend on port 5000.

## Running Locally

**Development server:**

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

## Available Scripts

| Command           | Description                              |
|-------------------|------------------------------------------|
| `npm run dev`     | Start development server                 |
| `npm run build`   | Build for production (runs TypeScript check first) |
| `npm run lint`    | Run ESLint                               |
| `npm run preview` | Preview production build locally         |

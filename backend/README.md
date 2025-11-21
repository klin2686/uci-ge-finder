# Backend

Python Flask API for the UCI GE Finder.

## Prerequisites

- Python 3
- Redis (for caching and rate limiting; [see below](#running-redis-locally))

## Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**

   **Windows (Command Prompt):**

   ```cmd
   python -m venv venv
   venv\Scripts\activate
   ```

   **macOS/Linux:**

   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**

   Copy the example environment file:

   **Windows (Command Prompt):**

   ```cmd
   copy .env.example .env
   ```

   **macOS/Linux:**

   ```bash
   cp .env.example .env
   ```

5. **Update `.env` values:**

   | Variable                | Description                                             | Default/Example          |
   |-------------------------|---------------------------------------------------------|--------------------------|
   | `SECRET_KEY`            | Flask secret key                                        | `your_secret_key_here`   |
   | `CACHE_TYPE`            | Cache backend type                                      | `RedisCache`             |
   | `CACHE_DEFAULT_TIMEOUT` | Cache timeout in seconds                                | `300`                    |
   | `REDIS_URL`             | Redis connection URL                                    | `redis://localhost:6379` |
   | `FLASK_ENV`             | Flask environment (`development`/`production`/`testing`)| `development`            |
   | `RATELIMIT_STRATEGY`    | Rate limiting strategy                                  | `fixed-window`           |

   > **Note:** Cache dependency invalidation only works with `RedisCache`.

## Running Redis Locally

**Windows:**

- Install Redis via [Memurai](https://www.memurai.com/) (Windows-native) or use WSL
- Or run via Docker: `docker run -p 6379:6379 redis`

**macOS:**

```bash
brew install redis
brew services start redis
```

**Linux:**

```bash
sudo apt install redis-server
sudo systemctl start redis
```

## Running the Server

```bash
python run.py
```

The API will be available at `http://localhost:5000` by default.

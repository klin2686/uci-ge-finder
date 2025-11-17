from typing import Optional

import redis
from flask_caching import Cache
from flask_cors import CORS

cors = CORS()
cache = Cache()

redis_client: Optional[redis.Redis] = None

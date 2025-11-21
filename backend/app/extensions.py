from typing import Optional

import redis
from flask_caching import Cache
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

cors = CORS()
cache = Cache()
limiter = Limiter(get_remote_address)

redis_client: Optional[redis.Redis] = None

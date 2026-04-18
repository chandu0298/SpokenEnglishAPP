from upstash_redis.asyncio import Redis
from config import settings
import json
from typing import List, Dict, Optional

# Graceful fallback if redis isn't configured yet
try:
    if settings.upstash_redis_url and settings.upstash_redis_token:
        redis_client = Redis(url=settings.upstash_redis_url, token=settings.upstash_redis_token)
    else:
        redis_client = None
except Exception as e:
    print(f"Redis initialization failed: {e}")
    redis_client = None

# In-memory dictionary as a fallback for local testing without Upstash
_local_cache = {}

async def get_chat_history(user_id: str, limit: int = 10) -> List[Dict]:
    """Retrieve chat history for a given user."""
    key = f"chat:{user_id}:history"
    
    if redis_client:
        try:
            history = await redis_client.lrange(key, 0, limit - 1)
            # Reversing because we typically want chronological order, 
            # or depends on how we push (lpush/rpush)
            return [json.loads(msg) for msg in history[::-1]]
        except Exception as e:
            print(f"Redis error getting history: {e}")
            
    # Fallback
    return _local_cache.get(key, [])[-limit:]

async def add_message_to_history(user_id: str, role: str, content: str, limit: int = 10):
    """Adds a message to the user's chat history and keeps only the latest 'limit' messages."""
    key = f"chat:{user_id}:history"
    msg_json = json.dumps({"role": role, "content": content})
    
    if redis_client:
        try:
            # We push to the right (end of the list)
            await redis_client.rpush(key, msg_json)
            # Clip the list to the last `limit` elements
            await redis_client.ltrim(key, -limit, -1)
            return
        except Exception as e:
            print(f"Redis error setting history: {e}")
            
    # Fallback to local dict
    if key not in _local_cache:
        _local_cache[key] = []
    _local_cache[key].append({"role": role, "content": content})
    _local_cache[key] = _local_cache[key][-limit:]

async def get_cached_response(cache_key: str) -> Optional[str]:
    """Retrieve a cached response if it exists."""
    if redis_client:
        try:
            return await redis_client.get(f"cache:{cache_key}")
        except Exception as e:
            print(f"Redis error getting cache: {e}")
    return _local_cache.get(f"cache:{cache_key}")

async def set_cached_response(cache_key: str, response: str, expire_seconds: int = 86400):
    """Cache a response for a given key (default 24 hours)."""
    if redis_client:
        try:
            await redis_client.set(f"cache:{cache_key}", response, ex=expire_seconds)
            return
        except Exception as e:
            print(f"Redis error setting cache: {e}")
            
    # Fallback to local dict
    _local_cache[f"cache:{cache_key}"] = response

async def increment_user_usage(user_id: str, feature: str) -> int:
    """
    Increments a daily counter for a specific feature and user.
    Returns the new count.
    """
    from datetime import datetime
    date_str = datetime.now().strftime("%Y-%m-%d")
    key = f"usage:{user_id}:{feature}:{date_str}"
    
    if redis_client:
        try:
            # Increment and set expiry to 24 hours if it's the first time
            count = await redis_client.incr(key)
            if count == 1:
                await redis_client.expire(key, 86400)
            return count
        except Exception as e:
            print(f"Redis error incrementing usage: {e}")
            
    # Fallback
    _local_cache[key] = _local_cache.get(key, 0) + 1
    return _local_cache[key]

async def get_user_usage(user_id: str, feature: str) -> int:
    """Gets the current daily usage count for a feature."""
    from datetime import datetime
    date_str = datetime.now().strftime("%Y-%m-%d")
    key = f"usage:{user_id}:{feature}:{date_str}"
    
    if redis_client:
        try:
            val = await redis_client.get(key)
            return int(val) if val else 0
        except Exception as e:
            print(f"Redis error getting usage: {e}")
            
    return _local_cache.get(key, 0)

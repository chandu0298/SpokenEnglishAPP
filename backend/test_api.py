import asyncio
from httpx import AsyncClient
from main import app
import json

async def test_me_endpoint():
    print("Testing /api/user/me endpoint internally...")
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Test without token (should trigger MOCK mode if env=development)
        response = await ac.get("/api/user/me")
        print(f"Status Code (No Token): {response.status_code}")
        try:
            print(f"Response Body: {json.dumps(response.json(), indent=2)}")
        except:
            print(f"Response Text: {response.text}")

        # Test chat/message with mock user
        print("\nTesting /api/chat/message internally...")
        response = await ac.post("/api/chat/message", json={
            "message": "I want to know about the different usage of Can and Could",
            "user_level": "B1"
        })
        print(f"Status Code: {response.status_code}")
        body = response.json()
        if "traceback" in body:
            print(f"TRACEBACK DETECTED:\n{body['traceback']}")
        else:
            print(f"Response Body: {json.dumps(body, indent=2)}")

if __name__ == "__main__":
    asyncio.run(test_me_endpoint())

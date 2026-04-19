#!/usr/bin/env python3
"""
Backend API Testing for EchoFluent SpokenEnglishAPP
Tests the key endpoints mentioned in the review request.
"""

import requests
import sys
import json
from datetime import datetime

class EchoFluentAPITester:
    def __init__(self, base_url="https://9c704916-3722-44af-aa7a-382a60851d1b.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response preview: {str(response_data)[:200]}...")
                except:
                    print(f"   Response text: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:500]}")
                self.failed_tests.append({
                    "test": name,
                    "endpoint": endpoint,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:500]
                })

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "endpoint": endpoint,
                "error": str(e)
            })
            return False, {}

    def test_health_check(self):
        """Test backend API health check at /"""
        return self.run_test(
            "Backend Health Check",
            "GET",
            "/",
            200
        )

    def test_chat_demo(self):
        """Test /api/chat/demo endpoint - AI Coach Priya chat functionality"""
        return self.run_test(
            "Chat Demo - AI Coach Priya",
            "POST",
            "/api/chat/demo",
            200,
            data={
                "message": "Hello, can you help me practice English?",
                "user_level": "B1"
            }
        )

    def test_daily_word_origin(self):
        """Test /api/vocab/daily-origin endpoint - word origin feature"""
        return self.run_test(
            "Daily Word Origin",
            "GET",
            "/api/vocab/daily-origin",
            200
        )

    def test_chat_demo_empty_message(self):
        """Test chat demo with empty message (should fail)"""
        return self.run_test(
            "Chat Demo - Empty Message",
            "POST",
            "/api/chat/demo",
            400,
            data={
                "message": "",
                "user_level": "B1"
            }
        )

    def test_chat_demo_different_levels(self):
        """Test chat demo with different user levels"""
        levels = ["A1", "A2", "B1", "B2", "C1", "C2"]
        success_count = 0
        
        for level in levels:
            success, _ = self.run_test(
                f"Chat Demo - Level {level}",
                "POST",
                "/api/chat/demo",
                200,
                data={
                    "message": f"Hello, I'm at {level} level",
                    "user_level": level
                }
            )
            if success:
                success_count += 1
        
        return success_count == len(levels), {}

def main():
    print("🚀 Starting EchoFluent Backend API Tests")
    print("=" * 50)
    
    tester = EchoFluentAPITester()
    
    # Test 1: Health check
    print("\n📋 Testing Core Endpoints...")
    tester.test_health_check()
    
    # Test 2: Chat demo functionality
    print("\n💬 Testing Chat Demo Functionality...")
    tester.test_chat_demo()
    
    # Test 3: Daily word origin
    print("\n📚 Testing Vocabulary Features...")
    tester.test_daily_word_origin()
    
    # Test 4: Error handling
    print("\n🛡️ Testing Error Handling...")
    tester.test_chat_demo_empty_message()
    
    # Test 5: Different user levels
    print("\n🎯 Testing Different User Levels...")
    tester.test_chat_demo_different_levels()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for test in tester.failed_tests:
            error_msg = test.get('error', f"Status {test.get('actual')} (expected {test.get('expected')})")
            print(f"   - {test['test']}: {error_msg}")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"\n🎯 Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
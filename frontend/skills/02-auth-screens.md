# Frontend Skill 02: Auth Screens

## Architecture
Authentication is managed via Firebase Client SDK. The state is synchronized with our React context provider to guard routes.

## Flow
On app launch, the `_layout.tsx` checks if the user is logged in.
If NOT logged in:
1. User is redirected to `app/(auth)/login.tsx` (or onboarding).
2. They enter email/password or use Phone OTP (via Firebase Recaptcha Verifier).
3. Firebase logs them in and returns a JWT.
4. We store the JWT securely using `expo-secure-store`.
5. We make an API call to our backend (`POST /api/auth/register`) to ensure the user exists in our Neon PostgreSQL database.
6. User is redirected to `app/(tabs)/index.tsx`.

## Key Screens
- `onboarding.tsx`: 3-slide swipable carousel introducing the app -> "Get Started" button.
- `login.tsx`: Email input, Password input, OR "Login with Phone" toggle.
- `otp.tsx`: 6-digit OTP input view.

## Design Details
- Auth screens should have a clean white background.
- Emphasize the brand logo and colors.
- Input fields should be large, tappable (`height: 56px`), with clear focus states (e.g. blue border when focused).

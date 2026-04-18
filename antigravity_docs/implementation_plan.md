# Implementation Plan: Frontend Project Initialization

## Goal
Establish the React Native (Expo) foundation for the SpokenEnglishAPP. This includes setting up the project structure, configuring Expo Router for file-based navigation, and initializing the "Stitch" design system.

## User Review Required
> [!IMPORTANT]
> **Node.js Environment**: I will be using the Homebrew-installed Node.js path (`/opt/homebrew/bin`) for initialization. 
> 
> **Project Structure**: I will initialize the Expo app directly inside the `frontend/` directory. If any conflicts occur with the existing `skills/` folder, I will resolve them by temporarily moving the skills folder.

## Proposed Changes

### 1. Project Initialization
#### [NEW] [Expo App](file:///Users/chandrasekhar/Live%20Projects/SpokenEnglishAPP/frontend)
Initialize a new Expo project using the TypeScript template:
```bash
npx create-expo-app@latest ./ --template blank-typescript
```

### 2. Design System & Constants
#### [NEW] `frontend/constants/Theme.ts`
Define the project-wide theme based on the "Stitch" prototype:
- **Colors**: Primary (`#2B59FF`), Background (`#F5F7FA`), Text (`#1A1C1E`).
- **Typography**: Configure Inter font settings.

### 3. Navigation Scaffolding (Expo Router)
#### [NEW] `frontend/app/_layout.tsx`
The root layout providing global providers (Theme, Auth).
#### [NEW] `frontend/app/(auth)/login.tsx`
The entry point for user authentication.
#### [NEW] `frontend/app/(tabs)/_layout.tsx`
Bottom tab navigation for Home, Lessons, and Pronunciation.

### 4. Dependencies
Install essential libraries:
- `expo-router`: For file-based navigation.
- `expo-font`: To load the Inter font.
- `expo-speech`: For the offline pronunciation feature.
- `lucide-react-native`: For iconography.

---

## Verification Plan
### Manual Verification
- Ensure `npx expo` starts without configuration errors.
- Confirm the `frontend/app/` structure matches the planned design.
- Verify that `expo-router` is correctly configured in `package.json`.

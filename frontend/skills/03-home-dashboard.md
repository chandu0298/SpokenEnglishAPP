# Frontend Skill 03: Home Dashboard

## Architecture
The Home Dashboard (`app/(tabs)/index.tsx`) is the user's primary landing view. It aggregates data from the user profile, progress tracking, and lessons APIs.

## Components
1. **Header Area**:
   - "Good Morning, [Name]"
   - Streak Flame Icon + Number
   - Total Fluency Score Badge (0-100)
2. **Category Filter Tabs**: 
   - A horizontal scroll view with pills: "All", "Social", "Business", "Travel", "Daily", "Phone".
   - Active pill uses Primary Blue background `#2B59FF` with white text.
3. **Topic Grid / List**:
   - Scrollable list of `TopicCard` components.
   - Each card represents a lesson block.

## TopicCard Design
- **Background**: `#FFFFFF`
- **Shadow**: Light dropdown `rgba(0,0,0,0.05)`
- **Header**: Category tag (e.g., `Social` colored green) and difficulty tag.
- **Title**: e.g., "Job Interview" (Bold, 18px).
- **Progress Bar**: Horizontal bar showing % completed.
- **Status Icon**: Checkmark if done, Padlock if locked (PRO only).

## State Management
- Fetch data from `/api/lessons` on mount.
- Pull-to-refresh enabled.
- If a user clicks a locked PRO topic, open the `payment.tsx` modal.

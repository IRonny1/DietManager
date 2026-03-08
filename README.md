# 🍽️ AI Calorie Tracker - Mobile App

## 📖 Project Overview

An Android mobile application that uses artificial intelligence to analyze food calorie content from photos. The app enables users to scan meals, get detailed nutritional information, track their daily intake, and achieve personal fitness goals.

## 🎯 Main Goal

Create a simple, convenient, and functional tool for nutrition monitoring with minimal user effort. Primary focus on speed and accuracy of AI recognition.

---

## 🛠️ Technology Stack

### Mobile Frontend
- **Framework:** React Native + TypeScript
- **Navigation:** React Navigation v6
- **State Management:** Zustand (simple & performant)
- **UI Library:** React Native Paper (Material Design)
- **Forms:** React Hook Form
- **Charts:** react-native-chart-kit
- **Camera:** react-native-vision-camera
- **Image Picker:** react-native-image-picker
- **Local Storage:** AsyncStorage + MMKV (for performance)
- **HTTP Client:** Axios
- **Date Handling:** date-fns

### Backend
- **Framework:** NestJS + TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Call to own backend, then own backend calls external Auth service
- **File Storage:** AWS S3 or local storage
- **API Documentation:** Swagger/OpenAPI

### AI & External APIs
- **Image Recognition:** Claude API (Anthropic) - vision capabilities
- **Food Database:** USDA FoodData Central API or Open Food Facts
- **Calorie Calculation:** Custom formulas (Mifflin-St Jeor)

### DevOps & Tools
- **Version Control:** Git + GitHub
- **CI/CD:** GitHub Actions
- **Code Quality:** ESLint + Prettier
- **Testing:** Jest + React Native Testing Library
- **Backend Hosting:** Railway, Render, or DigitalOcean
- **Database Hosting:** Supabase or Neon

---

## 👥 User Types

### 1. Guest User (No Registration)
**Available Features:**
- Upload photo and get instant results (calories + macros)
- Manual food entry
- Basic daily statistics (stored in device)

**Limitations:**
- History stored only in browser/device
- No access to weekly/monthly statistics
- No cross-device synchronization

### 2. Registered User
**Additional Features:**
- Complete scan history
- Personal goals (auto-calculated or manual)
- Weekly/monthly statistics with charts
- Cross-device synchronization
- Profile editing

---

## 🎯 Core Features

### ✅ MVP Features

1. **AI Food Recognition**
    - Camera integration
    - Photo upload from gallery
    - AI analysis via Claude API
    - Results: category, ingredients, calories, macros, portion size

2. **Daily Tracking**
    - Add meals (AI or manual)
    - View daily progress
    - Track calories and macros (Protein, Fat, Carbs)
    - Progress indicator to daily goal

3. **User Authentication**
    - Registration (email + password)
    - Login/Logout
    - Profile management

4. **Personal Goals**
    - Auto-calculation based on user data (age, weight, height, activity, goal)
    - Manual goal setting
    - Ability to edit goals

5. **Scan History**
    - View all previous scans
    - Filter by date
    - Delete entries
    - View details (photo, nutrition, timestamp)

6. **Basic Statistics**
    - Daily summary
    - Weekly statistics
    - Simple charts (bar chart, pie chart)

### ⭐ Bonus Features (If Time Allows)

7. **Advanced Statistics**
    - Monthly reports
    - Detailed charts and trends
    - Average consumption metrics

8. **Data Export**
    - Export to CSV
    - Export to PDF report

9. **Additional Features**
    - Dark mode
    - Multiple language support
    - Push notifications
    - Barcode scanner for packaged foods

---

## 🔄 User Flows

### Flow 1: First Time Use (Guest)
```
1. User opens app
2. Sees welcome screen with "Scan Food" button
3. Taps button → Camera or gallery picker opens
4. Uploads food photo
5. AI analyzes → Shows results:
   - Category name (e.g., "Pizza Margherita")
   - Main ingredients
   - Calories (kcal)
   - Protein/Fat/Carbs (g)
   - Portion size (g)
6. User can:
   - Confirm and add to daily log
   - Edit data manually
   - Cancel
7. After adding → Sees daily statistics
8. Banner: "Register to save your history"
```

### Flow 2: Registration & Profile Setup
```
1. User taps "Sign Up"
2. Enters email + password (optional: OAuth Google)
3. After registration → Onboarding:
   a) "Set Your Goal"
   b) Choose mode:
      - Automatic calculation (form: age, gender, weight, height, activity, goal)
      - Manual entry (just enter kcal number)
4. System calculates daily norm using Mifflin-St Jeor formula
5. Shows result + ability to adjust
6. Saves settings
7. Redirects to Dashboard
```

### Flow 3: Main Usage Cycle (Registered User)
```
1. User opens app → Sees Dashboard:
   - Daily goal progress (circular chart)
   - List of today's meals
   - "Add Food" button

2. Taps "Add Food" → Choice:
   a) Scan photo
   b) Add manually (if AI failed)

3a. If scanning:
   - Uploads photo → AI recognizes
   - Shows results with edit option
   - Adds to log

3b. If manual:
   - Form: meal name, calories, macros, portion
   - Saves

4. Daily statistics updates
5. Can view history or statistics
```

### Flow 4: History View
```
1. User navigates to "History" tab
2. Sees calendar or date-based list
3. Can filter:
   - By date
   - By source (AI/manual)
4. Taps record → Sees details:
   - Photo (if available)
   - Full meal information
   - Timestamp
5. Can delete entry
```

### Flow 5: Statistics & Reports
```
1. User navigates to "Statistics" tab
2. Selects period:
   - Week
   - Month
3. Sees charts:
   - Calories per day (bar chart)
   - Macro distribution (pie chart)
   - Average consumption
   - Days with over/under target
4. Can export report (bonus feature)
```

### Flow 6: Goal Editing
```
1. User navigates to "Profile" tab
2. Sees current settings:
   - Daily calorie goal
   - Physical parameters (if using auto-calculation)
3. Can:
   - Change goal manually
   - Update parameters → recalculate automatically
   - Switch mode (auto ↔ manual)
4. Saves changes
```

---

## 📱 App Structure (Screens)

### 1. **Welcome Screen** (First launch only)
- App logo and tagline
- "Get Started" button
- "Sign In" link

### 2. **Auth Screens**
- Login screen
- Registration screen
- Forgot password (optional)

### 3. **Onboarding** (After registration)
- Goal setup wizard (2-3 steps)

### 4. **Main Tabs** (Bottom Navigation)

#### Tab 1: Dashboard (Home)
- Daily progress circle
- Today's meals list
- "Add Food" FAB button
- Quick stats

#### Tab 2: Add Food
- Camera view or gallery picker
- AI result display
- Edit form
- Manual entry option

#### Tab 3: History
- Calendar view or list
- Date filters
- Meal cards
- Search functionality

#### Tab 4: Statistics
- Period selector
- Charts and graphs
- Summary metrics

#### Tab 5: Profile
- User info
- Goals settings
- App preferences
- Logout button
- 
---

## 🎨 Design Guidelines

### Color Scheme
- Primary: Green (#4CAF50) - health, freshness
- Secondary: Orange (#FF9800) - energy, calories
- Background: White/Light Gray (#F5F5F5)
- Text: Dark Gray (#212121)
- Accent: Blue (#2196F3) - interactive elements

### Typography
- Headers: Bold, 20-24px
- Body: Regular, 14-16px
- Captions: Light, 12px

### Components Style
- Rounded corners (8-12px radius)
- Subtle shadows
- Clear hierarchy
- Touch-friendly targets (min 44x44px)

---
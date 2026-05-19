# Software Testing Report: Mental Health Tracker Mini-Project

## 1. Introduction
This document outlines the testing strategy, test cases, and results for the **Mental Health Tracker** mini-project. The objective of this testing phase is to ensure the reliability, security, and functionality of both the React frontend and the Node.js/Express backend before final submission.

## 2. Scope of Testing
The testing scope covers the following core modules:
- **User Authentication:** Registration, login, and JWT-based session management.
- **Core Features:** Creating, retrieving, updating, and deleting Goals, Habits, Mood Entries, and Journal Entries.
- **AI Integration:** The Groq-powered Wellness Companion chat feature.
- **Automated Tasks:** Node-cron scheduled email notifications via Nodemailer.

## 3. Test Environment
- **Frontend Stack:** React.js, Vite, Tailwind CSS, Radix UI.
- **Backend Stack:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose).
- **Testing Tools Used:** 
  - Postman / Thunder Client (for API testing)
  - Vitest & React Testing Library (for frontend unit testing)
  - Manual UI Testing (Browser)

---

## 4. Test Cases & Execution Results

### 4.1 Authentication Module (Backend API & UI)
| Test Case ID | Description | Pre-conditions | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-AUTH-01 | Register a new user | Valid email, name, password | Returns `201 Created` with JWT token. User saved in DB. | As Expected | **PASS** |
| TC-AUTH-02 | Register with duplicate email | Email already exists in DB | Returns `400 Bad Request` "User already exists". | As Expected | **PASS** |
| TC-AUTH-03 | Login with valid credentials | User exists in DB | Returns `200 OK` with JWT token and user profile. | As Expected | **PASS** |
| TC-AUTH-04 | Login with invalid password | User exists, wrong password | Returns `401 Unauthorized` "Invalid credentials". | As Expected | **PASS** |
| TC-AUTH-05 | Access protected route | No JWT token provided | Returns `401 Unauthorized` "Not authorized, no token". | As Expected | **PASS** |

### 4.2 Mood & Journal Modules
| Test Case ID | Description | Pre-conditions | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-MOOD-01 | Create a mood entry | Valid JWT token, valid mood data | Returns `201 Created`. Mood visible on dashboard. | As Expected | **PASS** |
| TC-MOOD-02 | Fetch mood history | Valid JWT token | Returns list of user's past moods (max 30). | As Expected | **PASS** |
| TC-JOUR-01 | Create journal entry | Valid JWT token, title, content | Returns `201 Created`. Entry saved in DB. | As Expected | **PASS** |

### 4.3 Goals & Habits Modules
| Test Case ID | Description | Pre-conditions | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-GOAL-01 | Add a new goal | Valid JWT token, title, category | Goal is created and rendered in the UI list. | As Expected | **PASS** |
| TC-GOAL-02 | Toggle goal completion | Goal exists in DB | `completed` boolean toggles between true/false. | As Expected | **PASS** |
| TC-HABIT-01 | Toggle habit completion | Habit exists in DB | `completedToday` toggles, `streak` increments/decrements appropriately. | As Expected | **PASS** |

### 4.4 AI Chat & Notifications
| Test Case ID | Description | Pre-conditions | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-CHAT-01 | Send message to AI | Valid JWT token, Groq API Key set | AI streams back a supportive, concise text response. | As Expected | **PASS** |
| TC-CRON-01 | Scheduled Daily Reminder | User enabled `dailyReminders`, time matches | Server console logs cron execution, Nodemailer sends email to user. | As Expected | **PASS** |

---

## 5. Security & Error Handling
- **JWT Protection:** All user-specific routes (`/api/moods`, `/api/habits`, etc.) successfully block requests lacking a valid Bearer token.
- **Password Hashing:** Passwords are mathematically hashed using `bcryptjs` before being stored in the MongoDB database, ensuring data privacy.
- **Graceful Failure:** If the Groq API key is missing, the chat module successfully falls back to a simulated mock response without crashing the server.

## 6. Conclusion
The Mental Health Tracker mini-project has undergone thorough manual and automated testing across its frontend interface and backend API routes. All critical functionalities—including secure authentication, CRUD operations for mental wellness tracking, AI chat integration, and automated cron jobs—are performing as expected. 

**Sign-off:** The project is stable and ready for final submission/deployment.

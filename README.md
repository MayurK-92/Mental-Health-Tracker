# Mental Health Tracker

A comprehensive, full-stack web application designed to help users track, manage, and improve their mental wellness. This platform offers a suite of tools including mood logging, interactive journaling, habit and goal tracking, and an AI-powered wellness companion to provide supportive guidance.

## 🚀 Features

*   **User Authentication**: Secure registration and login system utilizing JWT (JSON Web Tokens) and bcrypt for password hashing.
*   **Mood & Journal Tracking**: Log daily moods and maintain a personal journal to reflect on your thoughts and track mental health trends over time.
*   **Goals & Habits Management**: Set personal wellness goals and build positive daily habits with streak tracking.
*   **AI Wellness Companion**: An integrated chat interface powered by Groq API, offering a supportive, AI-driven assistant for mental wellness guidance.
*   **Automated Reminders**: Daily scheduled email notifications (using node-cron and Nodemailer) to encourage users to log their wellness data.

## 🛠️ Technology Stack

**Frontend:**
*   React.js
*   Vite
*   Tailwind CSS
*   Radix UI (Shadcn UI components)
*   Recharts (for data visualization)
*   React Router, React Query

**Backend:**
*   Node.js
*   Express.js
*   MongoDB (Mongoose ODM)
*   JWT for Authentication
*   Node-cron & Nodemailer for task scheduling
*   Groq API Integration

## 📂 Project Structure

The repository is structured into two main parts:
*   `/` (Root): Contains the React frontend application built with Vite.
*   `/backend`: Contains the Node.js and Express backend API.

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js installed on your machine.
*   MongoDB instance running (local or cloud like MongoDB Atlas).
*   Groq API Key for the AI companion.

### 1. Clone the repository
```bash
git clone <repository-url>
cd "Mental health tracker"
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mental-health
JWT_SECRET=your_jwt_secret_key
GROK_API_KEY=your_groq_api_key
# Ensure any other required environment variables are set
```

Start the backend server:
```bash
node server.js
```

### 3. Frontend Setup
Open a new terminal window, navigate to the root directory, and install dependencies:
```bash
cd "Mental health tracker"
npm install
```

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000
```

Start the Vite development server:
```bash
npm run dev
```

The application should now be accessible at `http://localhost:5173` (or the port specified by Vite).

## 🧪 Testing

The project includes a comprehensive testing strategy covering user authentication, core CRUD features, AI integration, and automated tasks. 

For more details on test cases, execution, and results, please refer to the [Testing Report](Testing_Report.md).

## 📝 License
ISC

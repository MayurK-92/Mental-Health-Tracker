# Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose

* This document defines the purpose, scope, and requirements for the Mental Health Tracker software application.
* The system is a full-stack web application designed to help individuals monitor, manage, and improve their mental wellness through a suite of digital tools including mood logging, interactive journaling, goal/habit tracking, an AI-powered wellness companion, and automated reminders.
* Version/Release: 1.0

### 1.2 Document Conventions

* Naming conventions: Standard conventions are followed (e.g., camelCase for variables/functions, PascalCase for React components).
* Formatting standards: Markdown is used for documentation formatting.
* Requirement priority rules: Requirements are classified as High (must-have), Medium (should-have), or Low (nice-to-have).
* Terminology usage: Technical terms and acronyms are defined in the Glossary (Appendix A).

### 1.3 Intended Audience and Reading Suggestions

* **Developers**: To understand the architectural design, feature specifications, and implementation details.
* **Testers**: To formulate test cases, test plans, and validation strategies.
* **Project Managers**: To track project progress, scope, and feature completion.
* **Clients/Stakeholders**: To verify that the functional and non-functional requirements meet the overall vision.

### 1.4 Product Scope

* **Overview of the software**: A comprehensive web-based platform combining traditional mental health journaling and habit tracking with modern AI-driven guidance.
* **Objectives and goals**: To encourage consistent tracking of mental states, aid in building positive daily habits, and offer a supportive, accessible interface for mental wellness.
* **Business benefits**: Promotes digital wellness and provides scalable support tools for individuals to self-manage their mental health routines.
* **Relation to business strategy**: Aligns with the growing focus on digital health, wellness applications, and self-care technologies.

### 1.5 References

* React.js Documentation
* Node.js & Express.js Documentation
* MongoDB & Mongoose Documentation
* Groq API Reference
* [Testing_Report.md](./Testing_Report.md)

---

# 2. Overall Description

### 2.1 Product Perspective

* **System context**: The Mental Health Tracker is an independent web application that interacts with external services, specifically the Groq API for AI capabilities and an SMTP service (via Nodemailer) for emails.
* **Existing system relationship**: It is a standalone application built from scratch.
* **High-level architecture**: Client-Server architecture utilizing the MERN stack (MongoDB, Express.js, React, Node.js).
* **External systems interaction**: Connects to MongoDB for data persistence, Groq API for the wellness companion, and an email provider for automated notifications.

### 2.2 Product Functions

* User Registration and Authentication (JWT).
* Mood and Journal Logging.
* Goal setting and Habit streak tracking.
* AI Wellness Companion (Interactive Chat).
* Automated Daily Email Reminders.

### 2.3 User Classes and Characteristics

* **Customer/User**: Individuals seeking to track their mental health. Requires basic computer literacy. They have access only to their personal data and features.
* **Technical expertise levels**: Designed to be intuitive for non-technical users.
* **Access privileges**: Users are restricted to their own accounts and data. There is no administrative dashboard in the current scope.

### 2.4 Operating Environment

* **Hardware platform**: Any device (PC, tablet, mobile) capable of running a modern web browser.
* **OS requirements**: OS-agnostic (Windows, macOS, Linux, iOS, Android).
* **Browser support**: Modern browsers (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge).
* **Database requirements**: MongoDB (Local instance or Cloud via MongoDB Atlas).
* **Network environment**: Active internet connection required for API communications, database access, and AI interactions.

### 2.5 Design and Implementation Constraints

* **Technology stack constraints**: Must be built using React.js (Vite), Node.js, Express.js, and MongoDB.
* **Security constraints**: Passwords must be securely hashed (bcrypt), and API routes must be protected using JWT.
* **Hardware limitations**: The system relies on the user's browser performance for frontend rendering.

### 2.6 User Documentation

* **Installation guide**: Available in the `README.md` file located in the project root.
* **Testing guide**: Available in the `Testing_Report.md` file.

### 2.7 Assumptions and Dependencies

* **Third-party services**: Relies on the continuous availability of the Groq API for the AI companion feature.
* **Assumed conditions**: Users must provide a valid email address to receive automated reminders and reset passwords (if implemented).

---

# 3. External Interface Requirements

### 3.1 User Interfaces

* **UI design guidelines**: Clean, modern, and accessible design utilizing Tailwind CSS and Radix UI (Shadcn components).
* **Screen layouts**: Responsive layouts including a central Dashboard, Journaling view, Habit Tracker interface, AI Chat window, and Authentication screens.
* **Data Visualization**: Recharts will be used to display mood trends and habit streaks visually.

### 3.2 Hardware Interfaces

* No specific hardware interfaces required beyond standard device input (keyboard, mouse, touch screen).

### 3.3 Software Interfaces

* **APIs**: The React frontend communicates with the Node.js backend via a RESTful API. The backend communicates with the Groq API.
* **Databases**: The backend uses Mongoose ODM to interface with MongoDB.

### 3.4 Communications Interfaces

* **Network protocols**: HTTP/HTTPS for client-server communication.
* **Email services**: SMTP protocol utilized via Nodemailer to send automated email reminders.

---

# 4. System Features

## 4.1 User Authentication

### 4.1.1 Description and Priority
* **Feature description**: Secure registration and login system.
* **Priority level**: High

### 4.1.2 Stimulus/Response Sequences
* **User action**: User submits registration form with email and password.
* **System response**: System creates an account, hashes the password, stores it in the database, and returns a success message.
* **User action**: User submits login credentials.
* **System response**: System verifies credentials, generates a JWT, and grants access to protected routes.

### 4.1.3 Functional Requirements
#### REQ-1
* The system must securely hash user passwords using bcrypt before database insertion.
#### REQ-2
* The system must generate, assign, and validate JSON Web Tokens (JWT) to manage user sessions and protect API endpoints.

## 4.2 Mood & Journal Tracking

### 4.2.1 Description and Priority
* **Feature description**: Interface for users to log daily moods and maintain a text-based personal journal.
* **Priority level**: High

### 4.2.2 Stimulus/Response Sequences
* **User action**: User selects a mood and writes a journal entry, then clicks save.
* **System response**: System associates the entry with the user's account and saves it to the database with a timestamp.

### 4.2.3 Functional Requirements
#### REQ-3
* The system must allow users to create, read, update, and delete (CRUD) their personal mood logs and journal entries.

## 4.3 Goals & Habits Management

### 4.3.1 Description and Priority
* **Feature description**: Tools to set personal wellness goals and track the completion of daily habits.
* **Priority level**: Medium

### 4.3.2 Stimulus/Response Sequences
* **User action**: User creates a new habit to track.
* **System response**: System initializes the habit with a 0-day streak.
* **User action**: User marks a habit as completed for the day.
* **System response**: System increments the streak counter and updates visual progress.

### 4.3.3 Functional Requirements
#### REQ-4
* The system must accurately calculate and maintain daily streaks for habit completion.
#### REQ-5
* The system must provide visual representations (charts/graphs) of habit progress using the Recharts library.

## 4.4 AI Wellness Companion

### 4.4.1 Description and Priority
* **Feature description**: An integrated chat interface utilizing the Groq API to provide automated, supportive guidance.
* **Priority level**: Medium

### 4.4.2 Stimulus/Response Sequences
* **User action**: User types a message in the AI chat interface and sends it.
* **System response**: System transmits the message to the Groq API, receives the response, and renders it in the chat window.

### 4.4.3 Functional Requirements
#### REQ-6
* The system must successfully connect to and authenticate with the Groq API to process conversational queries and return appropriate wellness-focused responses.

## 4.5 Automated Reminders

### 4.5.1 Description and Priority
* **Feature description**: Server-side scheduled tasks to send daily email notifications.
* **Priority level**: Medium

### 4.5.2 Stimulus/Response Sequences
* **System action**: A predefined time is reached (cron job trigger).
* **System response**: System queries the database for users who have not logged activity that day and dispatches a reminder email via Nodemailer.

### 4.5.3 Functional Requirements
#### REQ-7
* The backend must utilize `node-cron` to execute scheduled background tasks.
#### REQ-8
* The system must integrate `Nodemailer` to format and send outbound email notifications successfully.

---

# 5. Other Nonfunctional Requirements

### 5.1 Performance Requirements
* **Response time**: API endpoints should respond within 500ms under normal load. AI response times are dependent on the external Groq API.
* **Scalability**: The modular Node.js backend and React frontend should allow for independent scaling.

### 5.2 Safety Requirements
* **Data protection**: User data must be securely stored, and the database should be regularly backed up to prevent data loss.

### 5.3 Security Requirements
* **Authentication & Authorization**: All user-specific routes and data must be protected and strictly require a valid JWT.
* **Encryption**: Passwords must be irreversibly hashed.
* **Privacy protection**: The system must enforce strict data isolation; users cannot access or view data belonging to other users.
* **Environment Variables**: Sensitive keys (JWT Secret, Database URI, API Keys) must be stored in `.env` files and excluded from version control.

### 5.4 Software Quality Attributes
* **Reliability**: The system should handle external API (Groq) timeouts or failures gracefully without crashing the main application.
* **Maintainability**: Code must be cleanly structured into separate frontend and backend directories, with modular React components and Express controllers.
* **Usability**: The interface must be intuitive, responsive on mobile devices, and leverage the Shadcn UI library for consistent design patterns.

### 5.5 Business Rules
* **User permissions**: Only the authenticated owner of the data is permitted to modify or delete it.

---

# 6. Other Requirements

* **Database requirements**: MongoDB schema validation must be implemented via Mongoose to ensure data integrity before saving documents.

---

# Appendix A: Glossary

* **API**: Application Programming Interface.
* **CRUD**: Create, Read, Update, Delete (Basic database operations).
* **JWT**: JSON Web Token, used for securely transmitting information between parties as a JSON object, primarily used for authentication.
* **MERN**: A software stack consisting of MongoDB, Express.js, React, and Node.js.
* **ODM**: Object Data Modeling (e.g., Mongoose), a programming technique for converting data between incompatible type systems.

# Appendix B: Analysis Models

* *To be completed during the design phase (e.g., Database Entity-Relationship diagrams, Component flowcharts).*

# Appendix C: To Be Determined (TBD) List

* Implementation details for password reset functionality via email.
* Potential integration with OAuth providers (Google, GitHub) for single sign-on.
* Native mobile application development strategy.

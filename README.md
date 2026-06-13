# CIVIX - Civic Issue Management Platform

CIVIX is a full-stack web platform that helps citizens report, track, and resolve civic issues with real-time updates.  
It makes it easier for people to raise concerns and for local authorities to respond quickly.

🔗 [Live App](https://civix-frontend-3.onrender.com/)

---

## 📖 Table of Contents
1. [What It Does](#-what-it-does)
2. [Tech Stack](#%EF%B8%8F-tech-stack)
3. [Features](#-features)
4. [Environment Setup](#-environment-setup)
5. [Getting Started](#-getting-started)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
6. [Project Structure](#-project-structure)

---

## 🔍 What it does
- **Citizen Empowerment:** Citizens can report local civic issues (like potholes, garbage, broken streetlights) with descriptive titles, descriptions, and photographic evidence.
- **Admin Management:** District-level admin officers receive filtered, localized dashboard feeds containing issues specific to their district code to coordinate and resolve them.
- **Real-Time Communication:** Direct WebSocket-based chat system (`Socket.IO`) allows citizens and district admins to communicate directly on active cases.
- **Cloud Media Uploads:** Automatically handles robust image compression and uploads profile pictures and issue reports straight to AWS S3 buckets.

---

## 🛠️ Tech Stack
- **Frontend:** React.js, React Router DOM, Socket.io-client, Axios, CSS Variables
- **Backend:** Node.js, Express.js, Socket.IO, Mongoose
- **Database:** MongoDB Atlas
- **Storage:** AWS S3 (via `@aws-sdk/client-s3` & `multer`)
- **Authentication:** Role-Based JSON Web Token (JWT)

---

## 🚀 Features
- **Secure Authentication:** JWT token-based login and registration (verifying government emails ending in `@gov.in` / `@nic.in` for admins).
- **Interactive Forms:** Multi-part issue submission supporting location coordinates, address, and live photo attachments.
- **Dynamic Dashboards:**
  - **Citizen:** View all reported issues, upvote active problems, comment on reports, and track personal submittals.
  - **District Admin:** Three-column workflow board (Unsolved, In Progress, Solved) with quick status transition triggers.
- **District Analytics:** Admin statistics panel calculating total reports, breakdown by progress status, and average resolution time.

---

## ⚙️ Environment Setup

Create configuration files in both the frontend and backend directories.

### Backend configuration (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_s3_bucket_name
```

### Frontend configuration (`frontend/.env`)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_BACKEND_URL=http://localhost:5000
```

---

## 🏁 Getting Started

### Backend Setup
1. Navigate into the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch development server:
   ```bash
   npm run dev
   ```
   *(Server starts listening on `http://localhost:5000`)*

### Frontend Setup
1. Navigate into the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run local dev server:
   ```bash
   npm start
   ```
   *(Dev server launches on `http://localhost:3000`)*

---

## 📂 Project Structure
```
CIVIX/
├── backend/
│   ├── config/          # Database & Cloud storage configs
│   ├── controllers/     # Business logic controllers
│   ├── middleware/      # Auth & Upload route guards
│   ├── models/          # MongoDB/Mongoose Schemas
│   ├── routes/          # API endpoints router
│   ├── utils/           # S3 uploading & token utilities
│   ├── app.js           # Server application initialization
│   └── server.js        # Main entrypoint (Express & WebSockets)
└── frontend/
    ├── public/          # Assets and HTML templates
    └── src/
        ├── components/  # Layout, auth, profile, and chat views
        ├── services/    # Centralized Axios API connections
        ├── App.js       # Main component routing definition
        └── index.js     # React entrypoint
```

---

## 📅 Built in
**May 2025**

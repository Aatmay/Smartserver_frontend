# SmartServe – Predictive Food Demand and Surplus Redistribution System

## Problem Statement
Institutional canteens over-prepare food due to poor demand estimation 
causing waste. SmartServe predicts food demand using ML and connects 
surplus food with NGOs.

## Tech Stack
- Frontend: React.js
- Backend: Node.js + Express.js
- Database: MongoDB Atlas
- ML Service: Python Flask + Random Forest
- Auth: JWT + bcrypt

## Live Links
- Backend API: https://smartserve-backend-i8ls.onrender.com
- ML API: https://smartserve-ml.onrender.com
- GitHub: https://github.com/Aatmay/MiniProject_SmartServe

## Setup Instructions

### Prerequisites
- Node.js v18+
- Python 3.13
- MongoDB Atlas account

### Backend Setup
cd smartserve-backend/smartserve-backend
npm install
create .env file with:
  MONGO_URI=your_mongodb_uri
  JWT_SECRET=your_secret
  SURPLUS_THRESHOLD=20
  ML_API_URL=http://localhost:8000
npx nodemon server.js

### ML Setup
cd smartserve-ml
pip install -r requirements.txt
python app.py

### Frontend Setup
cd smartserve-frontend
npm install
npm start

## Features
- JWT Authentication with role-based access (Admin/NGO)
- Food Log System with auto leftover calculation
- Random Forest ML predictions (94.3% R² accuracy, 5000 records)
- Surplus Alert System with 20% threshold
- Light/Dark theme toggle
- Cascade delete with data integrity

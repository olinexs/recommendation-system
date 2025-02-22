# Product Recommendation System

This is a Flask and React-based product recommendation system. It uses **collaborative filtering** and **content-based filtering** to recommend products to users.

## Features
- User registration and login
- Product recommendations based on user preferences
- Hybrid recommendation system (collaborative + content-based)

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Loading and Training Models](#loading-and-training-models)
3. [Saving Models as Pickle Files](#saving-models-as-pickle-files)
4. [Setting Up the MySQL Database](#setting-up-the-mysql-database)
5. [Running the Flask Backend](#running-the-flask-backend)
6. [Running the React Frontend](#running-the-react-frontend)
7. [Deployment](#deployment)
8. [Contributing](#contributing)
9. [License](#license)

---

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8+
- Node.js 16+
- MySQL Server
- Git

---

## Loading and Training Models

1. **Install Python Dependencies**:
   Navigate to the `backend` folder and install the required Python packages:

   ```bash
   cd backend
   pip install -r requirements.txt

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
follow all the steps in main.ipynb.

## Saving Models as Pickle Files
follow all the steps in main.ipynb.

## Setting Up the MySQL Database
1. Install MySQL
2. Create Database:
   
```bash
CREATE DATABASE recommendation_system;

3. Create Tables:
```bash
USE recommendation_system;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE products (
    asin VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255),
    brand VARCHAR(255),
    rating FLOAT,
    image_url VARCHAR(255)
);

CREATE TABLE ratings (
    user_id INT,
    product_id VARCHAR(255),
    rating FLOAT,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(asin)
);

4. **Update Database Credentials in backend/app.py**:
  ```bash
  app.config['MYSQL_HOST'] = 'localhost'
  app.config['MYSQL_USER'] = 'root'
  app.config['MYSQL_PASSWORD'] = 'your_password'
  app.config['MYSQL_DB'] = 'recommendation_system'

## Running the Flask Backend
in terminal, run this to open the directory:
```bash
cd backend
Run the Flask Server by:
```bash
python app.py

## Running the React Frontend
in different terminal/split the terminal to open different directory:
```bash
cd frontend
```bash
npm install
```bash
npm start

The frontend will start at http://localhost:3000. or click the link  in the terminal


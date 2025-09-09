# Workshop 9 - Product Management System

**Full-Stack Web Application using MongoDB, Express.js, and Angular**

**Student:** Vo Viet Tien Bui - s5325217
**Course:** 3813ICT - Software Frameworks  
**Trimester:** 2, 2025

---

## 📋 Workshop Tasks Completed

✅ **Task 1:** Setup - MongoDB driver installation  
✅ **Task 2:** Server-side MongoDB CRUD operations  
✅ **Task 3:** Express REST API with all required endpoints  
✅ **Task 4:** Angular frontend with three pages  

---

## 🏗️ System Architecture

```
Frontend (Angular)  ←→  Backend (Express)  ←→  Database (MongoDB)
   Port: 4200              Port: 3000           Port: 27017
```

---

## 📁 Project Structure

```
3813ICT_week9/
├── App/                    # Task 2 - MongoDB CRUD Operations
│   ├── app.js             # Database connection utilities
│   ├── create.js          # Database initialization
│   ├── add.js             # Add products (+ API functions)
│   ├── read.js            # Read products (+ API functions)
│   ├── update.js          # Update products (+ API functions)
│   └── remove.js          # Delete products (+ API functions)
├── server/                 # Task 3 - Express REST API
│   ├── server.js          # Main Express server
│   └── package.json       # Server dependencies
├── frontend/               # Task 4 - Angular Frontend
│   ├── src/app/components/ # UI Components (Products, Add, Update)
│   ├── src/app/services/   # HTTP API services
│   ├── src/app/models/     # TypeScript interfaces
│   └── package.json       # Frontend dependencies
├── package.json           # Root MongoDB dependencies
├── PROJECT_GUIDE.md       # Comprehensive technical documentation
└── README.md              # This file - Setup instructions
```

---

## 🚀 Quick Start Guide

### Prerequisites

Before running the application, ensure you have:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** installed and running on port 27017
3. **Angular CLI** - Install with: `npm install -g @angular/cli`

### Step 1: Install Dependencies

```bash
# Navigate to project root
cd 3813ICT_week9

# Install root MongoDB dependencies
npm install

# Install Express server dependencies
cd server
npm install

# Install Angular frontend dependencies
cd ../frontend
npm install

# Return to project root
cd ..
```

### Step 2: Setup Database

```bash
# Initialize the database and collection
node App/create.js

# Add sample products (4 products will be created)
node App/add.js
```

### Step 3: Start the Application

**You need 2 terminals running simultaneously:**

#### Terminal 1 - Start Express API Server

```bash
cd server
nodemon server.js
```

#### Terminal 2 - Start Angular Frontend

```bash
cd frontend
ng serve
```

### Step 4: Access the Application

Open your web browser and navigate to:
**<http://localhost:4200>**

---

## 🧪 Testing the Application

### Task 2 - Test Database Operations

```bash
# Test each CRUD operation individually
node App/add.js      # Adds 4 sample products
node App/read.js     # Displays all products in console
node App/update.js   # Updates product ID 1
node App/remove.js   # Removes product ID 4
```

### Task 3 - Test API Endpoints

With the Express server running (`node server.js`), test the API:

```bash
# Test GET - List all products
curl http://localhost:3000/products

# Test API root endpoint
curl http://localhost:3000/
```

**Alternative:** Use a tool like **Postman** to test the API endpoints.

### Task 4 - Test Frontend Features

With the Angular app running (`ng serve`), test these features:

1. **View Products**: Navigate to the main page
2. **Add Product**: Click "Add New Product" and fill the form
3. **Edit Product**: Click "Edit" on any product card
4. **Delete Product**: Click "Delete" on any product (with confirmation)
5. **Refresh**: Click the refresh button to reload data

---

## 📊 Database Schema

**Database:** `mydb`  
**Collection:** `products`

**Product Structure:**

```json
{
  "_id": "MongoDB ObjectID",
  "id": 1,
  "name": "Product Name (max 50 chars)",
  "description": "Product description (max 255 chars)",
  "price": 99.99,
  "units": 10
}
```

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| POST | `/products` | Add new product (with duplicate ID check) |
| PUT | `/products/:id` | Update product by MongoDB ObjectID |
| DELETE | `/products/:id` | Delete product by MongoDB ObjectID |

**All endpoints return JSON responses with success/error status.**

---

## 📚 Technologies Used

- **Backend:** Node.js, Express.js, MongoDB Driver
- **Frontend:** Angular 17, TypeScript, RxJS
- **Database:** MongoDB
- **Development:** Angular CLI, npm

---

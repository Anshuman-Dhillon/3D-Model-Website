# 3D Model Marketplace

A full-stack web application for buying, selling, and managing 3D models. The project features a React-based frontend and an Express.js backend, providing a seamless user experience for model creators and buyers.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Frontend Implementation](#frontend-implementation)
- [Backend Implementation](#backend-implementation)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)

---

## Overview

The 3D Model Marketplace is designed to allow users to browse, upload, purchase, and manage 3D models. It includes features such as user authentication, model management, cart functionality, and transaction history. The application is built using modern web technologies, including **React**, **Vite**, and **Express.js**, with **MongoDB** as the database.

---

## Features

### Frontend

- **Interactive UI**: Built with React and styled using CSS for a responsive and visually appealing interface.
- **Model Browsing**: Users can browse models with filters for categories and price ranges.
- **User Authentication**: Login and signup pages with support for Google and Facebook authentication.
- **Cart Management**: Add, remove, and view items in the shopping cart.
- **Profile Management**: Update personal information and manage uploaded models.
- **Transaction History**: View past purchases with detailed information.

### Backend

- **RESTful API**: Provides endpoints for user authentication, model management, and transactions.
- **Database Integration**: MongoDB is used to store user data, models, and transactions.
- **Authentication**: Secure login and signup using `bcrypt` for password hashing and `JWT` for token-based authentication.
- **Error Handling**: Middleware for handling errors and 404 responses.
- **Rate Limiting**: Prevents abuse of API endpoints using `express-rate-limit`.

---

## Frontend Implementation

### Architecture

The frontend is built using **React** and **Vite**, leveraging **React Router** for navigation and **Bootstrap** for styling. It follows a component-based architecture, ensuring modularity and reusability.

### Core Components

- **NavBar**: Navigation links to Home, Marketplace, Cart, and Profile.
- **ItemGrid**: Displays a grid of 3D models with options to add to cart or view details.
- **ModelItem**: Represents individual models with actions like "Add to Cart" and "Edit."
- **SearchBar**: Filters models by category and price range.
- **ProfilePage**: Enables users to update their personal information and upload profile pictures.
- **Cart**: Displays cart items and calculates total cost.
- **TransactionsGrid**: Shows transaction history grouped by date.

### Features

- **Dynamic Routing**: React Router is used for routes like Home, Catalog, Login, and Profile.
- **State Management**: React's `useState` and `useEffect` hooks manage component state.
- **Styling**: Custom CSS provides a consistent look and feel.

---

## Backend Implementation

### Architecture

The backend is built using **Express.js**, with a modular structure:

- **Routes**: API endpoints for models, users, and transactions.
- **Controllers**: Business logic for handling requests and interacting with the database.
- **Models**: MongoDB schemas for users, models, and transactions.
- **Middleware**: Includes authentication, error handling, and rate limiting.

### Features

- **User Authentication**: Secure login and signup using `bcrypt` and `JWT`.
- **Model Management**: CRUD operations for 3D models.
- **Cart Functionality**: Add/remove items from cart.
- **Transaction Management**: Records purchases and provides history APIs.
- **Database Integration**: MongoDB stores all core data.

---

## Project Structure

```text
3D-Model-Marketplace/
├── client/                   # Frontend (React + Vite)
│   ├── public/               # Public assets
│   ├── src/                  # Source files
│   │   ├── components/       # Reusable React components (NavBar, SearchBar, etc.)
│   │   ├── pages/            # Page-level components (Home, Login, Profile, etc.)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
│
├── server/                   # Backend (Express.js)
│   ├── controllers/          # Business logic (auth, model, transaction controllers)
│   ├── middleware/           # Authentication, error handlers, rate limiters
│   ├── models/               # Mongoose schemas for MongoDB
│   ├── routes/               # API routes
│   ├── utils/                # Utility functions (e.g. validators, formatters)
│   ├── config/               # Environment and database config
│   ├── server.js             # Main server entry point
│   └── .env
│
├── package.json
├── README.md
└── .gitignore

## Future Enhancements

- **Advanced Search**: Add filters for model formats, tags, and categories.
- **Payment Integration**: Implement PayPal, Stripe, and Google Pay.
- **Notifications**: Add real-time notifications using WebSockets.
- **Model Preview**: Use Three.js or WebGL for real-time 3D previews.
- **Admin Panel**: Provide an admin dashboard for user and model moderation.

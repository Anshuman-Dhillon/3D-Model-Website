import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './component design/Main.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import Login from './pages/Login.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SignUp from './pages/SignUp.jsx'
import NotFound from './pages/NotFound.jsx'
import Cart from './pages/Cart.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Settings from './pages/Settings.jsx'
import TransactionsPage from './pages/TransactionsPage.jsx'
import SupportPage from './pages/SupportPage.jsx'
import NotificationSettings from "./pages/NotificationSettings.jsx"
import ModelPage from './pages/ModelPage.jsx'

// Define the router
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App layout wraps all pages
    children: [
      { index: true, element: <Home /> }, // renders home page
      { path: 'home', element: <Home /> }, //can use http://localhost:5173/home
      { path: 'catalog', element: <Catalog /> }, //can use http://localhost:5173/catalog
      { path: 'login', element: <Login /> }, //can use http://localhost:5173/login
      { path: 'profile', element: <ProfilePage /> }, //can use http://localhost:5173/profile
      { path: 'signup', element: <SignUp /> },
      { path: '*', element: <NotFound /> },
      { path: 'cart', element: <Cart /> },
      { path: 'settings', element: <Settings /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'support', element: <SupportPage /> },
      { path: 'settings/notifications', element: <NotificationSettings /> },
      { path: 'modelview', element: <ModelPage /> }
    ],
  },
]);

// Render the router
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
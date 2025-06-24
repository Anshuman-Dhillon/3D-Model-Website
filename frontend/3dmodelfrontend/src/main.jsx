import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './component design/Main.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import Login from './pages/Login.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SignUp from './pages/SignUp.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom"

// Define the router
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App layout wraps all pages
    children: [
      { index: true, element: <Home /> },
      { path: 'home', element: <Home /> },
      { path: 'catalog', element: <Catalog /> },
      { path: 'login', element: <Login /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'signup', element: <SignUp /> },
    ],
  },
]);

// Render the router
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
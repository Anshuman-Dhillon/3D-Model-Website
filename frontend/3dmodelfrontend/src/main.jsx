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
import EditModelsPage from './pages/EditModelsPage.jsx'
import ManageModelPage from './pages/ManageModelPage.jsx'
import MessagesPage from './pages/MessagesPage.jsx'
import UsersPage from './pages/UsersPage.jsx'
import UserProfilePage from './pages/UserProfilePage.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// Define the router
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'home', element: <Home /> },
      { path: 'catalog', element: <Catalog /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'support', element: <SupportPage /> },
      { path: 'modelview/:id', element: <ModelPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'user/:id', element: <UserProfilePage /> },
      { path: '*', element: <NotFound /> },
      // Protected routes
      { path: 'profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
      { path: 'cart', element: <ProtectedRoute><Cart /></ProtectedRoute> },
      { path: 'settings', element: <ProtectedRoute><Settings /></ProtectedRoute> },
      { path: 'transactions', element: <ProtectedRoute><TransactionsPage /></ProtectedRoute> },
      { path: 'settings/notifications', element: <ProtectedRoute><NotificationSettings /></ProtectedRoute> },
      { path: 'mymodels', element: <ProtectedRoute><EditModelsPage /></ProtectedRoute> },
      { path: 'managemodel', element: <ProtectedRoute><ManageModelPage /></ProtectedRoute> },
      { path: 'managemodel/:id', element: <ProtectedRoute><ManageModelPage /></ProtectedRoute> },
      { path: 'messages', element: <ProtectedRoute><MessagesPage /></ProtectedRoute> },
    ],
  },
]);

// Render the router
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
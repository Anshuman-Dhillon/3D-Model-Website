import React, { createContext, useContext, useState, useEffect } from "react";
import { apiLogin, apiSignup, apiLogout, apiGetProfile, apiRefresh, apiGoogleAuth } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to restore session from refresh token cookie
  useEffect(() => {
    async function restore() {
      try {
        const ok = await apiRefresh();
        if (ok) {
          const profile = await apiGetProfile();
          if (profile) setUser(profile);
        }
      } catch {
        // No valid session
      }
      setLoading(false);
    }
    restore();
  }, []);

  async function login(usernameOrEmail, password) {
    const result = await apiLogin(usernameOrEmail, password);
    if (result.ok) {
      setUser(result.data.user);
    }
    return result;
  }

  async function signup(email, username, password, confirmPassword) {
    const result = await apiSignup(email, username, password, confirmPassword);
    if (result.ok) {
      setUser(result.data.user);
    }
    return result;
  }

  async function logout() {
    await apiLogout();
    setUser(null);
  }

  async function googleLogin(credential) {
    const result = await apiGoogleAuth(credential);
    if (result.ok) {
      setUser(result.data.user);
    }
    return result;
  }

  async function refreshProfile() {
    const profile = await apiGetProfile();
    if (profile) setUser(profile);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, googleLogin, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

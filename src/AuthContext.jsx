import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("reviews");

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsed = JSON.parse(storedUserData);
      setUserData(parsed);
      setUsername(parsed.username);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [userData]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
      username,
      setUsername,
      userData,
      setUserData,
      activeTab,
      setActiveTab
    }}>
      {children}
    </AuthContext.Provider>
  );
};

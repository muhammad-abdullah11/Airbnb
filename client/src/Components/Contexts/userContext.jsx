import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // track auth check

  useEffect(() => {
    const token = localStorage.getItem("token"); // moved inside useEffect

    const fetchProfile = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return; // no redirect here, let pages handle it
      }

      try {
        const res = await axios.get("/api/v1/users/get-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          setUser(res.data.user);
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Prevent rendering children until auth check is complete
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

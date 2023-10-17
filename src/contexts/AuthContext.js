import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";

import { login, logout, signup } from "../utils/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false);
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const value = { user, login, logout, signup };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

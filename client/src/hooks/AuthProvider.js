import { useContext, createContext, useEffect, useState } from "react";
const AuthContext = createContext();
const [user, setUser] = useState(null);

export const AuthProvider = ({ children }) => {
  useEffect(() => {
    const some = localStorage.getItem("token");
    const user = some.token;
    if (some) {
      setUser(user);
    }
  }, []);
  return <AuthContext.Provider>{children}</AuthContext.Provider>;
};

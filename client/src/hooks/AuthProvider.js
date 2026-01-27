import { useContext, createContext, useEffect, useState } from "react";
const AuthContext = createContext();
//
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const some = localStorage.getItem("user");
    try {
      const user = some.token;
      console.log(user);
      if (some) {
        setUser(user);
      }
    } catch (error) {
      setUser(null);
    }
  }, []);
  const login = (userData) => {
    console.log("at least it reached here ", userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
  return (
    <AuthContext.Provider value={{ setUser, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);

import React from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/AuthProvider";
export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  console.log(user?.role);
  const navigate = useNavigate();
  if (!user) return <Navigate to="/login" replace />;
  //   if (user.role == "student") return <Navigate to="/student" replace />;
  return children;
}

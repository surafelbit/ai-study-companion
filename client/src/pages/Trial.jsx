import React from "react";
import { useAuth } from "../hooks/AuthProvider";
export default function Trial() {
  const { logout } = useAuth();
  function something() {
    logout();
  }
  const { user } = useAuth();
  console.log(user);
  console.log(JSON.parse(localStorage.getItem("user")));
  return (
    <div>
      drops of jupiter
      <button onClick={something}>disappear</button>
    </div>
  );
}

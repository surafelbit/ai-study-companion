import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigator = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState(false);
  async function submitHandler(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      console.log(response.data);
      localStorage.setItem("user", response.data);
      navigator("/fanum");
      setError(false);

      console.log(response);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  }
  return (
    <div>
      <form onSubmit={submitHandler}>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        ></input>
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        ></input>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

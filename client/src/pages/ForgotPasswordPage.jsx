import React from "react";
import axios from "axios";
import { useState } from "react";
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState();
  async function submitter(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgotpassword",
        { email }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <h1>forgot password</h1>
      <form onSubmit={submitter}>
        <h1>input email</h1>
        <label>email</label>
        <input
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        ></input>
        <button type="submit">submit</button>
      </form>
    </div>
  );
}

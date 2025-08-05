import axios from "axios";
import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
export default function ResetPasswordPage() {
  const { id } = useParams();
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  async function submitter(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/resetpassword/${id}`,
        {
          password,
          passwordConfirm,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <form onSubmit={submitter}>
        <label>password</label>
        <input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
        <label>password confirm</label>
        <input
          type="password"
          onChange={(e) => {
            setPasswordConfirm(e.target.value);
          }}
        ></input>
        <button type="submit">submit</button>
      </form>
    </div>
  );
}

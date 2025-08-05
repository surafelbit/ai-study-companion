import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
export default function VerifyEmail() {
  const [token, setToken] = useState();
  useEffect(() => {
    setToken;
  }, []);
  const { id } = useParams();
  console.log(id);
  async function verifier() {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/verifyemail/${id}`
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <button onClick={verifier}>verifier</button>
    </div>
  );
}

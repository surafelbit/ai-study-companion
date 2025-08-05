import React, { use, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const navigator = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [error, setError] = useState(false);
  async function submitHandler(e) {
    try {
      e.preventDefault();
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          email,
          password,
          passwordConfirm,
          phoneNumber,
          firstName,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <form onSubmit={submitHandler}>
      <label>firstName</label>
      <input
        type="text"
        onChange={(e) => {
          setFirstName(e.target.value);
        }}
      ></input>
      <label>lastName</label>
      <input
        onChange={(e) => {
          setLastName(e.target.value);
        }}
      ></input>
      <label>password</label>
      <input
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      ></input>
      <label>password confirm</label>
      <input
        onChange={(e) => {
          setPasswordConfirm(e.target.value);
        }}
      ></input>
      <label>email</label>
      <input
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      ></input>
      <label>phone number</label>
      <input
        onChange={(e) => {
          setPhoneNumber(e.target.value);
        }}
      ></input>
      <button type="submit">submitter</button>
    </form>
  );
}

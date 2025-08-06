// import React, { use, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// export default function Register() {
//   const navigator = useNavigate();
//   const [email, setEmail] = useState();
//   const [password, setPassword] = useState();
//   const [firstName, setFirstName] = useState();
//   const [lastName, setLastName] = useState();
//   const [passwordConfirm, setPasswordConfirm] = useState();
//   const [phoneNumber, setPhoneNumber] = useState();
//   const [error, setError] = useState(false);
//   async function submitHandler(e) {
//     try {
//       e.preventDefault();
//       const response = await axios.post(
//         "http://localhost:5000/api/auth/register",
//         {
//           email,
//           password,
//           passwordConfirm,
//           phoneNumber,
//           firstName,
//         }
//       );
//       console.log(response);
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   return (
//     <form onSubmit={submitHandler}>
//       <label>firstName</label>
//       <input
//         type="text"
//         onChange={(e) => {
//           setFirstName(e.target.value);
//         }}
//       ></input>
//       <label>lastName</label>
//       <input
//         onChange={(e) => {
//           setLastName(e.target.value);
//         }}
//       ></input>
//       <label>password</label>
//       <input
//         onChange={(e) => {
//           setPassword(e.target.value);
//         }}
//       ></input>
//       <label>password confirm</label>
//       <input
//         onChange={(e) => {
//           setPasswordConfirm(e.target.value);
//         }}
//       ></input>
//       <label>email</label>
//       <input
//         onChange={(e) => {
//           setEmail(e.target.value);
//         }}
//       ></input>
//       <label>phone number</label>
//       <input
//         onChange={(e) => {
//           setPhoneNumber(e.target.value);
//         }}
//       ></input>
//       <button type="submit">submitter</button>
//     </form>
//   );
// }
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useModal } from "../hooks/ModalProvider";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Register() {
  const navigator = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [error, setError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const { showModal, isOpen, setIsOpen } = useModal();

  const [resend, setResend] = useState(false);
  const resender = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/resend-verification",
        {
          email,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const resendVerification = async () => {
    try {
      console.log(email);
      const response = await axios.post(
        "http://localhost:5000/api/auth/resend-verification",
        {
          email: email,
        }
      );
      toast.success("verification code resent");

      console.log("Verification email resent:", response.data);
      // Optionally show a toast or alert here
    } catch (error) {
      console.error("Resend failed:", error.response?.data);
    }
  };

  // inside the component
  useEffect(() => {
    if (resend && isOpen) {
      showModal(
        <div>
          <p>resender div</p>
          <button
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
            onClick={resendVerification}
          >
            resend
          </button>
        </div>
      );
    }
    // resendVerification();
  }, [resend, isOpen]);

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
      const data = error.response?.data;

      if (data?.canResend) {
        // resendVerification();
        // ✅ This means user exists but is not verified
        setResend(true);
        setIsOpen(true);
      }
      console.log(error);
      console.log(error?.response?.data?.canResend);
    }
  }

  if (email && password && passwordConfirm && firstName) {
    // setIsDisabled(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      {/* {resend &&
        isOpen &&
        showModal(
          <div>
            resender div
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
              onClick={resender}
            >
              resend
            </button>
          </div>
        )} */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">
                  StudyAI
                </span>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Back to Home
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Register Form */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-gray-600">
              Join StudyAI and start learning smarter
            </p>
          </div>

          {/* Register Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
            <form onSubmit={submitHandler} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    First name
                  </label>
                  <input
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Last name
                  </label>
                  <input
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email address
                </label>
                <div className="relative">
                  <input
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                    placeholder="john@example.com"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Phone Number Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone number{" "}
                  <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                    }}
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                    placeholder="+1 (555) 123-4567"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                      placeholder="Create a strong password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      onChange={(e) => {
                        setPasswordConfirm(e.target.value);
                      }}
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                      placeholder="Confirm your password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  // onChange={(e)=>{set}}
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={!(email && password && passwordConfirm && firstName)}
                className={`${
                  email && password && passwordConfirm && firstName
                    ? "w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    : "w-full bg-gray-400 cursor-not-allowed text-white py-3 px-4 rounded-lg text-lg font-semibold transition-all transform "
                }`}
              >
                Create account
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="ml-2">Facebook</span>
              </button>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 bg-green-100 rounded-full p-2 shadow-lg animate-bounce hidden lg:block">
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="absolute bottom-20 right-10 bg-purple-100 rounded-full p-2 shadow-lg animate-pulse hidden lg:block">
            <svg
              className="w-4 h-4 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">
                StudyAI
              </span>
            </div>

            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

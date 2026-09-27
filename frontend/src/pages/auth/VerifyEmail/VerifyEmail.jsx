import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  CheckCircle,
  XCircle,
  MailCheck,
} from "lucide-react";

import authService from "../../../services/auth/authService";

import "./VerifyEmail.css";

const VerifyEmail = () => {
  const [searchParams] =
    useSearchParams();

  const token =
    searchParams.get("token");

  // ======================================
  // Prevent duplicate request
  // while safely reusing the same promise
  // during React StrictMode development.
  // ======================================

  const verificationPromiseRef =
    useRef(null);

  // ======================================
  // State
  // ======================================

  const [status, setStatus] =
    useState(
      token
        ? "verifying"
        : "error"
    );

  const [message, setMessage] =
    useState(
      token
        ? ""
        : "This email verification link is invalid."
    );

  // ======================================
  // Verify Email
  // ======================================

  useEffect(() => {
    if (!token) {
      return;
    }

    // ====================================
    // Reuse the same request if React
    // StrictMode runs the effect again.
    // ====================================

    if (!verificationPromiseRef.current) {
      verificationPromiseRef.current =
        authService.verifyEmail(token);
    }

    verificationPromiseRef.current
      .then((response) => {
        setStatus("success");

        setMessage(
          response?.message ||
            "Your email has been verified successfully."
        );
      })
      .catch((error) => {
        console.error(
          "Email verification failed:",
          error
        );

        const statusCode =
          error?.response?.status;

        const backendMessage =
          error?.response?.data?.message;

        if (statusCode === 400) {
          setMessage(
            backendMessage ||
              "This verification link is invalid or has expired."
          );
        } else if (statusCode === 403) {
          setMessage(
            backendMessage ||
              "This account is currently unavailable."
          );
        } else if (statusCode === 404) {
          setMessage(
            backendMessage ||
              "The account associated with this verification link could not be found."
          );
        } else if (
          error?.code === "ECONNABORTED"
        ) {
          setMessage(
            "The verification request timed out. Please check that the Lumora server is running and try again."
          );
        } else {
          setMessage(
            backendMessage ||
              "We could not verify your email right now. Please try again."
          );
        }

        setStatus("error");
      });
  }, [token]);

  // ======================================
  // VERIFYING
  // ======================================

  if (
    status === "verifying"
  ) {
    return (
      <div className="verify-email-page">
        <div className="verify-email-card">

          <div className="verify-email-icon loading">
            <div className="verify-spinner" />
          </div>

          <h1>
            Verifying Your Email
          </h1>

          <p>
            Please wait while we verify
            your email address.
          </p>

        </div>
      </div>
    );
  }

  // ======================================
  // SUCCESS
  // ======================================

  if (
    status === "success"
  ) {
    return (
      <div className="verify-email-page">
        <div className="verify-email-card">

          <div className="verify-email-icon success">
            <CheckCircle
              size={64}
              strokeWidth={1.8}
            />
          </div>

          <div className="verify-email-brand">
            <MailCheck size={22} />

            <span>
              Lumora
            </span>
          </div>

          <h1>
            Email Verified!
          </h1>

          <p>
            {message}
          </p>

          <p className="verify-email-subtext">
            Your Lumora account is now
            verified. You can continue to
            login and start reading,
            writing and inspiring.
          </p>

          <Link
            to="/login"
            className="verify-email-button"
          >
            Continue to Login
          </Link>

        </div>
      </div>
    );
  }

  // ======================================
  // ERROR
  // ======================================

  return (
    <div className="verify-email-page">
      <div className="verify-email-card">

        <div className="verify-email-icon error">
          <XCircle
            size={64}
            strokeWidth={1.8}
          />
        </div>

        <div className="verify-email-brand">
          <MailCheck size={22} />

          <span>
            Lumora
          </span>
        </div>

        <h1>
          Verification Failed
        </h1>

        <p>
          {message}
        </p>

        <p className="verify-email-subtext">
          The verification link may have
          expired or already been used.
          Please request a new verification
          email.
        </p>

        <div className="verify-email-actions">

          <Link
            to="/login"
            className="verify-email-button"
          >
            Go to Login
          </Link>

          <Link
            to="/register"
            className="verify-email-secondary-button"
          >
            Create Account
          </Link>

        </div>

      </div>
    </div>
  );
};

export default VerifyEmail;
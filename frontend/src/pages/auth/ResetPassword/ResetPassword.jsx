import { useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import authService from "../../../services/auth/authService";

import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  /*
   * If there is no token, immediately show
   * invalid-link error without using useEffect.
   */
  const [error, setError] = useState(
    token
      ? ""
      : "This password reset link is invalid or incomplete."
  );

  const [fieldError, setFieldError] = useState("");

  /*
   * Password strength.
   */
  const passwordStrength = useMemo(() => {
    if (!password) {
      return {
        label: "",
        score: 0,
      };
    }

    let score = 0;

    if (password.length >= 8) {
      score++;
    }

    if (/[A-Z]/.test(password)) {
      score++;
    }

    if (/[a-z]/.test(password)) {
      score++;
    }

    if (/[0-9]/.test(password)) {
      score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
    }

    if (score <= 2) {
      return {
        label: "Weak",
        score,
      };
    }

    if (score <= 4) {
      return {
        label: "Medium",
        score,
      };
    }

    return {
      label: "Strong",
      score,
    };
  }, [password]);

  /*
   * Validate reset form.
   */
  const validateForm = () => {
    if (!token) {
      setError(
        "This password reset link is invalid or incomplete."
      );

      return false;
    }

    if (!password) {
      setFieldError(
        "Please enter a new password."
      );

      return false;
    }

    if (password.length < 8) {
      setFieldError(
        "Password must contain at least 8 characters."
      );

      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setFieldError(
        "Password must contain at least one uppercase letter."
      );

      return false;
    }

    if (!/[a-z]/.test(password)) {
      setFieldError(
        "Password must contain at least one lowercase letter."
      );

      return false;
    }

    if (!/[0-9]/.test(password)) {
      setFieldError(
        "Password must contain at least one number."
      );

      return false;
    }

    if (!confirmPassword) {
      setFieldError(
        "Please confirm your new password."
      );

      return false;
    }

    if (password !== confirmPassword) {
      setFieldError(
        "Passwords do not match."
      );

      return false;
    }

    return true;
  };

  /*
   * Submit reset password request.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setFieldError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      await authService.resetPassword({
        token,
        newPassword: password,
      });

      setSuccess(true);
    } catch (err) {
      console.error(
        "RESET PASSWORD ERROR:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to reset your password. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Successful password reset screen.
   */
  if (success) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-background">
          <div className="reset-password-orb reset-orb-one" />
          <div className="reset-password-orb reset-orb-two" />
        </div>

        <main className="reset-password-container">
          <section className="reset-password-card success-card">

            {/* Brand */}
            <div className="reset-brand">
              <Link
                to="/"
                className="reset-brand-link"
              >
                Lumora
              </Link>

              <span className="reset-brand-tagline">
                Read • Write • Inspire
              </span>
            </div>

            {/* Success icon */}
            <div className="success-icon-wrapper">
              <CheckCircle2
                size={46}
                strokeWidth={1.8}
              />
            </div>

            <h1>
              Password reset successful
            </h1>

            <p className="reset-description">
              Your Lumora password has been
              successfully updated. You can now
              sign in with your new password.
            </p>

            <button
              type="button"
              className="reset-primary-button"
              onClick={() => navigate("/login")}
            >
              Continue to Login
            </button>

            <Link
              to="/"
              className="reset-back-home"
            >
              <ArrowLeft size={17} />
              Back to Lumora
            </Link>
          </section>
        </main>
      </div>
    );
  }

  /*
   * Main reset password page.
   */
  return (
    <div className="reset-password-page">

      {/* Background */}
      <div className="reset-password-background">
        <div className="reset-password-orb reset-orb-one" />
        <div className="reset-password-orb reset-orb-two" />
      </div>

      <main className="reset-password-container">
        <section className="reset-password-card">

          {/* Brand */}
          <div className="reset-brand">
            <Link
              to="/"
              className="reset-brand-link"
            >
              Lumora
            </Link>

            <span className="reset-brand-tagline">
              Read • Write • Inspire
            </span>
          </div>

          {/* Header */}
          <div className="reset-header">

            <div className="reset-lock-icon">
              <LockKeyhole
                size={25}
                strokeWidth={2}
              />
            </div>

            <h1>
              Reset your password
            </h1>

            <p>
              Create a new password for your
              Lumora account.
            </p>
          </div>

          {/* Invalid token */}
          {!token && (
            <div className="reset-alert reset-alert-error">
              <AlertCircle size={18} />

              <div>
                <strong>
                  Invalid reset link
                </strong>

                <span>
                  Please request a new password
                  reset link.
                </span>
              </div>
            </div>
          )}

          {/* Backend/general error */}
          {error && token && (
            <div className="reset-alert reset-alert-error">
              <AlertCircle size={18} />

              <div>
                <strong>
                  Password reset failed
                </strong>

                <span>
                  {error}
                </span>
              </div>
            </div>
          )}

          {/* Form */}
          {token && (
            <form
              className="reset-form"
              onSubmit={handleSubmit}
              noValidate
            >

              {/* New password */}
              <div className="reset-field">

                <label htmlFor="new-password">
                  New password
                </label>

                <div className="reset-input-wrapper">

                  <LockKeyhole
                    className="reset-input-icon"
                    size={18}
                  />

                  <input
                    id="new-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) => {
                      setPassword(
                        event.target.value
                      );

                      setFieldError("");
                      setError("");
                    }}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {/* Password strength */}
                {password && (
                  <div className="password-strength">

                    <div className="strength-bars">
                      {[1, 2, 3, 4, 5].map(
                        (bar) => (
                          <span
                            key={bar}
                            className={
                              bar <=
                              passwordStrength.score
                                ? "strength-bar active"
                                : "strength-bar"
                            }
                          />
                        )
                      )}
                    </div>

                    <span
                      className={`strength-label strength-${passwordStrength.label.toLowerCase()}`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                )}

                <p className="password-hint">
                  Use at least 8 characters with
                  uppercase, lowercase and a number.
                </p>
              </div>

              {/* Confirm password */}
              <div className="reset-field">

                <label htmlFor="confirm-password">
                  Confirm new password
                </label>

                <div className="reset-input-wrapper">

                  <LockKeyhole
                    className="reset-input-icon"
                    size={18}
                  />

                  <input
                    id="confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(
                        event.target.value
                      );

                      setFieldError("");
                      setError("");
                    }}
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Field validation error */}
              {fieldError && (
                <div className="reset-field-error">
                  <AlertCircle size={16} />

                  <span>
                    {fieldError}
                  </span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="reset-primary-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="reset-spinner"
                    />

                    Updating password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="reset-footer">
            <Link
              to="/login"
              className="reset-login-link"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
};

export default ResetPassword;
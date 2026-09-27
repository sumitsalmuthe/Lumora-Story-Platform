import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  BookOpen,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Mail,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { useState } from "react";

import lumoraLogo from "../../../assets/logo/lumora-logo-bold.svg";

import useAuth from "../../../context/AuthContext/useAuth";

import GoogleSignInButton from "../../../components/auth/GoogleSignUpButton/GoogleSignInButton.jsx";

import FacebookLoginButton from "../../../components/auth/FacebookLoginButton/FacebookLoginButton.jsx";

import "./Login.css";


function Login() {
  const {
    login,
    googleLogin,
    facebookLogin,
    forgotPassword,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();


  // ======================================
  // Login State
  // ======================================

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);


  // ======================================
  // Forgot Password State
  // ======================================

  const [
    showForgotPassword,
    setShowForgotPassword,
  ] = useState(false);

  const [
    forgotEmail,
    setForgotEmail,
  ] = useState("");

  const [
    forgotError,
    setForgotError,
  ] = useState("");

  const [
    forgotSuccess,
    setForgotSuccess,
  ] = useState(false);

  const [
    isForgotSubmitting,
    setIsForgotSubmitting,
  ] = useState(false);


  // ======================================
  // Login Form
  // ======================================

  const [
    formData,
    setFormData,
  ] = useState({
    email: "",
    password: "",
    remember: false,
  });


  // ======================================
  // Get Destination
  // ======================================

  const getDestination = () => {
    return (
      location.state?.from?.pathname || "/"
    );
  };


  // ======================================
  // Google Login
  // ======================================

  const handleGoogleLogin = async (
    response
  ) => {
    setError("");

    if (!response?.credential) {
      setError(
        "Google authentication failed. Please try again."
      );

      return;
    }

    try {
      setIsSubmitting(true);

      await googleLogin({
        credential: response.credential,
        rememberMe: formData.remember,
      });

      navigate(
        getDestination(),
        {
          replace: true,
        }
      );
    } catch (requestError) {
      setError(
        requestError
          ?.response
          ?.data
          ?.message ||
          requestError
            ?.message ||
          "Unable to continue with Google. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  // ======================================
  // Facebook Login
  // ======================================

  const handleFacebookLogin = async (
    accessToken
  ) => {
    setError("");

    if (!accessToken) {
      setError(
        "Facebook authentication failed. Please try again."
      );

      return;
    }

    try {
      setIsSubmitting(true);

      await facebookLogin({
        accessToken,
        rememberMe: formData.remember,
      });

      navigate(
        getDestination(),
        {
          replace: true,
        }
      );
    } catch (requestError) {
      setError(
        requestError
          ?.response
          ?.data
          ?.message ||
          requestError
            ?.message ||
          "Unable to continue with Facebook. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  // ======================================
  // Handle Social Login Error
  // ======================================

  const handleSocialLoginError = (
    socialError
  ) => {
    if (isSubmitting) {
      return;
    }

    setError(
      socialError
        ?.response
        ?.data
        ?.message ||
        socialError
          ?.message ||
        "Authentication failed. Please try again."
    );
  };


  // ======================================
  // Handle Login Input
  // ======================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData(
      (current) => ({
        ...current,

        [name]:
          type === "checkbox"
            ? checked
            : value,
      })
    );

    if (error) {
      setError("");
    }
  };


  // ======================================
  // Login Submit
  // ======================================

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");

      setIsSubmitting(true);

      try {
        await login({
          email:
            formData.email,
          password:
            formData.password,
          rememberMe:
            formData.remember,
        });

        navigate(
          getDestination(),
          {
            replace: true,
          }
        );
      } catch (
        requestError
      ) {
        setError(
          requestError
            ?.response
            ?.data
            ?.message ||
            requestError
              ?.message ||
            "Unable to log in. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    };


  // ======================================
  // Open Forgot Password
  // ======================================

  const handleOpenForgotPassword =
    () => {
      setForgotEmail(
        formData.email || ""
      );

      setForgotError("");

      setForgotSuccess(false);

      setShowForgotPassword(true);
    };


  // ======================================
  // Back To Login
  // ======================================

  const handleBackToLogin =
    () => {
      setShowForgotPassword(
        false
      );

      setForgotError("");

      setForgotSuccess(false);
    };


  // ======================================
  // Forgot Email Change
  // ======================================

  const handleForgotEmailChange =
    (event) => {
      setForgotEmail(
        event.target.value
      );

      if (forgotError) {
        setForgotError("");
      }
    };


  // ======================================
  // Forgot Password Submit
  // ======================================

  const handleForgotPassword =
    async (event) => {
      event.preventDefault();

      setForgotError("");

      const email =
        forgotEmail.trim();

      if (!email) {
        setForgotError(
          "Please enter your email address."
        );

        return;
      }

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(
          email
        )
      ) {
        setForgotError(
          "Please enter a valid email address."
        );

        return;
      }

      try {
        setIsForgotSubmitting(
          true
        );

        await forgotPassword({
          email,
        });

        setForgotSuccess(
          true
        );
      } catch (
        requestError
      ) {
        console.error(
          "FORGOT PASSWORD ERROR:",
          requestError
        );

        setForgotError(
          requestError
            ?.response
            ?.data
            ?.message ||
            requestError
              ?.message ||
            "Unable to send the password reset email. Please try again."
        );
      } finally {
        setIsForgotSubmitting(
          false
        );
      }
    };


  // ======================================
  // Forgot Password Screen
  // ======================================

  if (
    showForgotPassword
  ) {
    return (
      <main className="login-page">

        <div className="login-page__decor login-page__decor--top" />

        <div className="login-page__decor login-page__decor--bottom" />


        <section className="login-container">

          {/* Brand */}

          <div className="login-brand">

            <img
              src={lumoraLogo}
              alt="Lumora"
              className="auth-logo"
            />

          </div>


          {/* Forgot Password Card */}

          <div className="login-card">

            <div className="login-card__header">

              <div className="login-icon">

                {forgotSuccess ? (
                  <CheckCircle2
                    size={22}
                    strokeWidth={1.8}
                  />
                ) : (
                  <Mail
                    size={22}
                    strokeWidth={1.8}
                  />
                )}

              </div>


              <span className="login-eyebrow">
                PASSWORD RECOVERY
              </span>


              <h1>
                {forgotSuccess
                  ? "Check your email."
                  : "Forgot your password?"}
              </h1>


              <p>
                {forgotSuccess
                  ? "If an account exists for this email, we've sent a password reset link. Check your inbox and follow the instructions."
                  : "Enter the email address associated with your Lumora account and we'll send you a secure password reset link."}
              </p>

            </div>


            {/* Success */}

            {forgotSuccess ? (

              <div className="forgot-success-box">

                <div className="forgot-success-icon">

                  <CheckCircle2
                    size={24}
                    strokeWidth={1.8}
                  />

                </div>


                <div className="forgot-success-content">

                  <strong>
                    Reset email sent
                  </strong>

                  <span>
                    Check:
                  </span>

                  <b>
                    {forgotEmail}
                  </b>

                  <small>
                    The reset link will expire
                    after 15 minutes.
                  </small>

                </div>

              </div>

            ) : (

              <form
                className="login-form"
                onSubmit={
                  handleForgotPassword
                }
              >

                {/* Error */}

                {forgotError && (

                  <div
                    className="auth-form-error forgot-error"
                    role="alert"
                  >

                    <AlertCircle
                      size={16}
                    />

                    <span>
                      {forgotError}
                    </span>

                  </div>

                )}


                {/* Email */}

                <div className="login-field">

                  <label htmlFor="forgot-email">
                    Email address
                  </label>


                  <div className="forgot-email-wrapper">

                    <Mail
                      size={18}
                      strokeWidth={1.8}
                    />

                    <input
                      id="forgot-email"
                      name="forgotEmail"
                      type="email"
                      value={
                        forgotEmail
                      }
                      onChange={
                        handleForgotEmailChange
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={
                        isForgotSubmitting
                      }
                      required
                    />

                  </div>

                </div>


                {/* Send Reset Link */}

                <button
                  type="submit"
                  className="login-submit"
                  disabled={
                    isForgotSubmitting
                  }
                >

                  <span>
                    {isForgotSubmitting
                      ? "Sending..."
                      : "Send reset link"}
                  </span>


                  {isForgotSubmitting ? (

                    <Loader2
                      size={18}
                      className="login-spinner"
                    />

                  ) : (

                    <ArrowRight
                      size={18}
                      strokeWidth={1.9}
                    />

                  )}

                </button>

              </form>

            )}


            {/* Bottom Actions */}

            <div className="login-register forgot-bottom">

              <button
                type="button"
                className="forgot-back-button"
                onClick={
                  handleBackToLogin
                }
              >

                <ArrowLeft
                  size={16}
                  strokeWidth={1.9}
                />

                <span>
                  Back to Login
                </span>

              </button>


              {forgotSuccess && (

                <button
                  type="button"
                  className="forgot-resend-button"
                  onClick={() => {
                    setForgotSuccess(
                      false
                    );

                    setForgotError(
                      ""
                    );
                  }}
                >
                  Request again
                </button>

              )}

            </div>

          </div>


          {/* Footer */}

          <p className="login-footer">

            By continuing, you agree to Lumora's{" "}

            <Link to="/terms">
              Terms
            </Link>

            {" "}and{" "}

            <Link to="/privacy">
              Privacy Policy
            </Link>

            .

          </p>

        </section>

      </main>
    );
  }


  // ======================================
  // Normal Login Screen
  // ======================================

  return (
    <main className="login-page">

      <div className="login-page__decor login-page__decor--top" />

      <div className="login-page__decor login-page__decor--bottom" />


      <section className="login-container">

        {/* Brand */}

        <div className="login-brand">

          <img
            src={lumoraLogo}
            alt="Lumora"
            className="auth-logo"
          />

        </div>


        {/* Login Card */}

        <div className="login-card">

          {/* Header */}

          <div className="login-card__header">

            <div className="login-icon">

              <BookOpen
                size={22}
                strokeWidth={1.8}
              />

            </div>


            <span className="login-eyebrow">
              WELCOME BACK
            </span>


            <h1>
              Welcome back.
            </h1>


            <p>
              Sign in to continue reading,
              writing, and discovering stories
              on Lumora.
            </p>

          </div>


          {/* Login Form */}

          <form
            className="login-form"
            onSubmit={
              handleSubmit
            }
          >

            {/* Error */}

            {error && (

              <div
                className="auth-form-error"
                role="alert"
              >

                <AlertCircle
                  size={16}
                />

                <span>
                  {error}
                </span>

              </div>

            )}


            {/* Email */}

            <div className="login-field">

              <label htmlFor="email">
                Email address
              </label>


              <input
                id="email"
                name="email"
                type="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                placeholder="you@example.com"
                autoComplete="email"
                disabled={
                  isSubmitting
                }
                required
              />

            </div>


            {/* Password */}

            <div className="login-field">

              <div className="login-field__label-row">

                <label htmlFor="password">
                  Password
                </label>


                <button
                  type="button"
                  className="login-forgot"
                  onClick={
                    handleOpenForgotPassword
                  }
                  disabled={
                    isSubmitting
                  }
                >
                  Forgot password?
                </button>

              </div>


              <div className="login-password">

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={
                    isSubmitting
                  }
                  required
                />


                <button
                  type="button"
                  className="login-password__toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={
                    isSubmitting
                  }
                >

                  {showPassword ? (

                    <EyeOff
                      size={18}
                      strokeWidth={1.8}
                    />

                  ) : (

                    <Eye
                      size={18}
                      strokeWidth={1.8}
                    />

                  )}

                </button>

              </div>

            </div>


            {/* Remember Me */}

            <label className="login-remember">

              <input
                type="checkbox"
                name="remember"
                checked={
                  formData.remember
                }
                onChange={
                  handleChange
                }
                disabled={
                  isSubmitting
                }
              />

              <span>
                Remember me
              </span>

            </label>


            {/* Login */}

            <button
              type="submit"
              className="login-submit"
              disabled={
                isSubmitting
              }
            >

              <span>
                {isSubmitting
                  ? "Logging in..."
                  : "Log in"}
              </span>


              {isSubmitting ? (

                <Loader2
                  size={18}
                  className="login-spinner"
                />

              ) : (

                <ArrowRight
                  size={18}
                  strokeWidth={1.9}
                />

              )}

            </button>

          </form>


          {/* Divider */}

          <div className="login-divider">

            <span>
              or
            </span>

          </div>


          {/* Social Login */}

          <div className="social-login">

            {/* Google */}

            <div className="google-login-wrapper">

              <GoogleSignInButton
                onSuccess={
                  handleGoogleLogin
                }
                onError={
                  handleSocialLoginError
                }
                disabled={
                  isSubmitting
                }
              />

            </div>


            {/* Facebook */}

            <div className="facebook-login-wrapper">

              <FacebookLoginButton
                onSuccess={
                  handleFacebookLogin
                }
                onError={
                  handleSocialLoginError
                }
                disabled={
                  isSubmitting
                }
              />

            </div>

          </div>


          {/* Register */}

          <div className="login-register">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create an account
            </Link>

          </div>

        </div>


        {/* Footer */}

        <p className="login-footer">

          By continuing, you agree to Lumora's{" "}

          <Link to="/terms">
            Terms
          </Link>

          {" "}and{" "}

          <Link to="/privacy">
            Privacy Policy
          </Link>

          .

        </p>

      </section>

    </main>
  );
}


export default Login;
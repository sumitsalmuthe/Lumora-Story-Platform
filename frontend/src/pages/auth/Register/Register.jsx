import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  BookOpen,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  MailCheck,
} from "lucide-react";

import {
  useState,
} from "react";

import lumoraLogo from "../../../assets/logo/lumora-logo-bold.svg";

import useAuth from "../../../context/AuthContext/useAuth";

import GoogleSignInButton from "../../../components/auth/GoogleSignUpButton/GoogleSignInButton.jsx";
import FacebookLoginButton from "../../../components/auth/FacebookLoginButton/FacebookLoginButton.jsx";

import "./Register.css";


function Register() {
  const {
  register,
  googleLogin,
  facebookLogin,
  resendVerificationEmail,
} = useAuth();

  const navigate = useNavigate();


  // ======================================
  // Password State
  // ======================================

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);


  // ======================================
  // Form State
  // ======================================

  const [
    error,
    setError,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  // Email verification success screen
  const [
    registrationComplete,
    setRegistrationComplete,
  ] = useState(false);

  // Resend verification state
  const [
    resendMessage,
    setResendMessage,
  ] = useState("");

  const [
    isResending,
    setIsResending,
  ] = useState(false);


  const [
    formData,
    setFormData,
  ] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });


  // ======================================
  // Input Change
  // ======================================

  const handleChange = (event) => {
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

    if (resendMessage) {
      setResendMessage("");
    }
  };


  // ======================================
  // Email Signup
  // ======================================

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");
      setResendMessage("");


      // Password match
      if (
        formData.password !==
        formData.confirmPassword
      ) {
        setError(
          "Passwords do not match."
        );

        return;
      }


      // Terms
      if (!formData.agree) {
        setError(
          "Please agree to Lumora's Terms and Privacy Policy."
        );

        return;
      }


      // Basic name validation
      if (
        !formData.name.trim()
      ) {
        setError(
          "Please enter your name."
        );

        return;
      }


      // Basic email validation
      if (
        !formData.email.trim()
      ) {
        setError(
          "Please enter your email address."
        );

        return;
      }


      // Password validation
      if (
        formData.password.length < 8
      ) {
        setError(
          "Password must be at least 8 characters."
        );

        return;
      }


      setIsSubmitting(true);


      try {
        await register({
          username:
            formData.name.trim(),

          email:
            formData.email
              .trim()
              .toLowerCase(),

          password:
            formData.password,
        });


        // ----------------------------------
        // IMPORTANT
        // ----------------------------------
        // Do NOT navigate to home.
        //
        // Local accounts need email
        // verification first.
        //
        // Show verification screen instead.
        // ----------------------------------

        setRegistrationComplete(true);

      } catch (
        requestError
      ) {
        console.error(
          "Registration failed:",
          requestError
        );


        setError(
          requestError
            ?.response
            ?.data
            ?.message ||
          requestError
            ?.message ||
          "Unable to create your account. Please try again."
        );

      } finally {
        setIsSubmitting(false);
      }
    };


  // ======================================
  // Resend Verification Email
  // ======================================

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      setResendMessage("");
      setError("");

     const response =
  await resendVerificationEmail(
    formData.email
  );

      setResendMessage(
        response?.message ||
          "A new verification email has been sent."
      );

    } catch (
      requestError
    ) {
      console.error(
        "Resend verification failed:",
        requestError
      );

      setResendMessage(
        requestError
          ?.response
          ?.data
          ?.message ||
        requestError
          ?.message ||
        "Unable to resend verification email. Please try again."
      );

    } finally {
      setIsResending(false);
    }
  };


  // ======================================
  // Google Signup
  // ======================================

  const handleGoogleSignup =
    async (response) => {
      setError("");


      // Terms must be accepted
      // before social signup.
      if (!formData.agree) {
        setError(
          "Please agree to Lumora's Terms and Privacy Policy before continuing with Google."
        );

        return;
      }


      if (
        !response?.credential
      ) {
        setError(
          "Google authentication failed. Please try again."
        );

        return;
      }


      try {
        setIsSubmitting(true);


        await googleLogin({
          credential:
            response.credential,

          rememberMe: true,
        });


        navigate(
          "/",
          {
            replace: true,
          }
        );

      } catch (
        requestError
      ) {
        console.error(
          "Google signup failed:",
          requestError
        );


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
  // Facebook Signup
  // ======================================

  const handleFacebookSignup =
    async (accessToken) => {
      setError("");


      // Terms must be accepted
      // before social signup.
      if (!formData.agree) {
        setError(
          "Please agree to Lumora's Terms and Privacy Policy before continuing with Facebook."
        );

        return;
      }


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
          rememberMe: true,
        });


        navigate(
          "/",
          {
            replace: true,
          }
        );

      } catch (
        requestError
      ) {
        console.error(
          "Facebook signup failed:",
          requestError
        );


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
  // Social Error
  // ======================================

  const handleSocialError =
    (socialError) => {
      console.error(
        "Social authentication error:",
        socialError
      );


      setError(
        socialError?.message ||
        "Authentication could not be completed. Please try again."
      );
    };


  // ======================================
  // EMAIL VERIFICATION SUCCESS SCREEN
  // ======================================

  if (registrationComplete) {
    return (
      <main className="register-page">

        <div
          className="register-page__decor register-page__decor--top"
        />

        <div
          className="register-page__decor register-page__decor--bottom"
        />


        <section className="register-container">

          {/* ======================================
              Brand
          ====================================== */}

          <div className="register-brand">

            <img
              src={lumoraLogo}
              alt="Lumora"
              className="auth-logo"
            />

          </div>


          {/* ======================================
              Verification Card
          ====================================== */}

          <div className="register-card verification-success-card">

            {/* Verification Icon */}

            <div className="verification-success-icon">

              <MailCheck
                size={34}
                strokeWidth={1.8}
              />

            </div>


            {/* Header */}

            <div className="register-card__header">

              <span className="register-eyebrow">
                ONE MORE STEP
              </span>


              <h1>
                Check your email.
              </h1>


              <p>
                We've sent a verification link to{" "}
                <strong>
                  {formData.email}
                </strong>
                .
              </p>

            </div>


            {/* Verification Information */}

            <div className="verification-message">

              <p>
                Open the email and click{" "}
                <strong>
                  Verify Email Address
                </strong>{" "}
                to activate your Lumora account.
              </p>


              <p>
                The verification link will expire
                in 15 minutes.
              </p>

            </div>


            {/* Resend Message */}

            {resendMessage && (
              <p
                className="verification-resend-message"
                role="status"
              >
                {resendMessage}
              </p>
            )}


            {/* Resend Button */}

            <button
              type="button"
              className="register-submit"
              onClick={
                handleResendVerification
              }
              disabled={isResending}
            >

              <span>
                {isResending
                  ? "Sending..."
                  : "Resend verification email"}
              </span>


              {isResending ? (
                <Loader2
                  size={18}
                  className="register-spinner"
                />
              ) : (
                <ArrowRight
                  size={18}
                  strokeWidth={1.9}
                />
              )}

            </button>


            {/* Login */}

            <Link
              to="/login"
              className="verification-login-link"
            >
              Continue to Login
            </Link>


            {/* Help */}

            <p className="verification-help">
              Didn't receive the email? Check your
              spam or promotions folder.
            </p>

          </div>


          {/* Footer */}

          <p className="register-footer">
            Verify your email and start exploring
            stories on Lumora.
          </p>

        </section>

      </main>
    );
  }


  // ======================================
  // MAIN REGISTER UI
  // ======================================

  return (
    <main className="register-page">

      <div
        className="register-page__decor register-page__decor--top"
      />

      <div
        className="register-page__decor register-page__decor--bottom"
      />


      <section className="register-container">

        {/* ======================================
            Brand
        ====================================== */}

        <div className="register-brand">

          <img
            src={lumoraLogo}
            alt="Lumora"
            className="auth-logo"
          />

        </div>


        {/* ======================================
            Card
        ====================================== */}

        <div className="register-card">

          {/* ======================================
              Header
          ====================================== */}

          <div className="register-card__header">

            <div className="register-icon">

              <BookOpen
                size={22}
                strokeWidth={1.8}
              />

            </div>


            <span className="register-eyebrow">
              JOIN LUMORA
            </span>


            <h1>
              Create your account.
            </h1>


            <p>
              Join Lumora to discover stories,
              follow writers, and share worlds
              of your own.
            </p>

          </div>


          {/* ======================================
              Form
          ====================================== */}

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            {/* Error */}

            {error && (
              <p
                className="auth-form-error"
                role="alert"
              >
                {error}
              </p>
            )}


            {/* ======================================
                Name
            ====================================== */}

            <div className="register-field">

              <label htmlFor="name">
                Your name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                placeholder="Enter your name"
                autoComplete="name"
                disabled={
                  isSubmitting
                }
                required
              />

            </div>


            {/* ======================================
                Email
            ====================================== */}

            <div className="register-field">

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


            {/* ======================================
                Password
            ====================================== */}

            <div className="register-field">

              <label htmlFor="password">
                Password
              </label>


              <div className="register-password">

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
                  placeholder="Create a password"
                  autoComplete="new-password"
                  disabled={
                    isSubmitting
                  }
                  minLength={8}
                  required
                />


                <button
                  type="button"
                  className="register-password__toggle"
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


            {/* ======================================
                Confirm Password
            ====================================== */}

            <div className="register-field">

              <label htmlFor="confirmPassword">
                Confirm password
              </label>


              <div className="register-password">

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    formData.confirmPassword
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  disabled={
                    isSubmitting
                  }
                  minLength={8}
                  required
                />


                <button
                  type="button"
                  className="register-password__toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) =>
                        !current
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={
                    isSubmitting
                  }
                >

                  {showConfirmPassword ? (
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


            {/* ======================================
                Terms
            ====================================== */}

            <label className="register-terms">

              <input
                type="checkbox"
                name="agree"
                checked={
                  formData.agree
                }
                onChange={
                  handleChange
                }
                disabled={
                  isSubmitting
                }
                required
              />


              <span>
                I agree to Lumora's{" "}

                <Link to="/terms">
                  Terms
                </Link>{" "}

                and{" "}

                <Link to="/privacy">
                  Privacy Policy
                </Link>
                .
              </span>

            </label>


            {/* ======================================
                Submit
            ====================================== */}

            <button
              type="submit"
              className="register-submit"
              disabled={
                isSubmitting
              }
            >

              <span>
                {isSubmitting
                  ? "Creating account..."
                  : "Create account"}
              </span>


              {isSubmitting ? (
                <Loader2
                  size={18}
                  className="register-spinner"
                />
              ) : (
                <ArrowRight
                  size={18}
                  strokeWidth={1.9}
                />
              )}

            </button>

          </form>


          {/* ======================================
              Divider
          ====================================== */}

          <div className="register-divider">

            <span>
              or
            </span>

          </div>


          {/* ======================================
              Google
          ====================================== */}

          <div className="google-register-wrapper">

            <GoogleSignInButton
              onSuccess={
                handleGoogleSignup
              }
              onError={
                handleSocialError
              }
              disabled={
                isSubmitting
              }
            />

          </div>


          {/* ======================================
              Facebook
          ====================================== */}

          <div className="facebook-register-wrapper">

            <FacebookLoginButton
              onSuccess={
                handleFacebookSignup
              }
              onError={
                handleSocialError
              }
              disabled={
                isSubmitting
              }
            />

          </div>


          {/* ======================================
              Login
          ====================================== */}

          <div className="register-login">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Log in
            </Link>

          </div>

        </div>


        {/* ======================================
            Footer
        ====================================== */}

        <p className="register-footer">
          Create your account and start
          exploring stories on Lumora.
        </p>

      </section>

    </main>
  );
}


export default Register;
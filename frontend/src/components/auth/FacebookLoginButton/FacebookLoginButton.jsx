import { useCallback, useEffect, useRef, useState } from "react";
import "./FacebookLoginButton.css";

const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;

const FacebookLoginButton = ({
  onSuccess,
  onError,
  disabled = false,
}) => {
  const [sdkLoading, setSdkLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  const initializedRef = useRef(false);

  const initializeFacebook = useCallback(() => {
    if (!window.FB || initializedRef.current) {
      return;
    }

    try {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: false,
        version: "v23.0",
      });

      initializedRef.current = true;

      // Run outside the current effect cycle.
      window.setTimeout(() => {
        setSdkLoading(false);
      }, 0);
    } catch (error) {
      console.error(
        "Facebook SDK initialization failed:",
        error
      );

      window.setTimeout(() => {
        setSdkLoading(false);
      }, 0);

      onError?.(
        new Error(
          "Facebook Login could not be initialized."
        )
      );
    }
  }, [onError]);

  useEffect(() => {
    if (!FACEBOOK_APP_ID) {
      console.error(
        "Facebook App ID is missing. Add VITE_FACEBOOK_APP_ID to frontend .env"
      );

      window.setTimeout(() => {
        setSdkLoading(false);
      }, 0);

      return;
    }

    // Facebook SDK is already available
    if (window.FB) {
      initializeFacebook();
      return;
    }

    // Facebook SDK script already exists
    const existingScript =
      document.getElementById("facebook-jssdk");

    if (existingScript) {
      const handleLoad = () => {
        initializeFacebook();
      };

      existingScript.addEventListener(
        "load",
        handleLoad
      );

      return () => {
        existingScript.removeEventListener(
          "load",
          handleLoad
        );
      };
    }

    // Facebook SDK callback
    window.fbAsyncInit = () => {
      initializeFacebook();
    };

    // Create Facebook SDK script
    const script = document.createElement("script");

    script.id = "facebook-jssdk";
    script.src =
      "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";

    script.onerror = () => {
      console.error(
        "Failed to load Facebook JavaScript SDK."
      );

      window.setTimeout(() => {
        setSdkLoading(false);
      }, 0);

      onError?.(
        new Error(
          "Unable to load Facebook Login. Please try again."
        )
      );
    };

    document.body.appendChild(script);

    return () => {
      if (window.fbAsyncInit) {
        window.fbAsyncInit = undefined;
      }
    };
  }, [initializeFacebook, onError]);

  const handleFacebookLogin = () => {
    if (
      disabled ||
      sdkLoading ||
      loginLoading ||
      !window.FB
    ) {
      return;
    }

    setLoginLoading(true);

    window.FB.login(
      (response) => {
        if (
          response?.status === "connected" &&
          response?.authResponse?.accessToken
        ) {
          const accessToken =
            response.authResponse.accessToken;

          onSuccess?.(accessToken);
        } else {
          onError?.(
            new Error(
              "Facebook login was cancelled or could not be completed."
            )
          );
        }

        setLoginLoading(false);
      },
      {
        scope: "public_profile,email",
      }
    );
  };

  const isDisabled =
    disabled || sdkLoading || loginLoading;

  return (
    <button
      type="button"
      className="facebook-login-button"
      onClick={handleFacebookLogin}
      disabled={isDisabled}
      aria-label="Continue with Facebook"
    >
      {loginLoading ? (
        <>
          <span className="facebook-spinner" />
          <span>Connecting...</span>
        </>
      ) : sdkLoading ? (
        <>
          <span className="facebook-spinner" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          <span className="facebook-icon">f</span>
          <span>Continue with Facebook</span>
        </>
      )}
    </button>
  );
};

export default FacebookLoginButton;
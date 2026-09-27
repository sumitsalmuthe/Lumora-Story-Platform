import {
  useEffect,
  useRef,
} from "react";

import "./GoogleSignInButton.css";


const GOOGLE_SCRIPT_URL =
  "https://accounts.google.com/gsi/client";

let googleScriptPromise = null;


// =========================================
// Load Google Identity Services
// =========================================

const loadGoogleScript = () => {
  if (
    window.google?.accounts?.id
  ) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise =
    new Promise(
      (resolve, reject) => {
        const existingScript =
          document.querySelector(
            `script[src="${GOOGLE_SCRIPT_URL}"]`
          );

        if (existingScript) {
          existingScript.addEventListener(
            "load",
            resolve,
            {
              once: true,
            }
          );

          existingScript.addEventListener(
            "error",
            reject,
            {
              once: true,
            }
          );

          return;
        }

        const script =
          document.createElement(
            "script"
          );

        script.src =
          GOOGLE_SCRIPT_URL;

        script.async = true;
        script.defer = true;

        script.onload = () => {
          resolve();
        };

        script.onerror = () => {
          reject(
            new Error(
              "Unable to load Google Identity Services."
            )
          );
        };

        document.head.appendChild(
          script
        );
      }
    );

  return googleScriptPromise;
};


// =========================================
// Google Sign-In Button
// =========================================

function GoogleSignInButton({
  onSuccess,
  onError,
  disabled = false,
}) {
  const buttonRef =
    useRef(null);

  const callbackRef =
    useRef(onSuccess);

  const errorRef =
    useRef(onError);

  const disabledRef =
    useRef(disabled);


  // =======================================
  // Keep Latest Success Callback
  // =======================================

  useEffect(() => {
    callbackRef.current =
      onSuccess;
  }, [onSuccess]);


  // =======================================
  // Keep Latest Error Callback
  // =======================================

  useEffect(() => {
    errorRef.current =
      onError;
  }, [onError]);


  // =======================================
  // Keep Latest Disabled State
  // =======================================

  useEffect(() => {
    disabledRef.current =
      disabled;
  }, [disabled]);


  // =======================================
  // Initialize Google
  // =======================================

  useEffect(() => {
    let isMounted = true;

    const initializeGoogle =
      async () => {
        try {
          await loadGoogleScript();

          if (
            !isMounted ||
            !buttonRef.current
          ) {
            return;
          }

          const clientId =
            import.meta.env
              .VITE_GOOGLE_CLIENT_ID;
              console.log("Google Origin:", window.location.origin);
console.log("Google Client ID:", clientId);

          if (!clientId) {
            const error =
              new Error(
                "Google Client ID is missing."
              );

            console.error(
              "VITE_GOOGLE_CLIENT_ID is missing from frontend/.env"
            );

            errorRef.current?.(
              error
            );

            return;
          }


          // Clear existing button

          buttonRef.current.innerHTML =
            "";


          // Initialize Google

          window.google.accounts.id.initialize(
            {
              client_id:
                clientId,

              callback:
                (response) => {
                  if (
                    disabledRef.current
                  ) {
                    return;
                  }

                  if (
                    !response?.credential
                  ) {
                    errorRef.current?.(
                      new Error(
                        "Google authentication failed. Please try again."
                      )
                    );

                    return;
                  }

                  callbackRef.current?.(
                    response
                  );
                },

              auto_select:
                false,

              cancel_on_tap_outside:
                true,
            }
          );


          // Render official Google button

          window.google.accounts.id.renderButton(
            buttonRef.current,
            {
              type: "standard",

              theme: "outline",

              size: "large",

              text:
                "continue_with",

              shape:
                "rectangular",

              logo_alignment:
                "left",

              width: 400,
            }
          );

        } catch (error) {
          console.error(
            "Google Sign-In initialization failed:",
            error
          );

          errorRef.current?.(
            error
          );
        }
      };


    void initializeGoogle();


    // =====================================
    // Cleanup
    // =====================================

    const buttonElement =
      buttonRef.current;

    return () => {
      isMounted = false;

      if (buttonElement) {
        buttonElement.innerHTML =
          "";
      }
    };

  }, []);


  // =======================================
  // Render
  // =======================================

  return (
    <div
      className={`google-signin-wrapper ${
        disabled
          ? "google-signin-wrapper--disabled"
          : ""
      }`}
      aria-disabled={
        disabled
      }
    >

      <div
        ref={buttonRef}
        className="google-signin-button"
      />

    </div>
  );
}


export default GoogleSignInButton;
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import authService from "../../services/auth/authService";
import AuthContext from "./authContext";

import {
  getStoredUser,
  hasAuthSession,
} from "../../services/auth/authStorage";


// =======================================
// Auth Provider
// =======================================

function AuthProvider({
  children,
}) {
  // =====================================
  // Initial User
  // =====================================

  const [
    user,
    setUser,
  ] = useState(
    getStoredUser()
  );


  // =====================================
  // Loading State
  // =====================================

  const [
    isLoading,
    setIsLoading,
  ] = useState(
    !hasAuthSession()
  );


  // =====================================
  // Restore Session
  // =====================================

  useEffect(() => {
    let mounted = true;

    const restoreSession =
      async () => {
        /*
         * If an authentication session
         * already exists locally, don't
         * unnecessarily refresh it here.
         */

        if (hasAuthSession()) {
          if (mounted) {
            setIsLoading(false);
          }

          return;
        }

        try {
          const response =
            await authService.refresh();

          const session =
            response?.data ||
            response;

          const sessionUser =
            session?.user;

          if (
            mounted &&
            sessionUser
          ) {
            setUser(
              sessionUser
            );
          }
        } catch {
          /*
           * No valid session.
           * User remains logged out.
           */
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);


  // =====================================
  // Login
  // =====================================

  const login =
    useCallback(
      async ({
        email,
        password,
        rememberMe = false,
      }) => {
        const response =
          await authService.login({
            email,
            password,
            rememberMe,
          });

        const session =
          response?.data ||
          response;

        const sessionUser =
          session?.user;

        if (!sessionUser) {
          throw new Error(
            "Invalid login response"
          );
        }

        setUser(
          sessionUser
        );

        return sessionUser;
      },
      []
    );


  // =====================================
  // Register
  // =====================================

  const register =
    useCallback(
      async ({
        username,
        email,
        password,
      }) => {
        const response =
          await authService.register({
            username,
            email,
            password,
          });

        const session =
          response?.data ||
          response;

        const sessionUser =
          session?.user;

        if (!sessionUser) {
          throw new Error(
            "Invalid registration response"
          );
        }

        setUser(
          sessionUser
        );

        return sessionUser;
      },
      []
    );


  // =====================================
  // Google Login / Signup
  // =====================================

  const googleLogin =
    useCallback(
      async ({
        credential,
        rememberMe = false,
      }) => {
        const response =
          await authService.googleLogin({
            credential,
            rememberMe,
          });

        const session =
          response?.data ||
          response;

        const sessionUser =
          session?.user;

        if (!sessionUser) {
          throw new Error(
            "Invalid Google authentication response"
          );
        }

        setUser(
          sessionUser
        );

        return sessionUser;
      },
      []
    );


  // =====================================
  // Facebook Login / Signup
  // =====================================

  const facebookLogin =
    useCallback(
      async ({
        accessToken,
        rememberMe = false,
      }) => {
        if (!accessToken) {
          throw new Error(
            "Facebook access token is required"
          );
        }

        const response =
          await authService.facebookLogin({
            accessToken,
            rememberMe,
          });

        const session =
          response?.data ||
          response;

        const sessionUser =
          session?.user;

        if (!sessionUser) {
          throw new Error(
            "Invalid Facebook authentication response"
          );
        }

        setUser(
          sessionUser
        );

        return sessionUser;
      },
      []
    );


  // =====================================
  // Forgot Password
  // =====================================

  const forgotPassword =
    useCallback(
      async ({
        email,
      }) => {
        return await authService
          .forgotPassword({
            email,
          });
      },
      []
    );


  // =====================================
  // Reset Password
  // =====================================

  const resetPassword =
    useCallback(
      async ({
        token,
        newPassword,
      }) => {
        return await authService
          .resetPassword({
            token,
            newPassword,
          });
      },
      []
    );


  // =====================================
  // Logout
  // =====================================

  const logout =
    useCallback(
      async () => {
        try {
          await authService.logout();
        } finally {
          setUser(null);
        }
      },
      []
    );


  // =====================================
  // Logout All Sessions
  // =====================================

  const logoutAll =
    useCallback(
      async () => {
        try {
          await authService
            .logoutAll();
        } finally {
          setUser(null);
        }
      },
      []
    );


  // =====================================
  // Get Current User
  // =====================================

  const getMe =
    useCallback(
      async () => {
        const response =
          await authService.getMe();

        const session =
          response?.data ||
          response;

        const sessionUser =
          session?.user;

        if (!sessionUser) {
          throw new Error(
            "Unable to retrieve current user"
          );
        }

        setUser(
          sessionUser
        );

        return sessionUser;
      },
      []
    );


  // =====================================
  // Become Writer
  // =====================================

  const becomeWriter =
    useCallback(
      async () => {
        const response =
          await authService
            .becomeWriter();

        const session =
          response?.data ||
          response;

        const sessionUser =
          session?.user;

        if (!sessionUser) {
          throw new Error(
            "Invalid become-writer response"
          );
        }

        setUser(
          sessionUser
        );

        return sessionUser;
      },
      []
    );


  // =====================================
  // Change Password
  // =====================================

  const changePassword =
    useCallback(
      async ({
        currentPassword,
        newPassword,
      }) => {
        try {
          return await authService
            .changePassword({
              currentPassword,
              newPassword,
            });
        } finally {
          /*
           * Backend revokes the existing
           * authentication sessions after
           * password change.
           */

          setUser(null);
        }
      },
      []
    );


  // =====================================
  // Authentication Status
  // =====================================

  const isAuthenticated =
    Boolean(user);


  // =====================================
  // Writer Status
  // =====================================

  const isWriter =
    user?.role === "writer" ||
    user?.role === "admin";


  // =====================================
  // Admin Status
  // =====================================

  const isAdmin =
    user?.role === "admin";


  // =====================================
  // Context Value
  // =====================================

  const value =
    useMemo(
      () => ({
        // User
        user,

        // Loading
        isLoading,

        // Authentication state
        isAuthenticated,

        // Roles
        isWriter,
        isAdmin,

        // Authentication
        login,
        register,
        googleLogin,
        facebookLogin,

        // Password
        forgotPassword,
        resetPassword,
        changePassword,

        // User
        getMe,

        // Sessions
        logout,
        logoutAll,

        // Writer
        becomeWriter,
      }),

      [
        user,
        isLoading,
        isAuthenticated,

        isWriter,
        isAdmin,

        login,
        register,
        googleLogin,
        facebookLogin,

        forgotPassword,
        resetPassword,
        changePassword,

        getMe,

        logout,
        logoutAll,

        becomeWriter,
      ]
    );


  // =====================================
  // Provider
  // =====================================

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}


// =========================================
// Export
// =========================================

export default AuthProvider;
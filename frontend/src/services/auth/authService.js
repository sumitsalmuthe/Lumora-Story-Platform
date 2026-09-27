import apiClient from "../api/apiClient";

import {
  persistAuthSession,
  updateStoredSession,
  clearAuthStorage,
} from "./authStorage";

// ======================================
// Authentication Base URL
// ======================================

const AUTH_BASE_URL =
  "/v1/auth";

// ======================================
// Extract Session Data
// ======================================

const extractSessionData = (
  response
) => {
  const data =
    response?.data?.data;

  return {
    user: data?.user || null,

    accessToken:
      data?.accessToken || null,
  };
};

// ======================================
// Login
// ======================================

const login = async ({
  email,
  password,
  rememberMe = false,
}) => {
  const response =
    await apiClient.post(
      `${AUTH_BASE_URL}/login`,
      {
        email,
        password,
        rememberMe,
      },
      {
        skipAuthRefresh: true,
      }
    );

  const {
    user,
    accessToken,
  } =
    extractSessionData(
      response
    );

  if (!user || !accessToken) {
    throw new Error(
      "Login succeeded but session data is missing"
    );
  }

  persistAuthSession(
    accessToken,
    user,
    rememberMe
  );

  return {
    ...response.data,

    user,

    accessToken,

    rememberMe,
  };
};

// ======================================
// Register
// ======================================

const register = async ({
  username,
  email,
  password,
}) => {
  const response = await apiClient.post(
    `${AUTH_BASE_URL}/register`,
    {
      username,
      email,
      password,
    },
    {
      skipAuthRefresh: true,
    }
  );

  return response.data;
};

// ======================================
// Google Login / Signup
// ======================================

const googleLogin = async ({
  credential,
  rememberMe = false,
}) => {
  if (!credential) {
    throw new Error(
      "Google credential is required"
    );
  }

  const response =
    await apiClient.post(
      `${AUTH_BASE_URL}/google`,
      {
        credential,
      },
      {
        skipAuthRefresh: true,
      }
    );

  const {
    user,
    accessToken,
  } =
    extractSessionData(
      response
    );

  if (!user || !accessToken) {
    throw new Error(
      "Google authentication succeeded but session data is missing"
    );
  }

  persistAuthSession(
    accessToken,
    user,
    rememberMe
  );

  return {
    ...response.data,

    user,

    accessToken,

    rememberMe,
  };
};

// ======================================
// Facebook Login / Signup
// ======================================

const facebookLogin = async ({
  accessToken: facebookAccessToken,
  rememberMe = false,
}) => {
  if (!facebookAccessToken) {
    throw new Error(
      "Facebook access token is required"
    );
  }

  const response =
    await apiClient.post(
      `${AUTH_BASE_URL}/facebook`,
      {
        accessToken:
          facebookAccessToken,
      },
      {
        skipAuthRefresh: true,
      }
    );

  const {
    user,
    accessToken,
  } =
    extractSessionData(
      response
    );

  if (!user || !accessToken) {
    throw new Error(
      "Facebook authentication succeeded but session data is missing"
    );
  }

  persistAuthSession(
    accessToken,
    user,
    rememberMe
  );

  return {
    ...response.data,

    user,

    accessToken,

    rememberMe,
  };
};

// ======================================
// Refresh Session
// ======================================

const refresh = async () => {
  const response =
    await apiClient.post(
      `${AUTH_BASE_URL}/refresh`,
      {},
      {
        skipAuthRefresh: true,
      }
    );

  const {
    user,
    accessToken,
  } =
    extractSessionData(
      response
    );

  if (!user || !accessToken) {
    throw new Error(
      "Session refresh succeeded but session data is missing"
    );
  }

  updateStoredSession(
    accessToken,
    user
  );

  return {
    ...response.data,

    user,

    accessToken,
  };
};

// ======================================
// Logout
// ======================================

const logout = async () => {
  try {
    const response =
      await apiClient.post(
        `${AUTH_BASE_URL}/logout`,
        {},
        {
          skipAuthRefresh: true,
        }
      );

    return response.data;
  } finally {
    clearAuthStorage();
  }
};

// ======================================
// Logout All Sessions
// ======================================

const logoutAll = async () => {
  try {
    const response =
      await apiClient.post(
        `${AUTH_BASE_URL}/logout-all`
      );

    return response.data;
  } finally {
    clearAuthStorage();
  }
};

// ======================================
// Get Current User
// ======================================

const getMe = async () => {
  const response =
    await apiClient.get(
      `${AUTH_BASE_URL}/me`
    );

  const user =
    response?.data?.data?.user;

  if (!user) {
    throw new Error(
      "Authenticated user data is missing"
    );
  }

  updateStoredSession(
    null,
    user
  );

  return {
    ...response.data,

    user,
  };
};

// ======================================
// Change Password
// ======================================

const changePassword = async ({
  currentPassword,
  newPassword,
}) => {
  try {
    const response =
      await apiClient.post(
        `${AUTH_BASE_URL}/change-password`,
        {
          currentPassword,
          newPassword,
        }
      );

    return response.data;
  } finally {
    /*
     * Backend revokes all sessions
     * after password change.
     */

    clearAuthStorage();
  }
};

// ======================================
// Forgot Password
// ======================================

const forgotPassword = async ({
  email,
}) => {
  const response =
    await apiClient.post(
      `${AUTH_BASE_URL}/forgot-password`,
      {
        email,
      },
      {
        skipAuthRefresh: true,
      }
    );

  return response.data;
};

// ======================================
// Reset Password
// ======================================

const resetPassword = async ({
  token,
  newPassword,
}) => {
  const response =
    await apiClient.post(
      `${AUTH_BASE_URL}/reset-password`,
      {
        token,
        newPassword,
      },
      {
        skipAuthRefresh: true,
      }
    );

  return response.data;
};

// ======================================
// Verify Email
// ======================================

const verifyEmail = async (
  token
) => {
  if (!token) {
    throw new Error(
      "Email verification token is required"
    );
  }

  const response =
    await apiClient.get(
      `${AUTH_BASE_URL}/verify-email`,
      {
        params: {
          token,
        },

        skipAuthRefresh: true,

        // Never leave the verification
        // screen spinning forever.
        timeout: 15000,
      }
    );

  return response.data;
};

// ======================================
// Resend Email Verification
// ======================================

const resendVerificationEmail = async (
  email
) => {
  if (!email) {
    throw new Error(
      "Email address is required"
    );
  }

  const response =
    await apiClient.post(
      `${AUTH_BASE_URL}/resend-verification`,
      {
        email,
      }
    );

  return response.data;
};

// ======================================
// Become Writer
// ======================================

const becomeWriter = async () => {
  const response =
    await apiClient.put(
      `${AUTH_BASE_URL}/become-writer`
    );

  const {
    user,
    accessToken,
  } =
    extractSessionData(
      response
    );

  if (!user || !accessToken) {
    throw new Error(
      "Writer upgrade succeeded but session data is missing"
    );
  }

  updateStoredSession(
    accessToken,
    user
  );

  return {
    ...response.data,

    user,

    accessToken,
  };
};

// ======================================
// Export
// ======================================

const authService = {
  login,

  register,

  googleLogin,

  facebookLogin,

  refresh,

  logout,

  logoutAll,

  getMe,

  changePassword,

  forgotPassword,

  resetPassword,

  verifyEmail,

  resendVerificationEmail,

  becomeWriter,
};

export default authService;
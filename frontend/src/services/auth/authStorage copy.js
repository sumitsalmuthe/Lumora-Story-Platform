const TOKEN_KEY = "lumora-token";
const USER_KEY = "lumora-user";

/**
 * Get the storage used by the current authentication session.
 */
const getSessionStorage = () => {
  if (localStorage.getItem(TOKEN_KEY)) {
    return localStorage;
  }

  if (sessionStorage.getItem(TOKEN_KEY)) {
    return sessionStorage;
  }

  return null;
};

/**
 * Get current access token.
 */
export const getAccessToken = () => {
  return (
    localStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem(TOKEN_KEY) ||
    null
  );
};

/**
 * Get stored user.
 */
export const getStoredUser = () => {
  try {
    const rawUser =
      localStorage.getItem(USER_KEY) ||
      sessionStorage.getItem(USER_KEY);

    if (!rawUser) {
      return null;
    }

    return JSON.parse(rawUser);
  } catch (error) {
    console.error(
      "Failed to read stored Lumora user:",
      error
    );

    clearAuthStorage();

    return null;
  }
};

/**
 * Save authentication session.
 *
 * rememberMe = true
 *   → localStorage
 *
 * rememberMe = false
 *   → sessionStorage
 */
export const persistAuthSession = (
  accessToken,
  user,
  rememberMe = false
) => {
  if (!accessToken || !user) {
    throw new Error(
      "Invalid authentication session"
    );
  }

  clearAuthStorage();

  const storage = rememberMe
    ? localStorage
    : sessionStorage;

  storage.setItem(
    TOKEN_KEY,
    accessToken
  );

  storage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );
};

/**
 * Update existing authentication session.
 *
 * Keeps the token in the same storage that
 * was originally being used.
 */
export const updateStoredSession = (
  accessToken,
  user
) => {
  const storage = getSessionStorage();

  if (!storage) {
    return;
  }

  if (accessToken) {
    storage.setItem(
      TOKEN_KEY,
      accessToken
    );
  }

  if (user) {
    storage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );
  }
};

/**
 * Clear all frontend authentication data.
 */
export const clearAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

/**
 * Check if an authentication session exists.
 */
export const hasAuthSession = () => {
  return Boolean(getAccessToken());
};

/**
 * Check whether the current session uses
 * Remember Me.
 *
 * true  → localStorage
 * false → sessionStorage
 * null  → no session
 */
export const isRememberedSession = () => {
  if (
    localStorage.getItem(TOKEN_KEY) ||
    localStorage.getItem(USER_KEY)
  ) {
    return true;
  }

  if (
    sessionStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem(USER_KEY)
  ) {
    return false;
  }

  return null;
};

export {
  TOKEN_KEY,
  USER_KEY,
};
import axios from "axios";

import API_BASE_URL from "./apiConfig";

import {
  getAccessToken,
  updateStoredSession,
  clearAuthStorage,
} from "../auth/authStorage";

const apiClient = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

/*
 * Separate Axios client for refresh.
 *
 * This prevents the refresh request itself from
 * entering the normal refresh interceptor.
 */
const refreshClient = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

/*
 * Only one refresh request should run at a time.
 */
let refreshPromise = null;

/**
 * Requests that should not automatically
 * trigger token refresh.
 */
const shouldSkipRefresh = (config) => {
  return (
    config?.skipAuthRefresh === true ||
    config?.url?.includes("/v1/auth/refresh") ||
    config?.url?.includes("/v1/auth/login") ||
    config?.url?.includes("/v1/auth/register") ||
    config?.url?.includes("/v1/auth/logout")
  );
};

/**
 * Add access token to requests.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Refresh access token.
 */
const refreshAccessToken = async () => {
  /*
   * If another request is already refreshing,
   * wait for that same request.
   */
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/v1/auth/refresh", {})
      .then((response) => {
        const data =
          response?.data?.data;

        const accessToken =
          data?.accessToken;

        const user =
          data?.user || null;

        if (!accessToken) {
          throw new Error(
            "Refresh response does not contain an access token"
          );
        }

        /*
         * Keep the refreshed session in the same
         * storage used by the current session.
         */
        updateStoredSession(
          accessToken,
          user
        );

        return {
          accessToken,
          user,
        };
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

/**
 * Handle API responses.
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest =
      error.config;

    /*
     * Only handle 401 responses.
     */
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      shouldSkipRefresh(originalRequest) ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    /*
     * Prevent infinite retry loops.
     */
    originalRequest._retry = true;

    try {
      const {
        accessToken,
      } = await refreshAccessToken();

      /*
       * Update Authorization header.
       */
      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${accessToken}`;

      /*
       * Retry original request.
       */
      return apiClient(
        originalRequest
      );
    } catch {
      /*
       * Refresh session is no longer valid.
       *
       * Clear frontend authentication.
       */
      clearAuthStorage();

      return Promise.reject(error);
    }
  }
);

export default apiClient;
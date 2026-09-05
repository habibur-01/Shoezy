import axios from "axios";
import { LOGIN_ENDPOINT, LOGOUT_ENDPOINT, REFRESH_TOKEN_ENDPOINT, SIGNUP_ENDPOINT } from "../endpoint";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";



const instance = axios.create({
  baseURL: API_BASE_URL,

  timeout: 60 * 1000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  // Important for HttpOnly cookies
  withCredentials: true,
});

// =====================================================
// Refresh request state
// =====================================================

// Prevent multiple refresh requests at the same time
let refreshPromise = null;

// =====================================================
// Refresh Access Token
// =====================================================

const refreshAccessToken = async () => {

  // If refresh is already running,
  // return the same promise.
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = axios
    .post(
      `${API_BASE_URL}${REFRESH_TOKEN_ENDPOINT}`,
      {},
      {
        withCredentials: true,

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
    .then((response) => {

      // Backend should set a new access-token
      // HttpOnly cookie here.

      return response?.data?.success === true;
    })
    .catch((error) => {

      console.error(
        "Refresh token failed:",
        error?.response?.data?.message ||
          error.message
      );

      return false;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};


// =====================================================
// Response Interceptor
// =====================================================

instance.interceptors.response.use(

  // Success
  (response) => {
    return response;
  },


  // Error
  async (error) => {

    const originalRequest =
      error.config;

    const status =
      error?.response?.status;


    // -----------------------------------------------
    // Don't refresh these endpoints
    // -----------------------------------------------

    const isAuthRequest =
      originalRequest?.url?.includes(
        LOGIN_ENDPOINT
      ) ||
      originalRequest?.url?.includes(
        SIGNUP_ENDPOINT
      ) ||
      originalRequest?.url?.includes(
        REFRESH_TOKEN_ENDPOINT
      ) ||
      originalRequest?.url?.includes(
        LOGOUT_ENDPOINT
      );


    // -----------------------------------------------
    // Handle 401
    // -----------------------------------------------

    if (
      status === 401 &&
      !originalRequest?._retry &&
      !isAuthRequest
    ) {

      originalRequest._retry = true;


      const refreshed =
        await refreshAccessToken();


      if (refreshed) {

        // Browser now has the new
        // access-token cookie.

        return instance.request(
          originalRequest
        );
      }


      // Refresh failed
      // Let AuthContext handle logout state.

      return Promise.reject(error);
    }


    return Promise.reject(error);
  }
);



export default instance;


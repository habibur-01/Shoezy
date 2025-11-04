import axios from "axios";
import { REFRESH_TOKEN_ENDPOINT } from "../endpoint";
// import { REFRESH_TOKEN_ENDPOINT } from "../config"; // adjust path

// ---------------------- Helper functions ----------------------
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function timeDelay(retryCount) {
  const base = 500; // 0.5s
  const multiplier = 1.5 ** (retryCount - 1);
  const retryInterval = base * multiplier;
  return retryInterval + randomInt(0, retryInterval); // add jitter
}

function wait(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

// ---------------------- Retry counter ----------------------
let _retry_count = 0;
export function resetRetry() {
  _retry_count = 0;
}

// ---------------------- Axios instance ----------------------
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 1000 * 60, // 1 min
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ---------------------- Request interceptor ----------------------
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------------------- Response interceptor ----------------------
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const origReq = error.config;

    // ---------------- Retry 5xx with exponential backoff ----------------
    if (error?.response?.status >= 500 && _retry_count < 10) {
      _retry_count++;
      await wait(timeDelay(_retry_count));
      return instance.request(origReq);
    }

    // ---------------- Handle 401 → refresh token ----------------
   
    if (error?.response?.status === 401 && origReq.headers?.Authorization) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken && _retry_count <= 5) {
          _retry_count++;
          delete origReq.headers.Authorization;
          const newToken = await refreshAccessToken(refreshToken);
          if (!newToken) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return Promise.reject(error);
          }
          origReq.headers.Authorization = `Bearer ${newToken}`;
          return instance.request(origReq);
        }
    }

    return Promise.reject(error);
  }
);

// ---------------------- Refresh token function ----------------------
async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}${REFRESH_TOKEN_ENDPOINT}`,
      { refresh_token: refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
          
        },
      }
    );
    const newToken = response?.data?.token;
    if (newToken) localStorage.setItem("authToken", newToken);
    return newToken || null;
  } catch (err) {
    console.log("🚀 Refresh token error:", err.message);
    return null;
  }
}

export default instance;

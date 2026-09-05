import api from "../../api/index";
import {
  LOGIN_ENDPOINT,
  SIGNUP_ENDPOINT,
  LOGOUT_ENDPOINT,
  GET_ME_ENDPOINT,
  FORGOT_PASSWORD_ENDPOINT,
  RESET_PASSWORD_ENDPOINT,
  VERIFY_EMAIL_ENDPOINT,
  RESEND_VERIFICATION_ENDPOINT,
  CHANGE_PASSWORD_ENDPOINT,
  UPDATE_PROFILE_ENDPOINT,
  UPDATE_AVATAR_ENDPOINT,
} from "../../endpoint";

// Login
export const userLogin = async (data) => {
  try {
    const result = await api.post(LOGIN_ENDPOINT, data);
    return result;
  } catch (error) {
    console.error("🚀 ~ login ~ error:", error);
    throw error;
  }
};

// Signup / Register
export const userSignup = async (data) => {
  try {
    const result = await api.post(SIGNUP_ENDPOINT, data);
    return result;
  } catch (error) {
    console.error("🚀 ~ signup ~ error:", error);
    throw error;
  }
};

// Logout
export const userLogout = async () => {
  try {
    const result = await api.post(LOGOUT_ENDPOINT);
    return result;
  } catch (error) {
    console.error("🚀 ~ logout ~ error:", error);
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const result = await api.get(GET_ME_ENDPOINT);
    return result;
  } catch (error) {
    console.error("🚀 ~ getCurrentUser ~ error:", error);
    throw error;
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const result = await api.post(FORGOT_PASSWORD_ENDPOINT, { email });
    return result;
  } catch (error) {
    console.error("🚀 ~ forgotPassword ~ error:", error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (token, password) => {
  try {
    const result = await api.post(RESET_PASSWORD_ENDPOINT, { token, password });
    return result;
  } catch (error) {
    console.error("🚀 ~ resetPassword ~ error:", error);
    throw error;
  }
};

// Verify email
export const verifyEmail = async (token) => {
  try {
    const result = await api.post(VERIFY_EMAIL_ENDPOINT, { token });
    return result;
  } catch (error) {
    console.error("🚀 ~ verifyEmail ~ error:", error);
    throw error;
  }
};

// Resend verification
export const resendVerification = async (email) => {
  try {
    const result = await api.post(RESEND_VERIFICATION_ENDPOINT, { email });
    return result;
  } catch (error) {
    console.error("🚀 ~ resendVerification ~ error:", error);
    throw error;
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const result = await api.patch(CHANGE_PASSWORD_ENDPOINT, {
      currentPassword,
      newPassword,
    });
    return result;
  } catch (error) {
    console.error("🚀 ~ changePassword ~ error:", error);
    throw error;
  }
};

// Update profile
export const updateProfile = async (data) => {
  try {
    const result = await api.patch(UPDATE_PROFILE_ENDPOINT, data);
    return result;
  } catch (error) {
    console.error("🚀 ~ updateProfile ~ error:", error);
    throw error;
  }
};

// Update avatar (Separate API)
export const updateAvatar = async (avatar) => {
  try {
    const result = await api.patch(UPDATE_AVATAR_ENDPOINT, { avatar });
    return result;
  } catch (error) {
    console.error("🚀 ~ updateAvatar ~ error:", error);
    throw error;
  }
};


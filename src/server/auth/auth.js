import api from "../../api/index";
import { LOGIN_ENDPOINT, SIGNUP_ENDPOINT } from "../../endpoint";

export const userLogin = async (data) => {
  try {
    const result = await api.post(LOGIN_ENDPOINT, data);

    if (result && result?.status === 200) {
      localStorage.setItem("authToken", result?.data.data.access_token);
      localStorage.setItem("refreshToken", result?.data.data.refresh_token);
      localStorage.setItem("user", JSON.stringify({
        user_id: result?.data?.data?.id,
        email: result?.data?.data?.email,
        username: result?.data?.data?.username,
      }));
    }
    return result;
  } catch (error) {
    console.log("🚀 ~ login ~ error:", error);
  }
};

export const userSignup = async (data) => {
  try {
    const result = await api.post(SIGNUP_ENDPOINT, data);
    return result;
  } catch (error) {
    console.log("🚀 ~ register ~ error:", error);
  }
};

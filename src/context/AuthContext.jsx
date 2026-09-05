import React, { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/index";
import {
  GET_ME_ENDPOINT,
  LOGIN_ENDPOINT,
  SIGNUP_ENDPOINT,
  LOGOUT_ENDPOINT,
} from "../endpoint";
import { setAuthLoading, clearAuth, setAuthUser } from "../redux/features/auth/authSlice";
import { syncGuestCartWithServer } from "../server/cart/cart";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  // Redux is the single source of truth
  const { user, isAuthenticated, isLoading, } = useSelector((state) => state.auth);

  // =========================
  // CHECK AUTH
  // =========================

  const checkAuthStatus = async () => {

    try {

      dispatch(
        setAuthLoading(true)
      );

      const response =
        await api.get(
          GET_ME_ENDPOINT
        );

      if (
        response?.data?.success &&
        response?.data?.data
      ) {

        const userData =
          response.data.data;

        dispatch(
          setAuthUser(userData)
        );

      } else {

        dispatch(clearAuth());

      }

    } catch (error) {

      console.log(
        "Session restore:",
        error.message
      );

      dispatch(clearAuth());

    } finally {

      dispatch(
        setAuthLoading(false)
      );

    }
  };


  // =========================
  // LOGIN
  // =========================

  const login = async (credentials) => {
    const response = await api.post(
      LOGIN_ENDPOINT,
      credentials
    );
  
    if (response?.data?.success) {
      const userData = response.data.data.user;

      dispatch(setAuthUser(userData));

      await syncGuestCartWithServer();
    }

    return response;
  };

  const signup = async (data) => {
    const response = await api.post(
      SIGNUP_ENDPOINT,
      data
    );

    // Registration successful,
    // but DON'T authenticate the user here.

    return response;
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = async () => {

    try {

      await api.post(
        LOGOUT_ENDPOINT
      );

    } finally {

      dispatch(clearAuth());

    }
  };

  // =========================
  // INITIAL AUTH CHECK
  // =========================

  useEffect(() => {

    checkAuthStatus();

  }, []);

  const refreshUser = async () => {
    await checkAuthStatus();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,

        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export default AuthContext;

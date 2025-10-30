import axios from "axios";
import { Formik } from "formik";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { userLogin } from "../../server/auth/auth";
import { useDispatch, useSelector } from "react-redux";
import { loggedIn } from "../../redux/features/auth/authSlice";

const loginSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Must be a valid email"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const from = location.state?.from?.pathname || "/";

  // handle login user
  const handleLogin = async (values, resetForm) => {
    try {
      setIsLoading(true);
      const result = await userLogin(values);
      console.log("🚀 ~ handleLogin ~ result:", result.data);
      if (result?.data.success) {
        dispatch(
          loggedIn({
            email: result?.data?.data?.email,
            username: result?.data?.data?.username,
          })
        );
        navigate(from, { replace: true });
        resetForm();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login to continue shopping
        </p>

        {/* Login Form */}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={(values, { resetForm }) => {
            handleLogin(values, resetForm);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  placeholder="Enter your email"
                  required
                />
                {errors.email && touched.email && errors.email}
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  placeholder="Enter your password"
                  required
                />
                {errors.password && touched.password && errors.password}
              </div>

              <div className="flex justify-between items-center mb-4">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-gray-600 text-sm">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-500 hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </button>
            </form>
          )}
        </Formik>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-400">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Login */}
        <button className="w-full border py-2 rounded-lg flex justify-center items-center space-x-2 hover:bg-gray-50 transition">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Login with Google</span>
        </button>

        {/* Sign Up Redirect */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

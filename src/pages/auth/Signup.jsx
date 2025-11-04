import { Formik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { userSignup } from "../../server/auth/auth";
import LoadingSpinner from "../../components/common/loader/Loader";

const signupSchema = Yup.object({
  username: Yup.string().required("Name is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Must be a valid email"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirm_pass: Yup.string()
    .required("Retype password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});
const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSignUp = async (values, resetForm) => {
    const data = {
      username: values.username,
      email: values.email,
      password: values.password,
    };

    try {
      const result = await userSignup(data);
      if (result.data?.success) {
        navigate("/login");
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
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Sign up to start shopping
        </p>

        <Formik
          initialValues={{ username: "", email: "", password: "" }}
          validationSchema={signupSchema}
          onSubmit={(values, { resetForm }) => {
            handleSignUp(values, resetForm);
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
            /* Sign Up Form */
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Full Name</label>
                <input
                  name="username"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  placeholder="Enter your name"
                  required
                />
                <p className="text-red-500">
                  {errors.username && touched.username && errors.username}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  placeholder="Enter your email"
                  required
                />
                <p className="text-red-500">
                  {errors.email && touched.email && errors.email}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Password</label>
                <input
                  name="password"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  placeholder="Create a password"
                  required
                />
                <p className="text-red-500">
                  {errors.password && touched.password && errors.password}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Confirm Password
                </label>
                <input
                  name="confirm_pass"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.confirm_pass}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  placeholder="Confirm your password"
                  required
                />
                <p className="text-red-500">
                  {errors.confirm_pass &&
                    touched.confirm_pass &&
                    errors.confirm_pass}
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:cursor-pointer hover:bg-green-700 transition"
              >
                {isLoading ? <LoadingSpinner /> : "Sign Up"}
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

        {/* Google Sign Up */}
        <button className="w-full border py-2 rounded-lg flex justify-center items-center space-x-2 hover:bg-gray-50 transition">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Sign Up with Google</span>
        </button>

        {/* Login Redirect */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

import React, { useState } from "react";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdPersonAddAlt } from "react-icons/md";
import PasswordStrengthMeter from "../../components/common/auth/PasswordStrengthMeter";
import { useAuth } from "../../hooks/useAuth";

const signupSchema = Yup.object({
  firstName: Yup.string().trim().required("First name is required"),
  lastName: Yup.string().trim().required("Last name is required"),
  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email address"),
  phone: Yup.string().trim(),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  agreeTerms: Yup.boolean().oneOf([true], "You must accept the Terms and Conditions"),
});

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (values, resetForm) => {
    const data = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone ? values.phone.trim() : "",
      password: values.password,
    };

    try {
      setIsLoading(true);
      setServerError("");
      const result = await signup(data);

      if (result?.data?.success) {
        toast.success("Account created! We've sent a verification link to your email inbox.");
        resetForm();
        navigate("/login");
      } else {
        const msg = result?.data?.message || "Failed to create account";
        setServerError(msg);
        toast.error(msg);
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Registration failed. Please try again.";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl w-full p-8 sm:p-10 border border-red-500 transition-all duration-300">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[var(--color-red,#db4444)] flex items-center justify-center text-2xl shadow-inner">
            <MdPersonAddAlt />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 tracking-tight">
          Create an Account
        </h2>
        <p className="text-center text-sm text-gray-500 mt-1 mb-8">
          Enter your details below to get started with Exclusive
        </p>

        {serverError && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
            <span>⚠️</span>
            <span>{serverError}</span>
          </div>
        )}

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            agreeTerms: true,
          }}
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.firstName}
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.firstName && touched.firstName
                        ? "border-red-400 focus:ring-red-200 bg-red-50/20"
                        : "border-gray-300 focus:ring-red-100 focus:border-[var(--color-red,#db4444)]"
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && touched.firstName && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.lastName}
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.lastName && touched.lastName
                        ? "border-red-400 focus:ring-red-200 bg-red-50/20"
                        : "border-gray-300 focus:ring-red-100 focus:border-[var(--color-red,#db4444)]"
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && touched.lastName && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.email && touched.email
                        ? "border-red-400 focus:ring-red-200 bg-red-50/20"
                        : "border-gray-300 focus:ring-red-100 focus:border-[var(--color-red,#db4444)]"
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[var(--color-red,#db4444)]"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    className={`w-full px-3.5 py-2.5 pr-11 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.password && touched.password
                        ? "border-red-400 focus:ring-red-200 bg-red-50/20"
                        : "border-gray-300 focus:ring-red-100 focus:border-[var(--color-red,#db4444)]"
                    }`}
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-base" />
                    ) : (
                      <FaEye className="text-base" />
                    )}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.password}
                  </p>
                )}

                {/* Password Strength Indicator */}
                <PasswordStrengthMeter password={values.password} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.confirmPassword}
                    className={`w-full px-3.5 py-2.5 pr-11 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-400 focus:ring-red-200 bg-red-50/20"
                        : "border-gray-300 focus:ring-red-100 focus:border-[var(--color-red,#db4444)]"
                    }`}
                    placeholder="Repeat your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-base" />
                    ) : (
                      <FaEye className="text-base" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="pt-1">
                <label className="flex items-start space-x-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={values.agreeTerms}
                    onChange={handleChange}
                    className="w-4 h-4 mt-0.5 text-[var(--color-red,#db4444)] rounded border-gray-300 focus:ring-[var(--color-red,#db4444)]"
                  />
                  <span>
                    I agree to the{" "}
                    <a href="#" className="text-[var(--color-red,#db4444)] hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[var(--color-red,#db4444)] hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.agreeTerms && touched.agreeTerms && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.agreeTerms}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[var(--color-red,#db4444)] hover:bg-[#c93a3a] text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}
        </Formik>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-200" />
          <span className="px-3 text-xs uppercase tracking-wider text-gray-400 font-medium">
            OR
          </span>
          <hr className="flex-grow border-gray-200" />
        </div>

        <button
          type="button"
          onClick={() => toast.info("Google OAuth is configured for production.")}
          className="w-full border border-gray-300 py-2.5 rounded-lg flex justify-center items-center space-x-3 hover:bg-gray-50 transition duration-150 text-sm font-medium text-gray-700 cursor-pointer"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-4 h-4"
          />
          <span>Sign up with Google</span>
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[var(--color-red,#db4444)] font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;


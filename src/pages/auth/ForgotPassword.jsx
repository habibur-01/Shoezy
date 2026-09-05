import React, { useState } from "react";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { forgotPassword } from "../../server/auth/auth";
import { toast } from "react-toastify";
import { MdLockReset, MdArrowBack, MdCheckCircleOutline } from "react-icons/md";

const forgotSchema = Yup.object({
  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email address"),
});

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      setServerError("");
      const result = await forgotPassword(values.email);

      if (result?.data?.success) {
        setSubmittedEmail(values.email);
        const token = result.data?.data?.resetToken || result.data?.resetToken || "";
        if (token) {
          setResetToken(token);
        }
        toast.success("Password reset instructions generated!");
      } else {
        const msg = result?.data?.message || "Failed to process request";
        setServerError(msg);
        toast.error(msg);
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred. Please try again.";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 sm:p-10 border border-gray-100 transition-all duration-300">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[var(--color-red,#db4444)] flex items-center justify-center text-2xl shadow-inner">
            <MdLockReset />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 tracking-tight">
          Forgot Password?
        </h2>
        <p className="text-center text-sm text-gray-500 mt-1 mb-8">
          No worries, we’ll send you instructions to reset your password.
        </p>

        {submittedEmail ? (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
              <div className="flex items-start gap-3">
                <MdCheckCircleOutline className="text-xl text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900">
                    Instructions Sent!
                  </p>
                  <p className="mt-1 text-emerald-700">
                    If an account exists for{" "}
                    <span className="font-semibold">{submittedEmail}</span>,
                    a password reset link has been dispatched.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-700 hover:text-black py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
              >
                <MdArrowBack />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {serverError && (
              <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>{serverError}</span>
              </div>
            )}

            <Formik
              initialValues={{ email: "" }}
              validationSchema={forgotSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.email && touched.email
                          ? "border-red-400 focus:ring-red-200 bg-red-50/20"
                          : "border-gray-300 focus:ring-red-100 focus:border-[var(--color-red,#db4444)]"
                      }`}
                      placeholder="Enter your registered email"
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-500 text-xs mt-1 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[var(--color-red,#db4444)] hover:bg-[#c93a3a] text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending Instructions...</span>
                      </>
                    ) : (
                      "Send Reset Instructions"
                    )}
                  </button>

                  <div className="pt-2">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 py-2 transition"
                    >
                      <MdArrowBack />
                      <span>Back to Login</span>
                    </Link>
                  </div>
                </form>
              )}
            </Formik>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

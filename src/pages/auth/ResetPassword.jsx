import React, { useState } from "react";
import { Formik } from "formik";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { resetPassword } from "../../server/auth/auth";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdKey, MdCheckCircleOutline } from "react-icons/md";
import PasswordStrengthMeter from "../../components/common/auth/PasswordStrengthMeter";

const resetSchema = Yup.object({
  token: Yup.string().trim().required("Reset token is required"),
  password: Yup.string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const initialToken = searchParams.get("token") || "";
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleReset = async (values) => {
    try {
      setIsLoading(true);
      setServerError("");
      const result = await resetPassword(values.token, values.password);

      if (result?.data?.success) {
        setIsSuccess(true);
        toast.success("Password reset successfully!");
      } else {
        const msg = result?.data?.message || "Failed to reset password";
        setServerError(msg);
        toast.error(msg);
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Token invalid or expired. Please request a new link.";
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
            <MdKey />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 tracking-tight">
          Reset Password
        </h2>
        <p className="text-center text-sm text-gray-500 mt-1 mb-8">
          Enter your new password below to secure your account.
        </p>

        {isSuccess ? (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto">
              <MdCheckCircleOutline />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Password Reset Successful!
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Your password has been changed. You can now log in with your new credentials.
              </p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[var(--color-red,#db4444)] hover:bg-[#c93a3a] text-white font-medium py-3 rounded-lg transition shadow-md cursor-pointer"
            >
              Go to Login
            </button>
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
              initialValues={{
                token: initialToken,
                password: "",
                confirmPassword: "",
              }}
              validationSchema={resetSchema}
              enableReinitialize
              onSubmit={handleReset}
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
                  <div className="hidden">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Reset Token
                    </label>
                    <input
                      type="text"
                      name="token"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.token}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm font-mono transition-all focus:outline-none focus:ring-2 ${
                        errors.token && touched.token
                          ? "border-red-400 focus:ring-red-200 bg-red-50/20"
                          : "border-gray-300 focus:ring-red-100 focus:border-[var(--color-red,#db4444)]"
                      }`}
                      placeholder="Paste your reset token"
                    />
                    {errors.token && touched.token && (
                      <p className="text-red-500 text-xs mt-1 font-medium">
                        {errors.token}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        autoComplete="new-password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
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

                    <PasswordStrengthMeter password={values.password} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        autoComplete="new-password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.confirmPassword}
                        className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.confirmPassword && touched.confirmPassword
                            ? "border-red-400 focus:ring-red-200 bg-red-50/20"
                            : "border-gray-300 focus:ring-red-100 focus:border-[var(--color-red,#db4444)]"
                        }`}
                        placeholder="Repeat new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
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

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[var(--color-red,#db4444)] hover:bg-[#c93a3a] text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>

                  <p className="text-center text-sm text-gray-600 pt-2">
                    Remember your password?{" "}
                    <Link
                      to="/login"
                      className="text-[var(--color-red,#db4444)] font-semibold hover:underline"
                    >
                      Log in
                    </Link>
                  </p>
                </form>
              )}
            </Formik>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

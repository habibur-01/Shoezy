import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Field, Form, Formik } from 'formik';
import * as Yup from "yup";
import { resendVerification } from '../../../server/auth/auth';
import { toast } from 'react-toastify';

const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const LoginForm = ({
  onSuccess,
  onSwitchToSignup,
  onSwitchToForgot,

}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  const handleKeyEnter = () => {

  };

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      setUnverifiedEmail('');
      await onSuccess(values);
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      if (
        error?.response?.data?.emailVerified === false ||
        error?.response?.status === 403 ||
        error?.response?.data?.message?.toLowerCase().includes("verify")
      ) {
        const targetEmail = error?.response?.data?.email || values.email;
        setUnverifiedEmail(targetEmail);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendLink = async () => {
    if (!unverifiedEmail) return;
    try {
      setIsResending(true);
      const res = await resendVerification(unverifiedEmail);
      if (res?.data?.success) {
        toast.success("Verification link sent! Please check your email inbox.");
      } else {
        toast.error(res?.data?.message || "Failed to resend verification email");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error resending verification link");
    } finally {
      setIsResending(false);
    }
  };



  const handleSocialAuth = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        name: provider === 'Apple' ? 'Elena Rostova' : 'Julian Vance',
        email: provider === 'Apple' ? 'elena.rostova@icloud.com' : 'julian.vance@gmail.com',
        tier: 'Gold VIP',
        joinedDate: 'Member since 2025',
        ordersCount: 8,
        loyaltyPoints: 1240,
        savedBagCount: 2,
      });
    }, 700);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-7">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-semibold">
          Client Portal
        </span>
        <h1 className="font-serif-editorial text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight">
          Welcome Back
        </h1>
        <p className="text-sm text-stone-600 font-light">
          Sign in to access your private bag, order archive, and tailored concierge.
        </p>
      </div>



      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSocialAuth('Apple')}
          id="login-apple-btn"
          className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-lg text-xs font-medium tracking-wide transition-all shadow-xs active:scale-[0.99] cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.66-7.85-11.9-14.44-6-9.37-10.7-20.2-14.08-32.48-3.38-12.28-5.07-23.75-5.07-34.42 0-14.37 3.73-26.24 11.2-35.61 7.46-9.37 16.7-14.16 27.72-14.37 4.12 0 9.09 1.13 14.9 3.39 5.82 2.26 9.87 3.44 12.16 3.55 1.83 0 5.87-1.25 12.12-3.75 6.24-2.5 11.45-3.65 15.63-3.44 11.75.76 21.08 4.96 28 12.61-10.42 6.31-15.53 15.11-15.33 26.4.22 8.91 3.65 16.34 10.3 22.3 6.64 5.96 14.49 9.38 23.54 10.27-2.39 7.39-5.46 14.88-9.22 22.47zM119.22 33.64c0-7.39 2.65-14.17 7.95-20.35 5.3-6.17 11.77-9.98 19.4-11.43.54 7.61-1.92 14.73-7.39 21.36-5.47 6.63-12.1 10.68-19.89 12.16-.07-.58-.07-1.16-.07-1.74z" />
          </svg>
          <span>Apple Sign-in</span>
        </button>

        <button
          type="button"
          onClick={() => handleSocialAuth('Google')}
          id="login-google-btn"
          className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300/80 rounded-lg text-xs font-medium tracking-wide transition-all shadow-xs active:scale-[0.99] cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Google</span>
        </button>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-stone-200 w-full" />
        <span className="bg-[#fcfbf9] px-3 text-[11px] whitespace-nowrap uppercase tracking-widest text-stone-400 font-medium">
          or with email
        </span>
        <div className="border-t border-stone-200 w-full" />
      </div>

      {/* Form */}
      <Formik initialValues={{ email: '', password: '', rememberMe: false }} validationSchema={loginSchema} onSubmit={(values) => { handleSubmit(values); }}>
        {({ errors, touched, values }) => (

          <Form className="space-y-4" noValidate>
            {/* Unverified Email Warning Card */}
            {unverifiedEmail && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-3 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-amber-900">Email Verification Required</p>
                    <p className="text-amber-800 text-[11px] leading-relaxed">
                      Your email address (<strong>{unverifiedEmail}</strong>) is not verified yet.

                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResendLink}
                  disabled={isResending}
                  className="max-w-max py-2.5 px-3 bg-amber-900 hover:bg-stone-900 text-white rounded-lg text-xs font-medium tracking-wide transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-xs"
                >
                  {isResending ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-amber-200 border-t-white rounded-full animate-spin" />
                      <span>Sending Link...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5" />
                      <span>Resend Link</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <Field
                  id="login-email"
                  type="email"
                  name="email"
                  value={values.email}
                  placeholder="name@atelier.com"
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.email ? 'border-red-400 ring-1 ring-red-400/40' : 'border-stone-300/80 focus:border-stone-900 focus:ring-1 focus:ring-stone-900'
                    } rounded-lg text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all`}
                />
              </div>
              {errors.email && touched.email && (
                <p className="text-xs text-red-600 flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={onSwitchToForgot}
                  id="forgot-password-link"
                  className="text-xs text-stone-500 hover:text-stone-900 transition-colors font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <Field
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={values.password}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-11 py-2.5 bg-white border ${errors.password ? 'border-red-400 ring-1 ring-red-400/40' : 'border-stone-300/80 focus:border-stone-900 focus:ring-1 focus:ring-stone-900'
                    } rounded-lg text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  id="toggle-password-visibility-btn"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-600 flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Remember Me & Passwordless toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs text-stone-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  id="remember-me-checkbox"
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-stone-900 border-stone-900 text-white' : 'bg-white border-stone-300'
                    }`}
                >
                  {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>Keep me signed in</span>
              </label>

              {/* <button
                type="button"
                onClick={onSwitchToMagicLink}
                id="magic-link-btn"
                className="text-xs text-stone-500 hover:text-stone-900 underline underline-offset-4 decoration-stone-300 font-medium cursor-pointer"
              >
                Sign in with email link
              </button> */}
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-5 bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-stone-50 rounded-lg text-sm font-semibold tracking-wide flex items-center justify-center space-x-2 transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-stone-300 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </Form>
        )}
      </Formik>

      {/* Footer Switcher */}
      <div className="pt-2 text-center border-t border-stone-200/80">
        <p className="text-xs text-stone-600">
          New to Noir Atelier?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            id="switch-to-signup-btn"
            className="text-stone-900 font-semibold underline underline-offset-4 decoration-stone-400 hover:decoration-stone-900 cursor-pointer ml-1"
          >
            Create an Account
          </button>
        </p>
      </div>
    </div>
  );
};

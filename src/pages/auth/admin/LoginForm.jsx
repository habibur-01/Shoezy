import React, { useState } from "react";
import { Field, ErrorMessage, useFormikContext, Formik, Form } from "formik";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  X,
  Shield,
} from "lucide-react";

export const LoginForm = ({ error, onSubmit, onForgotPassword, onSSOLogin, isLoading, schema }) => {
  const [showPassword, setShowPassword] = useState(false);


  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        rememberMe: false,
      }}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting, values, setFieldValue }) => (
        <Form className="space-y-4 ">
          {/* Error alert */}
          {error && (
            <div
              id="login-error-alert"
              className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in duration-150"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="input-work-email"
              className="block text-xs font-semibold text-zinc-700 mb-1.5 uppercase tracking-wider"
            >
               Email address
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Mail className="w-4 h-4" />
              </div>

              <Field
                id="input-work-email"
                name="email"
                type="email"
                placeholder="alex.vance@commercehq.io"
                className={`w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300/80 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all ${
                  errors.email && touched.email
                    ? "border-rose-500"
                    : "border-zinc-300"
                }`}
              />

              {values.email && (
                <button
                  type="button"
                  onClick={() => setFieldValue("email", "")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  title="Clear email"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {errors.email && touched.email && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="input-work-password"
                className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider"
              >
                Password
              </label>

              <button
                type="button"
                onClick={onForgotPassword}
                id="btn-forgot-password-link"
                className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Lock className="w-4 h-4" />
              </div>

              <Field
                id="input-work-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className={`w-full pl-10 pr-10 py-2.5 text-sm bg-zinc-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all placeholder:text-zinc-400 ${
                  errors.password && touched.password
                    ? "border-rose-500"
                    : "border-zinc-300"
                }`}
              />

              <button
                type="button"
                id="btn-toggle-password-visibility"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {errors.password && touched.password && (
              <p className="text-[11px] text-rose-600 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Field
                type="checkbox"
                id="checkbox-remember-me"
                name="rememberMe"
                className="w-4 h-4 text-indigo-600 rounded border-zinc-300 focus:ring-indigo-500 cursor-pointer"
              />

              <span className="text-xs text-zinc-600">
                Remember this workstation for 30 days
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            id="btn-submit-login"
            className="w-full mt-2 py-3 px-5 bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-stone-50 rounded-lg text-sm font-semibold tracking-wide flex items-center justify-center space-x-2 transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-70 cursor-pointer flex justify-center items-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying ...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span>Sign In to Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>

          {/* Enterprise SSO */}
          <div className="pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-200"></div>

              <span className="flex-shrink mx-3 text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
                Or authenticate with
              </span>

              <div className="flex-grow border-t border-zinc-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                type="button"
                id="btn-sso-google"
                onClick={() => onSSOLogin("Google Workspace")}
                className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-lg text-xs font-medium tracking-wide transition-all shadow-xs active:scale-[0.99] cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.02h3.87c2.26-2.09 3.675-5.17 3.675-9.12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.02c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.24v3.12C3.26 21.36 7.35 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.61H1.24C.45 8.18 0 9.99 0 12s.45 3.82 1.24 5.39l4.03-3.12z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.24 6.61l4.03 3.12c.95-2.85 3.6-4.98 6.73-4.98z"
                  />
                </svg>

                <span>Google SSO</span>
              </button>

              <button
                type="button"
                id="btn-sso-okta"
                onClick={() => onSSOLogin("Okta SAML")}
                className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-medium text-zinc-700 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl transition-colors cursor-pointer"
              >
                <Shield className="w-4 h-4 text-indigo-600" />
                <span>Okta SAML</span>
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

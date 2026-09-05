import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { forgotPassword } from '../../../server/auth/auth';
import { toast } from 'react-toastify';

export const ForgotPasswordModal = ({
  onBackToLogin,
  onSendResetToast,
}) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resetToken, setResetToken] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const targetEmail = email.trim().toLowerCase();
    if (
      !targetEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)
    ) {
      setError('Please provide a valid email address');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result = await forgotPassword(targetEmail);
      if (result?.data?.success) {
        setIsSent(true);
        const token = result.data?.data?.resetToken || result.data?.resetToken || '';
        if (token) {
          setResetToken(token);
        }
        if (onSendResetToast) {
          onSendResetToast(targetEmail);
        } else {
          toast.success(`Password reset instructions sent to ${targetEmail}`);
        }

        setResendCountdown(60);
        const timer = setInterval(() => {
          setResendCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        const msg = result?.data?.message || 'Failed to send password reset email.';
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'An error occurred while sending reset link. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">

      {/* Back to Login */}
      <button
        onClick={onBackToLogin}
        id="back-to-login-btn"
        className="inline-flex items-center space-x-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors font-medium cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to sign in</span>
      </button>

      {/* Header */}
      <div className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-semibold">
          Security & Access
        </span>

        <h1 className="font-serif-editorial text-3xl text-stone-900 font-normal tracking-tight">
          Reset Password
        </h1>

        <p className="text-sm text-stone-600 font-light">
          Enter your registered email and we'll dispatch a secure
          authorization link to restore your password.
        </p>
      </div>

      {/* Success State */}
      {isSent ? (
        <div className="p-6 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-4">

          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-stone-900">
              Reset Link Dispatched
            </h3>

            <p className="text-xs text-stone-600">
              Instructions have been sent to{' '}
              <strong className="text-stone-900">
                {email}
              </strong>
              . Please check your inbox and spam folder.
            </p>
          </div>

          <div className="pt-2 flex flex-col items-center space-y-2">

            {/* Back to Sign In */}
            <button
              onClick={onBackToLogin}
              className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer"
            >
              Back to Sign In
            </button>

            {/* Resend */}
            <button
              disabled={resendCountdown > 0 || isLoading}
              onClick={handleSubmit}
              className="text-xs text-stone-500 hover:text-stone-900 disabled:opacity-50 inline-flex items-center space-x-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />

              <span>
                {resendCountdown > 0
                  ? `Resend available in ${resendCountdown}s`
                  : 'Resend verification link'}
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* Form */
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-1">

            <label
              htmlFor="reset-email"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-700"
            >
              Registered Email
            </label>

            <div className="relative">

              {/* Email Icon */}
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>

              {/* Email Input */}
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  if (error) {
                    setError(null);
                  }
                }}
                placeholder="name@atelier.com"
                autoComplete="email"
                className={`w-full pl-10 pr-4 py-2.5 bg-white border ${
                  error
                    ? 'border-red-400 ring-1 ring-red-400/40'
                    : 'border-stone-300/80 focus:border-stone-900 focus:ring-1 focus:ring-stone-900'
                } rounded-lg text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all`}
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-600 flex items-center space-x-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            id="send-reset-btn"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-5 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-lg text-sm font-semibold tracking-wide flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-[0.99] disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-stone-300 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Send Recovery Link</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
};



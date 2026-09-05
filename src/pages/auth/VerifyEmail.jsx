import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail, resendVerification } from "../../server/auth/auth";
import { toast } from "react-toastify";
import { MdMarkEmailRead, MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState(token ? "verifying" : "idle"); // idle | verifying | success | error
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (token) {
      handleVerification(token);
    }
  }, [token]);

  useEffect(() => {
    let timer;
    if (status === "success" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (status === "success" && countdown === 0) {
      navigate("/login");
    }
    return () => clearInterval(timer);
  }, [status, countdown, navigate]);

  const handleVerification = async (verifyToken) => {
    try {
      setStatus("verifying");
      const result = await verifyEmail(verifyToken);
      if (result?.data?.success) {
        setStatus("success");
        setMessage("Your email has been successfully verified! Redirecting to login page...");
        toast.success("Email verified!");
      } else {
        setStatus("error");
        setMessage(result?.data?.message || "Verification link is invalid or expired.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error?.response?.data?.message || "Failed to verify email. Token may be expired.");
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setIsResending(true);
      const result = await resendVerification(resendEmail);
      if (result?.data?.success) {
        toast.success("Verification link sent to your email!");
      } else {
        toast.error(result?.data?.message || "Failed to resend verification email");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error resending verification");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 sm:p-10 border border-gray-100 text-center transition-all duration-300">
        {status === "verifying" && (
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-[var(--color-red,#db4444)] border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-gray-900">Verifying Email...</h2>
            <p className="text-sm text-gray-500">
              Please wait while we verify your email address.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-5">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto">
              <MdCheckCircleOutline />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>
            <p className="text-sm text-gray-600">{message}</p>
            <Link
              to="/login"
              className="inline-block w-full bg-[var(--color-red,#db4444)] hover:bg-[#c93a3a] text-white font-medium py-3 rounded-lg transition shadow-md"
            >
              Continue to Login ({countdown}s)
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto">
              <MdErrorOutline />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              {message}
            </p>

            <form onSubmit={handleResend} className="pt-2 text-left space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Resend Verification Link
              </label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[var(--color-red,#db4444)]"
                required
              />
              <button
                type="submit"
                disabled={isResending}
                className="w-full bg-gray-900 hover:bg-black text-white font-medium py-2.5 rounded-lg text-sm transition cursor-pointer"
              >
                {isResending ? "Sending..." : "Resend Verification Link"}
              </button>
            </form>

            <div className="pt-2">
              <Link to="/login" className="text-sm text-[var(--color-red,#db4444)] hover:underline font-medium">
                Back to Login
              </Link>
            </div>
          </div>
        )}

        {status === "idle" && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto">
              <MdMarkEmailRead />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Email Verification</h2>
            <p className="text-sm text-gray-500">
              Check your inbox for a verification link, or request a new one below:
            </p>

            <form onSubmit={handleResend} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[var(--color-red,#db4444)]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isResending}
                className="w-full bg-[var(--color-red,#db4444)] hover:bg-[#c93a3a] text-white font-medium py-3 rounded-lg transition shadow-md cursor-pointer"
              >
                {isResending ? "Sending Link..." : "Send Verification Link"}
              </button>
            </form>

            <Link to="/login" className="inline-block text-sm text-gray-600 hover:underline">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  ShieldCheck,
  Sparkles,
  Radio,
} from "lucide-react";
import { toast } from "react-toastify";
import { setAuthUser } from "../../../redux/features/auth/authSlice";
import api from "../../../api/index";
import { ADMIN_LOGIN_ENDPOINT } from "../../../endpoint";
import * as Yup from "yup";
import { LoginBrandPanel } from "./LoginBrandPanel";
import { LoginForm } from "./LoginForm";

const AdminLoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Administrative email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Access key / password is required"),
});

export const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const from = location.state?.from?.pathname || "/admin/dashboard";

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await api.post(ADMIN_LOGIN_ENDPOINT, {
        email: values.email.trim().toLowerCase(),
        password: values.password,
        rememberMe: Boolean(values.rememberMe),
      });

      if (response?.data?.success && response?.data?.data?.user) {
        const loggedUser = response.data.data.user;

        // Update Redux authentication state (tokens are securely kept in HttpOnly cookies)
        dispatch(setAuthUser(loggedUser));

        toast.success(
          `Access Authorized. Welcome back, ${
            loggedUser.firstName || "Administrator"
          }!`,
        );

        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Admin authentication error:", err);

      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Authentication failed. Please verify administrative credentials.";

      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-zinc-100 font-['Poppins',sans-serif] text-zinc-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Left Brand Showcase (Desktop only) */}
      <LoginBrandPanel />

      {/* Right Authentication Area */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto">
        {/* Top Status & Security Bar */}
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-zinc-200/80">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold">
              <Sparkles className="w-4 h-4 text-indigo-200" />
            </div>
            <span className="font-bold text-zinc-900 text-sm">CommerceHQ</span>
          </div>

          <div className="flex items-center gap-3 ml-auto text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Admin Portal Active
            </span>
            <span className="hidden sm:inline-flex text-zinc-400 font-mono text-[11px]">
              TLS 1.3 / AES-256
            </span>
          </div>
        </div>

        {/* Center Card */}
        <div className="w-full max-w-md mx-auto my-auto py-8 ">
          <div className="bg-white/80 backdrop-blur-xs border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8 py-4">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-medium mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                Administrative Access Only
              </div>
              <div className="space-y-2">
                <h2 className="font-serif-editorial text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight capitalize">
                  {/* Sign in to your console */}
                  Welcome Back
                </h2>
                <p className="mt-1 text-sm text-stone-600 font-light">
                  Sign in with your staff account. Your assigned permissions control which sections you can access.
                </p>
              </div>
            </div>


            {/* Tab 1: Standard Credential Form */}

            <LoginForm
              schema={AdminLoginSchema}
              onSubmit={handleLogin}
              // onForgotPassword={() => setIsForgotPasswordOpen(true)}
            />
          </div>

          <div className="mt-6 text-center text-xs text-zinc-400">
            Protected by Cloud Armor enterprise DDoS and rate limiting.
            Authorized personnel only.
          </div>
        </div>

        {/* Bottom Legal / Help footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-zinc-200/80 text-[11px] text-zinc-500">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
            <span>CommerceHQ Infrastructure: Active</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="mailto:support@shoezy.com" className="hover:text-zinc-900 transition-colors">
              Need assistance?
            </a>
            <span>•</span>
            <span className="text-zinc-400">Security Audit Logs Enabled</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminLogin;

import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  KeyRound,
  Store,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import { setAuthUser } from "../../redux/features/auth/authSlice";
import api from "../../api/index";
import { ADMIN_LOGIN_ENDPOINT } from "../../endpoint";
import { Form, Formik } from "formik";
import * as Yup from "yup";


const AdminLoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});


const DEMO_CREDENTIALS = [
  {
    roleName: "Super Admin",
    email: "admin@shoezy.com",
    password: "admin123",
    roleId: "super_admin",
    userName: "Aiden Vance",
    badge: "Enterprise RBAC",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    roleName: "Store Manager",
    email: "manager@shoezy.com",
    password: "manager123",
    roleId: "store_manager",
    userName: "Sarah Connor",
    badge: "Catalog & Orders",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  {
    roleName: "Inventory Lead",
    email: "inventory@shoezy.com",
    password: "inventory123",
    roleId: "inventory_lead",
    userName: "Marcus Sterling",
    badge: "Stock & Taxonomy",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
];

export const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("admin@shoezy.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);

  const from = location.state?.from?.pathname || "/admin/dashboard";

  const handleSelectDemo = (preset, index) => {
    setEmail(preset.email);
    setPassword(preset.password);
    setSelectedDemoIndex(index);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please provide both administrative email and password");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Call dedicated Admin Login endpoint
      const response = await api.post(ADMIN_LOGIN_ENDPOINT, {
        email: email.trim().toLowerCase(),
        password,
        rememberMe: Boolean(rememberMe),
      });

      if (response?.data?.success && response?.data?.data?.user) {
        const loggedUser = response.data.data.user;
        const accessToken = response.data.data.access_token;

        // Set real tokens & Redux state
        localStorage.setItem(
          "shoezy_admin_token",
          accessToken || `adm_tok_${Date.now()}`,
        );
        localStorage.setItem("shoezy_admin_role", loggedUser.role || "admin");
        dispatch(setAuthUser(loggedUser));

        toast.success(
          `Access Authorized. Welcome back, ${loggedUser.firstName || "Administrator"}!`,
        );
        navigate(from, { replace: true });
        return;
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
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-violet-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 w-full px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-white">
                Shoezy
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                HQ Ops
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Enterprise Administration Portal
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-all"
        >
          <Store className="w-3.5 h-3.5 text-indigo-400" />
          <span>Public Storefront</span>
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/80">
          {/* Card Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Restricted Operations Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Administrative Sign In
            </h1>
            <p className="text-xs text-zinc-400 mt-1.5">
              Authenticate your identity to manage products, fulfillment,
              taxonomy, and RBAC policies.
            </p>
          </div>

          {/* Quick Demo Credentials Pill Selector */}
          <div className="mb-6 p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/90">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                1-Click Demo Profiles
              </span>
              <span className="text-[10px] text-zinc-500">
                Instant test fill
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {DEMO_CREDENTIALS.map((preset, idx) => {
                const isSelected = selectedDemoIndex === idx;
                return (
                  <button
                    key={preset.roleId}
                    type="button"
                    id={`btn-demo-${preset.roleId}`}
                    onClick={() => handleSelectDemo(preset, idx)}
                    className={`text-left p-2 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600/15 border-indigo-500/60 shadow-xs"
                        : "bg-zinc-900 border-zinc-800/80 hover:border-zinc-700"
                    }`}
                  >
                    <div className="text-[11px] font-bold text-zinc-200 truncate">
                      {preset.roleName}
                    </div>
                    <div className="text-[9px] text-zinc-400 truncate mt-0.5">
                      {preset.userName}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <Formik
  initialValues={{
    email: "",
    password: "",
    rememberMe: false,
  }}
  validationSchema={AdminLoginSchema}
  onSubmit={handleLogin}
>
  {({
    errors,
    touched,
    isSubmitting,
    values,
    handleChange,
    handleBlur,
  }) => (
    <Form className="space-y-4">
      {/* Email Field */}
      <div>
        <label
          htmlFor="admin-login-email"
          className="block text-xs font-semibold text-zinc-300 mb-1.5"
        >
          Administrative Email
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
            <Mail className="w-4 h-4" />
          </div>

          <input
            id="admin-login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="admin@shoezy.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full pl-10 pr-4 py-2.5 bg-zinc-950 border rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition-all font-mono text-xs ${
              touched.email && errors.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
          />
        </div>

        {touched.email && errors.email && (
          <p className="mt-1 text-[11px] text-red-400">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="admin-login-password"
            className="text-xs font-semibold text-zinc-300"
          >
            Access Key / Password
          </label>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
            <Lock className="w-4 h-4" />
          </div>

          <input
            id="admin-login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full pl-10 pr-10 py-2.5 bg-zinc-950 border rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition-all font-mono text-xs ${
              touched.password && errors.password
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {touched.password && errors.password && (
          <p className="mt-1 text-[11px] text-red-400">
            {errors.password}
          </p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            checked={values.rememberMe}
            onChange={handleChange}
            className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900 cursor-pointer"
          />

          <span className="text-xs text-zinc-400">
            Remember this terminal session
          </span>
        </label>

        <span className="text-[11px] text-indigo-400 font-mono flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          TLS Encrypted
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        id="btn-admin-submit-login"
        disabled={isSubmitting}
        className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Authenticating...</span>
          </>
        ) : (
          <>
            <span>Sign In to Operations Console</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </Form>
  )}
</Formik>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-5 text-center text-xs text-zinc-500 border-t border-zinc-900">
        <p>
          Shoezy E-Commerce Operations Hub &copy; {new Date().getFullYear()}{" "}
          &bull; All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

export default AdminLogin;

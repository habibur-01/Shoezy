import React, { useState } from "react";
import { Formik } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { userLogin } from "../../server/auth/auth";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { EditorialShowcase } from "../../components/common/auth/EditorialShowcase";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react"
import { LoginForm } from "../../components/common/auth/LoginForm";
import { MagicLinkForm } from "../../components/common/auth/MagicLinkForm";
import { Sparkles, ShoppingBag } from "lucide-react";
import { ForgotPasswordModal } from "../../components/common/auth/ForgotPasswordModal";
import { SignupForm } from "../../components/common/auth/SignupForm";
import BagDrawer from "../../components/common/auth/BagDrawer";
import { useQuery } from "@tanstack/react-query";
import { getCartItem } from "../../server/cart/cart";
import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const { login, signup } = useAuth();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [currentMode, setCurrentMode] = useState('login');

  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await getCartItem(isAuthenticated);
      return res?.data?.data;
    },
  });

  const cartCount = cartData?.items?.length || 0;




  const handleLogin = async (values, resetForm) => {
    try {
      setIsLoading(true);
      const loginPayload = {
        email: values.email.trim().toLowerCase(),
        password: values.password,
      };
      const result = await login(loginPayload);

      if (result?.data?.success) {
        toast.success("Welcome back! Login successful.");
        if (resetForm) resetForm();
        navigate(from, { replace: true });
      } else {
        const message = result?.data?.message || "Invalid email or password";
        toast.error(message);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please check your credentials.";

      toast.error(message);

    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (values) => {
    try {
      setIsLoading(true);
      const firstName = (values.firstName || (values.fullName || "").trim().split(" ")[0] || "").trim();
      const lastName = (values.lastName || (values.fullName || "").trim().split(" ").slice(1).join(" ") || "").trim();
      const signupPayload = {
        firstName,
        lastName,
        email: values.email.trim().toLowerCase(),
        password: values.password,
      };
      const result = await signup(signupPayload);

      if (result?.data?.success) {
        toast.success("Account created successfully!");
        navigate(from, { replace: true });
      } else {
        const message = result?.data?.message || "Failed to create account";
        toast.error(message);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-50 ">
      <div className="w-full flex-1 min-h-screen flex flex-col lg:grid lg:grid-cols-12 items-stretch">
        {/* Left Column: Full-Height Editorial Showcase (Flush against top, left, bottom with 0 outer padding & no rounded corners) */}
        <div className="hidden lg:flex lg:col-span-5 xl:col-span-5.5 flex-col h-full min-h-screen lg:min-h-[720px] shrink-0 sticky top-0">
          <EditorialShowcase mode={currentMode} />
        </div>

        {/* Right Column: Authentication Interactive Core */}
        <div className="w-full lg:col-span-7 xl:col-span-6.5 min-h-screen flex flex-col justify-between items-center px-4 sm:px-8 lg:px-12 xl:px-14 pt-20 sm:pt-24 pb-8 overflow-y-auto relative">

          {/* Cart Bag Trigger Button */}
          <div className="absolute top-4 right-5 sm:top-6 sm:right-6 lg:top-8 lg:right-8 flex items-center space-x-2 z-20">
            <button
              type="button"
              onClick={() => setIsBagOpen(true)}
              id="cart-bag-btn"
              className="relative p-2.5 text-stone-800 hover:text-stone-950 rounded-full hover:bg-stone-200/70 transition-all focus:outline-none focus:ring-2 focus:ring-stone-900/10 cursor-pointer shadow-xs bg-white/80 backdrop-blur-xs border border-stone-200/90 active:scale-95"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-stone-900 text-stone-50 text-[10px] font-semibold rounded-full flex items-center justify-center ring-2 ring-[#fcfbf9]">
                {cartCount}
              </span>
            </button>
          </div>

          <div className={`w-full ${currentMode === 'login' ? 'max-w-md' : 'max-w-lg'} my-auto py-6 shrink-0`}>
            {/* Mode Switcher Tabs for Quick Navigation */}
            <div className="w-full mb-6 p-1 bg-stone-200/70 rounded-xl flex items-center justify-between text-xs font-medium text-stone-600 shrink-0">
              <button
                type="button"
                onClick={() => setCurrentMode('login')}
                id="tab-login-btn"
                className={`flex-1 py-2 px-3 rounded-lg transition-all duration-200 cursor-pointer text-center ${currentMode === 'login'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'hover:text-stone-900'
                  }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setCurrentMode('signup')}
                id="tab-signup-btn"
                className={`flex-1 py-2 px-3 rounded-lg transition-all duration-200 cursor-pointer text-center ${currentMode === 'signup'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'hover:text-stone-900'
                  }`}
              >
                Create Account
              </button>
            </div>

            {/* Form Container with Motion Transitions */}
            <div className="w-full bg-white/80 backdrop-blur-xs border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
              <AnimatePresence mode="wait">
                {currentMode === 'login' && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <LoginForm
                      onSuccess={handleLogin}
                      onSwitchToSignup={() => setCurrentMode('signup')}
                      onSwitchToForgot={() => setCurrentMode('forgot')}

                    />
                  </motion.div>
                )}

                {currentMode === 'signup' && (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <SignupForm
                      onSuccess={handleSignUp}
                      onSwitchToLogin={() => setCurrentMode('login')}
                    />
                  </motion.div>
                )}

                {currentMode === 'forgot' && (
                  <motion.div
                    key="forgot"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ForgotPasswordModal
                      onBackToLogin={() => setCurrentMode('login')}
                      onSendResetToast={(email) =>
                        toast.success(`Password reset instructions sent to ${email}`)
                      }
                    />
                  </motion.div>
                )}

                {currentMode === 'magic-link' && (
                  <motion.div
                    key="magic-link"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <MagicLinkForm
                      onBackToLogin={() => setCurrentMode('login')}
                      onSuccess={handleLogin}
                      onSendToast={(title, desc) => toast.success('info', title, desc)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Editorial Perk Note */}
            <div className="lg:hidden w-full mt-6 p-4 rounded-xl bg-stone-900 text-stone-100 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-amber-300 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Member Privilege Included</span>
              </div>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                Join today for 10% off your initial bag order, private capsule pre-access, and complimentary carbon-neutral shipping.
              </p>
            </div>
          </div>

          {/* Right column footer */}
          <div className="w-full max-w-md pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400 font-light border-t border-stone-200/60 shrink-0">
            <span>&copy; 2026 NOIR ATELIER</span>
            <div className="flex items-center space-x-4 text-stone-500">
              <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-stone-800 transition-colors">
                Privacy
              </a>
              <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-stone-800 transition-colors">
                Terms
              </a>
              <a href="#support" onClick={(e) => e.preventDefault()} className="hover:text-stone-800 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Global Shopping Bag Slide-out Drawer */}
      <BagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        user={user}
        onProceedToAuth={() => {
          setIsBagOpen(false);
          setCurrentMode('login');
        }}
      />
    </div>
  );
};

export default Login;


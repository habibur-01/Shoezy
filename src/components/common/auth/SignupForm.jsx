import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Check,
  AlertCircle,
  Sparkles,
  Shield,
} from 'lucide-react';

export const SignupForm = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // -----------------------------------
  // Initial Values
  // -----------------------------------
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    newsletterOptIn: true,
    agreeTerms: true,
  };

  // -----------------------------------
  // Validation
  // -----------------------------------
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .trim()
      .required('Please enter your first name'),

    lastName: Yup.string()
      .trim()
      .required('Please enter your last name'),

    email: Yup.string()
      .trim()
      .email('Please provide a valid email address')
      .required('Please provide an email address'),

    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Please confirm your password'),

    newsletterOptIn: Yup.boolean(),

    agreeTerms: Yup.boolean()
      .oneOf(
        [true],
        'Please accept terms & privacy policy to continue'
      ),
  });

  // -----------------------------------
  // Password Strength
  // -----------------------------------
  const calculateStrength = (password) => {
    let score = 0;

    if (!password) {
      return {
        score: 0,
        label: 'None',
        color: 'bg-stone-200',
      };
    }

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return {
          score: 1,
          label: 'Weak',
          color: 'bg-amber-400',
        };

      case 2:
        return {
          score: 2,
          label: 'Fair',
          color: 'bg-yellow-500',
        };

      case 3:
        return {
          score: 3,
          label: 'Good',
          color: 'bg-emerald-500',
        };

      case 4:
        return {
          score: 4,
          label: 'Strong',
          color: 'bg-emerald-600',
        };

      default:
        return {
          score: 0,
          label: 'Too Short',
          color: 'bg-stone-300',
        };
    }
  };

  // -----------------------------------
  // Submit
  // -----------------------------------
  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      await onSuccess(values);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------------
  // Social Auth
  // -----------------------------------
  const handleSocialAuth = (provider) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      onSuccess({
        name:
          provider === 'Apple'
            ? 'Genevieve Hayes'
            : 'Marcus Sterling',

        email:
          provider === 'Apple'
            ? 'genevieve.h@icloud.com'
            : 'marcus.sterling@gmail.com',

        tier: 'Gold VIP',
        joinedDate: 'Joined Today',
        ordersCount: 0,
        loyaltyPoints: 200,
        savedBagCount: 2,
      });
    }, 700);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-semibold">
          Privilege Membership
        </span>

        <h1 className="font-serif-editorial text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight">
          Create an Account
        </h1>

        <p className="text-sm text-stone-600 font-light">
          Join Noir Atelier to unlock exclusive previews, order tracking,
          and complimentary global courier.
        </p>
      </div>

      {/* Formik */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setValues }) => {

          const strength = calculateStrength(values.password);

          return (
            <Form className="space-y-5" noValidate>

              {/* -------------------------------- */}
              {/* Social Signup */}
              {/* -------------------------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() => handleSocialAuth('Apple')}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-lg text-xs font-medium tracking-wide transition-all shadow-xs active:scale-[0.99] cursor-pointer disabled:opacity-70"
                >
                  <svg
                    className="w-3.5 h-3.5 fill-current"
                    viewBox="0 0 170 170"
                  >
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.66-7.85-11.9-14.44-6-9.37-10.7-20.2-14.08-32.48-3.38-12.28-5.07-23.75-5.07-34.42 0-14.37 3.73-26.24 11.2-35.61 7.46-9.37 16.7-14.16 27.72-14.37 4.12 0 9.09 1.13 14.9 3.39 5.82 2.26 9.87 3.44 12.16 3.55 1.83 0 5.87-1.25 12.12-3.75 6.24-2.5 11.45-3.65 15.63-3.44 11.75.76 21.08 4.96 28 12.61-10.42 6.31-15.53 15.11-15.33 26.4.22 8.91 3.65 16.34 10.3 22.3 6.64 5.96 14.49 9.38 23.54 10.27-2.39 7.39-5.46 14.88-9.22 22.47zM119.22 33.64c0-7.39 2.65-14.17 7.95-20.35 5.3-6.17 11.77-9.98 19.4-11.43.54 7.61-1.92 14.73-7.39 21.36-5.47 6.63-12.1 10.68-19.89 12.16-.07-.58-.07-1.16-.07-1.74z" />
                  </svg>

                  <span>Apple Sign-up</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialAuth('Google')}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300/80 rounded-lg text-xs font-medium tracking-wide transition-all shadow-xs active:scale-[0.99] cursor-pointer disabled:opacity-70"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                  >
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
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 1.25 17.42l4.03-3.15z"
                    />

                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>

                  <span>Google</span>
                </button>
              </div>

              {/* -------------------------------- */}
              {/* Divider */}
              {/* -------------------------------- */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-stone-200 w-full" />

                <span className="absolute bg-[#fcfbf9] px-3 text-[11px] uppercase tracking-widest text-stone-400 font-medium">
                  or with email
                </span>
              </div>

              {/* ================================= */}
              {/* 2 COLUMN FORM */}
              {/* ================================= */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">

                  {/* First Name */}
                  <div className="space-y-1">
                    <label
                      htmlFor="signup-firstname"
                      className="block text-xs font-semibold uppercase tracking-wider text-stone-700"
                    >
                      First Name
                    </label>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <User className="w-4 h-4" />
                      </div>

                      <Field
                        id="signup-firstname"
                        name="firstName"
                        type="text"
                        placeholder="e.g. Sébastien"
                        autoComplete="given-name"
                        className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.firstName && touched.firstName
                          ? 'border-red-400 ring-1 ring-red-400/40'
                          : 'border-stone-300/80 focus:border-stone-900 focus:ring-1 focus:ring-stone-900'
                          } rounded-lg text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all`}
                      />
                    </div>

                    {errors.firstName && touched.firstName && (
                      <ErrorMessage text={errors.firstName} />
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1">
                    <label
                      htmlFor="signup-lastname"
                      className="block text-xs font-semibold uppercase tracking-wider text-stone-700"
                    >
                      Last Name
                    </label>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <User className="w-4 h-4" />
                      </div>

                      <Field
                        id="signup-lastname"
                        name="lastName"
                        type="text"
                        placeholder="e.g. Laurent"
                        autoComplete="family-name"
                        className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.lastName && touched.lastName
                          ? 'border-red-400 ring-1 ring-red-400/40'
                          : 'border-stone-300/80 focus:border-stone-900 focus:ring-1 focus:ring-stone-900'
                          } rounded-lg text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all`}
                      />
                    </div>

                    {errors.lastName && touched.lastName && (
                      <ErrorMessage text={errors.lastName} />
                    )}
                  </div>
                </div>


                {/* Email */}
                <div className="space-y-1">
                  <label
                    htmlFor="signup-email"
                    className="block text-xs font-semibold uppercase tracking-wider text-stone-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Mail className="w-4 h-4" />
                    </div>

                    <Field
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="name@atelier.com"
                      autoComplete="email"
                      className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.email && touched.email
                        ? 'border-red-400 ring-1 ring-red-400/40'
                        : 'border-stone-300/80 focus:border-stone-900 focus:ring-1 focus:ring-stone-900'
                        } rounded-lg text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all`}
                    />
                  </div>

                  {errors.email && touched.email && (
                    <ErrorMessage text={errors.email} />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">

                  {/* Password */}
                  <div className="space-y-1">
                    <label
                      htmlFor="signup-password"
                      className="block text-xs font-semibold uppercase tracking-wider text-stone-700"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Lock className="w-4 h-4" />
                      </div>

                      <Field
                        id="signup-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimum 8 characters"
                        autoComplete="new-password"
                        className={`w-full pl-10 pr-11 py-2.5 bg-white border ${errors.password && touched.password
                          ? 'border-red-400 ring-1 ring-red-400/40'
                          : 'border-stone-300/80 focus:border-stone-900 focus:ring-1 focus:ring-stone-900'
                          } rounded-lg text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Password Strength */}
                    {values.password && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-stone-500">
                            Strength:
                          </span>

                          <span className="font-medium text-stone-800">
                            {strength.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-1.5 h-1.5">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`rounded-full transition-colors duration-300 ${step <= strength.score
                                ? strength.color
                                : 'bg-stone-200'
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {errors.password && touched.password && (
                      <ErrorMessage text={errors.password} />
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label
                      htmlFor="signup-confirm-password"
                      className="block text-xs font-semibold uppercase tracking-wider text-stone-700"
                    >
                      Confirm Password
                    </label>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Shield className="w-4 h-4" />
                      </div>

                      <Field
                        id="signup-confirm-password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                        className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.confirmPassword &&
                          touched.confirmPassword
                          ? 'border-red-400 ring-1 ring-red-400/40'
                          : 'border-stone-300/80 focus:border-stone-900 focus:ring-1 focus:ring-stone-900'
                          } rounded-lg text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all`}
                      />
                    </div>

                    {errors.confirmPassword &&
                      touched.confirmPassword && (
                        <ErrorMessage
                          text={errors.confirmPassword}
                        />
                      )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">

                  {/* Newsletter */}
                  <label className="flex items-start space-x-2 text-xs text-stone-600 cursor-pointer select-none md:col-span-1">
                    <Field
                      type="checkbox"
                      name="newsletterOptIn"
                      className="sr-only"
                    />

                    <div
                      className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-colors ${values.newsletterOptIn
                        ? 'bg-stone-900 border-stone-900 text-white'
                        : 'bg-white border-stone-300'
                        }`}
                    >
                      {values.newsletterOptIn && (
                        <Check className="w-3 h-3 stroke-[3]" />
                      )}
                    </div>

                    <span className="leading-snug">
                      Subscribe for private seasonal previews and receive a{' '}
                      <strong className="text-stone-900 font-semibold">
                        10% welcome privilege
                      </strong>{' '}
                      on your first order.
                    </span>
                  </label>

                  {/* Terms */}
                  <label className="flex items-start space-x-2 text-xs text-stone-600 cursor-pointer select-none md:col-span-1">
                    <Field
                      type="checkbox"
                      name="agreeTerms"
                      className="sr-only"
                    />

                    <div
                      className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-colors ${values.agreeTerms
                        ? 'bg-stone-900 border-stone-900 text-white'
                        : 'bg-white border-stone-300'
                        }`}
                    >
                      {values.agreeTerms && (
                        <Check className="w-3 h-3 stroke-[3]" />
                      )}
                    </div>

                    <span className="leading-snug">
                      I agree to{' '}
                      <a
                        href="#terms"
                        onClick={(e) => e.preventDefault()}
                        className="text-stone-900 underline font-medium"
                      >
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a
                        href="#privacy"
                        onClick={(e) => e.preventDefault()}
                        className="text-stone-900 underline font-medium"
                      >
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                </div>

                {/* Terms Error */}
                {errors.agreeTerms && touched.agreeTerms && (
                  <div className="md:col-span-2">
                    <ErrorMessage text={errors.agreeTerms} />
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-5 bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-stone-50 rounded-lg text-sm font-semibold tracking-wide flex items-center justify-center space-x-2 transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-stone-300 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Atelier Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </Form>
          );
        }}
      </Formik>

      {/* Footer */}
      <div className="pt-2 text-center border-t border-stone-200/80">
        <p className="text-xs text-stone-600">
          Already have an account?{' '}

          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-stone-900 font-semibold underline underline-offset-4 decoration-stone-400 hover:decoration-stone-900 cursor-pointer ml-1"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

// -----------------------------------
// Error Component
// -----------------------------------
const ErrorMessage = ({ text }) => {
  return (
    <p className="text-xs text-red-600 flex items-center space-x-1 mt-1">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      <span>{text}</span>
    </p>
  );
};

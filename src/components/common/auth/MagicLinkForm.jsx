import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';


export const MagicLinkForm = ({
  onBackToLogin,
  onSuccess,
  onSendToast,
}) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid email address');
      return;
    }

    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      onSendToast('Magic sign-in link dispatched', `Check ${email} to enter directly`);
    }, 750);
  };

  const handleInstantSignInDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        name: 'Camille Dubois',
        email: email || 'camille.dubois@atelier.com',
        tier: 'Gold VIP',
        joinedDate: 'Joined Today',
        ordersCount: 4,
        loyaltyPoints: 520,
        savedBagCount: 2,
      });
    }, 600);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <button
        onClick={onBackToLogin}
        id="magic-back-btn"
        className="inline-flex items-center space-x-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors font-medium cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to regular password login</span>
      </button>

      <div className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-semibold">
          Passwordless Entry
        </span>
        <h1 className="font-serif-editorial text-3xl text-stone-900 font-normal tracking-tight">
          Magic Sign-In Link
        </h1>
        <p className="text-sm text-stone-600 font-light">
          We’ll email you a one-click authentication link. No password memory required.
        </p>
      </div>

      {isSent ? (
        <div className="p-6 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-stone-900">
              One-Click Link Dispatched
            </h3>
            <p className="text-xs text-stone-600">
              We sent a sign-in link to <strong className="text-stone-900">{email}</strong>. Click the link in your email on this device to sign in instantly.
            </p>
          </div>

          <div className="pt-2 border-t border-stone-200/80 space-y-2">
            <p className="text-[11px] text-stone-500">
              Testing the experience right now?
            </p>
            <button
              onClick={handleInstantSignInDemo}
              id="magic-simulate-click-btn"
              className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-lg text-xs font-semibold tracking-wide flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Simulate Clicking Email Link</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1">
            <label
              htmlFor="magic-email"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-700"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="magic-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="name@atelier.com"
                autoComplete="email"
                className={`w-full pl-10 pr-4 py-2.5 bg-white border ${
                  error ? 'border-red-400 ring-1 ring-red-400/40' : 'border-stone-300/80 focus:border-stone-900 focus:ring-1 focus:ring-stone-900'
                } rounded-lg text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all`}
              />
            </div>
            {error && (
              <p className="text-xs text-red-600 flex items-center space-x-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            id="send-magic-link-btn"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-5 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-lg text-sm font-semibold tracking-wide flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-[0.99] disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-stone-300 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Email One-Click Link</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

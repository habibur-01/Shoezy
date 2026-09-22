import React, { useState } from 'react';
import { Mail, CheckCircle2, X, ArrowLeft, ShieldAlert } from 'lucide-react';



export const ForgotPasswordModal = ({
  isOpen,
  onClose,
  defaultEmail = '',
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid corporate email address.');
      return;
    }
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setEmail('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="modal-forgot-password"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 p-6 md:p-8"
      >
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
              <Mail className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
              Reset your password
            </h3>
            <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
              Enter your corporate email address. If an administrative profile exists, we will dispatch a secure 15-minute one-time recovery token.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="email"
                    id="input-forgot-email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    placeholder="name@commercehq.io"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 border border-zinc-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all placeholder:text-zinc-400"
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    {error}
                  </p>
                )}
              </div>

              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-[11px] text-zinc-500">
                <span className="font-semibold text-zinc-700">Corporate Security Policy:</span> Password reset links expire in 15 minutes and require multifactor confirmation from your registered device.
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-2.5 px-4 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  id="btn-submit-forgot-password"
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Send Instructions'
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-zinc-900">Recovery email dispatched</h3>
            <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
              We have forwarded password reset verification instructions to <span className="font-semibold text-zinc-800">{email}</span>. Please check your corporate inbox or spam folder.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleReset}
                id="btn-return-login-modal"
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

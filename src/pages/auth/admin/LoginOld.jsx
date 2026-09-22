import React, { useState } from 'react';
import { Sparkles, KeyRound, Users, ShieldCheck, Radio } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { LoginBrandPanel } from './login/LoginBrandPanel';
import { LoginForm } from './login/LoginForm';
import { QuickDemoLogins } from './login/QuickDemoLogins';
import { ForgotPasswordModal } from './login/ForgotPasswordModal';

export const LoginPage = () => {
  const { teamMembers, roles, login, loginAsUser } = useAdmin();

  const [activeTab, setActiveTab] = useState<'form' | 'quick'>('form');
  const [email, setEmail] = useState('alex.vance@commercehq.io');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (!res.success) {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    }, 450);
  };

  const handleQuickLogin = (userId) => {
    setIsLoading(true);
    setTimeout(() => {
      loginAsUser(userId);
      setIsLoading(false);
    }, 250);
  };

  const handleFillCredentials = (staffEmail) => {
    setEmail(staffEmail);
    setPassword('admin123');
    setActiveTab('form');
    setError(null);
  };

  const handleSSOLogin = (provider) => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      // Direct login as Alex Vance (Super Admin)
      loginAsUser('usr_01');
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-zinc-100 font-sans text-zinc-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
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
              API Gateways Nominal
            </span>
            <span className="hidden sm:inline-flex text-zinc-400 font-mono text-[11px]">
              TLS 1.3 / AES-256
            </span>
          </div>
        </div>

        {/* Center Card */}
        <div className="w-full max-w-lg mx-auto my-auto py-8">
          <div className="bg-white rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-200/80 p-6 sm:p-8">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-medium mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                Administrative Access Only
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                Sign in to your console
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Enter your credentials or select a verified staff persona to test role permissions.
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center p-1 bg-zinc-100 rounded-xl mb-6">
              <button
                type="button"
                id="tab-login-credentials"
                onClick={() => setActiveTab('form')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'form'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Credentials Login</span>
              </button>
              <button
                type="button"
                id="tab-login-personas"
                onClick={() => setActiveTab('quick')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'quick'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Staff Roles ({teamMembers.length})</span>
              </button>
            </div>

            {/* Tab 1: Standard Credential Form */}
            {activeTab === 'form' ? (
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
                isLoading={isLoading}
                error={error}
                onSubmit={handleSubmit}
                onForgotPassword={() => setIsForgotPasswordOpen(true)}
                onSSOLogin={handleSSOLogin}
              />
            ) : (
              /* Tab 2: Quick Demo Roles */
              <QuickDemoLogins
                teamMembers={teamMembers}
                roles={roles}
                onQuickLogin={handleQuickLogin}
                onFillCredentials={handleFillCredentials}
              />
            )}
          </div>

          <div className="mt-6 text-center text-xs text-zinc-400">
            Protected by Cloud Armor enterprise DDoS and rate limiting. Authorized personnel only.
          </div>
        </div>

        {/* Bottom Legal / Help footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-zinc-200/80 text-[11px] text-zinc-500">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
            <span>CommerceHQ Infrastructure: Active</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsForgotPasswordOpen(true)}
              className="hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Need assistance?
            </button>
            <span>•</span>
            <span className="text-zinc-400">Security Audit Logs Enabled</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        defaultEmail={email}
      />
    </div>
  );
};

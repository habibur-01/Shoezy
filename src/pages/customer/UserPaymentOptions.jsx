import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  CreditCard,
  Smartphone,
  Building2,
  Plus,
  Trash2,
  CheckCircle2,
  Star,
  Loader2,
  X,
  Wallet,
  ShieldCheck,
} from "lucide-react";
import {
  getUserPaymentOptions,
  createUserPaymentOption,
  deleteUserPaymentOption,
  setDefaultPaymentOption,
} from "../../server/payment/userPaymentOption";

const PROVIDER_ICONS = {
  bkash: Smartphone,
  nagad: Smartphone,
  rocket: Smartphone,
  upay: Smartphone,
  card: CreditCard,
  bank: Building2,
};

const PROVIDER_COLORS = {
  bkash: "bg-pink-50 text-pink-700 border-pink-200",
  nagad: "bg-orange-50 text-orange-700 border-orange-200",
  rocket: "bg-purple-50 text-purple-700 border-purple-200",
  upay: "bg-blue-50 text-blue-700 border-blue-200",
  card: "bg-indigo-50 text-indigo-700 border-indigo-200",
  bank: "bg-amber-50 text-amber-700 border-amber-200",
};

const UserPaymentOptions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    provider: "bkash",
    accountTitle: "",
    accountNumber: "",
    accountType: "Personal",
    isDefault: false,
  });

  // Fetch saved payment options
  const {
    data: optionsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userPaymentOptions"],
    queryFn: async () => {
      const res = await getUserPaymentOptions();
      return res?.data?.data || [];
    },
    staleTime: 2 * 60 * 1000,
  });

  const optionsList = optionsData || [];

  // Set Default Handler
  const handleSetDefault = async (id) => {
    try {
      const res = await setDefaultPaymentOption(id);
      if (res?.data?.success) {
        toast.success("Default payment option updated!");
        refetch();
      }
    } catch (err) {
      toast.error("Failed to update default payment option");
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this saved payment account?")) return;
    try {
      const res = await deleteUserPaymentOption(id);
      if (res?.data?.success) {
        toast.success("Saved payment account removed!");
        refetch();
      }
    } catch (err) {
      toast.error("Failed to delete payment account");
    }
  };

  // Create Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.accountTitle.trim()) {
      toast.error("Please enter an Account Title (e.g. My Personal bKash)");
      return;
    }

    if (!formData.accountNumber.trim()) {
      toast.error("Please enter your Wallet / Account Number");
      return;
    }

    try {
      setSubmitting(true);
      const res = await createUserPaymentOption(formData);
      if (res?.data?.success) {
        toast.success("New payment account saved successfully!");
        setIsModalOpen(false);
        setFormData({
          provider: "bkash",
          accountTitle: "",
          accountNumber: "",
          accountType: "Personal",
          isDefault: false,
        });
        refetch();
      } else {
        toast.error(res?.data?.message || "Failed to save payment option");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to save payment account";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-stone-900" />
            <span>My Payment Options</span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Save your personal bKash, Nagad, Rocket or Bank account details for fast & auto-filled checkout
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Payment Account</span>
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 flex flex-col items-center justify-center gap-3 text-stone-500">
          <Loader2 className="w-6 h-6 animate-spin text-stone-900" />
          <p className="text-xs font-semibold">Loading your saved payment accounts...</p>
        </div>
      ) : optionsList.length === 0 ? (
        // Empty State
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8 text-stone-700" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-stone-900">No Saved Payment Accounts</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              You haven't saved any payment accounts yet. Add your personal bKash, Nagad, or Rocket number to auto-fill during checkout!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Payment Account</span>
          </button>
        </div>
      ) : (
        // Saved Options Grid
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {optionsList.map((opt) => {
            const ProviderIcon = PROVIDER_ICONS[opt.provider] || Wallet;
            const badgeClass = PROVIDER_COLORS[opt.provider] || "bg-stone-50 text-stone-700 border-stone-200";

            return (
              <div
                key={opt._id}
                className={`bg-white border rounded-2xl p-5 space-y-4 shadow-xs transition-all ${
                  opt.isDefault ? "border-stone-900 ring-1 ring-stone-900" : "border-stone-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border uppercase tracking-wider flex items-center gap-1.5 ${badgeClass}`}>
                      <ProviderIcon className="w-3.5 h-3.5" />
                      <span>{opt.provider}</span>
                    </span>
                    {opt.isDefault && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> Default
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(opt._id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete Account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-stone-900">{opt.accountTitle}</h4>
                  <p className="text-sm font-mono font-bold text-stone-900 tracking-wider">
                    {opt.accountNumber}
                  </p>
                  <p className="text-[11px] text-stone-500 font-medium">
                    Type: <span className="font-semibold text-stone-700">{opt.accountType}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  {!opt.isDefault ? (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(opt._id)}
                      className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      <span>Set as Default</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Selected for Auto-Fill</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD NEW PAYMENT ACCOUNT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-stone-900" />
                <span>Add Personal Payment Account</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Provider */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Select Provider / Method
                </label>
                <select
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition"
                >
                  <option value="bkash">bKash Mobile Banking</option>
                  <option value="nagad">Nagad Mobile Banking</option>
                  <option value="rocket">Rocket Mobile Banking</option>
                  <option value="upay">Upay Mobile Banking</option>
                  <option value="card">Credit / Debit Card</option>
                  <option value="bank">Bank Account</option>
                </select>
              </div>

              {/* Account Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Account Label / Title
                </label>
                <input
                  type="text"
                  value={formData.accountTitle}
                  onChange={(e) => setFormData({ ...formData, accountTitle: e.target.value })}
                  placeholder="e.g. My Personal bKash Number"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition"
                />
              </div>

              {/* Account / Wallet Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Wallet / Account Number
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="e.g. 01799362609"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-bold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition"
                />
              </div>

              {/* Account Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">Account Type</label>
                <select
                  value={formData.accountType}
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition"
                >
                  <option value="Personal">Personal Account</option>
                  <option value="Agent">Agent Account</option>
                  <option value="Merchant">Merchant Account</option>
                </select>
              </div>

              {/* Default Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 text-stone-900 rounded border-stone-300 focus:ring-stone-900"
                />
                <label htmlFor="isDefault" className="text-xs font-bold text-stone-800 cursor-pointer">
                  Set as my primary default payment account
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Payment Option</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPaymentOptions;

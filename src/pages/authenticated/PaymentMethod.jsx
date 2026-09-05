import React, { useState, useEffect, useCallback } from "react";
import { CreditCard, Banknote, Smartphone, Building2, ShieldCheck, Copy, Check, Loader2, Zap, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getActivePaymentGateways } from "../../server/payment/paymentGateway";
import { getUserPaymentOptions } from "../../server/payment/userPaymentOption";

const DEFAULT_ICONS = {
  bkash: "/assets/bkash.png",
  nagad: "/assets/nagad.png",
  rocket: "/assets/rocket.png",
  sslcommerze: "/assets/sslcommerze.png",
  stripe: "/assets/stripe.png",
  bank: "/assets/bank.png",
  cod: "/assets/cod.svg",
};

const getGatewayIcon = (code) => {
  if (code === "cash_on_delivery" || code === "cod") return Banknote;
  if (code === "mobile_banking" || ["bkash", "nagad", "rocket", "upay", "cellfin"].includes(code)) return Smartphone;
  if (code === "card_payment" || ["card_online", "credit_debit_card", "sslcommerze", "stripe"].includes(code)) return CreditCard;
  return Building2;
};

const PaymentMethod = ({ paymentMethod, trxId, setPaymentMethod, setErrorMsg, setTrxId }) => {
  const [copied, setCopied] = useState(false);

  // Fetch Active Payment Gateways with their nested Payment Methods from Backend
  const { data: gatewayData, isLoading } = useQuery({
    queryKey: ["paymentGateways"],
    queryFn: async () => {
      const res = await getActivePaymentGateways();
      return res?.data?.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch User's Personal Saved Payment Options for Auto-Fill
  const { data: savedOptionsData } = useQuery({
    queryKey: ["userPaymentOptions"],
    queryFn: async () => {
      const res = await getUserPaymentOptions();
      return res?.data?.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const gatewayCategories = gatewayData || [];
  const savedUserAccounts = savedOptionsData || [];
  const [activeTab, setActiveTab] = useState("");

  // Set default active tab when gateways load
  useEffect(() => {
    if (gatewayCategories.length > 0 && !activeTab) {
      setActiveTab(gatewayCategories[0].code);
      if (!paymentMethod && gatewayCategories[0].methods?.length > 0) {
        setPaymentMethod(gatewayCategories[0].methods[0].code);
      }
    }
  }, [gatewayCategories, activeTab, paymentMethod, setPaymentMethod]);

  // Flatten all methods across all categories
  const allMethods = gatewayCategories.flatMap((g) => g.methods || []);
  const selectedMethodObj = allMethods.find((m) => m.code === paymentMethod);

  // Saved accounts matching selected payment method
  const matchingSavedAccounts = selectedMethodObj
    ? savedUserAccounts.filter(
        (acc) => acc.provider.toLowerCase() === selectedMethodObj.code.toLowerCase()
      )
    : [];

  const handleMethodSelect = useCallback(
    (code) => {
      setPaymentMethod(code);
      if (setErrorMsg) setErrorMsg({ addressErr: null, paymentErr: null });
    },
    [setPaymentMethod, setErrorMsg]
  );

  const handleTrxIdChange = useCallback(
    (id) => {
      if (setTrxId) setTrxId(id);
    },
    [setTrxId]
  );

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Currently active gateway category
  const activeGateway = gatewayCategories.find((g) => g.code === activeTab) || gatewayCategories[0];
  const activeMethods = activeGateway?.methods || [];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-stone-900" />
            <span>Payment Method</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Select your preferred payment gateway category to complete your order
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-8 justify-center text-xs font-semibold text-stone-500">
          <Loader2 className="w-5 h-5 animate-spin text-stone-900" />
          <span>Loading payment options...</span>
        </div>
      ) : (
        <>
          {/* CATEGORY GATEWAY TABS (NO ALL METHODS TAB) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-stone-50 p-1.5 rounded-xl border border-stone-200/80">
            {gatewayCategories.map((cat) => {
              const TabIcon = getGatewayIcon(cat.code);
              const isActive = activeTab === cat.code;
              const methodCount = (cat.methods || []).length;

              return (
                <button
                  key={cat._id || cat.code}
                  type="button"
                  onClick={() => {
                    setActiveTab(cat.code);
                    if (cat.methods && cat.methods.length > 0) {
                      const hasCurrent = cat.methods.some((m) => m.code === paymentMethod);
                      if (!hasCurrent) {
                        handleMethodSelect(cat.methods[0].code);
                      }
                    }
                  }}
                  className={`px-3.5 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-stone-900 text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{cat.name}</span>
                  {methodCount > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? "bg-stone-700 text-white" : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {methodCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ACTIVE CATEGORY METHODS GRID */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Available Methods under {activeGateway?.name}:
              </h3>
            </div>

            {activeMethods.length === 0 ? (
              <div className="py-6 text-center text-xs font-medium text-stone-500 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                No payment methods available in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {activeMethods.map((item) => {
                  const isSelected = paymentMethod === item.code;
                  const iconSrc = item.icon || DEFAULT_ICONS[item.code];
                  const ItemIcon = getGatewayIcon(item.code);

                  return (
                    <div
                      key={item._id || item.code}
                      onClick={() => handleMethodSelect(item.code)}
                      className={`cursor-pointer rounded-xl p-4 flex items-center gap-3 transition-all ${
                        isSelected
                          ? "bg-stone-900 text-white border-2 border-stone-900 shadow-md scale-[1.02]"
                          : "bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 hover:border-stone-300"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 overflow-hidden">
                        {iconSrc ? (
                          <img
                            src={iconSrc}
                            alt={item.name}
                            className="h-full w-full object-contain p-1"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <ItemIcon className="w-5 h-5 text-stone-700" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{item.name}</p>
                        <p
                          className={`text-[10px] font-medium ${
                            isSelected ? "text-stone-300" : "text-stone-500"
                          } truncate`}
                        >
                          {item.type === "online"
                            ? "Automated Portal"
                            : item.requiresTxnId
                            ? "Manual Trx Required"
                            : "Pay on Delivery"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* SELECTED METHOD DETAILS & INSTRUCTION BOX */}
      {selectedMethodObj && (
        <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Selected: {selectedMethodObj.name}
              </h3>
            </div>
            {selectedMethodObj.type === "online" ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">
                <Zap className="w-3 h-3" /> Automatic Instant Gateway
              </span>
            ) : selectedMethodObj.requiresTxnId ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                Manual Trx Required
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Pay on Delivery
              </span>
            )}
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            {selectedMethodObj.instruction || "Follow the instructions below to complete your payment."}
          </p>

          {/* QUICK SELECT FOR USER'S SAVED PAYMENT ACCOUNTS */}
          {matchingSavedAccounts.length > 0 && (
            <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-stone-900" />
                  Your Saved {selectedMethodObj.name} Account(s):
                </span>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Quick Auto-Fill Ready ✓
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {matchingSavedAccounts.map((acc) => (
                  <button
                    key={acc._id}
                    type="button"
                    onClick={() => {
                      handleTrxIdChange(`SAVED-${acc.accountNumber}`);
                    }}
                    className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-300 rounded-lg text-xs font-mono font-bold text-stone-900 flex items-center gap-2 transition cursor-pointer"
                  >
                    <span>{acc.accountTitle}: {acc.accountNumber}</span>
                    {acc.isDefault && (
                      <span className="text-[9px] bg-stone-900 text-white px-1.5 py-0.5 rounded-md">Default</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Merchant / Wallet Account Details */}
          {selectedMethodObj.accountNumber && selectedMethodObj.requiresTxnId && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white border border-stone-200 rounded-xl">
              <div>
                <span className="text-[11px] text-stone-500 font-medium block">
                  Merchant / Wallet Account Number:
                </span>
                <span className="font-mono font-bold text-stone-900 text-sm">
                  {selectedMethodObj.accountNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(selectedMethodObj.accountNumber)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition cursor-pointer self-start sm:self-auto"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Transaction ID Input for Manual Gateways */}
          {selectedMethodObj.requiresTxnId && (
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-stone-800">
                Enter {selectedMethodObj.name} Transaction ID (TrxID) / Reference No.
              </label>
              <input
                type="text"
                name="trxid"
                value={trxId || ""}
                onChange={(e) => handleTrxIdChange(e.target.value)}
                placeholder="e.g. 9B7X2891K"
                className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition"
              />
            </div>
          )}

          {/* Online Portal Gateway Banner */}
          {selectedMethodObj.type === "online" && (
            <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center gap-3 text-indigo-950">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
              <p className="text-[11px] leading-snug">
                You will be redirected securely to the <strong>{selectedMethodObj.name}</strong> payment gateway portal page upon clicking Confirm & Place Order.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(PaymentMethod);
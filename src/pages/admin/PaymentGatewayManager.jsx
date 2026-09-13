import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Smartphone,
  Building2,
  Banknote,
  Loader2,
  Shield,
  Layers,
  Settings2,
  Info,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getAllPaymentGateways,
  createPaymentGateway,
  updatePaymentGateway,
  deletePaymentGateway,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../../server/payment/paymentGateway";

const CATEGORY_ICONS = {
  cod: Banknote,
  mobile_banking: Smartphone,
  card_online: CreditCard,
  bank_transfer: Building2,
};

const PaymentGatewayManager = () => {
  const queryClient = useQueryClient();
  const [selectedGatewayId, setSelectedGatewayId] = useState(null);

  // Gateway Modal / Form State
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [editingGateway, setEditingGateway] = useState(null);
  const [gatewayForm, setGatewayForm] = useState({ name: "", code: "", description: "", isActive: true });

  // Method Modal / Form State
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [methodForm, setMethodForm] = useState({
    name: "",
    code: "",
    accountNumber: "",
    instruction: "",
    icon: "",
    requiresTxnId: true,
    type: "manual",
    isActive: true,
  });

  // Fetch all payment gateways with sub-methods
  const { data: gatewaysData, isLoading } = useQuery({
    queryKey: ["adminPaymentGateways"],
    queryFn: async () => {
      const res = await getAllPaymentGateways();
      return res?.data?.data || [];
    },
  });

  const gateways = gatewaysData || [];

  // Default select first gateway if none selected
  const activeSelectedGateway =
    gateways.find((g) => g._id === selectedGatewayId) || gateways[0] || null;

  // --- MUTATIONS ---
  const gatewayMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingGateway) {
        return await updatePaymentGateway(editingGateway._id, payload);
      }
      return await createPaymentGateway(payload);
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Payment gateway saved successfully");
      queryClient.invalidateQueries(["adminPaymentGateways"]);
      queryClient.invalidateQueries(["paymentGateways"]);
      setShowGatewayModal(false);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || "Operation failed");
    },
  });

  const deleteGatewayMut = useMutation({
    mutationFn: async (id) => await deletePaymentGateway(id),
    onSuccess: () => {
      toast.success("Gateway category deleted");
      queryClient.invalidateQueries(["adminPaymentGateways"]);
      queryClient.invalidateQueries(["paymentGateways"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Delete failed");
    },
  });

  const methodMutation = useMutation({
    mutationFn: async (payload) => {
      if (!activeSelectedGateway) return;
      if (editingMethod) {
        return await updatePaymentMethod(activeSelectedGateway._id, editingMethod._id, payload);
      }
      return await addPaymentMethod(activeSelectedGateway._id, payload);
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Payment method saved successfully");
      queryClient.invalidateQueries(["adminPaymentGateways"]);
      queryClient.invalidateQueries(["paymentGateways"]);
      setShowMethodModal(false);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || "Method operation failed");
    },
  });

  const deleteMethodMut = useMutation({
    mutationFn: async (methodId) => {
      if (!activeSelectedGateway) return;
      return await deletePaymentMethod(activeSelectedGateway._id, methodId);
    },
    onSuccess: () => {
      toast.success("Payment method deleted");
      queryClient.invalidateQueries(["adminPaymentGateways"]);
      queryClient.invalidateQueries(["paymentGateways"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Delete method failed");
    },
  });

  // --- HANDLERS ---
  const handleOpenGatewayModal = (gateway = null) => {
    if (gateway) {
      setEditingGateway(gateway);
      setGatewayForm({
        name: gateway.name,
        code: gateway.code,
        description: gateway.description || "",
        isActive: gateway.isActive !== undefined ? gateway.isActive : true,
      });
    } else {
      setEditingGateway(null);
      setGatewayForm({ name: "", code: "", description: "", isActive: true });
    }
    setShowGatewayModal(true);
  };

  const handleOpenMethodModal = (method = null) => {
    if (method) {
      setEditingMethod(method);
      setMethodForm({
        name: method.name,
        code: method.code,
        accountNumber: method.accountNumber || "",
        instruction: method.instruction || "",
        icon: method.icon || "",
        requiresTxnId: Boolean(method.requiresTxnId),
        type: method.type || "manual",
        isActive: method.isActive !== undefined ? method.isActive : true,
      });
    } else {
      setEditingMethod(null);
      setMethodForm({
        name: "",
        code: "",
        accountNumber: "",
        instruction: "",
        icon: "",
        requiresTxnId: true,
        type: "manual",
        isActive: true,
      });
    }
    setShowMethodModal(true);
  };

  const submitGatewayForm = (e) => {
    e.preventDefault();
    if (!gatewayForm.name.trim() || !gatewayForm.code.trim()) {
      toast.warning("Name and unique code are required");
      return;
    }
    gatewayMutation.mutate(gatewayForm);
  };

  const submitMethodForm = (e) => {
    e.preventDefault();
    if (!methodForm.name.trim()) {
      toast.warning("Payment method name is required");
      return;
    }
    methodMutation.mutate(methodForm);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-stone-900" />
            <span>Payment Gateway & Methods Manager</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Configure payment gateway categories and add sub-methods (e.g., bKash & Nagad under Mobile Banking).
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenGatewayModal()}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gateway Category</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 gap-2 text-xs font-semibold text-stone-500">
          <Loader2 className="w-5 h-5 animate-spin text-stone-900" />
          <span>Loading payment gateways...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: GATEWAY CATEGORIES */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Gateway Categories ({gateways.length})</span>
            </h2>

            <div className="space-y-2">
              {gateways.map((item) => {
                const isSelected = activeSelectedGateway?._id === item._id;
                const IconComponent = CATEGORY_ICONS[item.code] || CreditCard;
                const methodsCount = item.methods?.length || 0;

                return (
                  <div
                    key={item._id}
                    onClick={() => setSelectedGatewayId(item._id)}
                    className={`cursor-pointer rounded-xl p-3.5 border transition flex items-center justify-between ${
                      isSelected
                        ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                        : "bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected ? "bg-stone-800 text-white" : "bg-white text-stone-800 border border-stone-200"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{item.name}</p>
                        <p className={`text-[10px] ${isSelected ? "text-stone-300" : "text-stone-500"}`}>
                          {methodsCount} method{methodsCount !== 1 ? "s" : ""} configured
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleOpenGatewayModal(item)}
                        className={`p-1.5 rounded-lg transition ${
                          isSelected ? "hover:bg-stone-800 text-stone-200" : "hover:bg-stone-200 text-stone-600"
                        }`}
                        title="Edit Gateway Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {item.code !== "cod" && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete gateway category '${item.name}'?`)) {
                              deleteGatewayMut.mutate(item._id);
                            }
                          }}
                          className={`p-1.5 rounded-lg transition ${
                            isSelected ? "hover:bg-stone-800 text-red-300" : "hover:bg-red-50 text-red-600"
                          }`}
                          title="Delete Gateway Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: SUB-METHODS FOR SELECTED GATEWAY */}
          <div className="lg:col-span-2 space-y-4">
            {activeSelectedGateway ? (
              <div className="border border-stone-200 rounded-2xl p-5 bg-white space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900">
                        {activeSelectedGateway.name} Methods
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          activeSelectedGateway.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {activeSelectedGateway.isActive ? "Active Gateway" : "Disabled"}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Code: <code className="font-mono bg-stone-100 px-1 py-0.5 rounded">{activeSelectedGateway.code}</code>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenMethodModal()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition cursor-pointer self-start sm:self-auto shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Method (e.g. bKash / Nagad)</span>
                  </button>
                </div>

                {/* Sub-methods Grid */}
                {!activeSelectedGateway.methods || activeSelectedGateway.methods.length === 0 ? (
                  <div className="text-center py-8 bg-stone-50 rounded-xl border border-dashed border-stone-200 space-y-2">
                    <Info className="w-6 h-6 text-stone-400 mx-auto" />
                    <p className="text-xs font-semibold text-stone-600">
                      No specific payment methods added under {activeSelectedGateway.name} yet.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleOpenMethodModal()}
                      className="text-xs font-bold text-stone-900 underline hover:text-stone-700"
                    >
                      Click here to add the first method
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeSelectedGateway.methods.map((method) => (
                      <div
                        key={method._id || method.code}
                        className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-stone-300 transition"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-xs">{method.name}</span>
                            <code className="text-[10px] font-mono bg-stone-200/80 px-1.5 py-0.5 rounded text-stone-700">
                              {method.code}
                            </code>
                            {method.isActive ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full">
                                <XCircle className="w-3 h-3" /> Disabled
                              </span>
                            )}
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                method.type === "online"
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {method.type === "online" ? "Online Instant" : "Manual Trx"}
                            </span>
                          </div>

                          {method.accountNumber && (
                            <p className="text-xs text-stone-600 font-medium">
                              Wallet / Account No:{" "}
                              <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                                {method.accountNumber}
                              </span>
                            </p>
                          )}

                          {method.instruction && (
                            <p className="text-[11px] text-stone-500 italic">
                              "{method.instruction}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => handleOpenMethodModal(method)}
                            className="px-3 py-1.5 text-xs font-bold bg-white border border-stone-200 hover:bg-stone-100 text-stone-800 rounded-lg transition"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete payment method '${method.name}'?`)) {
                                deleteMethodMut.mutate(method._id);
                              }
                            }}
                            className="px-3 py-1.5 text-xs font-bold bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 rounded-lg transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-500">
                Select a gateway category from the left column to manage its methods.
              </div>
            )}
          </div>
        </div>
      )}

      {/* GATEWAY CATEGORY MODAL */}
      {showGatewayModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-stone-200">
            <h3 className="text-sm font-bold text-stone-900">
              {editingGateway ? "Edit Gateway Category" : "Add New Gateway Category"}
            </h3>

            <form onSubmit={submitGatewayForm} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={gatewayForm.name}
                  onChange={(e) => setGatewayForm({ ...gatewayForm, name: e.target.value })}
                  placeholder="e.g. Mobile Banking"
                  className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Unique Code
                </label>
                <input
                  type="text"
                  value={gatewayForm.code}
                  onChange={(e) => setGatewayForm({ ...gatewayForm, code: e.target.value })}
                  placeholder="e.g. mobile_banking"
                  disabled={Boolean(editingGateway)}
                  className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900 font-mono disabled:bg-stone-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={gatewayForm.description}
                  onChange={(e) => setGatewayForm({ ...gatewayForm, description: e.target.value })}
                  placeholder="e.g. Mobile wallet payments like bKash, Nagad"
                  className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="gatewayActive"
                  checked={gatewayForm.isActive}
                  onChange={(e) => setGatewayForm({ ...gatewayForm, isActive: e.target.checked })}
                  className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                />
                <label htmlFor="gatewayActive" className="text-xs font-bold text-stone-800">
                  Enable Gateway Category
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowGatewayModal(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={gatewayMutation.isPending}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-xs disabled:bg-stone-300"
                >
                  {gatewayMutation.isPending ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAYMENT METHOD MODAL (e.g. bKash / Nagad / SSLCommerze) */}
      {showMethodModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-stone-200">
            <h3 className="text-sm font-bold text-stone-900">
              {editingMethod
                ? `Edit Method in ${activeSelectedGateway?.name}`
                : `Add New Method under ${activeSelectedGateway?.name}`}
            </h3>

            <form onSubmit={submitMethodForm} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Method Name (e.g. bKash)
                  </label>
                  <input
                    type="text"
                    value={methodForm.name}
                    onChange={(e) => setMethodForm({ ...methodForm, name: e.target.value })}
                    placeholder="e.g. bKash, Nagad, SSLCommerze"
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Method Code
                  </label>
                  <input
                    type="text"
                    value={methodForm.code}
                    onChange={(e) => setMethodForm({ ...methodForm, code: e.target.value })}
                    placeholder="e.g. bkash, nagad, sslcommerze"
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Merchant / Wallet / Account Number
                </label>
                <input
                  type="text"
                  value={methodForm.accountNumber}
                  onChange={(e) => setMethodForm({ ...methodForm, accountNumber: e.target.value })}
                  placeholder="e.g. 01799362609 or DBBL A/C 12345"
                  className="w-full px-3.5 py-2 text-xs font-mono font-bold border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Payment Instruction
                </label>
                <textarea
                  rows={2}
                  value={methodForm.instruction}
                  onChange={(e) => setMethodForm({ ...methodForm, instruction: e.target.value })}
                  placeholder="Instructions for customer during checkout..."
                  className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Gateway Type
                  </label>
                  <select
                    value={methodForm.type}
                    onChange={(e) => setMethodForm({ ...methodForm, type: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900 bg-white"
                  >
                    <option value="manual">Manual (TrxID Entry)</option>
                    <option value="online">Online Automated Gateway</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="requiresTxn"
                    checked={methodForm.requiresTxnId}
                    onChange={(e) => setMethodForm({ ...methodForm, requiresTxnId: e.target.checked })}
                    className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                  />
                  <label htmlFor="requiresTxn" className="text-xs font-bold text-stone-800">
                    Require TrxID Input
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="methodActive"
                  checked={methodForm.isActive}
                  onChange={(e) => setMethodForm({ ...methodForm, isActive: e.target.checked })}
                  className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                />
                <label htmlFor="methodActive" className="text-xs font-bold text-stone-800">
                  Enable Method for Customers
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowMethodModal(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={methodMutation.isPending}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-xs disabled:bg-stone-300"
                >
                  {methodMutation.isPending ? "Saving Method..." : "Save Method"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentGatewayManager;

import React, { useState } from "react";
import { MapPin, Home, Building2, Plus, Edit2, CheckCircle2, X, Phone, User, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBillingAddress, updateAddress } from "../../server/billing/billing";
import { toast } from "react-toastify";

const DeliveryAddress = ({
  addresses = [],
  selectedAddress,
  onSelectAddress,
  isLoadingAddresses,
}) => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    addressLine: "",
    city: "",
    divisionOrState: "",
    postalCode: "",
    country: "Bangladesh",
    addressType: "home",
    isDefault: true,
  });

  const openAddModal = () => {
    setEditingAddr(null);
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      addressLine: "",
      city: "",
      divisionOrState: "",
      postalCode: "",
      country: "Bangladesh",
      addressType: "home",
      isDefault: true,
    });
    setShowModal(true);
  };

  const openEditModal = (addr) => {
    setEditingAddr(addr);
    setFormData({
      firstName: addr.firstName || "",
      lastName: addr.lastName || "",
      phone: addr.phone || "",
      addressLine: addr.addressLine || addr.shippingAddress?.address || "",
      city: addr.city || addr.shippingAddress?.city || "",
      divisionOrState: addr.divisionOrState || addr.shippingAddress?.state || "",
      postalCode: addr.postalCode || addr.shippingAddress?.zip || "",
      country: addr.country || "Bangladesh",
      addressType: addr.addressType || "home",
      isDefault: addr.isDefault || false,
    });
    setShowModal(true);
  };

  // Add/Update Mutation
  const { mutate: saveAddressMutation, isPending: isSaving } = useMutation({
    mutationFn: (data) => {
      if (editingAddr?._id) {
        return updateAddress(editingAddr._id, data);
      }
      return addBillingAddress(data);
    },
    onSuccess: (res) => {
      if (res?.data?.success) {
        toast.success(editingAddr ? "Address updated!" : "New address added!");
        setShowModal(false);
        queryClient.invalidateQueries(["addresses"]);
        queryClient.invalidateQueries(["address"]);
      } else {
        toast.error(res?.data?.message || "Failed to save address");
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Error saving address");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.addressLine ||
      !formData.city ||
      !formData.divisionOrState ||
      !formData.postalCode
    ) {
      toast.error("Please fill in all required address fields");
      return;
    }
    saveAddressMutation(formData);
  };

  const currentAddr = selectedAddress || addresses[0];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-stone-900" />
          <h2 className="text-base font-bold text-stone-900">Delivery Address</h2>
        </div>

        <button
          onClick={openAddModal}
          className="text-xs font-bold text-stone-700 hover:text-stone-900 flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200/70 px-3.5 py-2 rounded-xl transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Address</span>
        </button>
      </div>

      {isLoadingAddresses ? (
        <div className="flex items-center gap-2 py-6 text-xs text-stone-500 font-semibold">
          <Loader2 className="w-4 h-4 animate-spin text-stone-900" />
          <span>Loading delivery addresses...</span>
        </div>
      ) : !addresses || addresses.length === 0 ? (
        <div className="bg-stone-50 border border-dashed border-stone-300 rounded-2xl p-6 text-center space-y-3">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-stone-900">No delivery address found</p>
            <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
              Add your delivery address below to complete checkout and receive your order.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            + Add Delivery Address
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* List of Address Cards */}
          {addresses.map((addr) => {
            const isSelected = (currentAddr?._id || currentAddr?.id) === (addr._id || addr.id);
            const street = addr.addressLine || addr.shippingAddress?.address || "";
            const city = addr.city || addr.shippingAddress?.city || "";
            const state = addr.divisionOrState || addr.shippingAddress?.state || "";
            const zip = addr.postalCode || addr.shippingAddress?.zip || "";

            return (
              <div
                key={addr._id}
                onClick={() => onSelectAddress && onSelectAddress(addr)}
                className={`p-4 rounded-2xl border transition cursor-pointer relative ${
                  isSelected
                    ? "bg-stone-50 border-stone-900 shadow-xs"
                    : "bg-white border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                        isSelected ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white"
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">
                          {addr.firstName} {addr.lastName}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                          {addr.addressType || "Home"}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-700 font-medium leading-relaxed">
                        {street}, {city}, {state} {zip ? `- ${zip}` : ""}
                      </p>

                      <p className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{addr.phone}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(addr);
                    }}
                    className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
                    title="Edit address"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-stone-900">
                {editingAddr ? "Edit Delivery Address" : "Add Delivery Address"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-stone-400 hover:text-stone-900 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs bg-stone-50 focus:bg-white focus:outline-none focus:border-stone-900"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs bg-stone-50 focus:bg-white focus:outline-none focus:border-stone-900"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs bg-stone-50 focus:bg-white focus:outline-none focus:border-stone-900"
                  placeholder="017XXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Street Address Line *</label>
                <input
                  type="text"
                  required
                  value={formData.addressLine}
                  onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs bg-stone-50 focus:bg-white focus:outline-none focus:border-stone-900"
                  placeholder="House #12, Road #4, Block C"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs bg-stone-50 focus:bg-white focus:outline-none focus:border-stone-900"
                    placeholder="Dhaka"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Division / State *</label>
                  <input
                    type="text"
                    required
                    value={formData.divisionOrState}
                    onChange={(e) => setFormData({ ...formData, divisionOrState: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs bg-stone-50 focus:bg-white focus:outline-none focus:border-stone-900"
                    placeholder="Dhaka Division"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs bg-stone-50 focus:bg-white focus:outline-none focus:border-stone-900"
                    placeholder="1212"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Address Label</label>
                  <select
                    value={formData.addressType}
                    onChange={(e) => setFormData({ ...formData, addressType: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs bg-stone-50 focus:bg-white focus:outline-none focus:border-stone-900"
                  >
                    <option value="home">Home</option>
                    <option value="office">Office</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-stone-200 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Address</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(DeliveryAddress);
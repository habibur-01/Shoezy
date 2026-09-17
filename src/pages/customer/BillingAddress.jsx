import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  getUserAddresses,
  addBillingAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../server/billing/billing";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  Plus,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  Trash2,
  Edit3,
  Home,
  Briefcase,
  Globe,
  Tag,
} from "lucide-react";

// 🔹 Initial form values
const initialFormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  country: "Bangladesh",
  divisionOrState: "",
  city: "",
  area: "",
  postalCode: "",
  addressLine: "",
  addressType: "home",
  isDefault: false,
};

// 🔹 Validation Schema
const validationSchema = Yup.object({
  firstName: Yup.string().trim().required("First name is required"),
  lastName: Yup.string().trim().required("Last name is required"),
  phone: Yup.string().trim().required("Phone number is required"),
  country: Yup.string().trim().required("Country is required"),
  divisionOrState: Yup.string().trim().required("Division or State is required"),
  city: Yup.string().trim().required("City is required"),
  postalCode: Yup.string().trim().required("Postal/ZIP code is required"),
  addressLine: Yup.string().trim().required("Street address line is required"),
  addressType: Yup.string().oneOf(["home", "office", "other"]).default("home"),
  isDefault: Yup.boolean(),
});

const BillingAddress = () => {
  const user = useSelector((state) => state.auth.user);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user addresses on mount
  const loadAddresses = async () => {
    try {
      setLoading(true);
      const res = await getUserAddresses();
      if (res?.data?.success) {
        setAddresses(res.data.data || []);
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // Open modal for creating new address
  const handleAddNew = () => {
    setEditingAddress(null);
    setShowModal(true);
  };

  // Open modal for editing address
  const handleEdit = (addr) => {
    setEditingAddress(addr);
    setShowModal(true);
  };

  // Delete address
  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await deleteAddress(addressId);
      if (res?.data?.success) {
        toast.success("Address deleted successfully");
        loadAddresses();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete address");
    }
  };

  // Set default address
  const handleSetDefault = async (addressId) => {
    try {
      const res = await setDefaultAddress(addressId);
      if (res?.data?.success) {
        toast.success("Default address updated");
        loadAddresses();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to set default address");
    }
  };

  // Form submit handler (Create or Update)
  const handleSubmitForm = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);
      let res;
      if (editingAddress) {
        res = await updateAddress(editingAddress._id, values);
      } else {
        res = await addBillingAddress(values);
      }

      if (res?.data?.success) {
        toast.success(
          editingAddress
            ? "Address updated successfully!"
            : "New address added successfully!"
        );
        resetForm();
        setShowModal(false);
        setEditingAddress(null);
        loadAddresses();
      } else {
        toast.error(res?.data?.message || "Failed to save address");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error saving address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormInitialValues = () => {
    if (editingAddress) {
      return {
        firstName: editingAddress.firstName || "",
        lastName: editingAddress.lastName || "",
        phone: editingAddress.phone || "",
        country: editingAddress.country || "Bangladesh",
        divisionOrState: editingAddress.divisionOrState || "",
        city: editingAddress.city || "",
        area: editingAddress.area || "",
        postalCode: editingAddress.postalCode || "",
        addressLine: editingAddress.addressLine || "",
        addressType: editingAddress.addressType || "home",
        isDefault: editingAddress.isDefault || false,
      };
    }
    return {
      ...initialFormValues,
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
    };
  };

  return (
    <div className="flex-1 bg-[var(--color-background)] shadow-all rounded-xl px-6 sm:px-12 py-10 space-y-8">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2 className="text-[var(--color-red,#db4444)] font-semibold text-xl flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[var(--color-red,#db4444)]" />
            <span>Address Book & Management</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Manage your delivery and billing addresses for quick checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNew}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-2 transition cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Address Cards List */}
      {loading ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-stone-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500">Loading your address book...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="p-10 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-4">
          <div className="w-14 h-14 bg-stone-200 text-stone-600 rounded-full flex items-center justify-center mx-auto text-xl">
            <MapPin />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">No Saved Addresses Found</h3>
            <p className="text-xs text-stone-500 mt-1">
              Add your delivery address to enable express 1-click checkout.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddNew}
            className="px-5 py-2 bg-[var(--color-red,#db4444)] text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition cursor-pointer"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`p-6 rounded-2xl border transition-all space-y-4 relative ${
                addr.isDefault
                  ? "bg-white border-stone-900 ring-1 ring-stone-900 shadow-md"
                  : "bg-white border-stone-200/90 hover:border-stone-400 shadow-2xs"
              }`}
            >
              {/* Top Badges */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    {addr.addressType === "office" ? (
                      <Briefcase className="w-3 h-3 text-stone-600" />
                    ) : addr.addressType === "other" ? (
                      <Tag className="w-3 h-3 text-stone-600" />
                    ) : (
                      <Home className="w-3 h-3 text-stone-600" />
                    )}
                    <span>{addr.addressType || "home"}</span>
                  </span>

                  {addr.isDefault && (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Default</span>
                    </span>
                  )}
                </div>

                {/* Edit & Delete Actions */}
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(addr)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition cursor-pointer"
                    title="Edit Address"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(addr._id)}
                    className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer"
                    title="Delete Address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Name & Contact */}
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  <span>
                    {addr.firstName} {addr.lastName}
                  </span>
                </h3>
                <p className="text-xs text-stone-600 flex items-center gap-2 font-medium">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{addr.phone}</span>
                </p>
              </div>

              {/* Address Details */}
              <div className="text-xs text-stone-600 space-y-0.5 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
                <p className="font-semibold text-stone-900">{addr.addressLine}</p>
                {addr.area && <p>Area: {addr.area}</p>}
                <p>
                  {addr.city}, {addr.divisionOrState} — {addr.postalCode}
                </p>
                <p className="text-stone-400 font-medium">{addr.country}</p>
              </div>

              {/* Footer Actions */}
              {!addr.isDefault && (
                <button
                  type="button"
                  onClick={() => handleSetDefault(addr._id)}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition cursor-pointer text-center"
                >
                  Set as Default Address
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-red,#db4444)]" />
                <span>{editingAddress ? "Edit Saved Address" : "Add New Delivery Address"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-900 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <Formik
              initialValues={getFormInitialValues()}
              validationSchema={validationSchema}
              onSubmit={handleSubmitForm}
              enableReinitialize
            >
              {({ errors, touched, handleChange, handleBlur, values }) => (
                <Form className="space-y-4">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        First Name *
                      </label>
                      <Field
                        name="firstName"
                        type="text"
                        placeholder="John"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:ring-1 focus:ring-stone-900"
                      />
                      {errors.firstName && touched.firstName && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        Last Name *
                      </label>
                      <Field
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:ring-1 focus:ring-stone-900"
                      />
                      {errors.lastName && touched.lastName && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Address Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        Phone Number *
                      </label>
                      <Field
                        name="phone"
                        type="tel"
                        placeholder="+880 1712 345 678"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:ring-1 focus:ring-stone-900"
                      />
                      {errors.phone && touched.phone && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        Address Label Type
                      </label>
                      <Field
                        as="select"
                        name="addressType"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer"
                      >
                        <option value="home">Home (Residence)</option>
                        <option value="office">Office (Workplace)</option>
                        <option value="other">Other</option>
                      </Field>
                    </div>
                  </div>

                  {/* Address Line */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Street Address Line *
                    </label>
                    <Field
                      name="addressLine"
                      type="text"
                      placeholder="House / Flat No., Road No., Street Name"
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:ring-1 focus:ring-stone-900"
                    />
                    {errors.addressLine && touched.addressLine && (
                      <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.addressLine}</p>
                    )}
                  </div>

                  {/* City, Division/State, Postal Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        City / District *
                      </label>
                      <Field
                        name="city"
                        type="text"
                        placeholder="Dhaka"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:ring-1 focus:ring-stone-900"
                      />
                      {errors.city && touched.city && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        Division / State *
                      </label>
                      <Field
                        name="divisionOrState"
                        type="text"
                        placeholder="Dhaka Division"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:ring-1 focus:ring-stone-900"
                      />
                      {errors.divisionOrState && touched.divisionOrState && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.divisionOrState}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        Postal Code *
                      </label>
                      <Field
                        name="postalCode"
                        type="text"
                        placeholder="1207"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:ring-1 focus:ring-stone-900"
                      />
                      {errors.postalCode && touched.postalCode && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.postalCode}</p>
                      )}
                    </div>
                  </div>

                  {/* Country & Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        Country *
                      </label>
                      <Field
                        name="country"
                        type="text"
                        placeholder="Bangladesh"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:ring-1 focus:ring-stone-900"
                      />
                      {errors.country && touched.country && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.country}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        Area / Landmark (Optional)
                      </label>
                      <Field
                        name="area"
                        type="text"
                        placeholder="Dhanmondi"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>
                  </div>

                  {/* Set as Default Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-center space-x-2 text-xs text-stone-700 cursor-pointer select-none">
                      <Field
                        type="checkbox"
                        name="isDefault"
                        className="w-4 h-4 text-stone-900 rounded border-stone-300 focus:ring-stone-900"
                      />
                      <span>Set as my default shipping & billing address</span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-5 py-2.5 text-stone-600 border border-stone-300 rounded-lg text-xs font-semibold hover:bg-stone-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting
                        ? "Saving..."
                        : editingAddress
                        ? "Update Address"
                        : "Save Address"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingAddress;

import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Search,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { CustomerAnalytics } from '../../types';

interface CustomerInfoFormProps {
  customerName: string;
  setCustomerName: (val: string) => void;
  customerEmail: string;
  setCustomerEmail: (val: string) => void;
  customerPhone: string;
  setCustomerPhone: (val: string) => void;
  street: string;
  setStreet: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  state: string;
  setState: (val: string) => void;
  postalCode: string;
  setPostalCode: (val: string) => void;
  country: string;
  setCountry: (val: string) => void;
  internalNotes: string;
  setInternalNotes: (val: string) => void;
}

export const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  customerName,
  setCustomerName,
  customerEmail,
  setCustomerEmail,
  customerPhone,
  setCustomerPhone,
  street,
  setStreet,
  city,
  setCity,
  state,
  setState,
  postalCode,
  setPostalCode,
  country,
  setCountry,
  internalNotes,
  setInternalNotes,
}) => {
  const { customers } = useAdmin();
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  // Filtered customer list for quick fill
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const handleSelectCustomer = (c: CustomerAnalytics) => {
    setCustomerName(c.name);
    setCustomerEmail(c.email);
    setCity(c.city);
    setCountry(c.country);
    if (!street) setStreet('100 Main Street');
    if (!state) setState('CA');
    if (!postalCode) setPostalCode('90210');
    if (!customerPhone) setCustomerPhone('+1 (555) 019-4820');
    setShowCustomerDropdown(false);
    setCustomerSearch('');
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-zinc-100">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <span>2. Customer & Delivery Destination</span>
            <span className="text-[11px] font-normal text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
              Recipient Information
            </span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Enter the buyer's contact details and physical delivery address.
          </p>
        </div>

        {/* Quick Autofill from Past Customers */}
        <div className="relative">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="btn-toggle-customer-autofill"
              onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Autofill Past Customer
            </button>
          </div>

          {showCustomerDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-zinc-200 rounded-xl shadow-lg z-30 p-2 text-xs">
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search past buyers..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <div className="max-h-48 overflow-y-auto divide-y divide-zinc-100">
                {filteredCustomers.length === 0 ? (
                  <div className="py-3 text-center text-zinc-400">No matching past customer found</div>
                ) : (
                  filteredCustomers.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectCustomer(c)}
                      className="w-full text-left p-2 hover:bg-zinc-50 rounded-md flex flex-col transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-900">{c.name}</span>
                        <span className="text-[10px] text-zinc-400">{c.tier}</span>
                      </div>
                      <span className="text-zinc-500 truncate">{c.email}</span>
                      <span className="text-[10px] text-zinc-400">
                        {c.city}, {c.country}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Contact Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label htmlFor="input-customer-name" className="block text-xs font-medium text-zinc-700 mb-1">
            Customer Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              id="input-customer-name"
              type="text"
              required
              placeholder="e.g., Emily Richardson"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-zinc-50/50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-800"
            />
          </div>
        </div>

        <div>
          <label htmlFor="input-customer-email" className="block text-xs font-medium text-zinc-700 mb-1">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              id="input-customer-email"
              type="email"
              required
              placeholder="e.g., emily@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-zinc-50/50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-800"
            />
          </div>
        </div>

        <div>
          <label htmlFor="input-customer-phone" className="block text-xs font-medium text-zinc-700 mb-1">
            Phone Number <span className="text-zinc-400 font-normal">(for delivery SMS)</span>
          </label>
          <div className="relative">
            <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              id="input-customer-phone"
              type="tel"
              placeholder="e.g., +1 (555) 342-9182"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-zinc-50/50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-800"
            />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="p-3.5 bg-zinc-50/70 border border-zinc-200/80 rounded-xl mb-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 mb-2.5">
          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
          Shipping Destination Address
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor="input-street-address" className="block text-[11px] font-medium text-zinc-600 mb-0.5">
              Street Address & Apartment / Suite
            </label>
            <input
              id="input-street-address"
              type="text"
              placeholder="e.g., 450 Lexington Ave, Suite 12B"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full text-xs px-3 py-1.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-800"
            />
          </div>

          <div>
            <label htmlFor="input-city" className="block text-[11px] font-medium text-zinc-600 mb-0.5">
              City
            </label>
            <input
              id="input-city"
              type="text"
              placeholder="e.g., New York"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full text-xs px-3 py-1.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-800"
            />
          </div>

          <div>
            <label htmlFor="input-state" className="block text-[11px] font-medium text-zinc-600 mb-0.5">
              State / Province
            </label>
            <input
              id="input-state"
              type="text"
              placeholder="e.g., NY"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full text-xs px-3 py-1.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-800"
            />
          </div>

          <div>
            <label htmlFor="input-postal-code" className="block text-[11px] font-medium text-zinc-600 mb-0.5">
              Postal / ZIP Code
            </label>
            <input
              id="input-postal-code"
              type="text"
              placeholder="e.g., 10017"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full text-xs px-3 py-1.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-800"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor="select-country" className="block text-[11px] font-medium text-zinc-600 mb-0.5">
              Country
            </label>
            <select
              id="select-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full text-xs px-3 py-1.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-800"
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Japan">Japan</option>
              <option value="Sweden">Sweden</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Colombia">Colombia</option>
              <option value="Other">Other International Destination</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Internal Remarks */}
      <div>
        <label htmlFor="textarea-internal-notes" className="block text-xs font-medium text-zinc-700 mb-1 flex items-center gap-1.5">
          <ClipboardList className="w-3.5 h-3.5 text-zinc-400" />
          Staff Internal Notes & Delivery Dispatch Instructions{' '}
          <span className="text-zinc-400 font-normal">(visible to fulfillment team only)</span>
        </label>
        <textarea
          id="textarea-internal-notes"
          rows={2}
          placeholder="e.g., Leave package with reception / Customer negotiated express dispatch / Verified payment receipt via WhatsApp screenshot..."
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
          className="w-full text-xs px-3 py-2 bg-zinc-50/50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-800 placeholder-zinc-400"
        />
      </div>
    </div>
  );
};

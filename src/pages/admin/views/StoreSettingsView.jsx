import React, { useState } from 'react';
import {
  Settings,
  Store,
  Receipt,
  Coins,
  Truck,
  CreditCard,
  Bell,
  Save,
  CheckCircle2,
  Building,
  Mail,
  Phone,
  Globe,
  Plus,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const StoreSettingsView = ({
  initialTab = 'store_info',
}) => {
  const { shippingCarriers, logActivity } = useAdmin();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Store Information state
  const [storeName, setStoreName] = useState('CommerceHQ Flagship');
  const [supportEmail, setSupportEmail] = useState('support@commercehq.io');
  const [supportPhone, setSupportPhone] = useState('+1 (800) 555-0199');
  const [storeAddress, setStoreAddress] = useState('100 Market St, Suite 400, San Francisco, CA 94105');
  const [timezone, setTimezone] = useState('America/Los_Angeles (PST)');

  // Tax state
  const [taxClasses, setTaxClasses] = useState([
    { id: 'tax_std', name: 'Standard US State Sales Tax', rate: '7.25%', default: true },
    { id: 'tax_eu_vat', name: 'EU Digital Services VAT', rate: '20.00%', default: false },
    { id: 'tax_exempt', name: 'Zero-Rate / B2B Resale Exemption', rate: '0.00%', default: false },
  ]);

  // Currency state
  const [currencies, setCurrencies] = useState([
    { code: 'USD', symbol: '$', name: 'US Dollar', rate: '1.000', isBase: true },
    { code: 'EUR', symbol: '€', name: 'Euro', rate: '0.920', isBase: false },
    { code: 'GBP', symbol: '£', name: 'British Pound', rate: '0.785', isBase: false },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: '148.50', isBase: false },
  ]);

  // Payment Methods state
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'stripe', name: 'Stripe Credit & Debit Cards', enabled: true, mode: 'Live Production' },
    { id: 'paypal', name: 'PayPal Express Checkout', enabled: true, mode: 'Live Production' },
    { id: 'applepay', name: 'Apple Pay & Google Pay Express', enabled: true, mode: 'Active (Web/Mobile)' },
    { id: 'cod', name: 'Cash on Delivery (COD) / Direct Invoicing', enabled: true, mode: 'Regional Metro' },
  ]);

  // Notification settings
  const [notifications, setNotifications] = useState({
    orderConfirmationEmail: true,
    shippingUpdateSms: true,
    lowStockManagerAlert: true,
    refundAuthorizedWebhook: false,
  });

  const handleSave = () => {
    logActivity('STORE_SETTINGS_UPDATED', 'Security', `Saved updates for store preferences (${activeTab})`, 'info');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Store Settings & Configuration</h1>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
              System Admin
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure global store identity, multi-currency valuations, fiscal tax matrices, shipping methods, and webhooks.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {isSavedNotice && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Settings Saved!
            </span>
          )}
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Save Changes
          </button>
        </div>
      </div>

      {/* 6 Settings Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-zinc-200 rounded-xl overflow-x-auto shadow-2xs">
        <button
          onClick={() => setActiveTab('store_info')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'store_info'
              ? 'bg-zinc-900 text-white shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          Store Information
        </button>

        <button
          onClick={() => setActiveTab('tax')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'tax'
              ? 'bg-zinc-900 text-white shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          Tax
        </button>

        <button
          onClick={() => setActiveTab('currency')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'currency'
              ? 'bg-zinc-900 text-white shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          Currency
        </button>

        <button
          onClick={() => setActiveTab('shipping')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'shipping'
              ? 'bg-zinc-900 text-white shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          Shipping
        </button>

        <button
          onClick={() => setActiveTab('payment_methods')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'payment_methods'
              ? 'bg-zinc-900 text-white shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          Payment Methods
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-zinc-900 text-white shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          Notification Settings
        </button>
      </div>

      {/* TAB CONTENT: Store Info */}
      {activeTab === 'store_info' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-2xs space-y-4 max-w-2xl">
          <h3 className="font-bold text-sm text-zinc-900">Legal Store Identity & Branding</h3>
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Customer Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Support Telephone</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Registered Business Address</label>
              <input
                type="text"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Store Primary Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:outline-hidden"
              >
                <option>America/Los_Angeles (PST)</option>
                <option>America/New_York (EST)</option>
                <option>Europe/London (GMT)</option>
                <option>Asia/Tokyo (JST)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Tax */}
      {activeTab === 'tax' && (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
            <h3 className="font-bold text-xs text-zinc-900">Tax Classes & Regional Rates</h3>
            <button
              onClick={() => alert('Add tax class')}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
            >
              + Add Tax Rule
            </button>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Tax Class</th>
                <th className="py-3 px-4">Applicable Rate</th>
                <th className="py-3 px-4">Default Rule</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {taxClasses.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-50/60">
                  <td className="py-3 px-4 font-semibold text-zinc-900">{t.name}</td>
                  <td className="py-3 px-4 font-mono font-bold text-zinc-800">{t.rate}</td>
                  <td className="py-3 px-4">
                    {t.default ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                        Default Class
                      </span>
                    ) : (
                      <span className="text-zinc-400">Optional</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-indigo-600 font-semibold hover:text-indigo-800">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: Currency */}
      {activeTab === 'currency' && (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
            <h3 className="font-bold text-xs text-zinc-900">Supported Currencies & Live Exchange</h3>
            <button
              onClick={() => alert('Add currency')}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
            >
              + Add Currency
            </button>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Currency</th>
                <th className="py-3 px-4">Symbol</th>
                <th className="py-3 px-4">Exchange Rate (vs Base USD)</th>
                <th className="py-3 px-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {currencies.map((c) => (
                <tr key={c.code} className="hover:bg-zinc-50/60">
                  <td className="py-3 px-4 font-semibold text-zinc-900">
                    {c.name} ({c.code})
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-zinc-900">{c.symbol}</td>
                  <td className="py-3 px-4 font-mono text-zinc-700">{c.rate}</td>
                  <td className="py-3 px-4">
                    {c.isBase ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                        Base Currency
                      </span>
                    ) : (
                      <span className="text-zinc-500">Converted</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: Shipping */}
      {activeTab === 'shipping' && (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-zinc-200">
            <h3 className="font-bold text-xs text-zinc-900">Integrated Carriers & Default Shipping Zones</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Automated rate calculators and tracking prefixes.</p>
          </div>
          <div className="divide-y divide-zinc-100 text-xs">
            {shippingCarriers.map((carrier) => (
              <div key={carrier.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-zinc-900">{carrier.name}</div>
                  <div className="text-[11px] text-zinc-500">
                    {carrier.serviceType} • Transit: {carrier.estimatedDays}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-zinc-900">${carrier.baseRate.toFixed(2)}</span>
                  <div className="font-mono text-[10px] text-zinc-400">Prefix: {carrier.trackingPrefix}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Payment Methods */}
      {activeTab === 'payment_methods' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs space-y-4">
          <h3 className="font-bold text-xs text-zinc-900">Merchant Payment Gateways</h3>
          <div className="space-y-3">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className="p-4 border border-zinc-200 rounded-xl flex items-center justify-between bg-zinc-50/50"
              >
                <div>
                  <div className="font-semibold text-xs text-zinc-900">{pm.name}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">{pm.mode}</div>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                  Connected & Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs space-y-4 max-w-xl text-xs">
          <h3 className="font-bold text-sm text-zinc-900">Store Notifications & Webhooks</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 cursor-pointer">
              <div>
                <div className="font-semibold text-zinc-900">Order Confirmation Emails</div>
                <div className="text-[11px] text-zinc-500">Send instant PDF invoice to buyer upon checkout</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.orderConfirmationEmail}
                onChange={(e) =>
                  setNotifications({ ...notifications, orderConfirmationEmail: e.target.checked })
                }
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 cursor-pointer">
              <div>
                <div className="font-semibold text-zinc-900">SMS Outbound Dispatch Alerts</div>
                <div className="text-[11px] text-zinc-500">Ping customer phone when carrier tracking begins</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.shippingUpdateSms}
                onChange={(e) =>
                  setNotifications({ ...notifications, shippingUpdateSms: e.target.checked })
                }
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 cursor-pointer">
              <div>
                <div className="font-semibold text-zinc-900">Low Stock Safety Reorder Alerts</div>
                <div className="text-[11px] text-zinc-500">Notify store managers when inventory hits threshold</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.lowStockManagerAlert}
                onChange={(e) =>
                  setNotifications({ ...notifications, lowStockManagerAlert: e.target.checked })
                }
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

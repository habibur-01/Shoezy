import React, { useState } from "react";
import { FileText, Ruler, ShieldAlert, Star, Check } from "lucide-react";

const DetailsTabSection = ({ description }) => {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description & Details", icon: FileText },
    { id: "size", label: "Size Chart & Fit", icon: Ruler },
    { id: "terms", label: "Shipping & Returns", icon: ShieldAlert },
  ];

  return (
    <div className="my-12 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Tab Navigation Bar */}
      <div className="flex border-b border-stone-200 bg-stone-50/50 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap border-b-2 -mb-px ${
                isActive
                  ? "border-stone-900 text-stone-900 bg-white"
                  : "border-transparent text-stone-500 hover:text-stone-900 hover:bg-stone-100/50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-stone-900" : "text-stone-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Box */}
      <div className="p-6 lg:p-8 text-stone-700 text-sm leading-relaxed">
        {activeTab === "description" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-extrabold text-stone-900 text-base mb-2">Product Overview</h3>
              <p className="text-stone-600 leading-relaxed font-normal">
                {description || "Designed for maximum comfort, durability, and style. Engineered with premium materials and ergonomic cushioning for all-day performance."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-3">Key Highlights</h4>
                <ul className="space-y-2">
                  {[
                    "Ergonomic cushioned footbed for long-lasting comfort",
                    "Breathable upper material designed for airflow",
                    "High-traction non-slip rubber outsole",
                    "Durable reinforced stitching for enhanced longevity",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-medium text-stone-600">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-3">Specifications</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500 font-medium">Upper Material</span>
                    <span className="font-semibold text-stone-800">Synthetic Leather / Mesh</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500 font-medium">Sole Material</span>
                    <span className="font-semibold text-stone-800">TPR / Rubber</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500 font-medium">Closure</span>
                    <span className="font-semibold text-stone-800">Lace-Up / Open</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500 font-medium">Care Instructions</span>
                    <span className="font-semibold text-stone-800">Wipe clean with a damp cloth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "size" && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-stone-900 text-base mb-2">Size Comparison Chart</h3>
            <p className="text-xs text-stone-500 mb-4">
              Refer to the measurements below to find your ideal fit.
            </p>
            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-900 font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3">US Size</th>
                    <th className="p-3">UK Size</th>
                    <th className="p-3">EU Size</th>
                    <th className="p-3">Foot Length (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  <tr>
                    <td className="p-3 font-semibold text-stone-900">6.0</td>
                    <td className="p-3">5.5</td>
                    <td className="p-3">39.0</td>
                    <td className="p-3">24.5 cm</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-900">7.0</td>
                    <td className="p-3">6.5</td>
                    <td className="p-3">40.0</td>
                    <td className="p-3">25.0 cm</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-900">8.0</td>
                    <td className="p-3">7.5</td>
                    <td className="p-3">41.0</td>
                    <td className="p-3">26.0 cm</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-900">9.0</td>
                    <td className="p-3">8.5</td>
                    <td className="p-3">42.5</td>
                    <td className="p-3">27.0 cm</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-900">10.0</td>
                    <td className="p-3">9.5</td>
                    <td className="p-3">44.0</td>
                    <td className="p-3">28.0 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "terms" && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-stone-900 text-base mb-2">Shipping & Return Guarantee</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <h4 className="font-bold text-stone-900 mb-1">Standard & Express Delivery</h4>
                <p className="text-stone-600">
                  Standard delivery arrives within 3-5 business days. Express shipping delivers within 24-48 hours. Tracking details are sent via email instantly.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <h4 className="font-bold text-stone-900 mb-1">30-Day Hassle-Free Returns</h4>
                <p className="text-stone-600">
                  If you are not completely satisfied with your purchase, return unworn items within 30 days for a full refund or exchange.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsTabSection;

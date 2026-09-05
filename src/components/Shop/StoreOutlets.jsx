import React from "react";
import { MapPin, Phone, Clock, Store, Navigation, ShieldCheck } from "lucide-react";

const outletsData = [
  {
    id: 1,
    name: "Shoezy Flagship Store — Dhanmondi",
    city: "Dhaka",
    area: "Dhanmondi",
    address: "House #42, Road #27 (Old), Dhanmondi 3A, Dhaka 1209",
    phone: "+880 1712-345678",
    hours: "Sat - Thu: 10:00 AM - 9:00 PM | Fri: 3:00 PM - 9:30 PM",
    isFlagship: true,
    mapUrl: "https://maps.google.com/?q=Dhanmondi+27+Dhaka",
  },
  {
    id: 2,
    name: "Shoezy Exclusive Outlet — Banani",
    city: "Dhaka",
    area: "Banani",
    address: "Block E, Road #11, Plot #68, Banani, Dhaka 1213",
    phone: "+880 1819-876543",
    hours: "Everyday: 10:30 AM - 9:00 PM",
    isFlagship: false,
    mapUrl: "https://maps.google.com/?q=Banani+Road+11+Dhaka",
  },
  {
    id: 3,
    name: "Shoezy Premium Outlet — Uttara",
    city: "Dhaka",
    area: "Uttara",
    address: "Sector 3, Sonargaon Janapath Road, Uttara Model Town, Dhaka 1230",
    phone: "+880 1911-223344",
    hours: "Sat - Thu: 10:00 AM - 9:00 PM",
    isFlagship: false,
    mapUrl: "https://maps.google.com/?q=Uttara+Sector+3+Dhaka",
  },
  {
    id: 4,
    name: "Shoezy Mega Store — Chittagong GEC",
    city: "Chittagong",
    area: "GEC Circle",
    address: "Central Plaza (2nd Floor), GEC Circle, Agrabad Access Road, Chittagong",
    phone: "+880 1611-554433",
    hours: "Sat - Thu: 10:00 AM - 8:30 PM",
    isFlagship: false,
    mapUrl: "https://maps.google.com/?q=GEC+Circle+Chittagong",
  },
];

const StoreOutlets = () => {
  return (
    <div className="my-14 p-8 sm:p-10 bg-stone-900 text-stone-100 rounded-3xl shadow-xl space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-widest inline-flex items-center gap-1.5 mb-2">
            <Store className="w-3.5 h-3.5" />
            <span>Retail Locations</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Our Physical Store Outlets
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
            Visit any of our physical outlets to try on shoes, experience premium customer service, or collect online orders.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-stone-300 bg-stone-800/80 px-4 py-2.5 rounded-xl border border-stone-700/60">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Official Authorized Retail Points</span>
        </div>
      </div>

      {/* Outlets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {outletsData.map((outlet) => (
          <div
            key={outlet.id}
            className="p-6 rounded-2xl bg-stone-800/60 border border-stone-700/80 hover:border-stone-500 transition-all duration-300 space-y-4 relative group"
          >
            {/* Top Outlet Name & Flagship Tag */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-700 text-stone-300">
                  {outlet.city} • {outlet.area}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5 group-hover:text-red-400 transition-colors">
                  {outlet.name}
                </h3>
              </div>

              {outlet.isFlagship && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white shadow-sm flex-shrink-0">
                  Flagship Store
                </span>
              )}
            </div>

            {/* Address */}
            <div className="flex items-start space-x-3 text-xs text-stone-300">
              <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{outlet.address}</span>
            </div>

            {/* Phone & Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-700/50 text-xs">
              <div className="flex items-center space-x-2.5 text-stone-300">
                <Phone className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                <span className="font-medium">{outlet.phone}</span>
              </div>
              <div className="flex items-center space-x-2.5 text-stone-300">
                <Clock className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                <span className="font-medium text-[11px] leading-tight">{outlet.hours}</span>
              </div>
            </div>

            {/* Map Link Action */}
            <div className="pt-1">
              <a
                href={outlet.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Location Directions</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreOutlets;

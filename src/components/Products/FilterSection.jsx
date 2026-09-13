import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 text-left hover:bg-stone-50 transition cursor-pointer select-none"
      >
        <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">{title}</h3>
        <ChevronDown
          className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="p-3.5 pt-0">{children}</div>}
    </div>
  );
};

export default FilterSection;
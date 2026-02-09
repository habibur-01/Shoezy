
import { ChevronDown } from "lucide-react";
import React from "react";

const FilterSection = ({ title, children }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <ChevronDown className="w-5 h-5 text-gray-500" />
    </div>
    {children}
  </div>
);

export default FilterSection;
import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

const PasswordStrengthMeter = ({ password = "" }) => {
  if (!password) return null;

  const checks = [
    { label: "At least 6 characters", valid: password.length >= 6 },
    { label: "Contains uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", valid: /[a-z]/.test(password) },
    { label: "Contains a number", valid: /[0-9]/.test(password) },
    { label: "Contains special character", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.valid).length;

  const getStrengthMeta = () => {
    if (score <= 1) return { text: "Weak", color: "bg-red-500", width: "20%", textColor: "text-red-500" };
    if (score === 2) return { text: "Fair", color: "bg-orange-500", width: "40%", textColor: "text-orange-500" };
    if (score === 3) return { text: "Good", color: "bg-yellow-500", width: "60%", textColor: "text-yellow-600" };
    if (score === 4) return { text: "Strong", color: "bg-blue-500", width: "80%", textColor: "text-blue-600" };
    return { text: "Very Strong", color: "bg-emerald-500", width: "100%", textColor: "text-emerald-600" };
  };

  const meta = getStrengthMeta();

  return (
    <div className="mt-2 space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100 transition-all duration-200">
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-gray-500">Password strength:</span>
        <span className={`font-semibold ${meta.textColor}`}>{meta.text}</span>
      </div>

      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${meta.color} transition-all duration-300 rounded-full`}
          style={{ width: meta.width }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
        {checks.map((check, index) => (
          <div key={index} className="flex items-center gap-1.5 text-xs">
            {check.valid ? (
              <FaCheck className="text-emerald-500 text-[10px] shrink-0" />
            ) : (
              <FaTimes className="text-gray-300 text-[10px] shrink-0" />
            )}
            <span className={check.valid ? "text-gray-700" : "text-gray-400"}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;

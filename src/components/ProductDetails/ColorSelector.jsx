import React from "react";
import { Check, Slash } from "lucide-react";

const ColorSelector = ({ colors = [], variants = [], selectedColor, onSelect }) => {
  // Map color names to exact hex/CSS fallback values for crisp rendering
  const colorMap = {
    black: "#18181b",
    white: "#ffffff",
    red: "#ef4444",
    blue: "#2563eb",
    green: "#16a34a",
    gray: "#6b7280",
    grey: "#6b7280",
    brown: "#78350f",
    amber: "#d97706",
    pink: "#ec4899",
    purple: "#9333ea",
    orange: "#ea580c",
    yellow: "#eab308",
  };

  // Extract colors with stock > 0
  const availableColors = [
    ...new Set(
      variants
        .filter((v) => Number(v.stock) > 0)
        .map((v) => v.color?.toLowerCase())
    ),
  ];

  if (!colors || colors.length === 0) return null;

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
          Color: <span className="font-extrabold text-stone-900 capitalize">{selectedColor || "Select option"}</span>
        </span>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {colors.map((color, index) => {
          const colorName = color.toLowerCase();
          const isAvailable = availableColors.length === 0 || availableColors.includes(colorName);
          const isSelected = selectedColor && selectedColor.toLowerCase() === colorName;
          const hexCode = colorMap[colorName] || colorName;

          return (
            <button
              key={index}
              disabled={!isAvailable}
              onClick={() => isAvailable && onSelect(color)}
              title={color}
              className={`relative w-9 h-9 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center border ${
                isSelected
                  ? "ring-2 ring-stone-900 ring-offset-2 border-transparent scale-105"
                  : "border-stone-300 hover:scale-105"
              } ${!isAvailable ? "opacity-40 cursor-not-allowed" : ""}`}
              style={{ backgroundColor: hexCode }}
            >
              {isSelected && (
                <Check
                  className={`w-4 h-4 ${
                    colorName === "white" || colorName === "yellow"
                      ? "text-stone-900"
                      : "text-white"
                  }`}
                />
              )}
              {!isAvailable && (
                <span className="absolute inset-0 flex items-center justify-center text-stone-500">
                  <Slash className="w-5 h-5 text-stone-400 stroke-[2.5]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorSelector;

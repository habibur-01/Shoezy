import { Slash } from "lucide-react";
import React from "react";

const ColorSelector = ({ colors = [], variants = [], selectedColor, onSelect }) => {

    // Extract which colors actually exist in variants
    // Extract which colors have stock > 0
    const availableColors = [
        ...new Set(
            variants
                .filter(v => v.stock > 0)    
                .map(v => v.color)       
        )
    ];

    return (
        <div className="mt-4">
            <span className="font-semibold">Color:</span>

            <div className="flex gap-2 mt-2 flex-wrap">
                {colors.map((color, index) => {
                    const isAvailable = availableColors.includes(color);
                    const bgColor = color.toLowerCase()
                    const isSelected = selectedColor&&selectedColor.toLowerCase() === bgColor;

                    return (
                        <button
                            key={index}
                            disabled={!isAvailable}
                            className={`relative px-3 py-1 border capitalize bg-${bgColor} h-8 w-8
                ${isSelected ? "border-red-200 border-2 font-semibold" : "border-gray-300"}
                ${!isAvailable ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "cursor-pointer"}
              `}
                            onClick={() => isAvailable && onSelect(color)}
                        >

                            {!isAvailable && (
                                <span className="absolute inset-0 flex items-center justify-center text-lg text-gray-500 font-bold">
                                    <Slash size={22} />
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

import React from "react";

const TitleSection = ({ title }) => {
  return (
    <div className="flex justify-center mb-20">
      <p className="relative max-w-max text-4xl font-medium text-center after:content-[''] after:w-1/2 after:h-1 after:bg-[var(--color-text)] after:absolute after:left-1/2 after:-translate-x-1/2 after:top-full after:translate-y-2">
        {title}
      </p>
    </div>
  );
};

export default TitleSection;

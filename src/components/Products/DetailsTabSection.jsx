import React, { useState } from "react";

const DetailsTabSection = () => {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "DESCRIPTION" },
    { id: "terms", label: "TERMS AND CONDITIONS" },
    { id: "size", label: "SIZE CHART" },
  ];

  return (
    <div className=" my-10 p-4">
      {/* Tabs */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-semibold text-sm transition-all cursor-pointer ${
              activeTab === tab.id
                ? "border-b-2 border-black text-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4 text-gray-800 text-sm leading-relaxed">
        {activeTab === "description" && (
          <div>
            <p className="mb-4">
              Stay stylish and comfortable with the Bata Belt Sandal for Men,
              featuring a lightweight design, secure grip, and durable
              build—perfect for everyday wear.
            </p>

            <h3 className="font-bold mb-2">FEATURES:</h3>
            <ul className="mb-4 space-y-1">
              <li>Type: Sandal</li>
              <li>Gender: Men</li>
              <li>Upper Material: PU</li>
              <li>Color: Dark Brown</li>
              <li>Sole: TPR</li>
              <li>Closing: Open</li>
            </ul>

            <h3 className="font-bold mb-2">STYLE TIPS:</h3>
            <p>
              Elevate your casual look by pairing these sandals with a classic
              tee and casual trousers for a laid-back yet stylish vibe.
              Alternatively, opt for a polo shirt and cargo pants to
              effortlessly complement the sandal's versatile design.
            </p>
          </div>
        )}

        {activeTab === "terms" && (
          <div>
            <p>
              Here you can add your terms and conditions content. Example:
              Return within 7 days, warranty policies, and delivery details.
            </p>
          </div>
        )}

        {activeTab === "size" && (
          <div>
            <p>
              Size chart details will go here. You can use a table or grid to
              display available sizes (EU, US, UK measurements, etc.).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsTabSection;

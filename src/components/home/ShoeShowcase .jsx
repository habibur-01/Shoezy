import React from "react";
import sneakers from "../../assets/images/banner/walking_style.jpg";
import runner from "../../assets/images/banner/running.jpg";
import Container from "../common/Container/Container";

const ShoeShowcase = () => {
  return (
    <Container>
      <div className="space-y-8 ">
        {/* Sneakers Shoes */}
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <img
            src={sneakers}
            alt="Sneakers"
            className="w-full lg:w-1/2 rounded shadow-md"
          />
          <div className="text-center w-full lg:w-1/2 px-12 space-y-6">
            <h2 className="text-3xl font-semibold  text-[var(--color-black)]">
              Sneakers Shoes
            </h2>
            <p className="text-gray-500 text-base">
              Shoes are arguably the most important accessory in your closet you
              need them every day. They enhance or distract from every outfit
              and your entire mood can be affected by how they feel.
            </p>
            <button className="btn-black">READ MORE</button>
          </div>
        </div>

        {/* Running Shoes */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8">
          <div className="text-center w-full lg:w-1/2 px-12 space-y-6">
            <h2 className="text-3xl font-semibold  text-[var(--color-black)]">
              Running Shoes
            </h2>
            <p className="text-gray-500 text-base">
              The capacity to store and return energy in legs and feet that
              behave like springs is crucial in human running economy. Recent
              comparisons of shod and barefoot running may actually impede leg.
            </p>
            <button className="btn-black">READ MORE</button>
          </div>
          <img
            src={runner}
            alt="Running Shoes"
            className="w-full lg:w-1/2 rounded shadow-md"
          />
        </div>
      </div>
    </Container>
  );
};

export default ShoeShowcase;

import React from "react";
import Container from "../common/Container/Container";
import cover1 from "../../assets/images/banner/discount.png";
import cover2 from "../../assets/images/banner/discount2.png";

const DiscountSection = () => {
  return (
    <Container>
      <div className="flex justify-between gap-10">
        <div className="w-1/2 h-[450px] relative group hover:cursor-pointer">
          <div className="w-full h-full overflow-hidden">
            <img
              src={cover1}
              alt=""
              className="h-full w-full group-hover:scale-105"
            />
          </div>
          <div className="w-full h-full absolute bg-transparent top-0 left-0">
            <div className="h-full w-full px-10 space-y-6 flex flex-col justify-center">
              <p className="text-lg text-[var(--color-black)]">
                Flat 25% Discount
              </p>
              <p className="text-4xl font-medium text-[var(--color-black)]">
                Shoetopia Smart <br /> Casual Shoes
              </p>
              <div>
                <button className="bg-[var(--color-black)] uppercase text-base text-[var(--color-white)] px-5 py-2.5 font-medium hover:bg-[var(--color-black)]/75 hover:cursor-pointer">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 h-[450px] relative group  hover:cursor-pointer">
          <div className="w-full h-full overflow-hidden">
            <img
              src={cover2}
              alt=""
              className="h-full w-full group-hover:scale-105"
            />
          </div>
          <div className="w-full h-full absolute bg-transparent top-0 left-0">
            <div className="h-full w-full px-10 space-y-6 flex flex-col justify-center">
              <p className="text-lg text-[var(--color-black)]">
                Flat 20% Discount
              </p>
              <p className="text-4xl font-medium text-[var(--color-black)]">
                Leather Men's <br /> Sports Shoes
              </p>
              <div>
                <button className="bg-[var(--color-black)] uppercase text-base text-[var(--color-white)] px-5 py-2.5 font-medium hover:bg-[var(--color-black)]/75 hover:cursor-pointer">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default DiscountSection;

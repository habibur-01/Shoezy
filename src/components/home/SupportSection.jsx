import React from "react";
import Container from "../common/Container/Container";
import shippingicon from "../../assets/images/icon/shipping.svg";
import bankicon from "../../assets/images/icon/bank.svg";
import supporicon from "../../assets/images/icon/support.svg";
import rocketicon from "../../assets/images/icon/rocket.svg";

const SupportSection = () => {
  return (
    <Container>
      <div className="grid grid-cols-4 gap-10 pt-12">
        <div className="flex flex-col justify-center items-center text-center">
          <div className="h-12 w-12 overflow-hidden mb-4">
            <img
              src={shippingicon}
              alt="icon"
              className="h-full w-full object"
            />
          </div>
          <p className="text-base font-bold text-[var(--color-black)] mb-2">
            Fast Free Shipping
          </p>
          <p className="text-sm text-[(var(--color-black)]">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusamus,
            ad.
          </p>
        </div>
        <div className="flex flex-col justify-center items-center text-center">
          <div className="h-12 w-12 overflow-hidden mb-4">
            <img src={supporicon} alt="icon" className="h-full w-full object" />
          </div>
          <p className="text-base font-bold text-[var(--color-black)] mb-2">
            24/7 Support
          </p>
          <p className="text-sm text-[(var(--color-black)]">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusamus,
            ad.
          </p>
        </div>
        <div className="flex flex-col justify-center items-center text-center">
          <div className="h-12 w-12 overflow-hidden mb-4">
            <img src={bankicon} alt="icon" className="h-full w-full object" />
          </div>
          <p className="text-base font-bold text-[var(--color-black)] mb-2">
            Easy Money Back
          </p>
          <p className="text-sm text-[(var(--color-black)]">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusamus,
            ad.
          </p>
        </div>
        <div className="flex flex-col justify-center items-center text-center">
          <div className="h-12 w-12 overflow-hidden mb-4">
            <img src={rocketicon} alt="icon" className="h-full w-full object" />
          </div>
          <p className="text-base font-bold text-[var(--color-black)] mb-2">
            Store Search
          </p>
          <p className="text-sm text-[(var(--color-black)]">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusamus,
            ad.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default SupportSection;

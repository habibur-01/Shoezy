import React from "react";
import { Link } from "react-router-dom";
import Container from "../common/Container/Container";
import defaultCover1 from "../../assets/images/banner/discount.png";
import defaultCover2 from "../../assets/images/banner/discount2.png";

const DiscountSection = ({
  layoutType = "cards", // 'cards' | 'full_width' | 'split_banner' | 'deal_strip'
  title,
  badgeText = "Flat 25% Discount",
  headline = "Shoetopia Smart Casual Shoes",
  subtitle = "Grab seasonal savings on select bestselling shoes while supplies last.",
  coverImage,
  buttonText = "Shop Now",
  buttonLink = "/products",
}) => {
  const activeCover = coverImage || defaultCover1;

  // Full-width layout
  if (layoutType === "full_width") {
    return (
      <Container>
        <div className="my-10 relative rounded-2xl overflow-hidden min-h-[360px] sm:min-h-[420px] flex items-center shadow-lg group">
          <img
            src={activeCover}
            alt={headline}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
          <div className="relative z-10 p-8 sm:p-14 max-w-xl text-white space-y-4">
            <span className="inline-block px-3 py-1 bg-rose-500 text-white text-xs font-extrabold uppercase tracking-wider rounded-full shadow-xs">
              {badgeText}
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {headline}
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {subtitle}
            </p>
            <div className="pt-2">
              <Link
                to={buttonLink || "/products"}
                className="inline-flex items-center gap-2 bg-white text-zinc-950 hover:bg-rose-500 hover:text-white font-bold text-sm px-6 py-3 rounded-lg shadow-md transition-colors"
              >
                {buttonText} →
              </Link>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // Split banner layout
  if (layoutType === "split_banner") {
    return (
      <Container>
        <div className="my-12 flex flex-col lg:flex-row items-stretch rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-sm">
          <div className="w-full lg:w-1/2 relative min-h-[300px] lg:min-h-[380px] overflow-hidden group">
            <img
              src={activeCover}
              alt={headline}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                {badgeText}
              </span>
            </div>
          </div>
          <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-zinc-50/60 space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              {headline}
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              {subtitle}
            </p>
            <div className="pt-2">
              <Link
                to={buttonLink || "/products"}
                className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-rose-600 text-white font-semibold text-sm px-7 py-3 rounded-lg shadow-sm transition-colors"
              >
                {buttonText}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // Default cards layout
  return (
    <Container>
      <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-10 my-10">
        <div className="w-full sm:w-1/2 h-[380px] sm:h-[450px] relative group hover:cursor-pointer rounded-2xl overflow-hidden shadow-xs">
          <img
            src={coverImage || defaultCover1}
            alt=""
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="w-full h-full absolute bg-black/20 hover:bg-black/30 transition-colors top-0 left-0">
            <div className="h-full w-full px-8 sm:px-10 space-y-4 sm:space-y-6 flex flex-col justify-center">
              <p className="text-base sm:text-lg font-bold text-white uppercase tracking-wider drop-shadow-sm">
                {badgeText || "Flat 25% Discount"}
              </p>
              <p className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-md">
                {headline || "Shoetopia Smart Casual Shoes"}
              </p>
              <div>
                <Link
                  to={buttonLink || "/products"}
                  className="inline-block bg-white text-zinc-950 uppercase text-sm px-6 py-2.5 font-bold rounded hover:bg-rose-600 hover:text-white transition-colors shadow-sm"
                >
                  {buttonText || "Shop Now"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-1/2 h-[380px] sm:h-[450px] relative group hover:cursor-pointer rounded-2xl overflow-hidden shadow-xs">
          <img
            src={defaultCover2}
            alt=""
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="w-full h-full absolute bg-black/20 hover:bg-black/30 transition-colors top-0 left-0">
            <div className="h-full w-full px-8 sm:px-10 space-y-4 sm:space-y-6 flex flex-col justify-center">
              <p className="text-base sm:text-lg font-bold text-white uppercase tracking-wider drop-shadow-sm">
                Flat 20% Discount
              </p>
              <p className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-md">
                Leather Men's Sports Shoes
              </p>
              <div>
                <Link
                  to="/products"
                  className="inline-block bg-white text-zinc-950 uppercase text-sm px-6 py-2.5 font-bold rounded hover:bg-rose-600 hover:text-white transition-colors shadow-sm"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default DiscountSection;

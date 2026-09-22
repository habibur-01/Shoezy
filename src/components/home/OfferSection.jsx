import React from "react";
import { Link } from "react-router-dom";
import Container from "../common/Container/Container";
import defaultCover1 from "../../assets/images/banner/offer-1.jpg";
import defaultCover2 from "../../assets/images/banner/offer-2.jpg";
import defaultCover3 from "../../assets/images/banner/offer-3.jpg";

const OfferSection = ({
  layoutType = "cards", // 'cards' | 'full_width' | 'split_banner' | 'deal_strip'
  title,
  badgeText = "Flat 25% Discount",
  headline = "Shoetopia Smart Casual Shoes",
  subtitle = "Premium hand-crafted footwear designed for all-day comfort and timeless urban style.",
  coverImage,
  buttonText = "Shop Now",
  buttonLink = "/products",
}) => {
  const activeCover = coverImage || defaultCover1;

  // LAYOUT 1: FULL-WIDTH COVER HERO BANNER
  if (layoutType === "full_width") {
    return (
      <div className="my-10">
        <Container>
          <div className="relative rounded-2xl overflow-hidden min-h-[380px] sm:min-h-[440px] flex items-center shadow-lg group">
            {/* Background Cover Image */}
            <img
              src={activeCover}
              alt={headline}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Gradient Overlay for high contrast readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

            {/* Content Box */}
            <div className="relative z-10 p-8 sm:p-14 max-w-xl text-white space-y-4">
              <span className="inline-block px-3 py-1 bg-amber-400 text-zinc-950 text-xs font-extrabold uppercase tracking-wider rounded-full shadow-xs">
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
                  className="inline-flex items-center gap-2 bg-white text-zinc-950 hover:bg-amber-400 font-bold text-sm px-6 py-3 rounded-lg shadow-md transition-colors"
                >
                  {buttonText} →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // LAYOUT 2: SPLIT 50/50 FEATURE BANNER
  if (layoutType === "split_banner") {
    return (
      <div className="my-12">
        <Container>
          <div className="flex flex-col lg:flex-row items-stretch rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-sm">
            {/* Left: Big Cover Image */}
            <div className="w-full lg:w-1/2 relative min-h-[320px] lg:min-h-[420px] overflow-hidden group">
              <img
                src={activeCover}
                alt={headline}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-zinc-900/90 text-white text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-xs">
                  {badgeText}
                </span>
              </div>
            </div>

            {/* Right: Text & Action Card */}
            <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-zinc-50/60 space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Featured Promotion
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
                  {headline}
                </h2>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {subtitle}
              </p>
              <div className="pt-2">
                <Link
                  to={buttonLink || "/products"}
                  className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-indigo-600 text-white font-semibold text-sm px-7 py-3 rounded-lg shadow-sm transition-colors"
                >
                  {buttonText}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // LAYOUT 3: FLASH DEAL STRIP
  if (layoutType === "deal_strip") {
    return (
      <div className="my-10">
        <Container>
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-indigo-950 text-white p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-3 max-w-lg">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider rounded-md">
                  {badgeText}
                </span>
                <span className="text-xs text-zinc-400 font-mono">Special Promotion</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {headline}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300">
                {subtitle}
              </p>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              <div className="w-32 h-24 sm:w-40 sm:h-28 rounded-xl overflow-hidden border border-white/15 shrink-0">
                <img
                  src={activeCover}
                  alt={headline}
                  className="w-full h-full object-cover"
                />
              </div>
              <Link
                to={buttonLink || "/products"}
                className="px-6 py-3 bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs rounded-lg uppercase tracking-wider whitespace-nowrap shadow-sm transition-colors"
              >
                {buttonText}
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // DEFAULT LAYOUT: 3-CARD PROMOTIONAL GRID
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between gap-6 sm:gap-10 py-12">
        {/* Card 1 */}
        <div className="w-full md:w-1/3 relative group hover:cursor-pointer h-[330px]">
          <div className="w-full h-full overflow-hidden rounded-xl shadow-xs">
            <img
              src={coverImage || defaultCover1}
              alt=""
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="w-full h-full absolute bg-transparent top-0 left-0">
            <div className="h-full w-full px-8 space-y-4 flex flex-col justify-center bg-black/20 hover:bg-black/30 transition-colors rounded-xl">
              <p className="text-sm font-semibold text-white uppercase tracking-wider drop-shadow-sm">
                {badgeText || "Flat 25% Discount"}
              </p>
              <p className="text-3xl font-bold text-white drop-shadow-md">
                {headline || "Shoetopia Smart Casual Shoes"}
              </p>
              <div>
                <Link
                  to={buttonLink || "/products"}
                  className="inline-block bg-white text-zinc-900 uppercase text-xs px-5 py-2.5 font-bold rounded hover:bg-amber-400 hover:text-black transition-colors"
                >
                  {buttonText || "Shop Now"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="w-full md:w-1/3 relative group hover:cursor-pointer h-[330px]">
          <div className="w-full h-full overflow-hidden rounded-xl shadow-xs">
            <img
              src={defaultCover2}
              alt=""
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="w-full h-full absolute bg-transparent top-0 left-0">
            <div className="h-full w-full px-8 space-y-4 flex flex-col justify-center bg-black/20 hover:bg-black/30 transition-colors rounded-xl">
              <p className="text-sm font-semibold text-white uppercase tracking-wider drop-shadow-sm">
                Flat 20% Discount
              </p>
              <p className="text-3xl font-bold text-white drop-shadow-md">
                Leather Men's Sports Shoes
              </p>
              <div>
                <Link
                  to="/products"
                  className="inline-block bg-white text-zinc-900 uppercase text-xs px-5 py-2.5 font-bold rounded hover:bg-amber-400 hover:text-black transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="w-full md:w-1/3 relative group hover:cursor-pointer h-[330px]">
          <div className="w-full h-full overflow-hidden rounded-xl shadow-xs">
            <img
              src={defaultCover3}
              alt=""
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="w-full h-full absolute bg-transparent top-0 left-0">
            <div className="h-full w-full px-8 space-y-4 flex flex-col justify-center bg-black/20 hover:bg-black/30 transition-colors rounded-xl">
              <p className="text-sm font-semibold text-white uppercase tracking-wider drop-shadow-sm">
                Seasonal Exclusive
              </p>
              <p className="text-3xl font-bold text-white drop-shadow-md">
                Outdoor Trail Runners
              </p>
              <div>
                <Link
                  to="/products"
                  className="inline-block bg-white text-zinc-900 uppercase text-xs px-5 py-2.5 font-bold rounded hover:bg-amber-400 hover:text-black transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferSection;

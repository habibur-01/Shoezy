/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, Zap, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import nikeBanner from "../../assets/images/banner/nike.png";
import hero1 from "../../assets/images/banner/hero-1.png";
import hero2 from "../../assets/images/banner/hero-2.png";

const SLIDES = [
  {
    id: 1,
    badge: "2026 Athletic Innovation",
    title: "Nike Free Run",
    subtitle: "Men's Performance Running",
    description:
      "Engineered with revolutionary anatomical flex grooves, featherlight breathable mesh, and high-response foam for unmatched marathon cadence.",
    price: "$160",
    comparePrice: "$195",
    accentColor: "from-orange-500/20 to-amber-500/10",
    image: nikeBanner,
    highlight: "185g Featherlight",
    link: "/products",
  },
  {
    id: 2,
    badge: "Limited Edition Drop",
    title: "Adidas Ultraboost",
    subtitle: "Lightweight Energy Propulsion",
    description:
      "Crafted with 30% lighter Boost capsules delivering infinite kinetic bounce and precision Continental™ outsole traction across all weather.",
    price: "$190",
    comparePrice: "$220",
    accentColor: "from-blue-600/20 to-cyan-500/10",
    image: hero1,
    highlight: "Energy Return +15%",
    link: "/products",
  },
  {
    id: 3,
    badge: "Heritage Meets Speed",
    title: "New Balance 990v6",
    subtitle: "Everyday Road & Trail Cushion",
    description:
      "The pinnacle of heritage craftsmanship and FuelCell speed technology. Sculpted for maximum arch support, longevity, and timeless style.",
    price: "$200",
    comparePrice: "$230",
    accentColor: "from-stone-700/20 to-stone-500/10",
    image: hero2,
    highlight: "Handcrafted Build",
    link: "/products",
  },
];

const Banner = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative w-full bg-stone-950 text-white overflow-hidden">
      {/* Dynamic Swiper Banner */}
      <Swiper
        onSwiper={setSwiperInstance}
        onSlideChange={(s) => setActiveIndex(s.realIndex)}
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        speed={900}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
        }}
        className="w-full"
      >
        {SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center">
              {/* Background Atmospheric Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-tr ${slide.accentColor} opacity-70`}
              />
              <div className="absolute inset-0 bg-radial from-transparent via-stone-950/60 to-stone-950" />

              {/* Grid Texture Overlay */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
              />

              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Left Hero Content */}
                  <div className="lg:col-span-7 space-y-6 z-10 text-center lg:text-left">
                    <motion.div
                      key={`badge-${activeIndex}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-semibold text-orange-400"
                    >
                      <Sparkles className="w-4 h-4 text-orange-400" />
                      <span>{slide.badge}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping ml-1" />
                    </motion.div>

                    <motion.div
                      key={`title-${activeIndex}-${index}`}
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="space-y-1"
                    >
                      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white">
                        {slide.title}
                      </h1>
                      <p className="text-xl sm:text-2xl font-light text-stone-300 tracking-wide">
                        {slide.subtitle}
                      </p>
                    </motion.div>

                    <motion.p
                      key={`desc-${activeIndex}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="text-stone-300 text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
                    >
                      {slide.description}
                    </motion.p>

                    {/* Price & Action Row */}
                    <motion.div
                      key={`cta-${activeIndex}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
                    >
                      <Link
                        to={slide.link}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                      >
                        <span>Explore Collection</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <div className="flex items-baseline gap-2.5 px-4 py-2">
                        <span className="text-3xl font-black text-white">
                          {slide.price}
                        </span>
                        <span className="text-stone-400 line-through text-sm">
                          {slide.comparePrice}
                        </span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Save $35
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Hero Image Showcase with floating highlights */}
                  <div className="lg:col-span-5 relative flex justify-center items-center">
                    {/* Glowing circular backdrop */}
                    <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-orange-600/30 to-amber-500/20 blur-3xl -z-0" />

                    <motion.div
                      key={`img-${activeIndex}-${index}`}
                      initial={{ opacity: 0, scale: 0.88, rotate: -6 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="relative z-10 w-full max-w-md lg:max-w-lg"
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)] filter hover:scale-105 transition-transform duration-700"
                      />

                      {/* Floating Feature Chip */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="absolute bottom-4 right-0 sm:-right-4 bg-stone-900/90 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-2xl flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">
                            Innovation
                          </p>
                          <p className="text-xs sm:text-sm font-extrabold text-white">
                            {slide.highlight}
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows & Slide Indicators Bar */}
      <div className="relative border-t border-white/10 bg-stone-950/80 backdrop-blur-md z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quick Metrics Ticker */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Authentic Guaranteed</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>Free 2-Day Shipping on $75+</span>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>30-Day Risk-Free Wear Test</span>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 mr-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => swiperInstance?.slideToLoop(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === i
                      ? "w-8 bg-orange-500"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => swiperInstance?.slidePrev()}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => swiperInstance?.slideNext()}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;

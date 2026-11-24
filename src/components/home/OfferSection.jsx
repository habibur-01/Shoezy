import React from "react";
import { Link } from "react-router-dom";
import Container from "../common/Container/Container";
import ScrollReveal from "../common/animation/ScrollReveal";
import { ArrowRight, Compass, Shield, Wind } from "lucide-react";

import cover1 from "../../assets/images/banner/offer-1.jpg";
import cover2 from "../../assets/images/banner/offer-2.jpg";
import cover3 from "../../assets/images/banner/offer-3.jpg";

const OFFERS = [
  {
    id: 1,
    tag: "Racing Tech",
    title: "Carbon Road Speed",
    description: "Responsive carbon propulsion plates engineered for race day PRs.",
    discount: "Save $30",
    image: cover1,
    icon: Wind,
    link: "/products",
  },
  {
    id: 2,
    tag: "Tough Terrain",
    title: "All-Weather Trail",
    description: "Multi-directional Vibram rubber lugs for wet rock, mud, and alpine scree.",
    discount: "20% Off",
    image: cover2,
    icon: Compass,
    link: "/products",
  },
  {
    id: 3,
    tag: "Strength & Gym",
    title: "Studio & Cross-Train",
    description: "Wide anatomical toe boxes with zero-drop stability for heavy lifts.",
    discount: "Flat $25 Off",
    image: cover3,
    icon: Shield,
    link: "/products",
  },
];

const OfferSection = ({
  layoutType = "cards",
  title,
  badgeText = "Flat 25% Discount",
  headline = "Shoetopia Smart Casual Shoes",
  subtitle = "Premium hand-crafted footwear designed for all-day comfort and timeless urban style.",
  coverImage,
  buttonText = "Shop Now",
  buttonLink = "/products",
}) => {
  const activeCover = coverImage || cover1;

  if (layoutType === "full_width") {
    return (
      <Container maxWidth="82rem">
        <section className="relative my-10 min-h-[380px] overflow-hidden rounded-3xl bg-stone-950 flex items-center text-white">
          <img src={activeCover} alt={headline} className="absolute inset-0 h-full w-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-transparent" />
          <div className="relative z-10 max-w-2xl space-y-4 p-8 sm:p-12">
            {title && <p className="text-xs font-bold uppercase tracking-widest text-orange-300">{title}</p>}
            <span className="inline-flex rounded-full bg-orange-600 px-3 py-1 text-xs font-extrabold uppercase">{badgeText}</span>
            <h2 className="text-3xl font-black sm:text-5xl">{headline}</h2>
            <p className="text-sm leading-relaxed text-stone-200">{subtitle}</p>
            <Link to={buttonLink} className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-stone-950">{buttonText}<ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </Container>
    );
  }

  if (layoutType === "split_banner") {
    return (
      <Container maxWidth="82rem">
        <section className="my-10 grid overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-md lg:grid-cols-2">
          <img src={activeCover} alt={headline} className="h-72 w-full object-cover lg:h-full" />
          <div className="flex flex-col justify-center gap-4 bg-stone-50 p-8 sm:p-12">
            {title && <p className="text-xs font-bold uppercase tracking-widest text-orange-600">{title}</p>}
            <span className="w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-extrabold uppercase text-orange-700">{badgeText}</span>
            <h2 className="text-3xl font-black text-stone-900">{headline}</h2>
            <p className="text-sm leading-relaxed text-stone-600">{subtitle}</p>
            <Link to={buttonLink} className="inline-flex w-fit items-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-extrabold text-white">{buttonText}<ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </Container>
    );
  }

  if (layoutType === "deal_strip") {
    return (
      <Container maxWidth="82rem">
        <section className="my-10 flex flex-col gap-5 rounded-2xl bg-stone-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="space-y-2">
            {title && <p className="text-xs font-bold uppercase tracking-widest text-orange-300">{title}</p>}
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400">{badgeText}</span>
            <h2 className="text-2xl font-black">{headline}</h2>
            <p className="text-sm text-stone-300">{subtitle}</p>
          </div>
          <Link to={buttonLink} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-extrabold text-white">{buttonText}<ArrowRight className="h-4 w-4" /></Link>
        </section>
      </Container>
    );
  }

  const offers = OFFERS.map((item, index) => index === 0
    ? { ...item, title: headline, description: subtitle, discount: badgeText, image: activeCover, link: buttonLink }
    : item);

  return (
    <section className="py-16 bg-stone-900 text-white relative overflow-hidden">
      {/* Subtle decorative glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <Container maxWidth="82rem">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3.5 py-1 rounded-full mb-3">
              {badgeText || "Curated Disciplines"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {title || "Specialized Footwear Hubs"}
            </h2>
            <p className="mt-2 text-stone-400 text-sm sm:text-base">
              {subtitle}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-3xl bg-stone-950 border border-white/10 shadow-lg min-h-[380px] flex flex-col justify-end p-6 sm:p-8"
                >
                  {/* Background Image with Zoom */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/20" />

                  {/* Top Badge */}
                  <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
                    <span className="bg-orange-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                      {item.discount}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.tag}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-300 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="pt-2">
                      <Link
                        to={item.link}
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-white hover:text-orange-400 transition-colors"
                      >
                        <span>{index === 0 ? buttonText : "Explore Hub"}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
};

export default OfferSection;

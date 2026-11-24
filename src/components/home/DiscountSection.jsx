import React from "react";
import { Link } from "react-router-dom";
import Container from "../common/Container/Container";
import ScrollReveal from "../common/animation/ScrollReveal";
import { ArrowRight, Tag, Zap } from "lucide-react";
import cover1 from "../../assets/images/banner/discount.png";
import cover2 from "../../assets/images/banner/discount2.png";

const DiscountSection = ({
  layoutType = "cards",
  title,
  badgeText = "Flash Deal - 25% Off",
  headline = "Marathon & Speed Series",
  subtitle = "Engineered with carbon energy rods and cloud-cushion foam for personal best race days.",
  coverImage,
  buttonText = "Shop Running",
  buttonLink = "/products",
}) => {
  const activeCover = coverImage || cover1;

  if (layoutType === "full_width") {
    return (
      <Container maxWidth="74rem">
        <section className="relative my-10 min-h-[380px] overflow-hidden rounded-3xl bg-stone-900 flex items-center">
          <img src={activeCover} alt={headline} className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-transparent" />
          <div className="relative z-10 max-w-2xl space-y-4 p-8 text-white sm:p-12">
            {title && <p className="text-xs font-bold uppercase tracking-widest text-orange-300">{title}</p>}
            <span className="inline-flex rounded-full bg-orange-600 px-3 py-1 text-xs font-extrabold uppercase">{badgeText}</span>
            <h2 className="text-3xl font-black sm:text-5xl">{headline}</h2>
            <p className="text-sm leading-relaxed text-stone-200">{subtitle}</p>
            <Link to={buttonLink} className="inline-flex rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-stone-950">{buttonText}<ArrowRight className="ml-2 h-4 w-4" /></Link>
          </div>
        </section>
      </Container>
    );
  }

  if (layoutType === "split_banner") {
    return (
      <Container maxWidth="74rem">
        <section className="my-10 grid overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-md lg:grid-cols-2">
          <img src={activeCover} alt={headline} className="h-72 w-full object-cover lg:h-full" />
          <div className="flex flex-col justify-center gap-4 p-8 sm:p-12">
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
      <Container maxWidth="74rem">
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

  return (
    <section className="py-16">
      <Container maxWidth="74rem">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Banner 1: High Performance Running */}
            <div className="relative group overflow-hidden rounded-3xl bg-stone-900 min-h-[380px] sm:min-h-[420px] flex flex-col justify-end p-8 sm:p-10 border border-stone-200/60 shadow-md">
              {/* Background Image with Zoom & Dark Gradient */}
              <img
                src={activeCover}
                alt={headline}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

              {/* Content Overlay */}
              <div className="relative z-10 space-y-3 max-w-md">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-orange-600 text-white shadow-sm">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{badgeText}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  {headline}
                </h3>

                <p className="text-sm text-stone-300 leading-relaxed">
                  {subtitle}
                </p>

                <div className="pt-2 flex items-center gap-4">
                  <Link
                    to={buttonLink}
                    className="inline-flex items-center gap-2 bg-white hover:bg-stone-100 active:scale-[0.98] text-stone-950 text-xs sm:text-sm font-extrabold uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all duration-200"
                  >
                    <span>{buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="flex items-center gap-1.5 text-xs text-stone-400 font-mono">
                    <Tag className="w-3.5 h-3.5 text-orange-400" />
                    <span>CODE: <strong>RUN25</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner 2: Urban Street & Court Style */}
            <div className="relative group overflow-hidden rounded-3xl bg-stone-900 min-h-[380px] sm:min-h-[420px] flex flex-col justify-end p-8 sm:p-10 border border-stone-200/60 shadow-md">
              <img
                src={cover2}
                alt="Urban Street & Lifestyle Footwear"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

              <div className="relative z-10 space-y-3 max-w-md">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-amber-500 text-stone-950 shadow-sm">
                  <Tag className="w-3.5 h-3.5" />
                  <span>New Drop - 20% Off</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  Urban Suede & Streetwear
                </h3>

                <p className="text-sm text-stone-300 leading-relaxed">
                  Iconic silhouettes crafted from buttery Italian nubuck and reinforced rubber court soles.
                </p>

                <div className="pt-2 flex items-center gap-4">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all duration-200"
                  >
                    <span>Shop Streetwear</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="flex items-center gap-1.5 text-xs text-stone-400 font-mono">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span>CODE: <strong>STREET20</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
};

export default DiscountSection;

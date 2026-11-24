import React, { useState } from "react";
import { Link } from "react-router-dom";
import sneakersImg from "../../assets/images/banner/walking_style.jpg";
import runnerImg from "../../assets/images/banner/running.jpg";
import Container from "../common/Container/Container";
import ScrollReveal from "../common/animation/ScrollReveal";
import { ArrowRight, CheckCircle2, Cpu, Flame, Shield, Sparkles } from "lucide-react";

const HIGHLIGHTS = [
  {
    category: "sneakers",
    title: "The Urban Walk & Casual Movement",
    tag: "Everyday Ergonomics",
    description:
      "Shoes are the foundational pivot of your kinetic health. Our casual silhouettes integrate aerospace-grade arch alignment with timeless streetwear lines, protecting knees and joints through 15,000+ daily steps.",
    features: [
      "Custom memory-foam insoles adapted to plantar shape",
      "Reinforced scuff-resistant Italian leather and breathable suede",
      "Zero-break-in comfort engineered straight from the box",
    ],
    image: sneakersImg,
    stat: "15,000+",
    statLabel: "Steps of All-Day Comfort",
  },
  {
    category: "running",
    title: "Kinetic Road & Marathon Propulsion",
    tag: "Pure Speed Engineering",
    description:
      "The capacity to store and return mechanical energy in legs and feet that act as biological springs is crucial in running economy. Our dual-density nitrogen-infused midsole cuts muscle fatigue by up to 18%.",
    features: [
      "Full-length curved carbon plate for instantaneous toe-off",
      "Ultralight mono-mesh upper with targeted cooling vents",
      "Continental™ wet-traction rubber outsole pods",
    ],
    image: runnerImg,
    stat: "+18%",
    statLabel: "Energy Return Efficiency",
  },
];

const ShoeShowcase = () => {
  const [activeMode, setActiveMode] = useState("sneakers");
  const current = HIGHLIGHTS.find((h) => h.category === activeMode) || HIGHLIGHTS[0];

  return (
    <section className="py-20 bg-stone-100/60 border-y border-stone-200/80">
      <Container maxWidth="72rem">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-orange-100 text-orange-700 border border-orange-200 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Craft & Biomechanics</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                Engineered from the Ground Up
              </h2>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center p-1.5 bg-white rounded-2xl border border-stone-200 shadow-xs">
              <button
                onClick={() => setActiveMode("sneakers")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeMode === "sneakers"
                    ? "bg-stone-900 text-white shadow-sm"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Everyday Sneakers</span>
              </button>

              <button
                onClick={() => setActiveMode("running")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeMode === "running"
                    ? "bg-stone-900 text-white shadow-sm"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Performance Runners</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Feature Spotlight Stage */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-lg p-6 sm:p-10 lg:p-12 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Image Side */}
              <div className="lg:col-span-6 relative group overflow-hidden rounded-2xl bg-stone-100 aspect-4/3 sm:aspect-16/10">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />

                {/* Floating Metric Badge */}
                <div className="absolute bottom-4 left-4 bg-stone-950/90 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/10 shadow-lg">
                  <p className="text-2xl font-black text-orange-400">{current.stat}</p>
                  <p className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                    {current.statLabel}
                  </p>
                </div>
              </div>

              {/* Text Side */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
                    {current.tag}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
                    {current.title}
                  </h3>
                </div>

                <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                  {current.description}
                </p>

                {/* Feature Checklist */}
                <ul className="space-y-3 pt-2">
                  {current.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-semibold text-stone-800">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 flex items-center gap-4">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-stone-950 hover:bg-stone-800 active:scale-[0.98] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider px-7 py-3.5 rounded-xl shadow-md transition-all duration-200"
                  >
                    <span>Shop This Category</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/outlets"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900"
                  >
                    <span>Visit Store Fitting</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
};

export default ShoeShowcase;

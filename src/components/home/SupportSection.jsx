import React from "react";
import Container from "../common/Container/Container";
import ScrollReveal from "../common/animation/ScrollReveal";
import { Truck, RotateCcw, ShieldCheck, Headphones, Zap } from "lucide-react";

const BENEFITS = [
  {
    icon: Truck,
    title: "Free Express Shipping",
    description: "Complimentary priority courier on all orders over $75 worldwide.",
    highlight: "Ships in 24h",
  },
  {
    icon: RotateCcw,
    title: "30-Day Wear Test",
    description: "Take them to the street or track. Return risk-free if not 100% satisfied.",
    highlight: "Hassle-Free",
  },
  {
    icon: ShieldCheck,
    title: "Verified Authenticity",
    description: "Every pair is individually inspected by certified footwear specialists.",
    highlight: "100% Genuine",
  },
  {
    icon: Headphones,
    title: "24/7 Expert Fitting",
    description: "Real shoe fitters ready on live chat to guide size & gait selection.",
    highlight: "Always Online",
  },
];

const SupportSection = () => {
  return (
    <section className="py-12 bg-stone-100/70 border-b border-stone-200/80">
      <Container maxWidth="90rem">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-orange-300 hover:shadow-lg transition-all duration-300 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-900 group-hover:bg-orange-600 group-hover:text-white flex items-center justify-center transition-colors duration-300 shrink-0">
                    <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-extrabold text-stone-900 text-sm tracking-tight">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                      {item.highlight}
                    </span>
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

export default SupportSection;

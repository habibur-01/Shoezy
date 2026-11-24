import React from "react";
import Container from "../common/Container/Container";
import ScrollReveal from "../common/animation/ScrollReveal";
import { Send, BellRing } from "lucide-react";
import { toast } from "react-toastify";

const NewsletterSection = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.info("Newsletter sign-up is not available yet.");
  };

  return (
    <section className="py-20 bg-stone-950 text-white relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <Container maxWidth="48rem">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-orange-400">
              <BellRing className="w-3.5 h-3.5" />
              <span>Priority Drop Access</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Never Miss a Limited Release
            </h2>

            <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Get early access to new releases, seasonal offers, and footwear updates from Shoezy.
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-stone-400 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                required
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
              >
                <span>Join Club</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-center gap-6 text-[11px] text-stone-400 pt-2">
              <span>✓ Early access to releases</span>
              <span>✓ Seasonal offers</span>
              <span>✓ Footwear care tips</span>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
};

export default NewsletterSection;

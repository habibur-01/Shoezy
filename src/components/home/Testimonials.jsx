import React from "react";
import Container from "../common/Container/Container";
import TitleSection from "../common/header/TitleSection";
import ScrollReveal from "../common/animation/ScrollReveal";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import { Star, CheckCircle2, Quote } from "lucide-react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

const REVIEWS = [
  {
    id: 1,
    author: "Marcus Vance",
    role: "Marathon Runner • Chicago, IL",
    shoe: "Nike Free Run 2026",
    rating: 5,
    title: "PR on my 10K within two weeks",
    comment:
      "The energy return on these is night and day compared to standard foam trainers. The toe box has just enough room for natural toe splay without feeling loose. Zero blistering right out of the box.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 2,
    author: "Elena Rostova",
    role: "Trail & Ultra Athlete • Boulder, CO",
    shoe: "Salomon XT-6 Mindful",
    rating: 5,
    title: "Best all-weather grip on wet rock",
    comment:
      "I put 120 miles on rocky trails in Colorado and the lugs barely show wear. The quicklace system stays dialed even through creek crossings and mud. Shoezy's customer service helped me pick the half size up.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 3,
    author: "David Chen",
    role: "Physical Therapist • San Francisco, CA",
    shoe: "New Balance 990v6",
    rating: 5,
    title: "Unmatched arch alignment for 12hr shifts",
    comment:
      "I recommend these to patients dealing with plantar fasciitis and wear them myself for hospital rounds. Outstanding lateral stability, plush heel strike, and handsome enough for casual wear.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 4,
    author: "Sarah Lindqvist",
    role: "CrossFit Coach • Austin, TX",
    shoe: "Ultraboost Light Marathon",
    rating: 5,
    title: "Featherlight with explosive bounce",
    comment:
      "Noticeably lighter than older Ultraboost generations. Holds up beautifully through box jumps, sprint intervals, and 5-mile tempo runs. Delivered to my door within 24 hours.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-stone-50">
      <Container maxWidth="68rem">
        <ScrollReveal direction="up" delay={0.1}>
          <TitleSection
            badge="Verified Athletes"
            title="What Runners & Walkers Say"
            subtitle="Real feedback from daily commuters, marathoners, and wellness advocates testing our shoes."
          />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <Swiper
            slidesPerView={1}
            spaceBetween={24}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            modules={[FreeMode, Pagination, Autoplay]}
            className="pb-14!"
          >
            {REVIEWS.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="bg-white rounded-3xl p-7 border border-stone-200/90 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Stars & Model Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                        {review.shoe}
                      </span>
                    </div>

                    <h4 className="font-bold text-stone-900 text-base leading-snug">
                      "{review.title}"
                    </h4>

                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </div>

                  {/* Author Card */}
                  <div className="flex items-center gap-3 pt-6 mt-6 border-t border-stone-100">
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="w-11 h-11 rounded-full object-cover border-2 border-stone-100 shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-stone-900 text-xs sm:text-sm">
                          {review.author}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Verified Purchase" />
                      </div>
                      <p className="text-[11px] text-stone-400">{review.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </ScrollReveal>
      </Container>
    </section>
  );
};

export default Testimonials;

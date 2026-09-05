// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import { EDITORIAL_SLIDES, MEMBER_PERKS } from '../../../data/mockData';
// import {
//   CheckCircle2,
//   Sparkles,
//   ChevronRight,
//   Tag,
// } from 'lucide-react';

// export const EditorialShowcase = ({ mode }) => {
//   const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlideIndex(
//         (prev) => (prev + 1) % EDITORIAL_SLIDES.length
//       );
//     }, 6000);

//     return () => clearInterval(timer);
//   }, []);

//   const slide = EDITORIAL_SLIDES[currentSlideIndex];

//   return (
//     <div className="relative w-full h-full  rounded-2xl overflow-hidden bg-stone-900 text-stone-100 flex flex-col justify-between p-6 sm:p-8 lg:p-10 shadow-xl border border-stone-800">

//       {/* Background Slideshow with Gentle Zoom */}
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={slide.id}
//           initial={{ opacity: 0, scale: 1.05 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{
//             duration: 1.2,
//             ease: 'easeOut',
//           }}
//           className="absolute inset-0 z-0"
//         >
//           <img
//             src={slide.imageUrl}
//             alt={slide.title}
//             referrerPolicy="no-referrer"
//             className="w-full h-full object-cover object-center filter brightness-[0.62] contrast-[1.05]"
//           />

//           {/* Subtle gradient overlays */}
//           <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-900/30" />

//           <div className="absolute inset-0 bg-radial from-transparent via-stone-950/20 to-stone-950/70" />
//         </motion.div>
//       </AnimatePresence>

//       {/* Top Bar: Seasonal Capsule badge & Carousel Dots */}
//       <div className="relative z-10 flex items-center justify-between">

//         <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-stone-900/75 backdrop-blur-md border border-stone-700/60 text-[11px] uppercase tracking-[0.2em] font-medium text-stone-200">
//           <Sparkles className="w-3 h-3 text-amber-300" />
//           <span>{slide.tag}</span>
//         </div>

//         <div className="flex items-center space-x-1.5">
//           {EDITORIAL_SLIDES.map((s, idx) => (
//             <button
//               key={s.id}
//               onClick={() => setCurrentSlideIndex(idx)}
//               className={`h-1.5 rounded-full transition-all duration-300 ${
//                 idx === currentSlideIndex
//                   ? 'w-6 bg-stone-100'
//                   : 'w-1.5 bg-stone-500/60 hover:bg-stone-400'
//               }`}
//               aria-label={`Go to slide ${idx + 1}`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Middle/Bottom: Editorial Quote & Live Perks */}
//       <div className="relative z-10 space-y-6 pt-12">

//         {/* Editorial Quote */}
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={`${slide.id}-text`}
//             initial={{
//               opacity: 0,
//               y: 14,
//             }}
//             animate={{
//               opacity: 1,
//               y: 0,
//             }}
//             exit={{
//               opacity: 0,
//               y: -10,
//             }}
//             transition={{
//               duration: 0.5,
//             }}
//             className="space-y-3"
//           >
//             <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl text-stone-50 font-normal leading-tight tracking-tight">
//               {slide.title}
//             </h2>

//             <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed max-w-lg">
//               "{slide.quote}"
//             </p>
//           </motion.div>
//         </AnimatePresence>

//         {/* Member Exclusives / Welcome Privilege Banner */}
//         <div className="bg-stone-900/85 backdrop-blur-md border border-stone-700/60 rounded-xl p-4 sm:p-5 space-y-3">

//           <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">

//             <div className="flex items-center space-x-2 text-stone-200">
//               <Tag className="w-4 h-4 text-stone-300" />

//               <span className="text-xs uppercase tracking-wider font-semibold text-stone-200">
//                 {mode === 'signup'
//                   ? 'Welcome Privilege'
//                   : 'Member Privileges'}
//               </span>
//             </div>

//             <span className="text-xs text-amber-200/90 font-medium px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded">
//               -10% First Order
//             </span>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
//             {MEMBER_PERKS.slice(0, 4).map((perk, i) => (
//               <div
//                 key={i}
//                 className="flex items-start space-x-2"
//               >
//                 <CheckCircle2 className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />

//                 <span className="text-xs text-stone-300 font-normal leading-tight">
//                   {perk.title}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Footnote reassurance */}
//         <div className="flex items-center justify-between text-[11px] text-stone-400 font-light pt-2">

//           <span>
//             Carbon-Neutral Worldwide Delivery
//           </span>

//           <span className="flex items-center text-stone-300">
//             Learn more
//             <ChevronRight className="w-3 h-3 ml-0.5" />
//           </span>

//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EDITORIAL_SLIDES, MEMBER_PERKS } from '../../../data/mockData';
import {
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Tag,
} from 'lucide-react';

export const EditorialShowcase = ({ mode }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex(
        (prev) => (prev + 1) % EDITORIAL_SLIDES.length
      );
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const slide = EDITORIAL_SLIDES[currentSlideIndex];

  return (
    <div className="relative w-full h-full min-h-[720px] rounded-none overflow-hidden bg-stone-900 text-stone-100 flex flex-col justify-between p-8 sm:p-12 lg:p-14 shrink-0">

      {/* Background Slideshow with Gentle Zoom */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.2,
            ease: 'easeOut',
          }}
          className="absolute inset-0 z-0"
        >
          <img
            src={slide.imageUrl}
            alt={slide.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-[0.62] contrast-[1.05]"
          />

          {/* Subtle gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-900/30" />

          <div className="absolute inset-0 bg-radial from-transparent via-stone-950/20 to-stone-950/70" />
        </motion.div>
      </AnimatePresence>

      {/* Top Bar: Seasonal Capsule badge & Carousel Dots */}
      <div className="relative z-10 flex items-center justify-between shrink-0 mb-6 ">

        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-700/60 text-[11px] uppercase tracking-[0.2em] font-medium text-stone-200 shadow-sm">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>{slide.tag}</span>
        </div>

        <div className="flex items-center space-x-2">
          {EDITORIAL_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlideIndex
                  ? 'w-7 bg-stone-100'
                  : 'w-2 bg-stone-500/60 hover:bg-stone-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Middle/Bottom: Editorial Quote & Live Perks */}
      <div className="relative z-10 space-y-6 pt-6 shrink-0">

        {/* Editorial Quote */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${slide.id}-text`}
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.5,
            }}
            className="space-y-3"
          >
            <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl text-stone-50 font-normal leading-tight tracking-tight">
              {slide.title}
            </h2>

            <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed max-w-lg">
              "{slide.quote}"
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Member Exclusives / Welcome Privilege Banner */}
        <div className="bg-stone-900/85 backdrop-blur-md border border-stone-700/60 rounded-xl p-5 sm:p-6 space-y-3.5 shrink-0 shadow-lg">

          <div className="flex items-center justify-between border-b border-stone-800 pb-3">

            <div className="flex items-center space-x-2 text-stone-200">
              <Tag className="w-4 h-4 text-stone-300" />

              <span className="text-xs uppercase tracking-wider font-semibold text-stone-200">
                {mode === 'signup'
                  ? 'Welcome Privilege'
                  : 'Member Privileges'}
              </span>
            </div>

            <span className="text-xs text-amber-200/90 font-medium px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded">
              -10% First Order
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {MEMBER_PERKS.slice(0, 4).map((perk, i) => (
              <div
                key={i}
                className="flex items-start space-x-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />

                <span className="text-xs text-stone-300 font-normal leading-tight">
                  {perk.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footnote reassurance */}
        <div className="flex items-center justify-between text-[11px] text-stone-400 font-light pt-2 shrink-0">

          <span>
            Carbon-Neutral Worldwide Delivery
          </span>

          <span className="flex items-center text-stone-300">
            Learn more
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </span>

        </div>
      </div>
    </div>
  );
};


import React, { useEffect, useState } from "react";
import Banner from "../components/home/Banner";
import SupportSection from "../components/home/SupportSection";
import DiscountSection from "../components/home/DiscountSection";
import PopularProduct from "../components/home/PopularProduct";
import OfferSection from "../components/home/OfferSection";
import FeaturedProduct from "../components/home/FeaturedProduct";
import ShoeShowcase from "../components/home/ShoeShowcase ";
import Testimonials from "../components/home/Testimonials";
import api from "../api/index";
import { PUBLIC_HOMEPAGE_SECTIONS_ENDPOINT } from "../endpoint";

// Component Registry: Maps section types from backend CMS to actual React components
const SECTION_REGISTRY = {
  banner: Banner,
  support: SupportSection,
  discount: DiscountSection,
  popular_product: PopularProduct,
  offer: OfferSection,
  featured_product: FeaturedProduct,
  shoe_showcase: ShoeShowcase,
  testimonials: Testimonials,
  custom_banner: OfferSection,
};

// Default fallback sequence if API is offline or loading
const DEFAULT_SECTIONS = [
  { sectionKey: "banner", type: "banner", order: 1, isActive: true },
  { sectionKey: "support", type: "support", order: 2, isActive: true },
  { sectionKey: "discount", type: "discount", order: 3, isActive: true },
  { sectionKey: "popular_product", type: "popular_product", order: 4, isActive: true },
  { sectionKey: "offer", type: "offer", order: 5, isActive: true },
  { sectionKey: "featured_product", type: "featured_product", order: 6, isActive: true },
  { sectionKey: "shoe_showcase", type: "shoe_showcase", order: 7, isActive: true },
  { sectionKey: "testimonials", type: "testimonials", order: 8, isActive: true },
];

const Home = () => {
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await api.get(PUBLIC_HOMEPAGE_SECTIONS_ENDPOINT);
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          // Sort by order ascending
          const sorted = [...res.data.data].sort((a, b) => (a.order || 0) - (b.order || 0));
          setSections(sorted);
        }
      } catch (err) {
        console.warn("Using default homepage layout fallback:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, []);

  return (
    <div>
      {sections.map((section) => {
        if (!section.isActive) return null;
        const Component = SECTION_REGISTRY[section.type];
        if (!Component) return null;

        return (
          <Component
            key={section._id || section.sectionKey || `sec-${section.order}`}
            {...(section.settings || {})}
          />
        );
      })}
    </div>
  );
};

export default Home;

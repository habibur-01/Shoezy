import React, { useEffect, useState } from "react";
import Banner from "../components/home/Banner";
import SupportSection from "../components/home/SupportSection";
import DiscountSection from "../components/home/DiscountSection";
import PopularProduct from "../components/home/PopularProduct";
import OfferSection from "../components/home/OfferSection";
import FeaturedProduct from "../components/home/FeaturedProduct";
import ShoeShowcase from "../components/home/ShoeShowcase";
import Testimonials from "../components/home/Testimonials";
import NewsletterSection from "../components/home/NewsletterSection";
import api from "../api/index";
import { getProducts } from "../server/product/product";
import { PUBLIC_HOMEPAGE_SECTIONS_ENDPOINT } from "../endpoint";

const SECTION_REGISTRY = {
  banner: Banner,
  support: SupportSection,
  discount: DiscountSection,
  popular_product: PopularProduct,
  offer: OfferSection,
  featured_product: FeaturedProduct,
  shoe_showcase: ShoeShowcase,
  testimonials: Testimonials,
  newsletter: NewsletterSection,
  custom_banner: OfferSection,
};

const DEFAULT_SECTIONS = [
  { sectionKey: "banner", type: "banner", order: 1, isActive: true },
  { sectionKey: "support", type: "support", order: 2, isActive: true },
  { sectionKey: "discount", type: "discount", order: 3, isActive: true },
  { sectionKey: "popular_product", type: "popular_product", order: 4, isActive: true },
  { sectionKey: "offer", type: "offer", order: 5, isActive: true },
  { sectionKey: "featured_product", type: "featured_product", order: 6, isActive: true },
  { sectionKey: "shoe_showcase", type: "shoe_showcase", order: 7, isActive: true },
  { sectionKey: "testimonials", type: "testimonials", order: 8, isActive: true },
  { sectionKey: "newsletter", type: "newsletter", order: 9, isActive: true },
];

const readProductList = (response) => {
  const data = response?.data?.data;
  return response?.data?.success && Array.isArray(data?.products)
    ? data.products
    : [];
};

const Home = () => {
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [productSets, setProductSets] = useState({ popular: [], featured: [] });
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchHomepage = async () => {
      let nextSections = DEFAULT_SECTIONS;

      try {
        const response = await api.get(PUBLIC_HOMEPAGE_SECTIONS_ENDPOINT);
        if (response.data?.success && Array.isArray(response.data.data)) {
          nextSections = [...response.data.data].sort(
            (a, b) => Number(a.order || 0) - Number(b.order || 0),
          );
        }
      } catch (error) {
        console.warn("Using default homepage layout fallback:", error);
      }

      if (cancelled) return;
      setSections(nextSections);

      const hasPopular = nextSections.some(
        (section) => section.isActive && section.type === "popular_product",
      );
      const hasFeatured = nextSections.some(
        (section) => section.isActive && section.type === "featured_product",
      );

      try {
        const [popularResponse, featuredResponse] = await Promise.all([
          hasPopular
            ? getProducts({ page: 1, limit: 8, filters: { sortBy: "top_rated" } })
            : Promise.resolve(null),
          hasFeatured
            ? getProducts({ page: 1, limit: 8, filters: { sortBy: "newest" } })
            : Promise.resolve(null),
        ]);

        if (!cancelled) {
          setProductSets({
            popular: readProductList(popularResponse),
            featured: readProductList(featuredResponse),
          });
        }
      } catch (error) {
        console.error("Could not load homepage products:", error);
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    };

    fetchHomepage();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="w-full overflow-hidden">
      {sections.map((section) => {
        if (section.isActive === false) return null;
        const Component = SECTION_REGISTRY[section.type];
        if (!Component) return null;

        const productProps =
          section.type === "popular_product"
            ? { products: productSets.popular, productsLoading }
            : section.type === "featured_product"
              ? { products: productSets.featured, productsLoading }
              : {};

        return (
          <Component
            key={section._id || section.sectionKey || `sec-${section.order}`}
            {...(section.settings || {})}
            {...productProps}
          />
        );
      })}
    </main>
  );
};

export default Home;

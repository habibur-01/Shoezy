import React from "react";
import Banner from "../components/home/Banner";
import SupportSection from "../components/home/SupportSection";
import DiscountSection from "../components/home/DiscountSection";
import PopularProduct from "../components/home/PopularProduct";
import OfferSection from "../components/home/OfferSection";
import FeaturedProduct from "../components/home/FeaturedProduct";
import ShoeShowcase from "../components/home/ShoeShowcase ";
import Testimonials from "../components/home/Testimonials";
import Footer from "../components/home/Footer";

const Home = () => {
  return (
    <div>
      <Banner />
      <SupportSection />
      <DiscountSection />
      <PopularProduct />
      <OfferSection />
      <FeaturedProduct />
      <ShoeShowcase />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;

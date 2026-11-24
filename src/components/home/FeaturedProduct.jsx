import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../common/product/ProductCard";
import Container from "../common/Container/Container";
import ScrollReveal from "../common/animation/ScrollReveal";
import { ArrowRight } from "lucide-react";

const FeaturedProduct = ({
  title = "Featured Collection",
  subtitle = "Recently added styles from our collection.",
  products = [],
  productsLoading = false,
}) => {
  return (
    <section className="py-16">
      <Container maxWidth="80rem">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">Just Added</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-stone-900">{title}</h2>
              <p className="mt-2 max-w-2xl text-sm text-stone-500">{subtitle}</p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-orange-600 hover:text-orange-700 self-start md:self-auto"
            >
              <span>View Full Selection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsLoading ? (
              Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="h-96 rounded-xl bg-stone-100 animate-pulse" />
              ))
            ) : products.length ? (
              products.map((product) => (
                <ProductCard key={product?._id || product?.id} item={product} />
              ))
            ) : (
              <p className="col-span-full py-10 text-center text-sm text-stone-500">No featured products are available right now.</p>
            )}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
};

export default FeaturedProduct;

import React, { useEffect, useState } from "react";
import ProductThumbnails from "../components/ProductDetails/ProductThumbnails.jsx";
import ProductZoom from "../components/ProductDetails/ProductZoom.jsx";
import ProductDescription from "../components/ProductDetails/ProductDescription.jsx";
import SizeSelector from "../components/ProductDetails/SizeSelectore.jsx";
import AddToCart from "../components/ProductDetails/AddToCart.jsx";
import Container from "../components/common/Container/Container.jsx";
import DetailsTabSection from "../components/ProductDetails/DetailsTabSection.jsx";
import ReviewsSection from "../components/ProductDetails/ReviewsSection.jsx";
import Breadcrumb from "../components/common/Breadcrumb/Breadcrumb.jsx";
import { useParams, Link } from "react-router-dom";
import { getProductsDetails } from "../server/product/product.js";
import { setSingleProduct } from "../redux/features/product/productSlice.js";
import { useDispatch, useSelector } from "react-redux";
import ColorSelector from "../components/ProductDetails/ColorSelector.jsx";
import { addToCart } from "../server/cart/cart.js";
import { toast } from "react-toastify";
import { increaseItemCount } from "../redux/features/initial/initialSlice.js";
import { ArrowLeft, Loader2 } from "lucide-react";

const ProductDetails = () => {
  const params = useParams();
  const { slug } = params;
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.singleProduct);
  const { isAuthenticated } = useSelector((state)=> state.auth);

  const thumbnails = React.useMemo(() => {
    if (!product?.images) return ["/placeholder.jpg"];
    if (typeof product.images === "string") return [product.images];
    const list = [];
    if (product.images.cover) list.push(product.images.cover);
    if (Array.isArray(product.images.gallery)) {
      list.push(...product.images.gallery);
    }
    return list.length > 0 ? list : ["/placeholder.jpg"];
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(thumbnails[0] || "");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProduct, setIsFetchingProduct] = useState(true);

  useEffect(() => {
    if (thumbnails?.length > 0 && thumbnails[0]) {
      setSelectedImage(thumbnails[0]);
    }
  }, [thumbnails]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsFetchingProduct(true);
        const result = await getProductsDetails(slug);
        if (result?.data?.success) {
          dispatch(setSingleProduct(result.data.data));
        }
      } catch (error) {
        console.error("fetch product details error:", error);
      } finally {
        setIsFetchingProduct(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  const handleAddToCart = async (id) => {
    try {
      setIsLoading(true);
      if (product?.colors?.length > 0 && !selectedColor) {
        toast.error("Please select a color option");
        return;
      }
      if (product?.sizes?.length > 0 && !selectedSize) {
        toast.error("Please select a size option");
        return;
      }

      const cartItem = {
        product: id,
        name: product?.name || "Product",
        image: product?.images?.cover || (typeof product?.images === "string" ? product?.images : "/placeholder.jpg"),
        price: product?.discount_price ? product?.discount_price : product?.price,
        quantity,
        selectedSize,
        selectedColor,
      };

      const result = await addToCart(cartItem, isAuthenticated);
      if (result?.data?.success) {
        dispatch(increaseItemCount());
        toast.success("This item has been added to your cart!");
      } else {
        toast.error(result?.data?.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("handleAddToCart error:", error);
      toast.error(error?.response?.data?.message || "Error adding item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const categoryName = typeof product?.category === "object" ? product?.category?.name : (product?.category || "Shoes");
  const brandName = product?.brand || "Brand";

  if (isFetchingProduct) {
    return (
      <Container>
        <div className="min-h-[500px] flex items-center justify-center flex-col gap-3 py-16">
          <Loader2 className="w-8 h-8 text-stone-900 animate-spin" />
          <p className="text-stone-500 font-semibold text-xs uppercase tracking-widest">
            Loading Product Details...
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-4">
        {/* Navigation Topbar */}
        <div className="flex items-center justify-between py-2 mb-4 border-b border-stone-200/60">
          <Breadcrumb />
          <Link
            to="/products"
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Shop</span>
          </Link>
        </div>

        {/* Main Product Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Gallery & Zoom (7 Columns on LG) */}
          <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4 sticky top-24">
            <ProductThumbnails
              thumbnails={thumbnails}
              selectedImage={selectedImage}
              onSelect={setSelectedImage}
            />
            <ProductZoom image={selectedImage} />
          </div>

          {/* Right Column: Specifications & Action Panel (5 Columns on LG) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-6">
            <ProductDescription
              brand={brandName}
              title={product?.name}
              price={product?.price}
              discountPrice={product?.discount_price}
              stock={product?.stock_quantity}
              rating={product?.rating || 4.9}
              numReviews={product?.numReviews || 34}
              description={product?.short_description}
            />

            <ColorSelector
              variants={product?.variants}
              colors={product?.colors}
              selectedColor={selectedColor}
              onSelect={(color) => {
                setSelectedColor(color);
                setSelectedSize(null);
              }}
            />

            <SizeSelector
              sizeGroup={categoryName.toLowerCase()}
              availableSizes={product?.sizes}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              variants={product?.variants}
              onSelect={setSelectedSize}
            />

            <AddToCart
              id={product?._id}
              isloading={isLoading}
              quantity={quantity}
              onIncrease={() => setQuantity(quantity + 1)}
              onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
              handleSubmit={handleAddToCart}
            />
          </div>
        </div>

        {/* Bottom Section: Tabs for Description, Specifications, and Size Chart */}
        <DetailsTabSection description={product?.description} />

        {/* Customer Reviews Section (Verified Buyers Only) */}
        {product?._id && <ReviewsSection productId={product._id} />}
      </div>
    </Container>
  );
};

export default ProductDetails;

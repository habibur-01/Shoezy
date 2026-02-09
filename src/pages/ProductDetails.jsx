import React, { useEffect, useState } from "react";
import ProductThumbnails from "../components/ProductDetails/ProductThumbnails.jsx"
import ProductZoom from "../components/ProductDetails/ProductZoom.jsx";
import ProductDescription from "../components/ProductDetails/ProductDescription.jsx";
import SizeSelector from "../components/ProductDetails/SizeSelectore.jsx";
import AddToCart from "../components/ProductDetails/AddToCart.jsx";
import Container from "../components/common/Container/Container.jsx";
import DetailsTabSection from "../components/ProductDetails/DetailsTabSection.jsx";
import Breadcrumb from "../components/common/Breadcrumb/Breadcrumb.jsx";
import { useParams } from "react-router-dom";
import { getProductsDetails } from "../server/product/product.js";
import { setSingleProduct } from "../redux/features/product/productSlice.js";
import { useDispatch, useSelector } from "react-redux";
import ColorSelector from "../components/ProductDetails/ColorSelector.jsx";
import { addToCart } from "../server/cart/cart.js";
import { toast } from "react-toastify";
import { increaseItemCount } from "../redux/features/initial/initialSlice.js";

const ProductDetails = () => {
  const params = useParams()
  const { slug } = params
  const dispatch = useDispatch()
  const product = useSelector(state => state.product.singleProduct)

  const thumbnails = React.useMemo(() => {
    return [
      product?.images?.cover,
      ...(product?.images?.gallery || [])
    ];
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(thumbnails[0]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false)
  console.log("🚀 ~ ProductDetails ~ isLoading:", isLoading)
  // Update selected image when thumbnails change
  useEffect(() => {
    if (thumbnails?.length > 0 && thumbnails[0]) {
      setSelectedImage(thumbnails[0]);
    }
  }, [thumbnails]);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await getProductsDetails(slug);
        if (result?.data?.success) {
          dispatch(setSingleProduct(result.data.data));
        }
      } catch (error) {
        console.log("fetch products:", error);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  const handleAddToCart = async (id) => {
    try {
      setIsLoading(true)
      if (!selectedColor && !selectedColor) return toast.error("Please select a color & size")
      const cartItem = {
        product: id,
        price: product?.discount_price ? product?.discount_price : product?.price,
        quantity,
        selectedSize,
        selectedColor
      }
      console.log("🚀 ~ handleAddToCart ~ cartItem:", cartItem)

      const result = await addToCart(cartItem)
      if (result?.data?.success) {
        dispatch(increaseItemCount())
        toast.success('This item is now in your cart.')
      } else {
        toast.error(result)
      }

    } catch (error) {
      console.log("🚀 ~ handleAddToCart ~ error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <div>
        <Breadcrumb />
      </div>
      <div className="flex  w-full">
        {/* Left: Images */}
        <div className="flex gap-4 w-1/2">
          <ProductThumbnails
            thumbnails={thumbnails}
            selectedImage={selectedImage}
            onSelect={setSelectedImage}
          />
          <ProductZoom image={selectedImage} />
        </div>

        {/* Right: Details */}
        <div className=" flex-1">
          <ProductDescription
            title={product?.name}
            price={product?.price}
            stock={product?.stock_quantity}
            description={product?.short_description}
          />
          <ColorSelector
            variants={product?.variants}
            colors={product?.colors}
            selectedColor={selectedColor}
            onSelect={(color) => {
              setSelectedColor(color)
              setSelectedSize(null)
            }}

          />

          <SizeSelector
            sizeGroup={product?.category?.name.toLowerCase()}       // "men" | "women" | "kids"
            availableSizes={product?.sizes}    // ["6", "8", "9"]
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
      <div>
        <DetailsTabSection description={product?.description} />
      </div>
    </Container>
  );
};

export default ProductDetails;

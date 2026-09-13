import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';


import { PublishBar } from './addProduct/PublishBar';
import { BasicInfoSection } from './addProduct/BasicInfoSection';
import { CategoryTaxonomySection } from './addProduct/CategoryTaxonomySection';
import { PricingSection } from './addProduct/PricingSection';
import { InventorySection } from './addProduct/InventorySection';
import { MediaSection } from './addProduct/MediaSection';
import { VariantsSection } from './addProduct/VariantsSection';
import { ShippingSection } from './addProduct/ShippingSection';
import { SeoSection } from './addProduct/SeoSection';
import { ProductPreviewModal } from './addProduct/ProductPreviewModal';









export const AddProductView = ({
  onBack,
  onNavigateToTaxonomy,
  initialCategory,
  initialSubCategory,
  initialChildCategory
}) => {
  const { categories, createProduct, hasPermission } = useAdmin();

  // Core product states
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [barcode, setBarcode] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(['new-arrival']);

  // Taxonomy states
  const [category, setCategory] = useState(
    initialCategory || categories[0]?.name || 'Electronics'
  );
  const [subCategory, setSubCategory] = useState(
    initialSubCategory || categories[0]?.subCategories?.[0]?.name || 'Audio & Headphones'
  );
  const [childCategory, setChildCategory] = useState(
    initialChildCategory || categories[0]?.subCategories?.[0]?.childCategories?.[0]?.name || ''
  );

  // Financials & Pricing
  const [price, setPrice] = useState(0);
  const [compareAtPrice, setCompareAtPrice] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [isTaxable, setIsTaxable] = useState(true);

  // Stock & Inventory
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState(25);
  const [lowStockThreshold, setLowStockThreshold] = useState(8);

  // Imagery & Gallery
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
  );
  const [galleryImages, setGalleryImages] = useState([]);

  // Variants
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState([]);

  // Shipping
  const [isPhysical, setIsPhysical] = useState(true);
  const [weight, setWeight] = useState(0.5);
  const [length, setLength] = useState(20);
  const [width, setWidth] = useState(15);
  const [height, setHeight] = useState(8);

  // Publishing & Modals
  const [status, setStatus] = useState('active');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const canPublish = hasPermission('products.create');

  const handleSubmit = (saveAsDraft = false) => {
    setValidationError(null);

    if (!title.trim()) {
      setValidationError('Product title is required.');
      return;
    }

    if (!sku.trim()) {
      setValidationError('SKU is required. You can click "Auto-Generate SKU" in Inventory.');
      return;
    }

    if (price <= 0 && !saveAsDraft) {
      setValidationError('Selling price must be greater than $0.00 to publish.');
      return;
    }

    if (!image.trim()) {
      setValidationError('A primary cover image URL is required.');
      return;
    }

    setIsSubmitting(true);

    const finalStatus = saveAsDraft ? 'draft' : status;

    const success = createProduct({
      title: title.trim(),
      sku: sku.trim().toUpperCase(),
      price: price || 0,
      stock: stock || 0,
      category,
      subCategory: subCategory || undefined,
      childCategory: childCategory || undefined,
      status: finalStatus,
      lowStockThreshold: lowStockThreshold || 5,
      image: image.trim(),
      brand: brand.trim() || undefined,
      barcode: barcode.trim() || undefined,
      description: description.trim() || undefined,
      galleryImages: galleryImages.length > 0 ? galleryImages : undefined,
      tags: tags.length > 0 ? tags : undefined,
      weight: isPhysical ? weight : undefined,
      dimensions: isPhysical ? { length, width, height } : undefined,
      variants: hasVariants && variants.length > 0 ? variants : undefined
    });

    setIsSubmitting(false);

    if (success) {
      onBack();
    }
  };

  return (
    <div className="pb-16 max-w-7xl mx-auto">
      {/* Sticky Publish Toolbar */}
      <PublishBar
        status={status}
        setStatus={setStatus}
        onBack={onBack}
        onPreview={() => setIsPreviewOpen(true)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        canPublish={canPublish}
        validationError={validationError} />
      

      {/* Responsive Form Layout: Main Column + Aside Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 2-Span Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Component 1: Basic Information */}
          <BasicInfoSection
            title={title}
            setTitle={setTitle}
            brand={brand}
            setBrand={setBrand}
            barcode={barcode}
            setBarcode={setBarcode}
            description={description}
            setDescription={setDescription}
            tags={tags}
            setTags={setTags} />
          

          {/* Component 2: Media & Gallery */}
          <MediaSection
            image={image}
            setImage={setImage}
            galleryImages={galleryImages}
            setGalleryImages={setGalleryImages} />
          

          {/* Component 3: Pricing & Financials */}
          <PricingSection
            price={price}
            setPrice={setPrice}
            compareAtPrice={compareAtPrice}
            setCompareAtPrice={setCompareAtPrice}
            costPrice={costPrice}
            setCostPrice={setCostPrice}
            isTaxable={isTaxable}
            setIsTaxable={setIsTaxable} />
          

          {/* Component 4: Product Variants */}
          <VariantsSection
            hasVariants={hasVariants}
            setHasVariants={setHasVariants}
            variants={variants}
            setVariants={setVariants}
            basePrice={price}
            baseSku={sku} />
          

          {/* Component 5: Shipping & Package Dimensions */}
          <ShippingSection
            isPhysical={isPhysical}
            setIsPhysical={setIsPhysical}
            weight={weight}
            setWeight={setWeight}
            length={length}
            setLength={setLength}
            width={width}
            setWidth={setWidth}
            height={height}
            setHeight={setHeight} />
          

          {/* Component 6: Search Engine Optimization Preview */}
          <SeoSection
            title={title}
            description={description}
            sku={sku}
            category={category} />
          
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Component 7: Category & 3-Tier Taxonomy */}
          <CategoryTaxonomySection
            category={category}
            setCategory={setCategory}
            subCategory={subCategory}
            setSubCategory={setSubCategory}
            childCategory={childCategory}
            setChildCategory={setChildCategory}
            onNavigateToTaxonomy={onNavigateToTaxonomy} />
          

          {/* Component 8: Inventory & Stock Management */}
          <InventorySection
            sku={sku}
            setSku={setSku}
            stock={stock}
            setStock={setStock}
            lowStockThreshold={lowStockThreshold}
            setLowStockThreshold={setLowStockThreshold}
            title={title}
            category={category} />
          

          {/* Quick Publish Checklist Card */}
          <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Publishing Checklist
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${title.trim() ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                
                <span className={title.trim() ? 'text-zinc-800' : 'text-zinc-400'}>
                  Product Title configured
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${sku.trim() ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                
                <span className={sku.trim() ? 'text-zinc-800' : 'text-zinc-400'}>
                  SKU assigned
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${price > 0 ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                
                <span className={price > 0 ? 'text-zinc-800' : 'text-zinc-400'}>
                  Selling price set ({price > 0 ? `$${price.toFixed(2)}` : 'Free'})
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${category ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                
                <span className={category ? 'text-zinc-800' : 'text-zinc-400'}>
                  Taxonomy hierarchy mapped
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${image.trim() ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                
                <span className={image.trim() ? 'text-zinc-800' : 'text-zinc-400'}>
                  Primary image provided
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Storefront Mockup Preview Modal */}
      <ProductPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={title}
        brand={brand}
        price={price}
        compareAtPrice={compareAtPrice}
        image={image}
        galleryImages={galleryImages}
        category={category}
        subCategory={subCategory}
        childCategory={childCategory}
        description={description}
        stock={stock}
        variants={variants}
        sku={sku} />
      
    </div>);

};

export const AddProductPage = () => {
  const navigate = useNavigate();
  return (
    <AddProductView
      onBack={() => navigate('/admin/products')}
      onNavigateToTaxonomy={() => navigate('/admin/categories')}
    />
  );
};

export default AddProductPage;
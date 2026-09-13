import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

import { ProductsHeader } from './products/ProductsHeader';
import { ProductsFilterBar } from './products/ProductsFilterBar';
import { ProductsTable } from './products/ProductsTable';
import { ProductQuickModal } from './products/ProductQuickModal';
import { AdminPagination } from './products/AdminPagination';

export const ProductsView = ({
  isNewModalOpen: externalModalOpen,
  setIsNewModalOpen: setExternalModalOpen,
  onNavigateToAddProduct,
  onNavigateToCategories
}) => {
  const {
    products,
    categories: taxonomyCategories,
    updateProductStock,
    createProduct,
    updateProduct,
    deleteProduct,
    isLoadingProducts,
    refreshProducts
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, stockFilter]);

  const isModalOpen = externalModalOpen !== undefined ? externalModalOpen : internalModalOpen;
  const setModalOpen = (open) => {
    if (setExternalModalOpen) {
      setExternalModalOpen(open);
    } else {
      setInternalModalOpen(open);
    }
  };

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState('Audio & Tech');
  const [formPrice, setFormPrice] = useState(99);
  const [formCost, setFormCost] = useState(45);
  const [formStock, setFormStock] = useState(20);
  const [formThreshold, setFormThreshold] = useState(10);
  const [formImage, setFormImage] = useState('');
  const [formStatus, setFormStatus] = useState('active');

  const categories = useMemo(() => {
    const catSet = new Set(['All']);
    if (taxonomyCategories?.length) {
      taxonomyCategories.forEach((c) => c?.name && catSet.add(c.name));
    }
    products.forEach((p) => {
      const cName = typeof p?.category === 'object' && p?.category !== null
        ? p.category.name
        : p?.category;
      if (cName && typeof cName === 'string') catSet.add(cName);
    });
    return Array.from(catSet);
  }, [taxonomyCategories, products]);

  const handleOpenAddModal = () => {
    if (onNavigateToAddProduct) {
      onNavigateToAddProduct();
      return;
    }
    setEditingProduct(null);
    setFormTitle('');
    setFormSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormCategory(categories[1] || 'Footwear');
    setFormPrice(129.99);
    setFormCost(55.0);
    setFormStock(25);
    setFormThreshold(10);
    setFormImage('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80');
    setFormStatus('active');
    setModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormTitle(product.title || product.name || '');
    setFormSku(product.sku || product._id || '');
    setFormCategory(
      typeof product.category === 'object' && product.category !== null
        ? (product.category.name || 'General')
        : (product.category || 'General')
    );
    setFormPrice(Number(product.price ?? 0));
    setFormCost(Number(product.cost ?? product.costPrice ?? 0));
    setFormStock(Number(product.stock ?? product.stock_quantity ?? 0));
    setFormThreshold(Number(product.lowStockThreshold ?? product.min_stock_alert ?? 8));
    setFormImage(
      product.image ||
      product.images?.cover ||
      (Array.isArray(product.images?.gallery) && product.images.gallery[0]) ||
      ''
    );
    setFormStatus(product.status || 'active');
    setModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const targetId = editingProduct?.id || editingProduct?._id;
    if (editingProduct && targetId) {
      const success = await updateProduct(targetId, {
        title: formTitle,
        name: formTitle,
        sku: formSku,
        category: formCategory,
        price: Number(formPrice),
        cost: Number(formCost),
        costPrice: Number(formCost),
        stock: Number(formStock),
        stock_quantity: Number(formStock),
        lowStockThreshold: Number(formThreshold),
        min_stock_alert: Number(formThreshold),
        image: formImage || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80',
        status: formStatus
      });
      if (success) setModalOpen(false);
    } else {
      const success = await createProduct({
        title: formTitle,
        name: formTitle,
        sku: formSku,
        category: formCategory,
        price: Number(formPrice),
        cost: Number(formCost),
        costPrice: Number(formCost),
        stock: Number(formStock),
        stock_quantity: Number(formStock),
        lowStockThreshold: Number(formThreshold),
        min_stock_alert: Number(formThreshold),
        image: formImage || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80',
        status: formStatus
      });
      if (success) setModalOpen(false);
    }
  };

  const handleDelete = (productId, title) => {
    if (confirm(`Are you sure you want to delete "${title}"? This action will be audited.`)) {
      deleteProduct(productId);
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const title = product?.title || product?.name || '';
      const sku = product?.sku || product?._id || '';
      const matchesSearch =
        !searchQuery ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sku.toLowerCase().includes(searchQuery.toLowerCase());

      const productCatName = typeof product?.category === 'object' && product?.category !== null
        ? product.category.name
        : product?.category;

      const matchesCategory = selectedCategory === 'All' || productCatName === selectedCategory;

      const stock = Number(product?.stock ?? product?.stock_quantity ?? 0);
      const lowThreshold = Number(product?.lowStockThreshold ?? product?.min_stock_alert ?? 8);

      let matchesStock = true;
      if (stockFilter === 'in_stock') matchesStock = stock > lowThreshold;
      if (stockFilter === 'low_stock')
        matchesStock = stock > 0 && stock <= lowThreshold;
      if (stockFilter === 'out_of_stock') matchesStock = stock <= 0;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  // Compute pagination parameters
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, safeCurrentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <ProductsHeader
        onOpenAddModal={handleOpenAddModal}
        onNavigateToCategories={onNavigateToCategories}
        onRefresh={refreshProducts}
        isLoading={isLoadingProducts}
      />

      {/* Control Bar: Search, Category Filter, Stock status tabs */}
      <ProductsFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
        products={products}
      />

      {/* Products Table */}
      <ProductsTable
        products={paginatedProducts}
        onUpdateStock={updateProductStock}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
        isLoading={isLoadingProducts}
      />

      {/* Pagination Controls */}
      <AdminPagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        pageSizeOptions={[10, 20, 50, 100]}
      />

      {/* Add / Edit Product Modal */}
      <ProductQuickModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        editingProduct={editingProduct}
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        formSku={formSku}
        setFormSku={setFormSku}
        formCategory={formCategory}
        setFormCategory={setFormCategory}
        formPrice={formPrice}
        setFormPrice={setFormPrice}
        formCost={formCost}
        setFormCost={setFormCost}
        formStock={formStock}
        setFormStock={setFormStock}
        formThreshold={formThreshold}
        setFormThreshold={setFormThreshold}
        formImage={formImage}
        setFormImage={setFormImage}
        formStatus={formStatus}
        setFormStatus={setFormStatus}
        categories={categories}
        onSubmit={handleSaveProduct}
      />
    </div>
  );
};

export const ProductsPage = () => {
  const navigate = useNavigate();
  return (
    <ProductsView
      onNavigateToAddProduct={() => navigate('/admin/add_product')}
      onNavigateToCategories={() => navigate('/admin/categories')}
    />
  );
};

export default ProductsPage;
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

import { CategoriesHeader } from './categories/CategoriesHeader';
import { TaxonomyMetricsBar } from './categories/TaxonomyMetricsBar';
import { ActiveHierarchyBreadcrumb } from './categories/ActiveHierarchyBreadcrumb';
import { MasterCategoryColumn } from './categories/MasterCategoryColumn';
import { SubCategoryColumn } from './categories/SubCategoryColumn';
import { ChildCategoryColumn } from './categories/ChildCategoryColumn';
import { CategoryTreeView } from './categories/CategoryTreeView';
import { LinkedProductsTable } from './categories/LinkedProductsTable';
import { CategoryModal } from './categories/CategoryModal';






export const CategoriesView = ({
  onSelectCategoryFilter,
  onNavigateToAddProduct
}) => {
  const {
    categories,
    products,
    createCategory,
    updateCategory,
    deleteCategory,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    createChildCategory,
    updateChildCategory,
    deleteChildCategory,
    metrics
  } = useAdmin();

  // Selection state for 3-tier cascading navigation
  const [selectedCatId, setSelectedCatId] = useState(() => categories[0]?.id || '');
  const [selectedSubCatId, setSelectedSubCatId] = useState(() => {
    const firstCat = categories[0];
    return firstCat?.subCategories?.[0]?.id || '';
  });
  const [selectedChildCatId, setSelectedChildCatId] = useState('');

  // Synchronize selection when categories load or change
  React.useEffect(() => {
    if (categories.length > 0) {
      const catExists = categories.some((c) => c.id === selectedCatId || c._id === selectedCatId);
      if (!selectedCatId || !catExists) {
        const firstCat = categories[0];
        const firstCatId = firstCat.id || firstCat._id || '';
        setSelectedCatId(firstCatId);
        const subs = firstCat.subCategories || firstCat.subcategories || [];
        const firstSubId = subs[0]?.id || subs[0]?._id || '';
        setSelectedSubCatId(firstSubId);
        setSelectedChildCatId('');
      }
    }
  }, [categories, selectedCatId]);

  // View toggle: 'columns' (Miller Columns) vs 'tree' (Hierarchical Tree)
  const [viewMode, setViewMode] = useState('columns');

  // Search filters per column
  const [catSearch, setCatSearch] = useState('');
  const [subCatSearch, setSubCatSearch] = useState('');
  const [childSearch, setChildSearch] = useState('');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTier, setModalTier] = useState('category');
  const [modalMode, setModalMode] = useState('create');

  // Target node IDs for edit/parent selection
  const [targetParentCatId, setTargetParentCatId] = useState('');
  const [targetParentSubCatId, setTargetParentSubCatId] = useState('');
  const [editingNodeId, setEditingNodeId] = useState('');

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState('active');
  const [formIcon, setFormIcon] = useState('Cpu');

  // Expanded nodes in tree view
  const [expandedCats, setExpandedCats] = useState({
    [categories[0]?.id || '']: true
  });
  const [expandedSubs, setExpandedSubs] = useState({
    [categories[0]?.subCategories?.[0]?.id || '']: true
  });

  // Currently resolved Category & Subcategory objects
  const activeCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCatId || c._id === selectedCatId) || categories[0] || null;
  }, [categories, selectedCatId]);

  const activeSubCategory = useMemo(() => {
    if (!activeCategory) return null;
    const subs = activeCategory.subCategories || activeCategory.subcategories || [];
    return (
      subs.find((s) => s.id === selectedSubCatId || s._id === selectedSubCatId) ||
      subs[0] ||
      null
    );
  }, [activeCategory, selectedSubCatId]);

  const activeChildCategory = useMemo(() => {
    if (!activeSubCategory) return null;
    const children = activeSubCategory.childCategories || activeSubCategory.childcategories || [];
    return children.find((ch) => ch.id === selectedChildCatId || ch._id === selectedChildCatId) || null;
  }, [activeSubCategory, selectedChildCatId]);

  // Compute products associated with the active selection
  const matchingProducts = useMemo(() => {
    if (!activeCategory) return [];
    return products.filter((p) => {
      if (activeChildCategory) {
        return (
          p.childCategory === activeChildCategory.name ||
          p.category === activeCategory.name && p.subCategory === activeSubCategory?.name);

      }
      if (activeSubCategory) {
        return p.subCategory === activeSubCategory.name || p.category === activeCategory.name;
      }
      return p.category === activeCategory.name;
    });
  }, [products, activeCategory, activeSubCategory, activeChildCategory]);

  // Handle open creation modal
  const handleOpenCreateModal = (
  tier,
  preCatId,
  preSubCatId) =>
  {
    setModalMode('create');
    setModalTier(tier);
    setEditingNodeId('');
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFormStatus('active');
    setFormIcon('Cpu');

    if (tier === 'category') {
      setTargetParentCatId('');
      setTargetParentSubCatId('');
    } else if (tier === 'subcategory') {
      setTargetParentCatId(preCatId || activeCategory?.id || categories[0]?.id || '');
      setTargetParentSubCatId('');
    } else if (tier === 'child') {
      const catId = preCatId || activeCategory?.id || categories[0]?.id || '';
      setTargetParentCatId(catId);
      const catObj = categories.find((c) => c.id === catId);
      const subId = preSubCatId || catObj?.subCategories?.[0]?.id || '';
      setTargetParentSubCatId(subId);
    }
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEditModal = (
  tier,
  node,
  parentCatId,
  parentSubCatId) =>
  {
    setModalMode('edit');
    setModalTier(tier);
    setEditingNodeId(node.id);
    setFormName(node.name);
    setFormSlug(node.slug);
    setFormDescription(node.description || '');
    setFormStatus(node.status);

    if (tier === 'category') {
      setFormIcon(node.icon || 'Cpu');
      setTargetParentCatId('');
      setTargetParentSubCatId('');
    } else if (tier === 'subcategory') {
      setTargetParentCatId(parentCatId || '');
      setTargetParentSubCatId('');
    } else if (tier === 'child') {
      setTargetParentCatId(parentCatId || '');
      setTargetParentSubCatId(parentSubCatId || '');
    }
    setIsModalOpen(true);
  };

  // Auto-generate slug as user types name
  const handleNameChange = (val) => {
    setFormName(val);
    if (modalMode === 'create') {
      const generatedSlug = val.
      toLowerCase().
      replace(/[^a-z0-9]+/g, '-').
      replace(/(^-|-$)+/g, '');
      setFormSlug(generatedSlug);
    }
  };

  // Save Modal
  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const slugToUse = formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (modalTier === 'category') {
      if (modalMode === 'create') {
        createCategory({
          name: formName.trim(),
          slug: slugToUse,
          description: formDescription.trim(),
          icon: formIcon,
          status: formStatus
        });
      } else {
        updateCategory(editingNodeId, {
          name: formName.trim(),
          slug: slugToUse,
          description: formDescription.trim(),
          icon: formIcon,
          status: formStatus
        });
      }
    } else if (modalTier === 'subcategory') {
      if (!targetParentCatId) return;
      if (modalMode === 'create') {
        createSubCategory(targetParentCatId, {
          categoryId: targetParentCatId,
          name: formName.trim(),
          slug: slugToUse,
          description: formDescription.trim(),
          status: formStatus
        });
      } else {
        updateSubCategory(targetParentCatId, editingNodeId, {
          name: formName.trim(),
          slug: slugToUse,
          description: formDescription.trim(),
          status: formStatus
        });
      }
    } else if (modalTier === 'child') {
      if (!targetParentCatId || !targetParentSubCatId) return;
      if (modalMode === 'create') {
        createChildCategory(targetParentCatId, targetParentSubCatId, {
          subCategoryId: targetParentSubCatId,
          name: formName.trim(),
          slug: slugToUse,
          description: formDescription.trim(),
          status: formStatus
        });
      } else {
        updateChildCategory(targetParentCatId, targetParentSubCatId, editingNodeId, {
          name: formName.trim(),
          slug: slugToUse,
          description: formDescription.trim(),
          status: formStatus
        });
      }
    }

    setIsModalOpen(false);
  };

  // Delete Handlers with confirmation
  const handleDeleteCategory = (cat) => {
    if (confirm(`Delete category "${cat.name}" and all its subcategories? This will be logged in the audit trail.`)) {
      deleteCategory(cat.id);
      if (selectedCatId === cat.id) {
        const remaining = categories.filter((c) => c.id !== cat.id);
        setSelectedCatId(remaining[0]?.id || '');
      }
    }
  };

  const handleDeleteSubCategory = (catId, sub) => {
    if (confirm(`Delete subcategory "${sub.name}" and all nested child categories?`)) {
      deleteSubCategory(catId, sub.id);
      if (selectedSubCatId === sub.id) {
        setSelectedSubCatId('');
      }
    }
  };

  const handleDeleteChildCategory = (catId, subId, child) => {
    if (confirm(`Delete child category "${child.name}"?`)) {
      deleteChildCategory(catId, subId, child.id);
      if (selectedChildCatId === child.id) {
        setSelectedChildCatId('');
      }
    }
  };

  // Toggle tree expansion
  const toggleCatExpand = (id) => {
    setExpandedCats((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleSubExpand = (id) => {
    setExpandedSubs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExpandAll = () => {
    const allCats = {};
    const allSubs = {};
    categories.forEach((c) => {
      allCats[c.id] = true;
      c.subCategories?.forEach((s) => allSubs[s.id] = true);
    });
    setExpandedCats(allCats);
    setExpandedSubs(allSubs);
  };

  const handleCollapseAll = () => {
    setExpandedCats({});
    setExpandedSubs({});
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics Bar */}
      <CategoriesHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenCreateModal={handleOpenCreateModal}
        activeCategory={activeCategory}
        activeSubCategory={activeSubCategory} />
      

      {/* Metrics Summary Strip */}
      <TaxonomyMetricsBar metrics={metrics} totalProducts={products.length} />

      {/* Active Breadcrumb Path Bar */}
      <ActiveHierarchyBreadcrumb
        activeCategory={activeCategory}
        activeSubCategory={activeSubCategory}
        activeChildCategory={activeChildCategory}
        matchingProductsCount={matchingProducts.length}
        onNavigateToAddProduct={onNavigateToAddProduct} />
      

      {/* VIEW 1: CASCADING 3-COLUMN MILLER PANES */}
      {viewMode === 'columns' &&
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[540px]">
          <MasterCategoryColumn
          categories={categories}
          selectedCatId={selectedCatId}
          catSearch={catSearch}
          setCatSearch={setCatSearch}
          onSelectCategory={(catId) => {
            setSelectedCatId(catId);
            const targetCat = categories.find((c) => c.id === catId);
            setSelectedSubCatId(targetCat?.subCategories?.[0]?.id || '');
            setSelectedChildCatId('');
          }}
          onOpenCreateModal={() => handleOpenCreateModal('category')}
          onOpenEditModal={(tier, node) => handleOpenEditModal(tier, node)}
          onDeleteCategory={handleDeleteCategory} />
        

          <SubCategoryColumn
          activeCategory={activeCategory}
          selectedSubCatId={selectedSubCatId}
          subCatSearch={subCatSearch}
          setSubCatSearch={setSubCatSearch}
          onSelectSubCategory={(subId) => {
            setSelectedSubCatId(subId);
            setSelectedChildCatId('');
          }}
          onOpenCreateModal={(tier, preCatId) => handleOpenCreateModal(tier, preCatId)}
          onOpenEditModal={(tier, node, parentCatId) =>
          handleOpenEditModal(tier, node, parentCatId)
          }
          onDeleteSubCategory={handleDeleteSubCategory} />
        

          <ChildCategoryColumn
          activeCategory={activeCategory}
          activeSubCategory={activeSubCategory}
          selectedChildCatId={selectedChildCatId}
          childSearch={childSearch}
          setChildSearch={setChildSearch}
          onSelectChildCategory={setSelectedChildCatId}
          onOpenCreateModal={(tier, preCatId, preSubCatId) =>
          handleOpenCreateModal(tier, preCatId, preSubCatId)
          }
          onOpenEditModal={(tier, node, parentCatId, parentSubCatId) =>
          handleOpenEditModal(tier, node, parentCatId, parentSubCatId)
          }
          onDeleteChildCategory={handleDeleteChildCategory}
          products={products} />
        
        </div>
      }

      {/* VIEW 2: FULL INTERACTIVE TREE VIEW */}
      {viewMode === 'tree' &&
      <CategoryTreeView
        categories={categories}
        expandedCats={expandedCats}
        expandedSubs={expandedSubs}
        onToggleCatExpand={toggleCatExpand}
        onToggleSubExpand={toggleSubExpand}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        onOpenCreateModal={handleOpenCreateModal}
        onOpenEditModal={handleOpenEditModal}
        onDeleteCategory={handleDeleteCategory}
        onDeleteSubCategory={handleDeleteSubCategory}
        onDeleteChildCategory={handleDeleteChildCategory} />

      }

      {/* LINKED PRODUCTS INSPECTION PANEL */}
      <LinkedProductsTable
        matchingProducts={matchingProducts}
        activeCategoryName={activeCategory?.name}
        activeSubCategoryName={activeSubCategory?.name}
        activeChildCategoryName={activeChildCategory?.name}
        onNavigateToAddProduct={onNavigateToAddProduct} />
      

      {/* ALL-IN-ONE CATEGORY CREATION & EDITING MODAL */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalMode={modalMode}
        modalTier={modalTier}
        setModalTier={setModalTier}
        categories={categories}
        activeCategory={activeCategory}
        targetParentCatId={targetParentCatId}
        setTargetParentCatId={setTargetParentCatId}
        targetParentSubCatId={targetParentSubCatId}
        setTargetParentSubCatId={setTargetParentSubCatId}
        formName={formName}
        formSlug={formSlug}
        formDescription={formDescription}
        formStatus={formStatus}
        formIcon={formIcon}
        setFormSlug={setFormSlug}
        setFormDescription={setFormDescription}
        setFormStatus={setFormStatus}
        setFormIcon={setFormIcon}
        onNameChange={handleNameChange}
        onSubmit={handleSaveModal} />
      
    </div>);

};

export const CategoriesPage = () => {
  const navigate = useNavigate();
  return (
    <CategoriesView
      onNavigateToAddProduct={() => navigate('/admin/add_product')}
      onSelectCategoryFilter={(catName) => navigate(`/admin/products?category=${encodeURIComponent(catName)}`)}
    />
  );
};

export default CategoriesPage;
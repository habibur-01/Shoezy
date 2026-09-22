import React, { useState, useEffect, useMemo } from 'react';
import {
  Tag,
  Plus,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Package,
  TrendingUp,
  Pencil,
  Trash2,
  X,
  Globe,
  Sparkles,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  getAdminBrands,
  createAdminBrand,
  updateAdminBrand,
  deleteAdminBrand,
} from '../../../server/brand/adminBrand';

const PARTNER_TIERS = [
  'Tier-1 Direct',
  'Tier-2 Distributor',
  'Authorized Dealer',
  'Exclusive Partner',
];

const PRESET_CATEGORIES = [
  'Running & Athletic Footwear',
  'Performance & Lifestyle Footwear',
  'Sneakers & Streetwear',
  'Motorsport & Speed Footwear',
  'Heritage Running & Lifestyle',
  'Signature In-House Collection',
  'Fitness & Retro Trainers',
  'Apparel & Accessories',
];

const QUICK_EMOJIS = ['👟', '⚡', '🐆', '🏃', '✨', '🏷️', '🔥', '🏆', '🎧', '🌿'];

export const BrandsView = () => {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive', 'featured'

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deletingBrand, setDeletingBrand] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo: '👟',
    category: PRESET_CATEGORIES[0],
    customCategory: '',
    tier: 'Tier-1 Direct',
    website: '',
    description: '',
    featured: false,
    status: 'active',
  });

  // Fetch brands from API
  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminBrands();
      if (res && res.data) {
        setBrands(res.data);
      } else if (Array.isArray(res)) {
        setBrands(res);
      }
    } catch (err) {
      console.error('Failed to load brands:', err);
      toast.error(err?.response?.data?.message || 'Failed to fetch brands from server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      name: '',
      slug: '',
      logo: '👟',
      category: PRESET_CATEGORIES[0],
      customCategory: '',
      tier: 'Tier-1 Direct',
      website: '',
      description: '',
      featured: false,
      status: 'active',
    });
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (brand) => {
    const isPresetCategory = PRESET_CATEGORIES.includes(brand.category);
    setFormData({
      name: brand.name || '',
      slug: brand.slug || '',
      logo: brand.logo || '🏷️',
      category: isPresetCategory ? brand.category : 'Other',
      customCategory: isPresetCategory ? '' : (brand.category || ''),
      tier: brand.tier || 'Tier-1 Direct',
      website: brand.website || '',
      description: brand.description || '',
      featured: Boolean(brand.featured),
      status: brand.status || 'active',
    });
    setEditingBrand(brand);
  };

  // Handle Create Brand
  const handleCreateBrand = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.warning('Brand name is required');
      return;
    }

    const resolvedCategory =
      formData.category === 'Other'
        ? formData.customCategory.trim() || 'Footwear'
        : formData.category;

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || undefined,
        logo: formData.logo.trim() || '🏷️',
        category: resolvedCategory,
        tier: formData.tier,
        website: formData.website.trim(),
        description: formData.description.trim(),
        featured: formData.featured,
        status: formData.status,
      };

      const res = await createAdminBrand(payload);
      const newBrand = res?.data || res;
      setBrands((prev) => [newBrand, ...prev]);
      toast.success(`Brand "${payload.name}" created successfully!`);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Create brand error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to create brand');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Update Brand
  const handleUpdateBrand = async (e) => {
    e.preventDefault();
    if (!editingBrand) return;
    if (!formData.name.trim()) {
      toast.warning('Brand name is required');
      return;
    }

    const resolvedCategory =
      formData.category === 'Other'
        ? formData.customCategory.trim() || 'Footwear'
        : formData.category;

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || undefined,
        logo: formData.logo.trim() || '🏷️',
        category: resolvedCategory,
        tier: formData.tier,
        website: formData.website.trim(),
        description: formData.description.trim(),
        featured: formData.featured,
        status: formData.status,
      };

      const res = await updateAdminBrand(editingBrand.id || editingBrand._id, payload);
      const updated = res?.data || res;

      setBrands((prev) =>
        prev.map((b) => ((b.id || b._id) === (editingBrand.id || editingBrand._id) ? updated : b))
      );
      toast.success(`Brand "${payload.name}" updated successfully!`);
      setEditingBrand(null);
    } catch (err) {
      console.error('Update brand error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update brand');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Brand
  const handleDeleteBrand = async () => {
    if (!deletingBrand) return;
    setIsSubmitting(true);
    try {
      const brandId = deletingBrand.id || deletingBrand._id;
      await deleteAdminBrand(brandId);
      setBrands((prev) => prev.filter((b) => (b.id || b._id) !== brandId));
      toast.success(`Brand "${deletingBrand.name}" deleted successfully!`);
      setDeletingBrand(null);
    } catch (err) {
      console.error('Delete brand error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to delete brand');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic Categories from existing brands
  const allCategories = useMemo(() => {
    const list = Array.from(new Set(brands.map((b) => b.category).filter(Boolean)));
    return ['all', ...list];
  }, [brands]);

  // Filtered Brands
  const filteredBrands = useMemo(() => {
    return brands.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (b.name && b.name.toLowerCase().includes(q)) ||
        (b.category && b.category.toLowerCase().includes(q)) ||
        (b.tier && b.tier.toLowerCase().includes(q)) ||
        (b.description && b.description.toLowerCase().includes(q));

      const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;

      let matchesStatus = true;
      if (statusFilter === 'active') matchesStatus = b.status === 'active';
      else if (statusFilter === 'inactive') matchesStatus = b.status === 'inactive';
      else if (statusFilter === 'featured') matchesStatus = Boolean(b.featured);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [brands, searchQuery, selectedCategory, statusFilter]);

  // Helper to render brand logo (either image URL or emoji)
  const renderBrandLogo = (logo, name) => {
    const isUrl = typeof logo === 'string' && (logo.startsWith('http://') || logo.startsWith('https://') || logo.startsWith('/'));
    if (isUrl) {
      return (
        <img
          src={logo}
          alt={name}
          className="w-full h-full object-contain p-1 rounded-xl"
          onError={(e) => {
            e.target.style.display = 'none';
            if (e.target.parentNode) {
              e.target.parentNode.textContent = '👟';
            }
          }}
        />
      );
    }
    return <span>{logo || '🏷️'}</span>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Brand Management</h1>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full">
              Catalog
            </span>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
              {brands.length} Brands
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Organize supplier partner brands, manage manufacturer tiers, update storefront profiles, and maintain brand taxonomy.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchBrands}
            disabled={isLoading}
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Refresh Brands"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            id="btn-add-brand"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Brand
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            id="input-search-brands"
            placeholder="Search brands, tiers, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-800"
          />
        </div>

        {/* Quick Filter Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-medium text-zinc-400 mr-1 hidden sm:inline">Status:</span>
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'Active' },
            { id: 'inactive', label: 'Inactive' },
            { id: 'featured', label: 'Featured ⭐' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === item.id
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Horizontal Tabs */}
      {allCategories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-medium text-zinc-400 shrink-0">Category:</span>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Loading Skeleton State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-2xs animate-pulse space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
                  <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-1/2" />
                </div>
              </div>
              <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
              <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
            </div>
          ))}
        </div>
      ) : filteredBrands.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-10 text-center shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <Tag className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">No brands found</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'all' || statusFilter !== 'all'
              ? 'No brands matched your search or category filters. Try clearing filters.'
              : 'You have not added any brand partners yet. Click below to add your first brand.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            {(searchQuery || selectedCategory !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setStatusFilter('all');
                }}
                className="px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Brand
            </button>
          </div>
        </div>
      ) : (
        /* Brands Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBrands.map((brand) => {
            const brandId = brand.id || brand._id;
            const isActive = brand.status === 'active' || brand.isActive !== false;

            return (
              <div
                key={brandId}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Logo, Name, Badges, and Action Buttons */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-2xl shadow-inner overflow-hidden">
                        {renderBrandLogo(brand.logo, brand.name)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 truncate">
                          <span className="truncate">{brand.name}</span>
                          {brand.featured && (
                            <span className="shrink-0 text-[9px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-1.5 py-0.2 rounded">
                              Featured
                            </span>
                          )}
                        </h3>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{brand.category}</p>
                      </div>
                    </div>

                    {/* Action buttons & Status Badge */}
                    <div className="flex items-center gap-1 shrink-0">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isActive
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                        }`}
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </span>

                      {/* Edit Button */}
                      <button
                        onClick={() => openEditModal(brand)}
                        className="p-1.5 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                        title="Edit Brand"
                        aria-label={`Edit ${brand.name}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeletingBrand(brand)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Brand"
                        aria-label={`Delete ${brand.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Brand Description if provided */}
                  {brand.description && (
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-2.5 mb-1 leading-relaxed">
                      {brand.description}
                    </p>
                  )}

                  {/* Metrics & Attributes Grid */}
                  <div className="grid grid-cols-2 gap-2 my-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
                    <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                      <span className="text-[10px] text-zinc-400 block font-medium">Catalog Items</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1 mt-0.5">
                        <Package className="w-3.5 h-3.5 text-zinc-500" />
                        {brand.productCount || 0} Products
                      </span>
                    </div>

                    <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                      <span className="text-[10px] text-zinc-400 block font-medium">Partner Tier</span>
                      <span className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1 mt-0.5 truncate">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">{brand.tier || 'Tier-1 Direct'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Storefront Link & Slug */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  {brand.website ? (
                    <a
                      href={brand.website.startsWith('http') ? brand.website : `https://${brand.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 inline-flex items-center gap-1 text-[11px] font-medium transition-colors"
                    >
                      <Globe className="w-3 h-3" />
                      <span>Storefront</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-zinc-400 italic">No storefront link</span>
                  )}

                  <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                    /{brand.slug}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================= */}
      {/* ADD BRAND MODAL                                         */}
      {/* ======================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Add Brand Partner</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Register a new supplier, shoe manufacturer, or apparel brand for catalog taxonomy.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBrand} className="mt-4 space-y-4 text-xs">
              {/* Brand Name and Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Brand Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nike, New Balance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Slug <span className="text-zinc-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="auto-generated if blank"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Logo / Emoji & Preview */}
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Brand Logo <span className="text-zinc-400 font-normal">(Emoji or Image URL)</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-2xl shadow-inner overflow-hidden">
                    {renderBrandLogo(formData.logo, formData.name || 'Preview')}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      placeholder="e.g. 👟 or https://example.com/logo.png"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                    {/* Quick emoji presets */}
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      <span className="text-[10px] text-zinc-400">Presets:</span>
                      {QUICK_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setFormData({ ...formData, logo: emoji })}
                          className="px-1.5 py-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Category and Partner Tier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Primary Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden"
                  >
                    {PRESET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="Other">Other / Custom Category...</option>
                  </select>

                  {formData.category === 'Other' && (
                    <input
                      type="text"
                      required
                      placeholder="Enter custom category..."
                      value={formData.customCategory}
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                      className="w-full mt-2 px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Partner Tier
                  </label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden"
                  >
                    {PARTNER_TIERS.map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Official Website */}
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Official Website
                </label>
                <input
                  type="url"
                  placeholder="https://brand.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Brand Description / Story
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief overview of the brand line, heritage, or specializations..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Status & Featured Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="checkbox-featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-zinc-300"
                  />
                  <label htmlFor="checkbox-featured" className="font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    Featured Brand ⭐
                  </label>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden"
                  >
                    <option value="active">Active (Visible in catalog)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* EDIT BRAND MODAL                                        */}
      {/* ======================================================= */}
      {editingBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Edit Brand: {editingBrand.name}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Update brand details, partner tiers, storefront URLs, and status.
                </p>
              </div>
              <button
                onClick={() => setEditingBrand(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateBrand} className="mt-4 space-y-4 text-xs">
              {/* Brand Name and Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Brand Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Logo / Emoji & Preview */}
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Brand Logo <span className="text-zinc-400 font-normal">(Emoji or Image URL)</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-2xl shadow-inner overflow-hidden">
                    {renderBrandLogo(formData.logo, formData.name || 'Preview')}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      <span className="text-[10px] text-zinc-400">Presets:</span>
                      {QUICK_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setFormData({ ...formData, logo: emoji })}
                          className="px-1.5 py-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Category and Partner Tier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Primary Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden"
                  >
                    {PRESET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="Other">Other / Custom Category...</option>
                  </select>

                  {formData.category === 'Other' && (
                    <input
                      type="text"
                      required
                      placeholder="Enter custom category..."
                      value={formData.customCategory}
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                      className="w-full mt-2 px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Partner Tier
                  </label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden"
                  >
                    {PARTNER_TIERS.map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Official Website */}
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Official Website
                </label>
                <input
                  type="url"
                  placeholder="https://brand.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Brand Description / Story
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Status & Featured Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit-checkbox-featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-zinc-300"
                  />
                  <label htmlFor="edit-checkbox-featured" className="font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    Featured Brand ⭐
                  </label>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden"
                  >
                    <option value="active">Active (Visible in catalog)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingBrand(null)}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Update Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* DELETE CONFIRMATION MODAL                               */}
      {/* ======================================================= */}
      {deletingBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-sm w-full p-5 animate-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <h3 className="text-sm font-bold text-center text-zinc-900 dark:text-zinc-100">
              Delete Brand Partner?
            </h3>
            <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 mt-1">
              Are you sure you want to delete <span className="font-semibold text-zinc-800 dark:text-zinc-200">{deletingBrand.name}</span>?
              {deletingBrand.productCount > 0 && (
                <span className="block mt-1 text-amber-600 dark:text-amber-400 font-medium">
                  Warning: {deletingBrand.productCount} products are currently associated with this brand.
                </span>
              )}
            </p>

            <div className="flex items-center justify-center gap-2 mt-5">
              <button
                type="button"
                onClick={() => setDeletingBrand(null)}
                disabled={isSubmitting}
                className="px-3.5 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteBrand}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Delete Brand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

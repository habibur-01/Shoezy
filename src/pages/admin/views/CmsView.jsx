import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Image,
  LayoutGrid,
  Menu,
  ImagePlus,
  Plus,
  Search,
  CheckCircle2,
  ExternalLink,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Move,
  Upload,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Layers,
  RefreshCw,
  X,
  AlertCircle,
  Sliders,
  Settings2,
  Link2,
  Tag,
  Copy,
  Palette,
} from 'lucide-react';
import api from '../../../api/index';
import {
  ADMIN_CMS_HOMEPAGE_SECTIONS_ENDPOINT,
  ADMIN_CMS_REORDER_SECTIONS_ENDPOINT,
  ADMIN_PAGES_ENDPOINT,
} from '../../../endpoint';
import { PREBUILT_TEMPLATES } from '../builder/builderTypes';
import { toast } from 'react-toastify';

const SECTION_TEMPLATES = [
  { type: 'popular_product', name: 'Top Selling & Popular Shoes', category: 'Products', description: 'Displays highest velocity and trending customer favorites.' },
  { type: 'featured_product', name: 'Featured Products Showcase', category: 'Products', description: 'Curated editorial picks selected by store merchandising.' },
  { type: 'offer', name: 'Special Deals & Promo Offers', category: 'Promotions', description: 'Promotional offer section with customizable cover layouts.' },
  { type: 'discount', name: 'Seasonal Discount Banner', category: 'Promotions', description: 'Promotional markdown banner with customizable cover layouts.' },
  { type: 'banner', name: 'Main Hero Banner Slider', category: 'Banners', description: 'Full-width high impact carousel banner with headline CTA.' },
  { type: 'shoe_showcase', name: 'Shoe Style & Variant Showcase', category: 'Visuals', description: 'Interactive multi-angle footwear category gallery.' },
  { type: 'testimonials', name: 'Customer Testimonials & Reviews', category: 'Social Proof', description: 'Verified buyer testimonials and star ratings carousel.' },
  { type: 'support', name: 'Customer Support & Perks Badges', category: 'Trust', description: 'Fast delivery, warranty, and payment trust badges.' },
];

const LAYOUT_OPTIONS = [
  { id: 'cards', name: 'Multi-Card Grid', desc: 'Side-by-side promotional offer cards with cover image and button' },
  { id: 'full_width', name: 'Full-Width Hero Cover', desc: 'Panoramic high-impact background cover banner with bold headline' },
  { id: 'split_banner', name: 'Split 50/50 Feature Banner', desc: 'Large cover image on left, styled discount card on right' },
  { id: 'deal_strip', name: 'Flash Deal Strip', desc: 'Compact gradient strip with discount badge, cover image and button' },
];

export const CmsView = ({ initialSection = 'pages' }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(initialSection);

  // Pages State
  const [pages, setPages] = useState([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isNewPageModalOpen, setIsNewPageModalOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('blank');
  const [isCreatingPage, setIsCreatingPage] = useState(false);

  // Banners State
  const [banners, setBanners] = useState([
    { id: 'b_01', title: 'Autumn Heritage Collection Hero', placement: 'Homepage Main Hero', ctaText: 'Explore Fall Gear', active: true, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=80' },
    { id: 'b_02', title: 'Free Worldwide Express Shipping Banner', placement: 'Top Announcement Ribbon', ctaText: 'Orders over $150', active: true, image: '' },
    { id: 'b_03', title: 'Artisan Ceramic Pour-Over Spotlight', placement: 'Category Header Banner', ctaText: 'Shop Coffee Bar', active: true, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80' },
  ]);

  // Dynamic Homepage Sections State from Backend
  const [sections, setSections] = useState([]);
  const [isLoadingSections, setIsLoadingSections] = useState(false);
  const [isSavingReorder, setIsSavingReorder] = useState(false);

  // Add Section Modal State
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionType, setNewSectionType] = useState('popular_product');
  const [newSectionPlacement, setNewSectionPlacement] = useState('below_popular');

  // Edit Section Content Modal State
  const [editingSection, setEditingSection] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editLayoutType, setEditLayoutType] = useState('cards');
  const [editBadgeText, setEditBadgeText] = useState('');
  const [editHeadline, setEditHeadline] = useState('');
  const [editCoverImage, setEditCoverImage] = useState('');
  const [editButtonText, setEditButtonText] = useState('');
  const [editButtonLink, setEditButtonLink] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Navigation Menus
  const [menus] = useState([
    { id: 'menu_header', name: 'Primary Main Header Navigation', location: 'Header Top Bar', itemsCount: 6 },
    { id: 'menu_footer_col1', name: 'Footer: Shop Categories', location: 'Footer Column 1', itemsCount: 5 },
    { id: 'menu_footer_col2', name: 'Footer: Customer Care & Returns', location: 'Footer Column 2', itemsCount: 4 },
    { id: 'menu_footer_col3', name: 'Footer: Legal & Transparency', location: 'Footer Column 3', itemsCount: 3 },
  ]);

  // Media Library
  const [mediaItems] = useState([
    { id: 'm_01', name: 'studio_headphones_front.webp', size: '240 KB', dims: '1200x1200', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80' },
    { id: 'm_02', name: 'ceramic_dripper_craft.webp', size: '310 KB', dims: '1200x1200', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80' },
    { id: 'm_03', name: 'mechanical_keyboard_rgb.webp', size: '420 KB', dims: '1440x900', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80' },
    { id: 'm_04', name: 'organic_hoodie_lifestyle.webp', size: '190 KB', dims: '1080x1350', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&auto=format&fit=crop&q=80' },
  ]);

  // Fetch custom pages on mount
  const fetchPages = async () => {
    setIsLoadingPages(true);
    try {
      const res = await api.get(ADMIN_PAGES_ENDPOINT);
      if (res.data?.success && Array.isArray(res.data.data)) {
        setPages(res.data.data);
      }
    } catch (err) {
      console.warn('Error fetching pages:', err);
    } finally {
      setIsLoadingPages(false);
    }
  };

  // Fetch homepage sections on mount
  const fetchSections = async () => {
    setIsLoadingSections(true);
    try {
      const res = await api.get(ADMIN_CMS_HOMEPAGE_SECTIONS_ENDPOINT);
      if (res.data?.success && Array.isArray(res.data.data)) {
        setSections(res.data.data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      }
    } catch (err) {
      console.warn('Error fetching homepage sections:', err);
      toast.error('Could not load homepage sections from server.');
    } finally {
      setIsLoadingSections(false);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchPages();
  }, []);

  // Sync activeSection with route prop initialSection
  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);


  // Create New Page
  const handleCreatePage = async (e) => {
    e.preventDefault();
    if (!newPageTitle.trim()) {
      toast.warning('Please enter a page title.');
      return;
    }

    setIsCreatingPage(true);
    try {
      let initialContent = [];
      if (selectedTemplateId !== 'blank') {
        const tpl = PREBUILT_TEMPLATES.find((t) => t.id === selectedTemplateId);
        if (tpl) {
          initialContent = tpl.content;
        }
      }

      const res = await api.post(ADMIN_PAGES_ENDPOINT, {
        title: newPageTitle.trim(),
        slug: newPageSlug.trim() || newPageTitle.toLowerCase().replace(/\s+/g, '-'),
        status: 'draft',
        content: initialContent,
      });

      if (res.data?.success && res.data.data) {
        toast.success(`Page "${newPageTitle}" created!`);
        setIsNewPageModalOpen(false);
        setNewPageTitle('');
        setNewPageSlug('');
        setSelectedTemplateId('blank');
        fetchPages();
        // Open visual builder
        navigate(`/admin/page-builder/${res.data.data._id}`);
      }
    } catch (err) {
      console.error('Failed to create page:', err);
      toast.error(err.response?.data?.message || 'Could not create page.');
    } finally {
      setIsCreatingPage(false);
    }
  };

  // Duplicate Page
  const handleDuplicatePage = async (pageId) => {
    try {
      const res = await api.post(`${ADMIN_PAGES_ENDPOINT}/${pageId}/duplicate`);
      if (res.data?.success) {
        toast.success('Page duplicated successfully as draft!');
        fetchPages();
      }
    } catch (err) {
      console.error('Failed to duplicate page:', err);
      toast.error('Failed to duplicate page.');
    }
  };

  // Delete Page
  const handleDeletePage = async (page) => {
    if (!window.confirm(`Are you sure you want to delete the page "${page.title}"?`)) {
      return;
    }
    try {
      const res = await api.delete(`${ADMIN_PAGES_ENDPOINT}/${page._id}`);
      if (res.data?.success) {
        toast.success(`Page "${page.title}" deleted.`);
        setPages((prev) => prev.filter((p) => p._id !== page._id));
      }
    } catch (err) {
      console.error('Failed to delete page:', err);
      toast.error('Failed to delete page.');
    }
  };


  // Reorder: Move Up
  const handleMoveUp = async (index) => {
    if (index <= 0) return;
    const reordered = [...sections];
    const temp = reordered[index];
    reordered[index] = reordered[index - 1];
    reordered[index - 1] = temp;

    const updated = reordered.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSections(updated);

    await saveReorderToBackend(updated);
  };

  // Reorder: Move Down
  const handleMoveDown = async (index) => {
    if (index >= sections.length - 1) return;
    const reordered = [...sections];
    const temp = reordered[index];
    reordered[index] = reordered[index + 1];
    reordered[index + 1] = temp;

    const updated = reordered.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSections(updated);

    await saveReorderToBackend(updated);
  };

  // Persist reordered array
  const saveReorderToBackend = async (updatedList) => {
    setIsSavingReorder(true);
    try {
      const payload = updatedList.map((s, idx) => ({
        _id: s._id,
        order: idx + 1,
      }));
      const res = await api.put(ADMIN_CMS_REORDER_SECTIONS_ENDPOINT, { sections: payload });
      if (res.data?.data && Array.isArray(res.data.data)) {
        setSections(res.data.data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      }
      toast.success('Homepage layout sequence saved live!');
    } catch (err) {
      console.error('Failed to save layout sequence:', err);
      toast.error('Failed to save layout sequence to server.');
      fetchSections();
    } finally {
      setIsSavingReorder(false);
    }
  };

  // Toggle Visibility
  const toggleSectionActive = async (section) => {
    try {
      const res = await api.patch(`${ADMIN_CMS_HOMEPAGE_SECTIONS_ENDPOINT}/${section._id}/toggle`);
      if (res.data?.success) {
        setSections((prev) =>
          prev.map((s) => (s._id === section._id ? { ...s, isActive: !s.isActive } : s))
        );
        toast.info(res.data.message || 'Section visibility updated.');
      }
    } catch (err) {
      console.error('Failed to toggle section status:', err);
      toast.error('Failed to update section visibility.');
    }
  };

  // Delete Section
  const handleDeleteSection = async (section) => {
    if (!window.confirm(`Are you sure you want to remove section "${section.title}" from the homepage?`)) {
      return;
    }
    try {
      const res = await api.delete(`${ADMIN_CMS_HOMEPAGE_SECTIONS_ENDPOINT}/${section._id}`);
      if (res.data?.success) {
        toast.success(`Removed "${section.title}"`);
        if (res.data?.data && Array.isArray(res.data.data)) {
          setSections(res.data.data.sort((a, b) => (a.order || 0) - (b.order || 0)));
        } else {
          fetchSections();
        }
      }
    } catch (err) {
      console.error('Failed to delete section:', err);
      toast.error('Failed to remove section.');
    }
  };

  // Create New Section
  const handleCreateSection = async (e) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) {
      toast.warning('Please provide a section title.');
      return;
    }

    let targetOrder = null;
    if (newSectionPlacement === 'top') {
      targetOrder = 1;
    } else if (newSectionPlacement === 'below_popular') {
      const popularIdx = sections.findIndex((s) => s.type === 'popular_product');
      if (popularIdx !== -1) {
        targetOrder = (sections[popularIdx].order || 1) + 1;
      } else {
        targetOrder = 2;
      }
    } else {
      targetOrder = sections.length + 1;
    }

    try {
      const res = await api.post(ADMIN_CMS_HOMEPAGE_SECTIONS_ENDPOINT, {
        title: newSectionTitle.trim(),
        type: newSectionType,
        targetPosition: targetOrder,
        settings: {
          title: newSectionTitle.trim(),
          layoutType: 'cards',
        },
      });

      if (res.data?.success) {
        toast.success(`Section "${newSectionTitle}" added to homepage!`);
        setIsAddSectionModalOpen(false);
        setNewSectionTitle('');

        // Directly set updated list from backend so it shows IMMEDIATELY in UI
        if (res.data?.data && Array.isArray(res.data.data)) {
          setSections(res.data.data.sort((a, b) => (a.order || 0) - (b.order || 0)));
        } else {
          fetchSections();
        }
      }
    } catch (err) {
      console.error('Failed to add section:', err);
      toast.error('Could not create section. Please try again.');
    }
  };

  // Open Edit Section Modal
  const openEditModal = (sec) => {
    setEditingSection(sec);
    setEditTitle(sec.title || '');
    const st = sec.settings || {};
    setEditSubtitle(st.subtitle || '');
    setEditLayoutType(st.layoutType || 'cards');
    setEditBadgeText(st.badgeText || 'Flat 25% Discount');
    setEditHeadline(st.headline || sec.title || '');
    setEditCoverImage(st.coverImage || '');
    setEditButtonText(st.buttonText || 'Shop Now');
    setEditButtonLink(st.buttonLink || '/products');
  };

  // Save Section Content & Settings
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingSection) return;

    setIsSavingEdit(true);
    try {
      const isProductSection = ['popular_product', 'featured_product', 'shoe_showcase'].includes(editingSection.type);

      const newSettings = isProductSection
        ? {
            ...editingSection.settings,
            title: editTitle.trim(),
            subtitle: editSubtitle.trim(),
          }
        : {
            ...editingSection.settings,
            layoutType: editLayoutType,
            badgeText: editBadgeText.trim(),
            headline: editHeadline.trim() || editTitle.trim(),
            subtitle: editSubtitle.trim(),
            coverImage: editCoverImage.trim(),
            buttonText: editButtonText.trim() || 'Shop Now',
            buttonLink: editButtonLink.trim() || '/products',
          };

      const res = await api.put(`${ADMIN_CMS_HOMEPAGE_SECTIONS_ENDPOINT}/${editingSection._id}`, {
        title: editTitle.trim(),
        settings: newSettings,
      });

      if (res.data?.success) {
        toast.success(`Updated content for "${editTitle}"!`);
        setEditingSection(null);

        if (res.data?.data && Array.isArray(res.data.data)) {
          setSections(res.data.data.sort((a, b) => (a.order || 0) - (b.order || 0)));
        } else {
          fetchSections();
        }
      }
    } catch (err) {
      console.error('Failed to update section:', err);
      toast.error('Failed to save section content.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const toggleBannerActive = (id) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Content Management System (CMS)</h1>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
              Storefront Experience
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage website content, marketing banners, navigation menus, and dynamically customize homepage layout & sections.
          </p>
        </div>
      </div>

      {/* 5 CMS Sub-Navigation Tabs */}
      {/* TOP CMS NAVIGATION TABS - USING LINKS FOR FULL URL & SIDEBAR SYNC */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-zinc-200 rounded-xl overflow-x-auto shadow-2xs">
        <Link
          to="/admin/cms_pages"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeSection === 'pages'
              ? 'bg-zinc-900 text-white shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Pages
        </Link>

        <Link
          to="/admin/cms_banners"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeSection === 'banners'
              ? 'bg-zinc-900 text-white shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Image className="w-3.5 h-3.5" />
          Banners
        </Link>

        <Link
          to="/admin/cms_homepage_sections"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeSection === 'homepage_sections'
              ? 'bg-zinc-900 text-white shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Homepage Sections
        </Link>

        <Link
          to="/admin/cms_navigation"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeSection === 'navigation'
              ? 'bg-zinc-900 text-white shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Menu className="w-3.5 h-3.5" />
          Navigation / Menus
        </Link>

        <Link
          to="/admin/cms_media"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeSection === 'media'
              ? 'bg-zinc-900 text-white shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <ImagePlus className="w-3.5 h-3.5" />
          Media Library
        </Link>
      </div>


      {/* SECTION: PAGES */}
      {activeSection === 'pages' && (
        <div className="space-y-4">
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">
                    Custom Pages & Landing Page Builder
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Elementor-Style Builder
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Create and customize promotional landing pages, product drops, or brand stories with drag-and-drop visual blocks.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsNewPageModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 cursor-pointer shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Create New Page
                </button>
              </div>
            </div>

            {isLoadingPages ? (
              <div className="p-8 text-center text-xs text-zinc-400">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                Loading custom pages...
              </div>
            ) : pages.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <Palette className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-xs text-zinc-800">No Custom Pages Yet</h4>
                <p className="text-[11px] text-zinc-500 max-w-sm mx-auto mt-1 mb-4">
                  Design promotional landing pages, shoe drop showcases, and brand story pages using our WordPress-style Visual Builder.
                </p>
                <button
                  onClick={() => setIsNewPageModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Create Your First Page
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Page Title & Slug</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Last Updated</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {pages.map((p) => (
                      <tr key={p._id || p.id} className="hover:bg-zinc-50/60">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-zinc-900 text-xs">{p.title}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[11px] text-indigo-600">
                              /page/{p.slug}
                            </span>
                            {p.status === 'published' && (
                              <Link
                                to={`/page/${p.slug}`}
                                target="_blank"
                                className="text-zinc-400 hover:text-indigo-600 p-0.5"
                                title="View Live Storefront"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-zinc-500 text-[11px]">
                          {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Visual Builder Button */}
                            <Link
                              to={`/admin/page-builder/${p._id}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
                              title="Edit in Visual Builder"
                            >
                              <Palette className="w-3.5 h-3.5" />
                              <span>Design</span>
                            </Link>

                            {/* Duplicate */}
                            <button
                              onClick={() => handleDuplicatePage(p._id)}
                              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                              title="Duplicate Page"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeletePage(p)}
                              className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Page"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE NEW PAGE MODAL */}
      {isNewPageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-zinc-900">Create New Custom Page</h3>
              </div>
              <button
                onClick={() => setIsNewPageModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="mt-4 space-y-4 text-xs">
              {/* Page Title */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Page Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Sneaker Drop 2026"
                  value={newPageTitle}
                  onChange={(e) => {
                    setNewPageTitle(e.target.value);
                    if (!newPageSlug || newPageSlug === newPageTitle.toLowerCase().replace(/\s+/g, '-')) {
                      setNewPageSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }
                  }}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* URL Slug */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  URL Slug (Auto Generated)
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-zinc-100 border border-r-0 border-zinc-200 rounded-l-lg text-zinc-500 font-mono">
                    /page/
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="summer-sneaker-drop-2026"
                    value={newPageSlug}
                    onChange={(e) => setNewPageSlug(e.target.value)}
                    className="flex-1 px-3 py-2 border border-zinc-200 rounded-r-lg bg-zinc-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Starter Template Picker */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-2">
                  Choose Starting Template
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setSelectedTemplateId('blank')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedTemplateId === 'blank'
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="font-bold text-zinc-800">Blank Canvas</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Start from a clean slate</div>
                  </div>

                  {PREBUILT_TEMPLATES.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTemplateId(t.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedTemplateId === t.id
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <div className="font-bold text-zinc-800 truncate">{t.name}</div>
                      <div className="text-[10px] text-zinc-500 truncate mt-0.5">{t.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPageModalOpen(false)}
                  className="px-3.5 py-1.5 text-zinc-600 hover:bg-zinc-100 font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingPage}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  {isCreatingPage ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>Create & Launch Visual Builder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* SECTION: BANNERS */}
      {activeSection === 'banners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((b) => (
            <div key={b.id} className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
              {b.image && (
                <img src={b.image} alt={b.title} className="w-full h-36 object-cover border-b border-zinc-100" />
              )}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-zinc-400">{b.placement}</span>
                  <button
                    onClick={() => toggleBannerActive(b.id)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer ${
                      b.active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                    }`}
                  >
                    {b.active ? 'Active' : 'Disabled'}
                  </button>
                </div>
                <h4 className="font-bold text-xs text-zinc-900">{b.title}</h4>
                <div className="text-[11px] text-zinc-500">CTA: "{b.ctaText}"</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION: HOMEPAGE SECTIONS (DYNAMIC LAYOUT & CONTENT BUILDER) */}
      {activeSection === 'homepage_sections' && (
        <div className="space-y-4">
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
            {/* Header with Add Section & Sync status */}
            <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">
                    Homepage Layout & Section Content Manager
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Live Page Builder
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Reorder sections with Up (↑) / Down (↓) buttons, edit titles and promotional cover layouts, and add new sections anytime.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isSavingReorder && (
                  <span className="text-xs text-indigo-600 flex items-center gap-1 font-medium">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </span>
                )}
                <button
                  onClick={() => setIsAddSectionModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 cursor-pointer shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Section
                </button>
              </div>
            </div>

            {/* Reorder List */}
            {isLoadingSections ? (
              <div className="p-8 text-center text-xs text-zinc-400">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                Loading homepage layout...
              </div>
            ) : sections.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500">
                No sections configured yet. Click "Add New Section" to get started.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 text-xs">
                {sections.map((sec, idx) => {
                  const isPromotion = ['offer', 'discount', 'banner', 'custom_banner'].includes(sec.type);
                  const isProduct = ['popular_product', 'featured_product', 'shoe_showcase'].includes(sec.type);
                  const layoutStyle = sec.settings?.layoutType || 'cards';

                  return (
                    <div
                      key={sec._id || sec.sectionKey || idx}
                      className={`p-3.5 flex items-center justify-between hover:bg-zinc-50/80 transition-colors ${
                        !sec.isActive ? 'opacity-60 bg-zinc-50/40' : ''
                      }`}
                    >
                      {/* Left: Position number, Title, Category Badge, Layout Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200/80 text-zinc-700 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                          {sec.order || idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-900 truncate text-xs">{sec.title}</span>
                            <span className="px-2 py-0.2 rounded text-[10px] font-mono font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
                              {sec.type}
                            </span>
                            {isPromotion && (
                              <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                Layout: {layoutStyle.replace('_', ' ')}
                              </span>
                            )}
                            {isProduct && (
                              <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                                Product Showcase
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                            Key: <span className="font-mono text-zinc-500">{sec.sectionKey}</span> • {sec.isActive ? 'Active on Storefront' : 'Hidden from Storefront'}
                            {sec.settings?.subtitle && ` • "${sec.settings.subtitle}"`}
                          </div>
                        </div>
                      </div>

                      {/* Right: Up / Down arrows, Edit Content, Visibility toggle, Delete */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Edit Content Button */}
                        <button
                          onClick={() => openEditModal(sec)}
                          title="Edit Section Content & Layout"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <Settings2 className="w-3.5 h-3.5" />
                          <span>Edit Content</span>
                        </button>

                        {/* Move Up */}
                        <button
                          onClick={() => handleMoveUp(idx)}
                          disabled={idx === 0}
                          title="Move Up"
                          className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                            idx === 0
                              ? 'text-zinc-300 border-zinc-100 cursor-not-allowed bg-zinc-50'
                              : 'text-zinc-600 border-zinc-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
                          }`}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          onClick={() => handleMoveDown(idx)}
                          disabled={idx === sections.length - 1}
                          title="Move Down"
                          className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                            idx === sections.length - 1
                              ? 'text-zinc-300 border-zinc-100 cursor-not-allowed bg-zinc-50'
                              : 'text-zinc-600 border-zinc-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
                          }`}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Toggle Active / Hidden */}
                        <button
                          onClick={() => toggleSectionActive(sec)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                            sec.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-200'
                          }`}
                        >
                          {sec.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{sec.isActive ? 'Visible' : 'Hidden'}</span>
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteSection(sec)}
                          title="Delete Section"
                          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION: NAVIGATION / MENUS */}
      {activeSection === 'navigation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menus.map((m) => (
            <div key={m.id} className="bg-white border border-zinc-200 rounded-xl p-4 shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-xs text-zinc-900">{m.name}</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Location: {m.location}</p>
                </div>
                <span className="font-mono text-xs bg-zinc-100 px-2 py-0.5 rounded text-zinc-700">
                  {m.itemsCount} links
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-end">
                <button className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 cursor-pointer">
                  Manage Menu Structure →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION: MEDIA LIBRARY */}
      {activeSection === 'media' && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-zinc-200 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs text-zinc-900">Asset Cloud Library</h3>
              <p className="text-[11px] text-zinc-400">Manage high-resolution imagery and CDN static files.</p>
            </div>
            <button
              onClick={() => alert('Media upload triggered')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 cursor-pointer shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" /> Upload Assets
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs group"
              >
                <img src={item.url} alt={item.name} className="w-full h-32 object-cover" />
                <div className="p-2.5 text-xs">
                  <div className="font-semibold text-zinc-800 truncate text-[11px]">{item.name}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    {item.size} • {item.dims}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD SECTION MODAL */}
      {isAddSectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-zinc-900">Add New Homepage Section</h3>
              </div>
              <button
                onClick={() => setIsAddSectionModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSection} className="mt-4 space-y-4 text-xs">
              {/* Section Title */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Section Display Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Trending & Top Selling Shoes"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Template / Component Type */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Choose Component Template <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                  {SECTION_TEMPLATES.map((tmpl) => (
                    <label
                      key={tmpl.type}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        newSectionType === tmpl.type
                          ? 'border-indigo-600 bg-indigo-50/50'
                          : 'border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="sectionType"
                        value={tmpl.type}
                        checked={newSectionType === tmpl.type}
                        onChange={() => setNewSectionType(tmpl.type)}
                        className="mt-0.5 text-indigo-600"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-900">{tmpl.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 font-mono">
                            {tmpl.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">{tmpl.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Placement / Position */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Initial Placement Order</label>
                <select
                  value={newSectionPlacement}
                  onChange={(e) => setNewSectionPlacement(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:outline-hidden"
                >
                  <option value="below_popular">Below Top Selling / Popular Products (Recommended)</option>
                  <option value="top">At the very top (Position 1)</option>
                  <option value="bottom">At the bottom of the page</option>
                </select>
                <p className="text-[11px] text-zinc-400 mt-1">
                  You can always adjust the position using the Up (↑) & Down (↓) buttons after adding.
                </p>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsAddSectionModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs cursor-pointer transition-colors"
                >
                  Add Section to Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SECTION CONTENT MODAL */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    Edit Content: {editingSection.title}
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Type: {editingSection.type}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditingSection(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4 text-xs">
              {/* Common: Section Title */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Section Headline / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Popular Product / Top Sell"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Common: Subtitle */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Subtitle / Description (Optional)
                </label>
                <input
                  type="text"
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  placeholder="e.g. Discover our most demanded footwear styles of the season"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* SPECIFIC TO PROMOTION & OFFER SECTIONS: Layout Selector & Cover Image */}
              {['offer', 'discount', 'banner', 'custom_banner'].includes(editingSection.type) && (
                <div className="space-y-4 pt-3 border-t border-zinc-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Promotion Cover Layout & Design Options</span>
                  </div>

                  {/* Layout Style Choice */}
                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1.5">
                      Select Cover Layout Style
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {LAYOUT_OPTIONS.map((opt) => (
                        <label
                          key={opt.id}
                          className={`p-2.5 rounded-lg border cursor-pointer transition-colors flex flex-col justify-between ${
                            editLayoutType === opt.id
                              ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600'
                              : 'border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-900 text-xs">{opt.name}</span>
                            <input
                              type="radio"
                              name="layoutType"
                              value={opt.id}
                              checked={editLayoutType === opt.id}
                              onChange={() => setEditLayoutType(opt.id)}
                              className="text-indigo-600"
                            />
                          </div>
                          <p className="text-[10px] text-zinc-500 mt-1 leading-tight">{opt.desc}</p>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Cover Image URL */}
                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={editCoverImage}
                      onChange={(e) => setEditCoverImage(e.target.value)}
                      placeholder="https://images.unsplash.com/... or leave blank for default"
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:outline-hidden font-mono text-[11px]"
                    />
                    {editCoverImage && (
                      <div className="mt-2 rounded-lg overflow-hidden border border-zinc-200 h-24 w-full">
                        <img
                          src={editCoverImage}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Badge Text & Button */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-zinc-700 mb-1">
                        Discount / Badge Text
                      </label>
                      <input
                        type="text"
                        value={editBadgeText}
                        onChange={(e) => setEditBadgeText(e.target.value)}
                        placeholder="e.g. Flat 25% Discount"
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-zinc-700 mb-1">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={editButtonText}
                        onChange={(e) => setEditButtonText(e.target.value)}
                        placeholder="e.g. Shop Now"
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">
                      Button Link Target
                    </label>
                    <input
                      type="text"
                      value={editButtonLink}
                      onChange={(e) => setEditButtonLink(e.target.value)}
                      placeholder="e.g. /products or /products/sports"
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:outline-hidden font-mono text-[11px]"
                    />
                  </div>
                </div>
              )}

              {/* SPECIFIC TO PRODUCT SECTIONS: Helpful Info */}
              {['popular_product', 'featured_product', 'shoe_showcase'].includes(editingSection.type) && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px] leading-relaxed">
                  <span className="font-bold">Product Showcase Section:</span> Products in this section are dynamically pulled from your live catalog based on customer demand and sales. You can customize the section title and description above to highlight this collection (e.g. "Trending Shoes / Top Sell").
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  {isSavingEdit && <RefreshCw className="w-3 h-3 animate-spin" />}
                  <span>Save Content</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

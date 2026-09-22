import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  RotateCw,
  Plus,
  Layers,
  Sparkles,
  Layout,
  Sliders,
  Type,
  Image as ImageIcon,
  ShoppingBag,
  ShieldCheck,
  Trash2,
  Copy,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  X,
  Search,
  Check,
  Globe,
  Settings,
  HelpCircle,
} from 'lucide-react';
import api from '../../../api/index';
import { ADMIN_PAGES_ENDPOINT } from '../../../endpoint';
import { toast } from 'react-toastify';
import {
  ELEMENT_CATEGORIES,
  ELEMENT_DEFINITIONS,
  PREBUILT_TEMPLATES,
} from './builderTypes';
import { ElementRenderer } from './ElementRenderer';

export const PageBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewPage = !id || id === 'new';

  // Page Meta & State
  const [pageId, setPageId] = useState(isNewPage ? null : id);
  const [pageTitle, setPageTitle] = useState('New Custom Page');
  const [pageSlug, setPageSlug] = useState('new-custom-page');
  const [pageDescription, setPageDescription] = useState('');
  const [pageStatus, setPageStatus] = useState('draft'); // 'draft' | 'published'
  const [pageSettings, setPageSettings] = useState({
    backgroundColor: '#ffffff',
    maxWidth: '1280px',
    padding: '0px',
    metaTitle: '',
    metaDescription: '',
  });

  // Content Tree State
  const [content, setContent] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);

  // Undo / Redo History
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // UI Modes & Panels
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState('elements'); // 'elements' | 'layers' | 'settings'
  const [activeInspectorTab, setActiveInspectorTab] = useState('content'); // 'content' | 'style' | 'layout'
  const [elementSearch, setElementSearch] = useState('');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Loading / Saving States
  const [isLoading, setIsLoading] = useState(!isNewPage);
  const [isSaving, setIsSaving] = useState(false);

  // ----------------------------------------------------
  // Initial Load from API
  // ----------------------------------------------------
  useEffect(() => {
    if (!isNewPage && id) {
      const fetchPage = async () => {
        setIsLoading(true);
        try {
          const res = await api.get(`${ADMIN_PAGES_ENDPOINT}/${id}`);
          if (res.data?.success && res.data.data) {
            const p = res.data.data;
            setPageId(p._id);
            setPageTitle(p.title || 'Untitled Page');
            setPageSlug(p.slug || 'untitled');
            setPageDescription(p.description || '');
            setPageStatus(p.status || 'draft');
            setPageSettings(p.settings || { backgroundColor: '#ffffff', maxWidth: '1280px' });
            const initialContent = Array.isArray(p.content) ? p.content : [];
            setContent(initialContent);
            setHistory([JSON.stringify(initialContent)]);
            setHistoryIndex(0);
          }
        } catch (err) {
          console.error('Failed to load page:', err);
          toast.error('Could not load page from server.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchPage();
    } else {
      // Initialize blank page with empty history
      setHistory([JSON.stringify([])]);
      setHistoryIndex(0);
    }
  }, [id, isNewPage]);

  // ----------------------------------------------------
  // History / Undo / Redo
  // ----------------------------------------------------
  const updateContentWithHistory = (newContent) => {
    setContent(newContent);
    const serialized = JSON.stringify(newContent);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(serialized);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setContent(JSON.parse(history[prevIndex]));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setContent(JSON.parse(history[nextIndex]));
    }
  };

  // ----------------------------------------------------
  // Tree Traversal & Manipulation Helpers
  // ----------------------------------------------------
  const findElementById = (nodes, targetId) => {
    for (const node of nodes) {
      if (node.id === targetId) return node;
      if (node.children && node.children.length > 0) {
        const found = findElementById(node.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const updateElementById = (nodes, targetId, updater) => {
    return nodes.map((node) => {
      if (node.id === targetId) {
        return updater(node);
      }
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: updateElementById(node.children, targetId, updater),
        };
      }
      return node;
    });
  };

  const removeElementById = (nodes, targetId) => {
    return nodes
      .filter((node) => node.id !== targetId)
      .map((node) => {
        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: removeElementById(node.children, targetId),
          };
        }
        return node;
      });
  };

  const duplicateNodeRecursive = (node) => {
    const newId = `${node.type}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    return {
      ...node,
      id: newId,
      children: node.children ? node.children.map(duplicateNodeRecursive) : undefined,
    };
  };

  const duplicateElementById = (nodes, targetId) => {
    const result = [];
    for (const node of nodes) {
      result.push(node);
      if (node.id === targetId) {
        result.push(duplicateNodeRecursive(node));
      } else if (node.children && node.children.length > 0) {
        node.children = duplicateElementById(node.children, targetId);
      }
    }
    return result;
  };

  // ----------------------------------------------------
  // Element Actions
  // ----------------------------------------------------
  const handleSelectElement = (element) => {
    setSelectedElementId(element?.id || null);
    if (element) {
      setActiveLeftTab('elements');
    }
  };

  const handleAddElement = (type, targetParentId = null) => {
    const def = ELEMENT_DEFINITIONS[type];
    if (!def) return;

    const newElement = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: def.type,
      props: { ...def.defaultProps },
      styles: { ...def.defaultStyles },
      children: def.isContainer ? [] : undefined,
    };

    let updatedContent;
    if (targetParentId) {
      // Add inside targeted container
      updatedContent = updateElementById(content, targetParentId, (parent) => ({
        ...parent,
        children: [...(parent.children || []), newElement],
      }));
    } else if (selectedElementId) {
      // If currently selected element is a container, add inside it
      const selected = findElementById(content, selectedElementId);
      if (selected && selected.children) {
        updatedContent = updateElementById(content, selectedElementId, (parent) => ({
          ...parent,
          children: [...(parent.children || []), newElement],
        }));
      } else {
        // Otherwise append to root
        updatedContent = [...content, newElement];
      }
    } else {
      // Append to root
      updatedContent = [...content, newElement];
    }

    updateContentWithHistory(updatedContent);
    setSelectedElementId(newElement.id);
    toast.info(`Added ${def.name}`);
  };

  const handleDeleteElement = (idToDelete) => {
    const updated = removeElementById(content, idToDelete);
    updateContentWithHistory(updated);
    if (selectedElementId === idToDelete) {
      setSelectedElementId(null);
    }
    toast.info('Element removed');
  };

  const handleDuplicateElement = (idToDup) => {
    const updated = duplicateElementById(content, idToDup);
    updateContentWithHistory(updated);
    toast.info('Element duplicated');
  };

  const handleMoveUp = (targetId) => {
    const moveInArray = (arr) => {
      const idx = arr.findIndex((n) => n.id === targetId);
      if (idx > 0) {
        const copy = [...arr];
        const temp = copy[idx];
        copy[idx] = copy[idx - 1];
        copy[idx - 1] = temp;
        return copy;
      }
      return arr.map((item) => {
        if (item.children) {
          return { ...item, children: moveInArray(item.children) };
        }
        return item;
      });
    };
    updateContentWithHistory(moveInArray(content));
  };

  const handleMoveDown = (targetId) => {
    const moveInArray = (arr) => {
      const idx = arr.findIndex((n) => n.id === targetId);
      if (idx !== -1 && idx < arr.length - 1) {
        const copy = [...arr];
        const temp = copy[idx];
        copy[idx] = copy[idx + 1];
        copy[idx + 1] = temp;
        return copy;
      }
      return arr.map((item) => {
        if (item.children) {
          return { ...item, children: moveInArray(item.children) };
        }
        return item;
      });
    };
    updateContentWithHistory(moveInArray(content));
  };

  // Load a Pre-built Template
  const handleApplyTemplate = (tpl) => {
    if (
      content.length > 0 &&
      !window.confirm('Applying this template will replace the current canvas contents. Continue?')
    ) {
      return;
    }
    updateContentWithHistory(tpl.content);
    setIsTemplateModalOpen(false);
    setSelectedElementId(null);
    toast.success(`Loaded template: "${tpl.name}"`);
  };

  // ----------------------------------------------------
  // Save / Publish to Backend
  // ----------------------------------------------------
  const handleSave = async (targetStatus = pageStatus) => {
    if (!pageTitle.trim()) {
      toast.warning('Please provide a page title.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: pageTitle.trim(),
        slug: pageSlug.trim() || pageTitle.toLowerCase().replace(/\s+/g, '-'),
        description: pageDescription.trim(),
        status: targetStatus,
        content: content,
        settings: pageSettings,
      };

      let res;
      if (pageId) {
        res = await api.put(`${ADMIN_PAGES_ENDPOINT}/${pageId}`, payload);
      } else {
        res = await api.post(ADMIN_PAGES_ENDPOINT, payload);
      }

      if (res.data?.success && res.data.data) {
        const saved = res.data.data;
        setPageId(saved._id);
        setPageStatus(saved.status);
        toast.success(
          targetStatus === 'published'
            ? 'Page successfully published live!'
            : 'Page draft saved successfully!'
        );
      }
    } catch (err) {
      console.error('Failed to save page:', err);
      toast.error(err.response?.data?.message || 'Could not save page.');
    } finally {
      setIsSaving(false);
    }
  };

  // Currently Selected Node
  const selectedElement = selectedElementId ? findElementById(content, selectedElementId) : null;

  // ----------------------------------------------------
  // Render
  // ----------------------------------------------------
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white gap-3">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm font-medium text-slate-300">Loading Page Builder workspace...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* ==================================================== */}
      {/* 1. TOP APP BAR */}
      {/* ==================================================== */}
      <header className="h-14 border-b border-slate-800 bg-slate-900 px-4 flex items-center justify-between shrink-0 z-40">
        {/* Left: Back button & Page title */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/cms_pages"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to CMS Pages"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              className="bg-transparent text-sm font-bold text-white border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-hidden px-1 py-0.5 max-w-[200px] md:max-w-[300px] truncate"
              title="Click to edit page title"
            />

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                pageStatus === 'published'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {pageStatus}
            </span>
          </div>

          <div className="hidden lg:flex items-center text-xs text-slate-400 font-mono">
            <span>/page/</span>
            <input
              type="text"
              value={pageSlug}
              onChange={(e) => setPageSlug(e.target.value)}
              className="bg-transparent text-indigo-400 border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-hidden px-1 py-0.5 max-w-[150px]"
            />
          </div>
        </div>

        {/* Center: Viewport Switcher & History */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewport === 'desktop' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop View (100%)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewport === 'tablet' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewport === 'mobile' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile View (380px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-slate-800 mx-1" />

          {/* Undo / Redo */}
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className={`p-1.5 rounded-lg transition-colors ${
              historyIndex <= 0
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-400 hover:text-white cursor-pointer'
            }`}
            title="Undo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className={`p-1.5 rounded-lg transition-colors ${
              historyIndex >= history.length - 1
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-400 hover:text-white cursor-pointer'
            }`}
            title="Redo"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Actions (Templates, Preview, Save, Publish) */}
        <div className="flex items-center gap-2">
          {/* Templates Picker */}
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Templates</span>
          </button>

          {/* Live Storefront Link if published */}
          {pageSlug && (
            <Link
              to={`/page/${pageSlug}`}
              target="_blank"
              className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Open Public Page in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}

          {/* Preview Mode Toggle */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              isPreviewMode
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {isPreviewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isPreviewMode ? 'Exit Preview' : 'Preview'}</span>
          </button>

          {/* Save Draft */}
          <button
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          {/* Publish Live */}
          <button
            onClick={() => handleSave('published')}
            disabled={isSaving}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg transition-colors shadow-sm cursor-pointer inline-flex items-center gap-1.5"
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span>Publish Live</span>
          </button>
        </div>
      </header>

      {/* ==================================================== */}
      {/* 2. BUILDER WORKSPACE (3-COLUMN LAYOUT) */}
      {/* ==================================================== */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ================================================ */}
        {/* LEFT SIDEBAR: ELEMENTS / LAYERS / SETTINGS */}
        {/* ================================================ */}
        {!isPreviewMode && (
          <aside className="w-72 border-r border-slate-800 bg-slate-900 flex flex-col shrink-0 z-20">
            {/* Sidebar Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950 text-xs font-semibold">
              <button
                onClick={() => setActiveLeftTab('elements')}
                className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  activeLeftTab === 'elements'
                    ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-900/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Elements</span>
              </button>
              <button
                onClick={() => setActiveLeftTab('layers')}
                className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  activeLeftTab === 'layers'
                    ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-900/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Layers</span>
              </button>
              <button
                onClick={() => setActiveLeftTab('settings')}
                className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  activeLeftTab === 'settings'
                    ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-900/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
            </div>

            {/* TAB CONTENT: ELEMENTS PALETTE */}
            {activeLeftTab === 'elements' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search widgets..."
                    value={elementSearch}
                    onChange={(e) => setElementSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                {/* Categories */}
                {ELEMENT_CATEGORIES.map((cat) => {
                  const items = Object.values(ELEMENT_DEFINITIONS).filter((def) => {
                    const matchCat = def.category === cat.id;
                    const matchSearch = elementSearch
                      ? def.name.toLowerCase().includes(elementSearch.toLowerCase()) ||
                        def.description.toLowerCase().includes(elementSearch.toLowerCase())
                      : true;
                    return matchCat && matchSearch;
                  });

                  if (items.length === 0) return null;

                  return (
                    <div key={cat.id} className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                        {cat.name}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {items.map((item) => (
                          <button
                            key={item.type}
                            onClick={() => handleAddElement(item.type)}
                            className="p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-left transition-all cursor-pointer group flex flex-col gap-1.5"
                          >
                            <div className="w-7 h-7 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-800/50 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <Plus className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate">
                                {item.description}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB CONTENT: LAYERS TREE */}
            {activeLeftTab === 'layers' && (
              <div className="flex-1 overflow-y-auto p-3">
                <div className="text-xs font-semibold text-slate-400 mb-2 px-1">Page Hierarchy</div>
                {content.length === 0 ? (
                  <div className="text-xs text-slate-500 text-center py-8">Canvas is empty</div>
                ) : (
                  <div className="space-y-1">
                    {content.map((node, idx) => (
                      <LayerTreeItem
                        key={node.id || idx}
                        node={node}
                        selectedId={selectedElementId}
                        onSelect={(id) => setSelectedElementId(id)}
                        onDelete={handleDeleteElement}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: PAGE SETTINGS */}
            {activeLeftTab === 'settings' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Canvas Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={pageSettings.backgroundColor || '#ffffff'}
                      onChange={(e) =>
                        setPageSettings({ ...pageSettings, backgroundColor: e.target.value })
                      }
                      className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={pageSettings.backgroundColor || '#ffffff'}
                      onChange={(e) =>
                        setPageSettings({ ...pageSettings, backgroundColor: e.target.value })
                      }
                      className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Max Canvas Width</label>
                  <input
                    type="text"
                    value={pageSettings.maxWidth || '1280px'}
                    onChange={(e) => setPageSettings({ ...pageSettings, maxWidth: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                    placeholder="e.g. 1280px or 100%"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="font-bold text-slate-300">SEO & Metadata</div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={pageSettings.metaTitle || ''}
                      onChange={(e) =>
                        setPageSettings({ ...pageSettings, metaTitle: e.target.value })
                      }
                      placeholder="e.g. Shoezy Exclusive Sneaker Launch"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Meta Description</label>
                    <textarea
                      rows={3}
                      value={pageSettings.metaDescription || ''}
                      onChange={(e) =>
                        setPageSettings({ ...pageSettings, metaDescription: e.target.value })
                      }
                      placeholder="Page summary for search engines..."
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}
          </aside>
        )}

        {/* ================================================ */}
        {/* CENTER CANVAS: LIVE RESPONSIVE PREVIEW */}
        {/* ================================================ */}
        <main
          onClick={() => setSelectedElementId(null)}
          className="flex-1 bg-slate-900/60 overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-start relative"
        >
          {/* Canvas Wrapper */}
          <div
            style={{
              backgroundColor: pageSettings.backgroundColor || '#ffffff',
              maxWidth:
                viewport === 'mobile'
                  ? '380px'
                  : viewport === 'tablet'
                  ? '768px'
                  : pageSettings.maxWidth || '100%',
              minHeight: '80vh',
            }}
            className={`w-full transition-all duration-300 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 text-slate-900 relative ${
              viewport !== 'desktop' ? 'my-4 ring-8 ring-slate-950' : ''
            }`}
          >
            {content.length === 0 ? (
              /* Empty Canvas State */
              <div className="py-24 px-6 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
                  <Layout className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Your Canvas is Ready</h3>
                <p className="text-sm text-slate-500 max-w-md mt-1 mb-6">
                  Add elements from the left panel, or load a professionally crafted pre-built template to start instantly.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setIsTemplateModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Browse Pre-built Templates</span>
                  </button>
                  <button
                    onClick={() => handleAddElement('section')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Section</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Render the element tree */
              <div className="w-full">
                {content.map((element, idx) => (
                  <ElementRenderer
                    key={element.id || idx}
                    element={element}
                    isBuilder={!isPreviewMode}
                    selectedId={selectedElementId}
                    onSelect={handleSelectElement}
                    onDelete={handleDeleteElement}
                    onDuplicate={handleDuplicateElement}
                    onMoveUp={() => handleMoveUp(element.id)}
                    onMoveDown={() => handleMoveDown(element.id)}
                    onAddChild={(parentId) => {
                      setSelectedElementId(parentId);
                      setActiveLeftTab('elements');
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Floating Bottom Quick Add Button */}
          {!isPreviewMode && content.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => handleAddElement('section')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Section to Bottom</span>
              </button>
            </div>
          )}
        </main>

        {/* ================================================ */}
        {/* RIGHT SIDEBAR: ELEMENT INSPECTOR & STYLING */}
        {/* ================================================ */}
        {!isPreviewMode && (
          <aside className="w-80 border-l border-slate-800 bg-slate-900 flex flex-col shrink-0 z-20">
            {selectedElement ? (
              <>
                {/* Header */}
                <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                  <div>
                    <div className="text-xs font-bold text-white capitalize flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{selectedElement.type.replace('_', ' ')} Properties</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      ID: {selectedElement.id}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedElementId(null)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Inspector Tabs */}
                <div className="flex border-b border-slate-800 bg-slate-950 text-xs font-semibold">
                  <button
                    onClick={() => setActiveInspectorTab('content')}
                    className={`flex-1 py-2 text-center cursor-pointer transition-colors ${
                      activeInspectorTab === 'content'
                        ? 'text-indigo-400 border-b-2 border-indigo-500'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Content
                  </button>
                  <button
                    onClick={() => setActiveInspectorTab('style')}
                    className={`flex-1 py-2 text-center cursor-pointer transition-colors ${
                      activeInspectorTab === 'style'
                        ? 'text-indigo-400 border-b-2 border-indigo-500'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Style
                  </button>
                  {selectedElement.children && (
                    <button
                      onClick={() => setActiveInspectorTab('layout')}
                      className={`flex-1 py-2 text-center cursor-pointer transition-colors ${
                        activeInspectorTab === 'layout'
                          ? 'text-indigo-400 border-b-2 border-indigo-500'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Layout
                    </button>
                  )}
                </div>

                {/* Tab: Content */}
                {activeInspectorTab === 'content' && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                    {/* Text Props */}
                    {selectedElement.props?.text !== undefined && (
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Text Content</label>
                        {selectedElement.type === 'paragraph' ? (
                          <textarea
                            rows={4}
                            value={selectedElement.props.text}
                            onChange={(e) => {
                              const updated = updateElementById(content, selectedElement.id, (el) => ({
                                ...el,
                                props: { ...el.props, text: e.target.value },
                              }));
                              updateContentWithHistory(updated);
                            }}
                            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-hidden focus:border-indigo-500"
                          />
                        ) : (
                          <input
                            type="text"
                            value={selectedElement.props.text}
                            onChange={(e) => {
                              const updated = updateElementById(content, selectedElement.id, (el) => ({
                                ...el,
                                props: { ...el.props, text: e.target.value },
                              }));
                              updateContentWithHistory(updated);
                            }}
                            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-hidden focus:border-indigo-500"
                          />
                        )}
                      </div>
                    )}

                    {/* Heading Tag */}
                    {selectedElement.type === 'heading' && (
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Heading Tag</label>
                        <select
                          value={selectedElement.props?.tag || 'h2'}
                          onChange={(e) => {
                            const updated = updateElementById(content, selectedElement.id, (el) => ({
                              ...el,
                              props: { ...el.props, tag: e.target.value },
                            }));
                            updateContentWithHistory(updated);
                          }}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                        >
                          <option value="h1">H1 - Main Title</option>
                          <option value="h2">H2 - Section Header</option>
                          <option value="h3">H3 - Subheader</option>
                          <option value="h4">H4 - Small Heading</option>
                        </select>
                      </div>
                    )}

                    {/* Link / URL */}
                    {(selectedElement.props?.link !== undefined || selectedElement.type === 'button') && (
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Button Link</label>
                        <input
                          type="text"
                          value={selectedElement.props.link || '/products'}
                          onChange={(e) => {
                            const updated = updateElementById(content, selectedElement.id, (el) => ({
                              ...el,
                              props: { ...el.props, link: e.target.value },
                            }));
                            updateContentWithHistory(updated);
                          }}
                          placeholder="e.g. /products or https://..."
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                        />
                      </div>
                    )}

                    {/* Image Source */}
                    {selectedElement.props?.src !== undefined && (
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Image URL</label>
                        <input
                          type="text"
                          value={selectedElement.props.src}
                          onChange={(e) => {
                            const updated = updateElementById(content, selectedElement.id, (el) => ({
                              ...el,
                              props: { ...el.props, src: e.target.value },
                            }));
                            updateContentWithHistory(updated);
                          }}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                        />
                        {selectedElement.props.src && (
                          <img
                            src={selectedElement.props.src}
                            alt="Preview"
                            className="mt-2 w-full h-24 object-cover rounded-lg border border-slate-800"
                          />
                        )}
                      </div>
                    )}

                    {/* Product Card Specifics */}
                    {selectedElement.type === 'product_card' && (
                      <div className="space-y-3 pt-2 border-t border-slate-800">
                        <div>
                          <label className="block text-slate-400 font-semibold mb-1">Product Title</label>
                          <input
                            type="text"
                            value={selectedElement.props.title || ''}
                            onChange={(e) => {
                              const updated = updateElementById(content, selectedElement.id, (el) => ({
                                ...el,
                                props: { ...el.props, title: e.target.value },
                              }));
                              updateContentWithHistory(updated);
                            }}
                            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 font-semibold mb-1">Price</label>
                          <input
                            type="text"
                            value={selectedElement.props.price || ''}
                            onChange={(e) => {
                              const updated = updateElementById(content, selectedElement.id, (el) => ({
                                ...el,
                                props: { ...el.props, price: e.target.value },
                              }));
                              updateContentWithHistory(updated);
                            }}
                            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 font-semibold mb-1">Discount Tag</label>
                          <input
                            type="text"
                            value={selectedElement.props.discountBadge || ''}
                            onChange={(e) => {
                              const updated = updateElementById(content, selectedElement.id, (el) => ({
                                ...el,
                                props: { ...el.props, discountBadge: e.target.value },
                              }));
                              updateContentWithHistory(updated);
                            }}
                            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Style */}
                {activeInspectorTab === 'style' && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                    {/* Text Color */}
                    {selectedElement.styles?.color !== undefined && (
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Text Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedElement.styles.color || '#000000'}
                            onChange={(e) => {
                              const updated = updateElementById(content, selectedElement.id, (el) => ({
                                ...el,
                                styles: { ...el.styles, color: e.target.value },
                              }));
                              updateContentWithHistory(updated);
                            }}
                            className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={selectedElement.styles.color || '#000000'}
                            onChange={(e) => {
                              const updated = updateElementById(content, selectedElement.id, (el) => ({
                                ...el,
                                styles: { ...el.styles, color: e.target.value },
                              }));
                              updateContentWithHistory(updated);
                            }}
                            className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {/* Background Color */}
                    {selectedElement.styles?.backgroundColor !== undefined && (
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Background Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedElement.styles.backgroundColor || '#ffffff'}
                            onChange={(e) => {
                              const updated = updateElementById(content, selectedElement.id, (el) => ({
                                ...el,
                                styles: { ...el.styles, backgroundColor: e.target.value },
                              }));
                              updateContentWithHistory(updated);
                            }}
                            className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={selectedElement.styles.backgroundColor || '#ffffff'}
                            onChange={(e) => {
                              const updated = updateElementById(content, selectedElement.id, (el) => ({
                                ...el,
                                styles: { ...el.styles, backgroundColor: e.target.value },
                              }));
                              updateContentWithHistory(updated);
                            }}
                            className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {/* Font Size */}
                    {selectedElement.styles?.fontSize !== undefined && (
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Font Size</label>
                        <input
                          type="text"
                          value={selectedElement.styles.fontSize}
                          onChange={(e) => {
                            const updated = updateElementById(content, selectedElement.id, (el) => ({
                              ...el,
                              styles: { ...el.styles, fontSize: e.target.value },
                            }));
                            updateContentWithHistory(updated);
                          }}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                          placeholder="e.g. 16px or 2rem"
                        />
                      </div>
                    )}

                    {/* Text Alignment */}
                    {selectedElement.styles?.textAlign !== undefined && (
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Text Alignment</label>
                        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                          {['left', 'center', 'right'].map((align) => (
                            <button
                              key={align}
                              onClick={() => {
                                const updated = updateElementById(content, selectedElement.id, (el) => ({
                                  ...el,
                                  styles: { ...el.styles, textAlign: align },
                                }));
                                updateContentWithHistory(updated);
                              }}
                              className={`py-1 capitalize rounded cursor-pointer ${
                                selectedElement.styles.textAlign === align
                                  ? 'bg-indigo-600 text-white font-bold'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {align}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Padding & Margin */}
                    <div className="space-y-3 pt-2 border-t border-slate-800">
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Padding</label>
                        <input
                          type="text"
                          value={selectedElement.styles?.padding || ''}
                          onChange={(e) => {
                            const updated = updateElementById(content, selectedElement.id, (el) => ({
                              ...el,
                              styles: { ...el.styles, padding: e.target.value },
                            }));
                            updateContentWithHistory(updated);
                          }}
                          placeholder="e.g. 24px or 16px 24px"
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Border Radius</label>
                        <input
                          type="text"
                          value={selectedElement.styles?.borderRadius || ''}
                          onChange={(e) => {
                            const updated = updateElementById(content, selectedElement.id, (el) => ({
                              ...el,
                              styles: { ...el.styles, borderRadius: e.target.value },
                            }));
                            updateContentWithHistory(updated);
                          }}
                          placeholder="e.g. 12px or 9999px"
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Layout (For Containers) */}
                {activeInspectorTab === 'layout' && selectedElement.children && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Direction</label>
                      <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                        {['column', 'row'].map((dir) => (
                          <button
                            key={dir}
                            onClick={() => {
                              const updated = updateElementById(content, selectedElement.id, (el) => ({
                                ...el,
                                styles: { ...el.styles, flexDirection: dir },
                              }));
                              updateContentWithHistory(updated);
                            }}
                            className={`py-1 capitalize rounded cursor-pointer ${
                              selectedElement.styles?.flexDirection === dir
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {dir}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Gap Between Items</label>
                      <input
                        type="text"
                        value={selectedElement.styles?.gap || '24px'}
                        onChange={(e) => {
                          const updated = updateElementById(content, selectedElement.id, (el) => ({
                            ...el,
                            styles: { ...el.styles, gap: e.target.value },
                          }));
                          updateContentWithHistory(updated);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                        placeholder="e.g. 24px"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* No Element Selected */
              <div className="p-8 text-center flex flex-col items-center justify-center text-slate-500 my-auto">
                <Sliders className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-xs font-semibold text-slate-400">No element selected</p>
                <p className="text-[11px] text-slate-600 mt-1 max-w-[200px]">
                  Click on any section or block in the canvas to customize its typography, colors, and layout.
                </p>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* ==================================================== */}
      {/* 3. TEMPLATES MODAL */}
      {/* ==================================================== */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Pre-built Page Templates</h3>
                  <p className="text-xs text-slate-400">Choose a proven layout to kickstart your design</p>
                </div>
              </div>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template List */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-4">
              {PREBUILT_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-slate-950 border border-slate-800 hover:border-indigo-500 rounded-xl overflow-hidden flex flex-col transition-all group"
                >
                  <div className="h-36 w-full overflow-hidden relative">
                    <img
                      src={tpl.thumbnail}
                      alt={tpl.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-white group-hover:text-indigo-400 transition-colors">
                        {tpl.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {tpl.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleApplyTemplate(tpl)}
                      className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Use This Template</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Subcomponent: Recursive Layer Tree Item
const LayerTreeItem = ({ node, selectedId, onSelect, onDelete }) => {
  const isSelected = selectedId === node.id;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="space-y-0.5">
      <div
        onClick={() => onSelect(node.id)}
        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
          isSelected
            ? 'bg-indigo-600 text-white font-semibold'
            : 'text-slate-300 hover:bg-slate-800'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <ChevronRight className={`w-3 h-3 ${hasChildren ? 'text-slate-400' : 'opacity-0'}`} />
          <span className="capitalize">{node.type.replace('_', ' ')}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(node.id);
          }}
          className={`p-0.5 hover:text-rose-400 rounded ${
            isSelected ? 'text-indigo-200' : 'text-slate-500'
          }`}
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Render Nested Children */}
      {hasChildren && (
        <div className="pl-4 border-l border-slate-800 ml-3 space-y-0.5">
          {node.children.map((child, idx) => (
            <LayerTreeItem
              key={child.id || idx}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

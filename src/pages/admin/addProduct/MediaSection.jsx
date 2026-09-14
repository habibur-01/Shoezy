import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  Sparkles,
  UploadCloud,
  Loader2,
  Star,
  ExternalLink,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { toast } from 'react-toastify';
import { uploadProductImages } from '../../../server/product/adminProduct';

const SAMPLE_PRESETS = [
  {
    label: 'Leather Sneakers',
    url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Running Performance',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Lifestyle Retro',
    url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Modern Minimalist',
    url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&auto=format&fit=crop&q=80',
  },
];

export const MediaSection = ({
  image,
  setImage,
  galleryImages = [],
  setGalleryImages,
}) => {
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Handle uploading multiple image files (from file picker or drag-and-drop)
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const validImageFiles = fileList.filter((f) => f.type.startsWith('image/'));

    if (validImageFiles.length === 0) {
      toast.error('Please select valid image files (.png, .jpg, .jpeg, .webp)');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();

      // If there is no primary cover image yet, designate 1st file as cover, rest as gallery
      if (!image || image.trim() === '') {
        formData.append('cover', validImageFiles[0]);
        validImageFiles.slice(1).forEach((f) => formData.append('gallery', f));
      } else {
        // Already have a cover, upload all new files as gallery images
        validImageFiles.forEach((f) => formData.append('gallery', f));
      }

      const res = await uploadProductImages(formData);

      if (res && res.success) {
        // If cover was empty or returned from API
        if (res.cover && (!image || image.trim() === '')) {
          setImage(res.cover);
        }

        const uploadedGallery = Array.isArray(res.gallery)
          ? res.gallery
          : Array.isArray(res.images)
          ? res.images
          : [];

        // Add new unique gallery images
        const currentGallery = Array.isArray(galleryImages) ? galleryImages : [];
        const combined = [...new Set([...currentGallery, ...uploadedGallery])];
        setGalleryImages(combined);

        toast.success(`${validImageFiles.length} image(s) uploaded successfully!`);
      } else {
        toast.error(res?.message || 'Failed to upload images');
      }
    } catch (err) {
      console.error('Error uploading product images:', err);
      toast.error(
        err?.response?.data?.message || err?.message || 'Network error while uploading images'
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileInputChange = (e) => {
    handleFileUpload(e.target.files);
  };

  // Drag & drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer?.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Add gallery image(s) by URL (supports single or comma/newline separated URLs)
  const handleAddGalleryImage = (e) => {
    e.preventDefault();
    if (!newGalleryUrl.trim()) return;

    // Split by comma or whitespace/newline in case user pastes multiple URLs at once
    const urls = newGalleryUrl
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.startsWith('http://') || u.startsWith('https://'));

    if (urls.length === 0) {
      toast.warn('Please enter a valid URL starting with http:// or https://');
      return;
    }

    const currentGallery = Array.isArray(galleryImages) ? galleryImages : [];
    const newItems = urls.filter((u) => !currentGallery.includes(u));

    if (newItems.length > 0) {
      setGalleryImages([...currentGallery, ...newItems]);
      toast.info(`Added ${newItems.length} gallery image(s)`);
    }
    setNewGalleryUrl('');
  };

  // Swap any gallery image to be the primary cover image
  const handlePromoteToCover = (galleryIdx) => {
    const targetUrl = galleryImages[galleryIdx];
    if (!targetUrl) return;

    const oldCover = image;
    setImage(targetUrl);

    // Replace promoted item in gallery with the previous cover if it exists
    const updated = [...galleryImages];
    if (oldCover && oldCover.trim() !== '') {
      updated[galleryIdx] = oldCover;
    } else {
      updated.splice(galleryIdx, 1);
    }
    setGalleryImages(updated);
    toast.success('Updated primary cover photo');
  };

  // Remove an image from gallery
  const handleRemoveGalleryImage = (index) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const totalImageCount = (image ? 1 : 0) + (galleryImages?.length || 0);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden transition-colors">
      {/* Header */}
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h2 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            Media & Product Imagery
          </h2>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
          {totalImageCount} {totalImageCount === 1 ? 'Image' : 'Images'} Active
        </span>
      </div>

      <div className="p-5 space-y-6">
        {/* ============================================================ */}
        {/* 1. Multi-File Upload Drag & Drop Area */}
        {/* ============================================================ */}
        <div>
          <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
            Upload Multiple Product Images
          </label>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            id="multi-image-file-input"
          />

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragging
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
                : 'border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 bg-zinc-50/50 dark:bg-zinc-800/30 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 py-3 text-indigo-600 dark:text-indigo-400">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-xs font-semibold">Uploading & Optimizing Images...</p>
                <p className="text-[11px] text-zinc-400">Saving files to catalog media storage</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center gap-1.5 py-1">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  <span className="text-indigo-600 dark:text-indigo-400 underline">
                    Click to select multiple photos
                  </span>{' '}
                  or drag and drop them here
                </p>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                  Supports PNG, JPG, JPEG, WEBP. Select multiple angles at once.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. Primary Cover Photo Preview & URL */}
        {/* ============================================================ */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
            Primary Cover Photo <span className="text-rose-500">*</span>
          </label>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* Visual Cover Preview */}
            {image ? (
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-xl overflow-hidden border-2 border-indigo-500 bg-zinc-100 dark:bg-zinc-800 shadow-sm shrink-0 group">
                <img
                  src={image}
                  alt="Primary Cover"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Primary Cover
                </span>
              </div>
            ) : (
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 flex flex-col items-center justify-center text-zinc-400 text-xs shrink-0 text-center p-2">
                <ImageIcon className="w-8 h-8 mb-1 text-zinc-300 dark:text-zinc-600" />
                <span>No cover image selected</span>
              </div>
            )}

            {/* Direct Cover URL input & presets */}
            <div className="flex-1 min-w-0 space-y-2.5 w-full">
              <div>
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 block mb-1">
                  Cover Image URL (or upload above):
                </span>
                <input
                  type="url"
                  required
                  id="input-product-cover-image"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Presets */}
              <div>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium flex items-center gap-1 mb-1">
                  <Sparkles className="w-3 h-3 text-purple-500" /> Quick Stock Presets:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {SAMPLE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className="text-[10px] px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. Additional Gallery Images Grid & Bulk URL Adder */}
        {/* ============================================================ */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              Additional Gallery Views ({galleryImages?.length || 0})
            </label>
            <span className="text-[11px] text-zinc-400">
              Hover thumbnail to switch cover or remove
            </span>
          </div>

          {/* URL Input */}
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Paste image URL (or multiple comma-separated URLs)..."
              value={newGalleryUrl}
              onChange={(e) => setNewGalleryUrl(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddGalleryImage}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Add URL
            </button>
          </div>

          {/* Gallery Thumbnails Grid */}
          {galleryImages && galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
              {galleryImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative group w-full h-28 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 shadow-2xs transition-all hover:shadow-md"
                >
                  <img
                    src={imgUrl}
                    alt={`Gallery view ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />

                  {/* Dark hover overlay with action buttons */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    {/* Top row: badge & delete */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-white bg-black/50 px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md shadow-xs transition-colors cursor-pointer"
                        title="Remove image"
                        aria-label="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom: Promote to cover */}
                    <button
                      type="button"
                      onClick={() => handlePromoteToCover(idx)}
                      className="w-full py-1 text-[10px] font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                      title="Promote this photo to primary cover"
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                      Make Cover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 text-center text-xs text-zinc-400 dark:text-zinc-500">
              No gallery images added yet. Upload files above or paste secondary view URLs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaSection;
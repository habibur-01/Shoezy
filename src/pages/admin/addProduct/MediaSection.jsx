import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, Check, Sparkles, UploadCloud } from 'lucide-react';








const SAMPLE_PRESETS = [
{
  label: 'Studio Headphones',
  url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
},
{
  label: 'Smart Watch',
  url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
},
{
  label: 'Leather Sneakers',
  url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80'
},
{
  label: 'Ergonomic Desk',
  url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80'
}];


export const MediaSection = ({
  image,
  setImage,
  galleryImages,
  setGalleryImages
}) => {
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const handleAddGalleryImage = (e) => {
    e.preventDefault();
    if (!newGalleryUrl.trim()) return;
    if (!galleryImages.includes(newGalleryUrl.trim())) {
      setGalleryImages([...galleryImages, newGalleryUrl.trim()]);
    }
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (index) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 border-b border-zinc-100 bg-zinc-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-purple-600" />
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            Media & Product Imagery
          </h2>
        </div>
        <span className="text-[11px] text-zinc-400 font-medium">Cover & Gallery</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Main Cover Image */}
        <div>
          <label className="block text-xs font-semibold text-zinc-800 mb-1">
            Primary Cover Image URL <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              required
              id="input-product-cover-image"
              placeholder="https://images.unsplash.com/photo-..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white" />
            
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-500" /> Preset Suggestions:
            </span>
            {SAMPLE_PRESETS.map((preset) =>
            <button
              key={preset.label}
              type="button"
              onClick={() => setImage(preset.url)}
              className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors">
              
                {preset.label}
              </button>
            )}
          </div>
        </div>

        {/* Visual Preview */}
        {image ?
        <div className="relative w-full sm:w-48 h-48 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100 shadow-2xs">
            <img
            src={image}
            alt="Primary Cover"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer" />
          
            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-zinc-900/80 text-white text-[10px] font-medium backdrop-blur-xs">
              Cover Photo
            </span>
          </div> :

        <div className="w-full h-32 rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400 text-xs">
            <UploadCloud className="w-6 h-6 mb-1 text-zinc-300" />
            Paste a valid image URL above to see live preview
          </div>
        }

        {/* Gallery Images */}
        <div className="pt-3 border-t border-zinc-100">
          <label className="block text-xs font-semibold text-zinc-800 mb-1">
            Additional Gallery Angles ({galleryImages.length})
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="url"
              placeholder="Paste secondary view URL (packaging, lifestyle, detail zoom)..."
              value={newGalleryUrl}
              onChange={(e) => setNewGalleryUrl(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white" />
            
            <button
              type="button"
              onClick={handleAddGalleryImage}
              className="px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors inline-flex items-center gap-1">
              
              <Plus className="w-3.5 h-3.5" /> Add Photo
            </button>
          </div>

          {galleryImages.length > 0 &&
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {galleryImages.map((imgUrl, idx) =>
            <div
              key={idx}
              className="relative group w-full h-24 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100">
              
                  <img
                src={imgUrl}
                alt={`Gallery ${idx + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer" />
              
                  <button
                type="button"
                onClick={() => handleRemoveGalleryImage(idx)}
                className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove Image">
                
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
            )}
            </div>
          }
        </div>
      </div>
    </div>);

};
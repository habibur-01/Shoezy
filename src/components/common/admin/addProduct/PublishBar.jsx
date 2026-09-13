import React from 'react';
import { ArrowLeft, Eye, Save, Send, CheckCircle2, AlertCircle } from 'lucide-react';













export const PublishBar = ({
  status,
  setStatus,
  onBack,
  onPreview,
  onSubmit,
  isSubmitting,
  canPublish,
  validationError
}) => {
  return (
    <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-4 py-3 -mx-4 sm:-mx-6 mb-6 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left: Navigation and status */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
            title="Return to products">
            
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-zinc-900">Add New Product</h1>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                status === 'active' ?
                'bg-emerald-50 text-emerald-700 border-emerald-200' :
                'bg-zinc-100 text-zinc-600 border-zinc-200'}`
                }>
                
                {status === 'active' ? '● Public Active' : '○ Unpublished Draft'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">
              Complete catalog specifications, 3-tier taxonomy, pricing, and media
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status selector */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg font-medium text-zinc-700 focus:outline-hidden focus:ring-1 focus:ring-zinc-900">
            
            <option value="draft">Save as Draft</option>
            <option value="active">Active (Online Store)</option>
            <option value="archived">Archived</option>
          </select>

          {/* Storefront Preview Button */}
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg shadow-2xs transition-colors">
            
            <Eye className="w-3.5 h-3.5 text-zinc-500" />
            Preview Storefront
          </button>

          {/* Save Draft */}
          <button
            type="button"
            onClick={() => onSubmit(true)}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors disabled:opacity-50">
            
            <Save className="w-3.5 h-3.5 text-zinc-600" />
            Save Draft
          </button>

          {/* Publish / Final Submit */}
          <button
            type="button"
            id="btn-publish-product"
            onClick={() => onSubmit(false)}
            disabled={isSubmitting || !canPublish}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs transition-colors disabled:opacity-50">
            
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? 'Publishing...' : 'Publish Product'}
          </button>
        </div>
      </div>

      {validationError &&
      <div className="mt-2.5 max-w-7xl mx-auto p-2 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{validationError}</span>
        </div>
      }
    </div>);

};
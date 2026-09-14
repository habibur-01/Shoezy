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
    <div className=" px-4 sm:px-6 lg:px-8 py-3.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-lg border-b border-zinc-200 dark:border-zinc-800 mb-6 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left: Navigation and status */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Return to products"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Add New Product</h1>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                  status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60'
                    : 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                }`}
              >
                {status === 'active' ? '● Public Active' : '○ Unpublished Draft'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
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
            className="px-2.5 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-medium text-zinc-700 dark:text-zinc-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="draft">Save as Draft</option>
            <option value="active">Active (Online Store)</option>
            <option value="archived">Archived</option>
          </select>

          {/* Storefront Preview Button */}
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>Preview</span>
          </button>

          {/* Save Draft */}
          <button
            type="button"
            onClick={() => onSubmit(true)}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
            <span>Save Draft</span>
          </button>

          {/* Publish / Final Submit */}
          <button
            type="button"
            id="btn-publish-product"
            onClick={() => onSubmit(false)}
            disabled={isSubmitting || !canPublish}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs hover:shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Publish Product</span>
              </>
            )}
          </button>
        </div>
      </div>

      {validationError && (
        <div className="mt-2.5 max-w-7xl mx-auto p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-lg flex items-center gap-2 text-xs text-rose-700 dark:text-rose-400 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{validationError}</span>
        </div>
      )}
    </div>);

};
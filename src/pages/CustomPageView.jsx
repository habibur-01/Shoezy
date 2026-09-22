import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/index';
import { PUBLIC_PAGES_ENDPOINT } from '../endpoint';
import { ElementRenderer } from './admin/builder/ElementRenderer';
import { RefreshCw, AlertCircle, ArrowLeft, Home } from 'lucide-react';

export const CustomPageView = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get(`${PUBLIC_PAGES_ENDPOINT}/${slug}`);
        if (res.data?.success && res.data.data) {
          setPage(res.data.data);
          // Set SEO Title
          if (res.data.data.settings?.metaTitle || res.data.data.title) {
            document.title = `${res.data.data.settings?.metaTitle || res.data.data.title} | Shoezy`;
          }
        } else {
          setError('Page not found or not currently published.');
        }
      } catch (err) {
        console.warn('Error fetching custom page:', err);
        setError(err.response?.data?.message || 'Page not found or not published.');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchPage();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading page content...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Page Not Found</h2>
        <p className="text-sm text-slate-500 max-w-md mt-1 mb-6">
          {error || 'The page you are looking for does not exist or is currently in draft mode.'}
        </p>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/products"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const { content = [], settings = {} } = page;

  return (
    <div
      style={{
        backgroundColor: settings.backgroundColor || '#ffffff',
        minHeight: '80vh',
      }}
      className="w-full"
    >
      <div
        style={{
          maxWidth: settings.maxWidth || '100%',
          margin: '0 auto',
        }}
      >
        {Array.isArray(content) && content.map((element, idx) => (
          <ElementRenderer
            key={element.id || idx}
            element={element}
            isBuilder={false}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomPageView;

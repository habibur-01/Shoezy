import React from 'react';
import { Cpu, Home, Shirt, Sparkles, Layers } from 'lucide-react';

export const renderCategoryIcon = (iconName, className = 'w-4 h-4') => {
  switch (iconName) {
    case 'Cpu':
      return <Cpu className={`${className} text-indigo-600`} />;
    case 'Home':
      return <Home className={`${className} text-emerald-600`} />;
    case 'Shirt':
      return <Shirt className={`${className} text-amber-600`} />;
    case 'Sparkles':
      return <Sparkles className={`${className} text-purple-600`} />;
    default:
      return <Layers className={`${className} text-indigo-600`} />;
  }
};
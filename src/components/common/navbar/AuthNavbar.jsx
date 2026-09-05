import React from 'react';
import { ShoppingBag, ArrowLeft, ShieldCheck, Code2 } from 'lucide-react';
import { AuthMode, UserAccount } from '../types';



 const AuthNavbar= ({
  currentMode,
  onSelectMode,
  user,
  bagCount,
  onOpenBag,
  onOpenCodeDrawer,
}) => {
  return (
    <header className="w-full bg-[#fcfbf9]/90 backdrop-blur-md border-b border-stone-200/70 sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Identity & Back Link */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <button
            onClick={() => onSelectMode('login')}
            className="flex items-center space-x-2 text-stone-900 group focus:outline-none"
            id="brand-logo-btn"
          >
            <span className="w-6 h-6 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center text-xs font-semibold tracking-tighter group-hover:scale-105 transition-transform">
              N
            </span>
            <div className="flex flex-col text-left">
              <span className="font-serif-editorial text-lg tracking-[0.18em] font-semibold text-stone-900 uppercase leading-none">
                NOIR ATELIER
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-stone-500 font-medium mt-0.5">
                Minimal E-Commerce
              </span>
            </div>
          </button>

          <div className="hidden md:flex items-center text-xs text-stone-500 space-x-1 pl-4 border-l border-stone-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="tracking-wide">256-Bit Encrypted Checkout</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Quick Code Drawer Button */}
          <button
            onClick={onOpenCodeDrawer}
            id="view-code-btn"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 transition-colors border border-stone-200/80 cursor-pointer"
            title="Inspect & Copy React / JS Source Code"
          >
            <Code2 className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden sm:inline">Get React Code</span>
          </button>

          {/* Cart Bag Trigger */}
          <button
            onClick={onOpenBag}
            id="cart-bag-btn"
            className="relative p-2 text-stone-800 hover:text-stone-950 rounded-full hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900/10 cursor-pointer"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {bagCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-stone-900 text-stone-50 text-[10px] font-semibold rounded-full flex items-center justify-center ring-2 ring-[#fcfbf9]">
                {bagCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
export default AuthNavbar;
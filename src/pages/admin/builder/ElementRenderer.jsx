import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Plus,
  Move,
  ShoppingBag,
} from 'lucide-react';

export const ElementRenderer = ({
  element,
  isBuilder = false,
  selectedId = null,
  onSelect = () => {},
  onDelete = () => {},
  onDuplicate = () => {},
  onMoveUp = () => {},
  onMoveDown = () => {},
  onAddChild = () => {},
}) => {
  if (!element) return null;

  const isSelected = isBuilder && selectedId === element.id;

  // Render children helper
  const renderChildren = () => {
    if (!element.children || element.children.length === 0) {
      if (isBuilder) {
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onAddChild(element.id);
            }}
            className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50/80 rounded-xl p-6 text-center text-xs text-indigo-600 font-medium cursor-pointer transition-all flex flex-col items-center justify-center gap-2 m-2"
          >
            <Plus className="w-5 h-5 text-indigo-500" />
            <span>Click to add elements inside this container</span>
          </div>
        );
      }
      return null;
    }

    return element.children.map((child, idx) => (
      <ElementRenderer
        key={child.id || idx}
        element={child}
        isBuilder={isBuilder}
        selectedId={selectedId}
        onSelect={onSelect}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onMoveUp={() => onMoveUp(element.id, idx)}
        onMoveDown={() => onMoveDown(element.id, idx)}
        onAddChild={onAddChild}
      />
    ));
  };

  // Content component selector
  const renderContent = () => {
    const { type, props = {}, styles = {} } = element;

    switch (type) {
      // ==========================================
      // LAYOUT
      // ==========================================
      case 'section':
        return (
          <section style={styles} className="w-full relative transition-all">
            {renderChildren()}
          </section>
        );

      case 'container':
        return (
          <div style={styles} className="w-full relative transition-all">
            {renderChildren()}
          </div>
        );

      case 'columns_2':
      case 'columns_3':
        return (
          <div style={styles} className="w-full relative transition-all">
            {renderChildren()}
          </div>
        );

      case 'divider':
        return (
          <hr
            style={{
              width: props.width || '100%',
              borderTopWidth: props.thickness || '1px',
              ...styles,
            }}
          />
        );

      case 'spacer':
        return <div style={{ height: props.height || styles.height || '40px' }} />;

      // ==========================================
      // TYPOGRAPHY
      // ==========================================
      case 'heading': {
        const Tag = props.tag || 'h2';
        return <Tag style={styles}>{props.text || 'Heading Title'}</Tag>;
      }

      case 'paragraph':
        return <p style={styles}>{props.text || 'Body text content here...'}</p>;

      case 'badge':
        return <span style={styles}>{props.text || 'Badge Tag'}</span>;

      // ==========================================
      // MEDIA
      // ==========================================
      case 'image':
        return (
          <div style={{ overflow: 'hidden', ...styles }}>
            <img
              src={props.src || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'}
              alt={props.alt || 'Shoe Image'}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        );

      case 'video':
        return (
          <div style={styles}>
            <iframe
              src={props.src || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
              title={props.title || 'Video'}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        );

      // ==========================================
      // COMMERCE
      // ==========================================
      case 'button':
        if (isBuilder) {
          return (
            <button type="button" style={styles} className="group">
              <span>{props.text || 'Button'}</span>
              <ArrowRight className="w-4 h-4 ml-2 inline transition-transform group-hover:translate-x-1" />
            </button>
          );
        }
        return (
          <Link to={props.link || '/products'} style={styles} className="group">
            <span>{props.text || 'Button'}</span>
            <ArrowRight className="w-4 h-4 ml-2 inline transition-transform group-hover:translate-x-1" />
          </Link>
        );

      case 'product_card':
        return (
          <div style={styles} className="group relative transition-all duration-300 hover:-translate-y-1">
            {props.discountBadge && (
              <span className="absolute top-4 left-4 z-10 bg-rose-500 text-white font-bold text-[11px] px-2.5 py-1 rounded-full shadow-md">
                {props.discountBadge}
              </span>
            )}
            <div className="w-full h-56 bg-slate-100 rounded-xl overflow-hidden mb-4 relative">
              <img
                src={props.image || 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop&q=80'}
                alt={props.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 text-base">{props.title || 'Shoe Name'}</h4>
              <p className="text-xs text-slate-500">{props.subtitle || 'Product description'}</p>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="font-extrabold text-indigo-600 text-lg">{props.price || '$149.00'}</span>
                {props.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">{props.originalPrice}</span>
                )}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              {isBuilder ? (
                <button className="w-full py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {props.buttonText || 'View Details'}
                </button>
              ) : (
                <Link
                  to={props.buttonLink || '/products'}
                  className="w-full py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {props.buttonText || 'View Details'}
                </Link>
              )}
            </div>
          </div>
        );

      case 'countdown':
        return <CountdownTimerComponent props={props} styles={styles} />;

      case 'discount_banner':
        return (
          <div style={styles} className="flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="space-y-3 z-10 max-w-xl">
              {props.badge && (
                <span className="inline-block bg-white/20 text-white font-bold text-xs uppercase px-3 py-1 rounded-full backdrop-blur-xs tracking-wider">
                  {props.badge}
                </span>
              )}
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
                {props.headline || 'Exclusive Discount Offer'}
              </h2>
              <p className="text-white/90 text-sm md:text-base leading-relaxed">
                {props.subhead || 'Special promotion for a limited time only.'}
              </p>
              <div className="pt-2">
                {isBuilder ? (
                  <button className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm rounded-xl shadow-lg transition-colors cursor-pointer">
                    {props.buttonText || 'Shop Offer'}
                  </button>
                ) : (
                  <Link
                    to={props.buttonLink || '/products'}
                    className="inline-block px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm rounded-xl shadow-lg transition-colors"
                  >
                    {props.buttonText || 'Shop Offer'}
                  </Link>
                )}
              </div>
            </div>
            {props.image && (
              <div className="w-full md:w-80 h-56 shrink-0 rounded-2xl overflow-hidden shadow-2xl z-10">
                <img src={props.image} alt={props.headline} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        );

      // ==========================================
      // SOCIAL PROOF
      // ==========================================
      case 'testimonial':
        return (
          <div style={styles} className="space-y-4">
            <div className="flex gap-1 text-amber-400">
              {Array.from({ length: props.rating || 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="italic text-slate-700 text-sm md:text-base leading-relaxed">
              {props.quote || '“Outstanding shoes and service!”'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {props.avatar && (
                <img
                  src={props.avatar}
                  alt={props.author}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
              )}
              <div>
                <div className="font-bold text-xs text-slate-900">{props.author || 'Customer Name'}</div>
                <div className="text-[11px] text-slate-400">{props.role || 'Verified Buyer'}</div>
              </div>
            </div>
          </div>
        );

      case 'features_badges':
        return (
          <div style={styles}>
            {(props.items || []).map((item, idx) => {
              const icons = [Truck, RotateCcw, ShieldCheck, Headphones];
              const IconComp = icons[idx % icons.length];
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{item.title}</h5>
                    <p className="text-[11px] text-slate-500">{item.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'faq_accordion':
        return <FaqAccordionComponent faqs={props.faqs || []} styles={styles} />;

      default:
        return (
          <div className="p-4 bg-slate-100 rounded text-xs text-slate-500">
            Unknown element type: {type}
          </div>
        );
    }
  };

  // If not in builder mode, just render cleanly
  if (!isBuilder) {
    return renderContent();
  }

  // Builder Mode: Wrap with selection outline, drag handle, and element toolbar
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element);
      }}
      className={`relative group transition-all duration-150 ${
        isSelected
          ? 'ring-2 ring-indigo-600 ring-offset-2 z-30'
          : 'hover:ring-1 hover:ring-indigo-300'
      }`}
    >
      {/* Element Selected Toolbar */}
      {isSelected && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute -top-7 left-0 z-40 bg-indigo-600 text-white rounded-t-md px-2 py-0.5 flex items-center gap-1.5 shadow-md text-[11px] font-mono select-none"
        >
          <Move className="w-3 h-3 text-indigo-200" />
          <span className="font-semibold capitalize">{element.type.replace('_', ' ')}</span>

          <div className="h-3 w-px bg-indigo-400 mx-1" />

          {/* Move Up */}
          <button
            onClick={() => onMoveUp(element.id)}
            title="Move Up"
            className="p-0.5 hover:bg-indigo-700 rounded cursor-pointer"
          >
            <ArrowUp className="w-3 h-3" />
          </button>

          {/* Move Down */}
          <button
            onClick={() => onMoveDown(element.id)}
            title="Move Down"
            className="p-0.5 hover:bg-indigo-700 rounded cursor-pointer"
          >
            <ArrowDown className="w-3 h-3" />
          </button>

          {/* Duplicate */}
          <button
            onClick={() => onDuplicate(element.id)}
            title="Duplicate Element"
            className="p-0.5 hover:bg-indigo-700 rounded cursor-pointer"
          >
            <Copy className="w-3 h-3" />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(element.id)}
            title="Delete Element"
            className="p-0.5 hover:bg-rose-600 rounded cursor-pointer text-rose-200 hover:text-white"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Render the actual content */}
      {renderContent()}
    </div>
  );
};

// Subcomponent: Live Countdown Timer
const CountdownTimerComponent = ({ props, styles }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: props.targetHours || 48,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={styles} className="space-y-3">
      {props.title && <div className="text-xs uppercase tracking-widest font-bold opacity-80">{props.title}</div>}
      <div className="flex items-center justify-center gap-3 font-mono font-extrabold text-2xl md:text-4xl">
        <div className="bg-white/10 backdrop-blur-xs px-3 py-2 rounded-xl border border-white/10 text-center min-w-[60px]">
          <div>{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-[9px] font-sans uppercase font-bold tracking-wider opacity-60">Hours</div>
        </div>
        <span>:</span>
        <div className="bg-white/10 backdrop-blur-xs px-3 py-2 rounded-xl border border-white/10 text-center min-w-[60px]">
          <div>{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-[9px] font-sans uppercase font-bold tracking-wider opacity-60">Mins</div>
        </div>
        <span>:</span>
        <div className="bg-white/10 backdrop-blur-xs px-3 py-2 rounded-xl border border-white/10 text-center min-w-[60px]">
          <div>{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-[9px] font-sans uppercase font-bold tracking-wider opacity-60">Secs</div>
        </div>
      </div>
    </div>
  );
};

// Subcomponent: Collapsible FAQ Accordion
const FaqAccordionComponent = ({ faqs, styles }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div style={styles} className="space-y-2 divide-y divide-slate-100">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="pt-2 first:pt-0">
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              className="w-full py-3 flex items-center justify-between text-left text-xs md:text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <span>{faq.q}</span>
              {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-indigo-500" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
            </button>
            {isOpen && (
              <div className="pb-3 text-xs md:text-sm text-slate-600 leading-relaxed animate-in fade-in duration-200">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

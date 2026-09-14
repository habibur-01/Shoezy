import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useField } from 'formik';
import { ChevronDown, Check, X, Search, AlertCircle } from 'lucide-react';

/**
 * Reusable Custom Select Component for Formik
 * 
 * Replaces default HTML <select> with a custom, accessible, customizable dropdown.
 * 
 * Supports:
 * - Direct Formik integration via `useField(name)`
 * - Complete styling customization: `bg`, `font`, `label`, `labelClassName`, `menuClassName`, etc.
 * - Options as either string array `['A', 'B']` or object array `[{ value: 'a', label: 'Option A', icon, badge, description }]`
 * - Search filter (`searchable` prop)
 * - Clearable selection (`isClearable` prop)
 * - Click-outside dismiss and blur touch handling
 */
export const FormikSelect = ({
  name,
  label,
  options = [],
  placeholder = 'Select an option...',
  required = false,
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Search options...',
  isClearable = false,
  helperText,
  // Customization Props
  bg = 'bg-white dark:bg-zinc-800',
  bgClassName,
  font = 'text-sm font-normal',
  fontClassName,
  labelClassName = 'text-xs font-semibold text-zinc-700 dark:text-zinc-300',
  buttonClassName = '',
  menuClassName = '',
  optionClassName = '',
  containerClassName = '',
  errorClassName = 'text-xs text-rose-500 dark:text-rose-400 font-medium',
  labelStyle,
  style,
  prefixIcon,
  hideError = false,
  onChange: customOnChange,
  renderOption,
  renderValue,
  ...restProps
}) => {
  const [field, meta, helpers] = useField(name);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  const hasError = Boolean(meta.touched && meta.error);
  const resolvedBg = bgClassName || bg;
  const resolvedFont = fontClassName || font;

  // Normalize options array into standard structure: [{ value, label, icon, badge, description, disabled }]
  const normalizedOptions = useMemo(() => {
    if (!Array.isArray(options)) return [];
    return options.map((opt) => {
      if (typeof opt === 'string' || typeof opt === 'number') {
        return {
          value: opt,
          label: String(opt),
        };
      }
      if (typeof opt === 'object' && opt !== null) {
        return {
          value: opt.value !== undefined ? opt.value : (opt.id || opt._id || opt.name || opt.label),
          label: opt.label !== undefined ? opt.label : (opt.name || String(opt.value)),
          icon: opt.icon,
          badge: opt.badge,
          description: opt.description,
          disabled: Boolean(opt.disabled),
          rawData: opt,
        };
      }
      return { value: '', label: '' };
    });
  }, [options]);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    if (field.value === undefined || field.value === null || field.value === '') {
      return null;
    }
    return (
      normalizedOptions.find(
        (opt) => String(opt.value) === String(field.value) || opt.label === field.value
      ) || { value: field.value, label: String(field.value) }
    );
  }, [normalizedOptions, field.value]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return normalizedOptions;
    const q = searchQuery.toLowerCase().trim();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.description && opt.description.toLowerCase().includes(q)) ||
        (opt.badge && String(opt.badge).toLowerCase().includes(q))
    );
  }, [normalizedOptions, searchQuery]);

  // Handle click outside to close dropdown & trigger Formik onBlur / touch
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (isOpen) {
          setIsOpen(false);
          helpers.setTouched(true);
          setSearchQuery('');
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, helpers]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, searchable]);

  const toggleDropdown = () => {
    if (disabled) return;
    if (isOpen) {
      setIsOpen(false);
      helpers.setTouched(true);
      setSearchQuery('');
    } else {
      setIsOpen(true);
    }
  };

  const handleSelectOption = (option) => {
    if (option.disabled) return;
    helpers.setValue(option.value);
    helpers.setTouched(true);
    setIsOpen(false);
    setSearchQuery('');
    if (customOnChange) {
      customOnChange(option.value, option);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (disabled) return;
    helpers.setValue('');
    helpers.setTouched(true);
    if (customOnChange) {
      customOnChange('', null);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Escape') {
      setIsOpen(false);
      helpers.setTouched(true);
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (!isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    } else if (e.key === 'ArrowDown' && !isOpen) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full flex flex-col space-y-1.5 relative ${containerClassName}`}
      style={style}
    >
      {/* Label */}
      {label && (
        <label
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={`flex items-center gap-1 cursor-pointer select-none ${labelClassName}`}
          style={labelStyle}
        >
          <span>{label}</span>
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}

      {/* Custom Trigger Button (Replaces Native <select>) */}
      <div className="relative w-full">
        <button
          type="button"
          id={`formik-custom-select-${name}`}
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-left transition-all duration-200 cursor-pointer select-none ${resolvedBg} ${resolvedFont} ${
            hasError
              ? 'border-rose-400 ring-2 ring-rose-400/20 dark:border-rose-500 dark:ring-rose-500/20'
              : isOpen
              ? 'border-indigo-600 ring-2 ring-indigo-600/20 dark:border-indigo-500'
              : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600'
          } ${disabled ? 'opacity-60 cursor-not-allowed bg-zinc-100 dark:bg-zinc-900' : ''} ${buttonClassName}`}
        >
          {/* Left Content (Icon + Selected Value) */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
            {prefixIcon && <span className="text-zinc-400 shrink-0">{prefixIcon}</span>}
            {selectedOption?.icon && (
              <span className="text-zinc-500 shrink-0">{selectedOption.icon}</span>
            )}

            {renderValue && selectedOption ? (
              renderValue(selectedOption)
            ) : selectedOption ? (
              <span className="text-zinc-900 dark:text-zinc-100 truncate">
                {selectedOption.label}
              </span>
            ) : (
              <span className="text-zinc-400 dark:text-zinc-500 truncate">{placeholder}</span>
            )}
          </div>

          {/* Right Content (Clear Button + Chevron Arrow) */}
          <div className="flex items-center gap-1.5 shrink-0 ml-1">
            {isClearable && selectedOption && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-md transition-colors cursor-pointer"
                title="Clear selection"
                aria-label="Clear selection"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <ChevronDown
              className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
              }`}
            />
          </div>
        </button>

        {/* Floating Custom Dropdown Popover Menu */}
        {isOpen && (
          <div
            className={`absolute top-full left-0 right-0 mt-1.5 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 ${menuClassName}`}
          >
            {/* Optional Search Input */}
            {searchable && (
              <div className="p-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <div
              role="listbox"
              className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 focus:outline-none"
            >
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
                  No matching options found
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = selectedOption?.value !== undefined && String(selectedOption.value) === String(opt.value);

                  return (
                    <div
                      key={String(opt.value)}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelectOption(opt)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer select-none ${
                        opt.disabled
                          ? 'opacity-40 cursor-not-allowed'
                          : isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      } ${optionClassName}`}
                    >
                      {/* Left: Custom or Default Render */}
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                        {renderOption ? (
                          renderOption(opt, isSelected)
                        ) : (
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate">{opt.label}</span>
                              {opt.badge && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-200/80 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 shrink-0">
                                  {opt.badge}
                                </span>
                              )}
                            </div>
                            {opt.description && (
                              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                                {opt.description}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right: Selected Checkmark */}
                      {isSelected && (
                        <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 ml-2" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && !hasError && (
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{helperText}</p>
      )}

      {/* Validation Error Message */}
      {hasError && !hideError && (
        <div
          className={`flex items-center gap-1.5 mt-1 animate-in fade-in slide-in-from-top-1 duration-150 ${errorClassName}`}
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{meta.error}</span>
        </div>
      )}
    </div>
  );
};

export default FormikSelect;

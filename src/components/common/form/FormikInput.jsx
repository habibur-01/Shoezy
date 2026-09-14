import React, { useState } from 'react';
import { useField } from 'formik';
import { AlertCircle, Eye, EyeOff, Plus, Minus } from 'lucide-react';

/**
 * Reusable Formik Input Component for text, number, email, password, textarea, etc.
 * 
 * Supports complete customization of:
 * - Background: `bg` or `bgClassName` (e.g., "bg-white", "bg-zinc-50 dark:bg-zinc-900")
 * - Font: `font` or `fontClassName` (e.g., "font-mono text-sm", "font-semibold")
 * - Label: `label`, `labelClassName`, `labelStyle`
 * - Icons: `prefixIcon`, `suffixIcon`
 * - Stepper controls for numbers: `showStepper`
 * - Password show/hide toggle for password types
 * - Formik validation error display
 */
export const FormikInput = ({
  name,
  label,
  type = 'text',
  placeholder = '',
  required = false,
  disabled = false,
  readOnly = false,
  helperText,
  // Customization Props
  bg = 'bg-white dark:bg-zinc-800',
  bgClassName,
  font = 'text-sm font-normal',
  fontClassName,
  labelClassName = 'text-xs font-semibold text-zinc-700 dark:text-zinc-300',
  inputClassName = '',
  containerClassName = '',
  wrapperClassName = '',
  errorClassName = 'text-xs text-rose-500 dark:text-rose-400 font-medium',
  labelStyle,
  inputStyle,
  style,
  // Number specific props
  min,
  max,
  step = 1,
  showStepper = false,
  // Textarea specific props
  rows = 3,
  // Icons & Addons
  prefixIcon,
  startIcon,
  suffixIcon,
  endIcon,
  disablePasswordToggle = false,
  hideError = false,
  onChange: customOnChange,
  onBlur: customOnBlur,
  ...restProps
}) => {
  const [field, meta, helpers] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = Boolean(meta.touched && meta.error);
  const resolvedBg = bgClassName || bg;
  const resolvedFont = fontClassName || font;
  const resolvedPrefixIcon = prefixIcon || startIcon;
  const resolvedSuffixIcon = suffixIcon || endIcon;
  const isTextarea = type === 'textarea';
  const isPassword = type === 'password';
  const isNumber = type === 'number';

  // Determine actual HTML input type
  const actualType = isPassword ? (showPassword ? 'text' : 'password') : type;

  // Handle number step increment / decrement
  const handleStep = (direction) => {
    if (disabled || readOnly) return;
    const currentVal = Number(field.value) || 0;
    const stepVal = Number(step) || 1;
    let nextVal = direction === 'up' ? currentVal + stepVal : currentVal - stepVal;

    if (min !== undefined && nextVal < Number(min)) nextVal = Number(min);
    if (max !== undefined && nextVal > Number(max)) nextVal = Number(max);

    helpers.setValue(nextVal);
    helpers.setTouched(true);
  };

  const handleChange = (e) => {
    if (isNumber) {
      const val = e.target.value;
      if (val === '') {
        helpers.setValue('');
      } else {
        const num = Number(val);
        helpers.setValue(isNaN(num) ? val : num);
      }
    } else {
      field.onChange(e);
    }
    if (customOnChange) {
      customOnChange(e);
    }
  };

  const handleBlur = (e) => {
    field.onBlur(e);
    if (customOnBlur) {
      customOnBlur(e);
    }
  };

  const inputId = restProps.id || `formik-input-${name}`;

  return (
    <div className={`w-full flex flex-col space-y-1.5 ${containerClassName}`} style={style}>
      {/* Label Section */}
      {label && (
        <label
          htmlFor={inputId}
          className={`flex items-center justify-between ${labelClassName}`}
          style={labelStyle}
        >
          <span className="flex items-center gap-1">
            {label}
            {required && <span className="text-rose-500 font-bold">*</span>}
          </span>
          {isNumber && min !== undefined && max !== undefined && (
            <span className="text-[10px] text-zinc-400 font-normal">
              Range: {min} - {max}
            </span>
          )}
        </label>
      )}

      {/* Input / Textarea Wrapper */}
      <div
        className={`relative flex items-center rounded-lg border transition-all duration-200 ${resolvedBg} ${
          hasError
            ? 'border-rose-400 ring-2 ring-rose-400/20 dark:border-rose-500 dark:ring-rose-500/20'
            : 'border-zinc-300 dark:border-zinc-700 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600/20 dark:focus-within:border-indigo-500'
        } ${disabled ? 'opacity-60 cursor-not-allowed bg-zinc-100 dark:bg-zinc-900' : ''} ${wrapperClassName}`}
      >
        {/* Prefix Icon */}
        {resolvedPrefixIcon && (
          <div className="pl-3 pr-1 text-zinc-400 dark:text-zinc-500 pointer-events-none flex items-center justify-center shrink-0">
            {resolvedPrefixIcon}
          </div>
        )}

        {/* Form Control: Textarea vs Standard Input */}
        {isTextarea ? (
          <textarea
            {...field}
            {...restProps}
            id={inputId}
            rows={rows}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            onChange={handleChange}
            onBlur={handleBlur}
            style={inputStyle}
            className={`w-full px-3 py-2 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none resize-y ${resolvedFont} ${inputClassName}`}
          />
        ) : (
          <input
            {...field}
            {...restProps}
            id={inputId}
            type={actualType}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            onChange={handleChange}
            onBlur={handleBlur}
            style={inputStyle}
            className={`w-full px-3 py-2 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none ${resolvedFont} ${
              resolvedPrefixIcon ? 'pl-1.5' : ''
            } ${resolvedSuffixIcon || isPassword || (isNumber && showStepper) ? 'pr-2' : ''} ${inputClassName}`}
          />
        )}

        {/* Password Eye Toggle */}
        {isPassword && !disablePasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            className="p-1.5 mr-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer rounded-md"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}

        {/* Number Stepper Controls */}
        {isNumber && showStepper && !disabled && !readOnly && (
          <div className="flex items-center gap-0.5 pr-2 shrink-0">
            <button
              type="button"
              onClick={() => handleStep('down')}
              tabIndex={-1}
              className="p-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors cursor-pointer"
              aria-label="Decrease value"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleStep('up')}
              tabIndex={-1}
              className="p-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors cursor-pointer"
              aria-label="Increase value"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Suffix Icon */}
        {resolvedSuffixIcon && !isPassword && !(isNumber && showStepper) && (
          <div className="pr-3 pl-1 text-zinc-400 dark:text-zinc-500 flex items-center justify-center shrink-0">
            {resolvedSuffixIcon}
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && !hasError && (
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{helperText}</p>
      )}

      {/* Validation Error Message */}
      {hasError && !hideError && (
        <div className={`flex items-center gap-1.5 mt-1 animate-in fade-in slide-in-from-top-1 duration-150 ${errorClassName}`}>
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{meta.error}</span>
        </div>
      )}
    </div>
  );
};

export default FormikInput;

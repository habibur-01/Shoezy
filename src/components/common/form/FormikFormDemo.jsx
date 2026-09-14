import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormikInput } from './FormikInput';
import { FormikSelect } from './FormikSelect';
import { DollarSign, Tag, Layers, Hash, Sparkles } from 'lucide-react';

const demoSchema = Yup.object().shape({
  productTitle: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .required('Product title is required'),
  sku: Yup.string()
    .required('SKU identifier is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be greater than zero')
    .required('Price is required'),
  stock: Yup.number()
    .typeError('Stock must be an integer')
    .min(0, 'Stock cannot be negative')
    .required('Stock quantity is required'),
  category: Yup.string()
    .required('Please select a category'),
  condition: Yup.string()
    .required('Condition is required'),
  notes: Yup.string(),
});

export const FormikFormDemo = () => {
  const categoryOptions = [
    {
      value: 'men-footwear',
      label: 'Men Footwear',
      badge: 'Popular',
      description: 'Running, casual, and formal men shoes',
    },
    {
      value: 'women-footwear',
      label: 'Women Footwear',
      badge: 'Trending',
      description: 'Heels, flats, boots, and sneakers',
    },
    {
      value: 'kids-apparel',
      label: 'Kids Collection',
      description: 'Children sizes and apparel',
    },
    {
      value: 'accessories',
      label: 'Bags & Accessories',
      description: 'Wallets, socks, laces, and backpacks',
    },
  ];

  const conditionOptions = ['Brand New in Box', 'Mint Condition', 'Refurbished / Open Box'];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl">
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Formik Custom Components Showcase
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Custom FormikInput (text & number) and Custom FormikSelect (no native &lt;select&gt;)
          </p>
        </div>
      </div>

      <Formik
        initialValues={{
          productTitle: '',
          sku: 'SKU-849201',
          price: 120,
          stock: 15,
          category: '',
          condition: '',
          notes: '',
        }}
        validationSchema={demoSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log('Submitted values:', values);
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, resetForm }) => (
          <Form className="space-y-4">
            {/* 1. Text Input with Custom Background & Font */}
            <FormikInput
              name="productTitle"
              label="Product Title"
              placeholder="e.g., Air Max Alpha Trainer 5"
              required
              bg="bg-zinc-50 dark:bg-zinc-800/80"
              font="text-sm font-medium"
              labelClassName="text-xs font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-300"
              prefixIcon={<Tag className="w-4 h-4" />}
              helperText="Enter a clean descriptive product name for the catalog."
            />

            {/* 2. Text Input for SKU with Monospace Font */}
            <FormikInput
              name="sku"
              label="Stock Keeping Unit (SKU)"
              placeholder="e.g., SKU-123456"
              required
              bg="bg-amber-50/50 dark:bg-amber-950/20"
              font="font-mono text-sm font-bold text-amber-900 dark:text-amber-200"
              labelClassName="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              prefixIcon={<Hash className="w-4 h-4 text-amber-600" />}
            />

            {/* 3. Number Input with Stepper Controls & Currency Prefix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormikInput
                name="price"
                type="number"
                label="Selling Price ($)"
                placeholder="0.00"
                min={1}
                max={10000}
                step={5}
                required
                bg="bg-white dark:bg-zinc-800"
                font="text-sm font-bold text-zinc-900 dark:text-zinc-100"
                prefixIcon={<DollarSign className="w-4 h-4 text-emerald-600" />}
                showStepper
              />

              <FormikInput
                name="stock"
                type="number"
                label="Available Units"
                placeholder="0"
                min={0}
                max={500}
                step={1}
                required
                bg="bg-white dark:bg-zinc-800"
                font="text-sm font-semibold"
                showStepper
              />
            </div>

            {/* 4. Custom Select with Search & Badges (No Native <select>) */}
            <FormikSelect
              name="category"
              label="Primary Category Taxonomy"
              placeholder="Choose a category from catalog..."
              options={categoryOptions}
              searchable
              isClearable
              required
              bg="bg-zinc-50 dark:bg-zinc-800"
              font="text-sm font-medium"
              labelClassName="text-xs font-bold text-zinc-800 dark:text-zinc-200"
              prefixIcon={<Layers className="w-4 h-4 text-indigo-500" />}
              helperText="Fully custom dropdown popover with instant search filtering."
            />

            {/* 5. Custom Select with Simple String Array Options */}
            <FormikSelect
              name="condition"
              label="Packaging Condition"
              placeholder="Select condition..."
              options={conditionOptions}
              isClearable
              required
              bg="bg-white dark:bg-zinc-800"
              font="text-sm"
            />

            {/* 6. Textarea Input */}
            <FormikInput
              name="notes"
              type="textarea"
              label="Internal Admin Notes"
              placeholder="Add optional notes for this product..."
              rows={2}
              bg="bg-zinc-50 dark:bg-zinc-800/60"
              font="text-xs font-normal"
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => resetForm()}
                className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Validating...' : 'Submit Formik Demo'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormikFormDemo;

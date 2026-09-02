import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useProduct } from '../hook/useProduct';

// ── Helpers ──
const formatPrice = (priceObj) => {
  if (!priceObj?.amount && priceObj?.amount !== 0) return null;
  const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };
  const symbol = symbols[priceObj.currency] || priceObj.currency || '₹';
  return `${symbol}${Number(priceObj.amount).toLocaleString()}`;
};

const getImageUrl = (img) => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  return img.preview || img.url || '';
};

const createEmptyVariantForm = () => ({
  images: [], // array of { file, preview }
  attributes: [{ key: '', value: '' }],
  price: '',
  stock: '',
});

export default function SellerProductDetails() {
  const { productId } = useParams();
  const { handleGetProductById, handleAddProductVariant } = useProduct();

  // ── Main Page State ──
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // ── Drawer & Form State ──
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [variantForm, setVariantForm] = useState(createEmptyVariantForm());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // ── Delete Dialog State ──
  const [deletingVariantId, setDeletingVariantId] = useState(null);

  // ── Fetch Product Data ──
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await handleGetProductById(productId);
      setProduct(data);
    } catch (err) {
      console.error('Failed to fetch product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // ── Drawer Handlers ──
  const openAddVariantDrawer = () => {
    setVariantForm(createEmptyVariantForm());
    setFormError('');
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setVariantForm(createEmptyVariantForm());
    setFormError('');
  };

  // ── Image Upload Handlers ──
  const handleAddFiles = (files) => {
    const selectedFiles = Array.from(files);
    const availableSlots = 7 - variantForm.images.length;
    if (availableSlots <= 0) return;

    const newImages = selectedFiles.slice(0, availableSlots).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setVariantForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const handleRemoveImage = (indexToRemove) => {
    setVariantForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // ── Attribute Handlers ──
  const handleAttributeChange = (index, field, value) => {
    setVariantForm((prev) => {
      const updated = [...prev.attributes];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, attributes: updated };
    });
  };

  const handleAddAttributeRow = () => {
    setVariantForm((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { key: '', value: '' }],
    }));
  };

  const handleRemoveAttributeRow = (indexToRemove) => {
    setVariantForm((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // ── Save / Submit Variant ──
  const handleSaveVariant = async () => {
    // 1. Validate Attributes
    const validAttributes = variantForm.attributes.filter(
      (attr) => attr.key.trim() && attr.value.trim()
    );

    if (validAttributes.length === 0) {
      setFormError('Please add at least one attribute (e.g., Color: Red).');
      return;
    }

    // 2. Format attributes as an object { Color: "Red", Size: "M" }
    const attributeMap = validAttributes.reduce((acc, curr) => {
      acc[curr.key.trim()] = curr.value.trim();
      return acc;
    }, {});

    // 3. Prepare payload matching product.api.js:
    //    - images: array of { file }
    //    - stock: number
    //    - price: number/string
    //    - attributes: object
    const variantPayload = {
      images: variantForm.images.filter((img) => img.file),
      stock: Math.max(0, Number(variantForm.stock) || 0),
      price: variantForm.price || (product?.price?.amount ?? 0),
      attributes: attributeMap,
    };

    try {
      setIsSubmitting(true);
      setFormError('');

      await handleAddProductVariant(productId, variantPayload);

      // Refresh product data to display the newly added variant
      await fetchProduct();
      closeDrawer();
    } catch (err) {
      console.error('Error saving variant:', err);
      setFormError(err.response?.data?.message || err.message || 'Failed to save variant.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Calculated Values ──
  const variants = product?.variants || [];
  const variantCount = variants.length;
  const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);

  const productImages = product?.images?.length
    ? product.images.map(getImageUrl).filter(Boolean)
    : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'];

  // ── Loading & Not Found States ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f6]">
        <div className="w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fbf9f6] gap-3">
        <p className="text-xl text-[#1b1c1a]" style={{ fontFamily: "'Cormorant Garamond',serif" }}>
          Product not found
        </p>
        <Link to="/seller/dashboard" className="text-xs uppercase tracking-widest text-[#C9A96E]">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen w-full flex flex-col bg-[#fbf9f6] text-[#1b1c1a]" style={{ fontFamily: "'Inter',sans-serif" }}>

        {/* ── Top Navbar ── */}
        <header className="sticky top-0 shrink-0 h-14 px-6 lg:px-10 flex items-center justify-between border-b border-[#e8e2d8] bg-[#fbf9f6]/95 backdrop-blur-sm z-20">
          <Link to="/seller/dashboard" className="flex flex-col">
            <span className="text-2xl font-light tracking-tight hover:text-[#C9A96E] transition-colors" style={{ fontFamily: "'Cormorant Garamond',serif" }}>
              Snitich.
            </span>
            <span className="text-[8px] uppercase tracking-[0.3em] text-[#8c8275] -mt-0.5">Seller Studio</span>
          </Link>
          <Link
            to="/seller/dashboard"
            className="text-xs uppercase tracking-widest text-[#706456] hover:text-[#1b1c1a] transition-colors flex items-center gap-1.5 group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Dashboard
          </Link>
        </header>

        {/* ── Main Content Container ── */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 flex flex-col gap-8">

          {/* 1. Product Overview Card */}
          <div className="bg-white border border-[#e8e2d8] rounded-xl p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center">

              {/* Gallery */}
              <div className="md:col-span-6 flex flex-row gap-3.5 items-stretch">
                {productImages.length > 1 && (
                  <div className="flex flex-col gap-2 overflow-y-auto max-h-[440px] sm:max-h-[500px] [scrollbar-width:none] shrink-0 py-1">
                    {productImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveImgIndex(i)}
                        onMouseEnter={() => setActiveImgIndex(i)}
                        className={`w-16 h-20 shrink-0 rounded-md overflow-hidden border transition-all ${
                          i === activeImgIndex ? 'border-[#1b1c1a] ring-2 ring-[#C9A96E]/70' : 'border-[#e8e2d8] opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
                <div className="relative flex-1 aspect-[4/5] max-h-[440px] sm:max-h-[500px] rounded-lg border border-[#e8e2d8] overflow-hidden bg-white shadow-xs">
                  <img
                    src={productImages[activeImgIndex] || productImages[0]}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute bottom-2.5 right-2.5 text-[10px] uppercase tracking-widest bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded">
                    {activeImgIndex + 1}/{productImages.length}
                  </span>
                </div>
              </div>

              {/* Info Details */}
              <div className="md:col-span-6 flex flex-col gap-3.5">
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C9A96E]">Product Overview</span>

                <h1 className="text-2xl sm:text-3xl font-light leading-tight tracking-tight" style={{ fontFamily: "'Cormorant Garamond',serif" }}>
                  {product.title}
                </h1>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-[#1b1c1a]">{formatPrice(product.price) ?? '—'}</span>
                  <span className="text-[11px] text-[#8c8275]">base price</span>
                </div>

                {product.description && (
                  <div className="border-t border-b border-[#e8e2d8] py-2.5">
                    <p className="text-xs sm:text-sm text-[#50463c] leading-relaxed">{product.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 pt-1 text-[11px] text-[#8c8275]">
                  <div className="bg-[#fbf9f6] border border-[#e8e2d8] rounded p-2.5 text-center">
                    <span className="block uppercase tracking-wider text-[9px]">SKU</span>
                    <span className="font-mono text-[#1b1c1a] font-semibold">RW-{product._id?.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="bg-[#fbf9f6] border border-[#e8e2d8] rounded p-2.5 text-center">
                    <span className="block uppercase tracking-wider text-[9px]">Variants</span>
                    <span className="text-[#1b1c1a] font-semibold">{variantCount}</span>
                  </div>
                  <div className="bg-[#fbf9f6] border border-[#e8e2d8] rounded p-2.5 text-center">
                    <span className="block uppercase tracking-wider text-[9px]">Total Stock</span>
                    <span className="text-[#1b1c1a] font-semibold">{totalStock} units</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Variants Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-light tracking-tight text-[#1b1c1a]" style={{ fontFamily: "'Cormorant Garamond',serif" }}>
                  Product Variants ({variantCount})
                </h2>
                <p className="text-[11px] text-[#8c8275]">Manage attributes, prices, and stock for each variant</p>
              </div>

              <button
                type="button"
                onClick={openAddVariantDrawer}
                id="add-variant-btn"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#C9A96E] text-white text-[11px] uppercase tracking-widest font-semibold rounded hover:bg-[#b8955a] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Variant
              </button>
            </div>

            {/* Variant Cards Grid */}
            {variantCount === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-[#e8e2d8] rounded-xl bg-white text-center text-[#8c8275] gap-2">
                <svg className="w-10 h-10 text-[#d4ccbf]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <p className="text-sm font-medium text-[#706456]">No variants added yet</p>
                <p className="text-xs max-w-sm">Create size, color, or material variants with custom prices and inventory.</p>
                <button
                  type="button"
                  onClick={openAddVariantDrawer}
                  className="mt-2 px-4 py-2 bg-[#1b1c1a] text-white text-xs uppercase tracking-wider rounded font-medium hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-all cursor-pointer"
                >
                  + Create First Variant
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {variants.map((v, idx) => {
                  const stock = v.stock ?? 0;
                  const stockColor = stock === 0 ? 'text-[#9e3127] bg-[#fdf1f0]' : stock <= 5 ? 'text-[#7a5a00] bg-[#fdf8e1]' : 'text-[#2e7d32] bg-[#eef7ee]';
                  const vId = v._id || v.id || idx;

                  return (
                    <div key={vId} className="border border-[#e8e2d8] rounded-xl bg-white shadow-sm hover:shadow-md hover:border-[#C9A96E]/40 transition-all flex flex-col overflow-hidden">
                      {/* Image Preview */}
                      <div className="h-32 bg-[#f5f3f0] flex items-center justify-center overflow-hidden">
                        {v.images?.length ? (
                          <div className="flex h-full w-full">
                            {v.images.slice(0, 3).map((img, j) => (
                              <img key={j} src={getImageUrl(img)} alt="" className="flex-1 h-full object-cover" />
                            ))}
                          </div>
                        ) : (
                          <svg className="w-8 h-8 text-[#d4ccbf]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 16.5v.75A2.25 2.25 0 005.25 19.5h13.5A2.25 2.25 0 0021 17.25V6.75A2.25 2.25 0 0018.75 4.5H5.25A2.25 2.25 0 003 6.75V16.5z" />
                          </svg>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-4 flex flex-col gap-3 flex-1">
                        {/* Attributes */}
                        <div className="flex flex-wrap gap-1.5">
                          {v.attributes && typeof v.attributes === 'object' && !(v.attributes instanceof Map) && !Array.isArray(v.attributes) ? (
                            Object.entries(v.attributes).map(([key, val], j) => (
                              <span key={j} className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#f5f0e8] border border-[#e8e2d8] rounded-md text-[#706456]">
                                <span className="text-[#C9A96E] font-semibold">{key}</span>: {val}
                              </span>
                            ))
                          ) : null}
                        </div>

                        {/* Price */}
                        <div>
                          {v.price?.amount ? (
                            <div className="flex items-baseline gap-1">
                              <span className="text-base font-semibold text-[#1b1c1a]">{formatPrice(v.price)}</span>
                              <span className="text-[9px] text-[#C9A96E] uppercase tracking-wider">Custom Price</span>
                            </div>
                          ) : (
                            <div className="flex items-baseline gap-1">
                              <span className="text-sm font-medium text-[#706456]">{formatPrice(product.price) ?? '—'}</span>
                              <span className="text-[9px] text-[#8c8275] uppercase tracking-wider">Base Price</span>
                            </div>
                          )}
                        </div>

                        {/* Stock Tag */}
                        <div className="mt-auto pt-2.5 border-t border-[#e8e2d8] flex items-center justify-between">
                          <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${stockColor}`}>
                            {stock === 0 ? 'Out of Stock' : stock <= 5 ? `Low (${stock})` : `In Stock (${stock})`}
                          </span>
                          <span className="text-xs font-semibold text-[#1b1c1a]">{stock} units</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </main>
      </div>

      {/* ════════════ ADD VARIANT DRAWER ════════════ */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-[#1b1c1a]/30 backdrop-blur-xs" onClick={closeDrawer} />
          <div className="absolute right-0 top-0 h-full w-[460px] max-w-full bg-[#fbf9f6] border-l border-[#e8e2d8] shadow-2xl flex flex-col z-50">

            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e2d8] bg-white shrink-0">
              <div>
                <h3 className="text-xl font-light text-[#1b1c1a]" style={{ fontFamily: "'Cormorant Garamond',serif" }}>
                  Add Product Variant
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-[#8c8275] mt-0.5">Attach custom images, price & stock</p>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                id="close-drawer-btn"
                className="w-8 h-8 flex items-center justify-center rounded text-[#8c8275] hover:bg-[#f5f0e8] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Form Fields */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* 1. Images Upload */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8c8275] block mb-1.5">
                  Images ({variantForm.images.length}/7)
                </label>
                {variantForm.images.length < 7 && (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleAddFiles(e.dataTransfer.files); }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-5 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                      isDragOver ? 'border-[#C9A96E] bg-[#fdf5e6]' : 'border-[#e8e2d8] hover:border-[#C9A96E]/50 hover:bg-[#fdf9f3] bg-white'
                    }`}
                  >
                    <svg className="w-6 h-6 text-[#C9A96E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <p className="text-xs text-[#706456]">Drop images or click to browse · {7 - variantForm.images.length} remaining</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleAddFiles(e.target.files)}
                    />
                  </div>
                )}

                {/* Previews */}
                {variantForm.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {variantForm.images.map((img, i) => (
                      <div key={i} className="relative w-14 h-14 rounded border border-[#e8e2d8] overflow-hidden group/img">
                        <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Dynamic Attributes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8c8275]">
                    Attributes <span className="text-[#C9A96E]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddAttributeRow}
                    className="text-[10px] text-[#C9A96E] font-semibold uppercase tracking-wider cursor-pointer hover:text-[#b8955a]"
                  >
                    + Add Attribute
                  </button>
                </div>

                <div className="space-y-2">
                  {variantForm.attributes.map((attr, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Attribute (e.g., Color, Size)"
                        value={attr.key}
                        onChange={(e) => handleAttributeChange(i, 'key', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-[#e8e2d8] rounded text-sm placeholder-[#c4bfb5] focus:outline-none focus:border-[#C9A96E] transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g., Midnight Blue, XL)"
                        value={attr.value}
                        onChange={(e) => handleAttributeChange(i, 'value', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-[#e8e2d8] rounded text-sm placeholder-[#c4bfb5] focus:outline-none focus:border-[#C9A96E] transition-colors"
                      />
                      {variantForm.attributes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAttributeRow(i)}
                          className="w-7 h-7 flex items-center justify-center text-[#8c8275] hover:text-red-500 transition-colors cursor-pointer shrink-0"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Custom Price */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8c8275] block mb-1.5">
                  Price <span className="normal-case tracking-normal font-normal">(optional, defaults to base price)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder={`e.g. ${product.price?.amount || 1499}`}
                    value={variantForm.price}
                    onChange={(e) => setVariantForm((prev) => ({ ...prev, price: e.target.value }))}
                    className="flex-1 px-3 py-2 bg-white border border-[#e8e2d8] rounded text-sm focus:outline-none focus:border-[#C9A96E] transition-colors"
                  />
                  <span className="px-3 py-2 bg-[#f5f0e8] border border-[#e8e2d8] rounded text-xs font-semibold text-[#706456] flex items-center">
                    {product.price?.currency || 'INR'}
                  </span>
                </div>
              </div>

              {/* 4. Stock Count */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8c8275] block mb-1.5">
                  Initial Stock Quantity
                </label>
                <div className="flex items-center w-32 border border-[#e8e2d8] rounded overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setVariantForm((prev) => ({ ...prev, stock: Math.max(0, (Number(prev.stock) || 0) - 1) }))}
                    className="w-9 h-9 flex items-center justify-center border-r border-[#e8e2d8] hover:bg-[#f5f0e8] transition-colors cursor-pointer text-[#706456]"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={variantForm.stock}
                    onChange={(e) => setVariantForm((prev) => ({ ...prev, stock: e.target.value === '' ? '' : Math.max(0, Number(e.target.value)) }))}
                    className="flex-1 h-9 text-center text-sm font-semibold bg-transparent border-0 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setVariantForm((prev) => ({ ...prev, stock: (Number(prev.stock) || 0) + 1 }))}
                    className="w-9 h-9 flex items-center justify-center border-l border-[#e8e2d8] hover:bg-[#f5f0e8] transition-colors cursor-pointer text-[#706456]"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                  {formError}
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="flex gap-3 px-6 py-4 border-t border-[#e8e2d8] bg-white shrink-0">
              <button
                type="button"
                id="save-variant-btn"
                disabled={isSubmitting}
                onClick={handleSaveVariant}
                className="flex-1 py-2.5 bg-[#C9A96E] text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-[#b8955a] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Saving Variant...' : 'Save Variant'}
              </button>
              <button
                type="button"
                id="cancel-drawer-btn"
                onClick={closeDrawer}
                className="px-5 py-2.5 border border-[#e8e2d8] text-[#1b1c1a] text-xs uppercase tracking-widest font-semibold rounded hover:bg-[#f5f0e8] transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

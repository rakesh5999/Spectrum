import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useProduct } from '../hook/useProduct';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];
const fmt = (p) => {
  if (!p?.amount) return null;
  const s = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };
  return `${s[p.currency] ?? p.currency}${Number(p.amount).toLocaleString()}`;
};
const imgUrl = (img) => {
  if (!img) return null;
  if (typeof img === 'string') return img;
  return img.url ?? img.preview ?? null;
};
const newVariant = () => ({
  id: crypto.randomUUID(),
  images: [],
  attributes: [{ key: '', value: '' }],
  price: { amount: '', currency: 'INR' },
  stock: 0,
});

export default function SellerProductDetails() {
  const { productId } = useParams();
  const { handleGetProductById } = useProduct();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  const [variants, setVariants] = useState([]);
  const [drawer, setDrawer] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(newVariant());
  const [err, setErr] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [delId, setDelId] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await handleGetProductById(productId);
        setProduct(data);
        if (data?.variants?.length)
          setVariants(data.variants.map(v => ({ ...v, id: v._id ?? crypto.randomUUID() })));
      } finally { setLoading(false); }
    })();
  }, [productId]);

  const openAdd = () => { setEditId(null); setForm(newVariant()); setErr(''); setDrawer(true); };
  const openEdit = (v) => { setEditId(v.id); setForm({ ...v, attributes: v.attributes?.length ? v.attributes : [{ key: '', value: '' }] }); setErr(''); setDrawer(true); };
  const closeDrawer = () => { setDrawer(false); setErr(''); };

  const addFiles = (files) => {
    const rem = 7 - form.images.length;
    if (rem <= 0) return;
    const imgs = Array.from(files).slice(0, rem).map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setForm(f => ({ ...f, images: [...f.images, ...imgs] }));
  };
  const rmImg = (i) => setForm(f => {
    const imgs = [...f.images];
    const [r] = imgs.splice(i, 1);
    if (r?.preview?.startsWith('blob:')) URL.revokeObjectURL(r.preview);
    return { ...f, images: imgs };
  });

  const setAttr = (i, k, v) => setForm(f => {
    const a = [...f.attributes]; a[i] = { ...a[i], [k]: v }; return { ...f, attributes: a };
  });

  const save = () => {
    const valid = form.attributes.filter(a => a.key.trim() && a.value.trim());
    if (!valid.length) { setErr('Add at least one attribute (e.g. Color: Red)'); return; }
    const v = { ...form, attributes: valid, stock: Number(form.stock) || 0, price: form.price.amount ? { amount: Number(form.price.amount), currency: form.price.currency } : null };
    setVariants(prev => editId ? prev.map(x => x.id === editId ? v : x) : [...prev, v]);
    closeDrawer();
  };

  const changeStock = (id, d) => setVariants(p => p.map(v => v.id === id ? { ...v, stock: Math.max(0, v.stock + d) } : v));

  const PLACEHOLDER = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
  const imgs = product?.images?.length ? product.images.map(imgUrl).filter(Boolean) : [PLACEHOLDER];

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#fbf9f6]">
      <div className="w-7 h-7 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#fbf9f6] gap-3">
      <p className="text-xl text-[#1b1c1a]" style={{ fontFamily: "'Cormorant Garamond',serif" }}>Product not found</p>
      <Link to="/seller/dashboard" className="text-xs uppercase tracking-widest text-[#C9A96E]">← Dashboard</Link>
    </div>
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <div className="h-screen w-full flex flex-col bg-[#fbf9f6] text-[#1b1c1a] overflow-hidden" style={{ fontFamily: "'Inter',sans-serif" }}>

        {/* ── Navbar ── */}
        <header className="shrink-0 h-14 px-8 flex items-center justify-between border-b border-[#e8e2d8] bg-[#fbf9f6]/95 backdrop-blur-sm z-20">
          <Link to="/seller/dashboard" className="flex flex-col">
            <span className="text-2xl font-light tracking-tight hover:text-[#C9A96E] transition-colors" style={{ fontFamily: "'Cormorant Garamond',serif" }}>Snitich.</span>
            <span className="text-[8px] uppercase tracking-[0.3em] text-[#8c8275] -mt-0.5">Seller Studio</span>
          </Link>
          <Link to="/seller/dashboard" className="text-xs uppercase tracking-widest text-[#706456] hover:text-[#1b1c1a] transition-colors flex items-center gap-1.5 group">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Dashboard
          </Link>
        </header>

        {/* ── Main flex column ── */}
        <main className="flex-1 min-h-0 flex flex-col">

          {/* Product info row */}
          <div className="flex-1 min-h-0 max-w-6xl w-full mx-auto px-6 grid grid-cols-12 gap-10 items-center">

            {/* Image gallery */}
            <div className="col-span-6 flex flex-row gap-3 items-stretch">
              {imgs.length > 1 && (
                <div className="flex flex-col gap-2 overflow-y-auto [scrollbar-width:none] shrink-0 py-1 self-stretch">
                  {imgs.map((img, i) => (
                    <button key={i} onMouseEnter={() => setActiveImg(i)} onClick={() => setActiveImg(i)}
                      className={`w-14 h-16 shrink-0 rounded-sm overflow-hidden border transition-all ${i === activeImg ? 'border-[#1b1c1a] ring-2 ring-[#C9A96E]/70' : 'border-[#e8e2d8] opacity-60 hover:opacity-100'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              <div className="relative flex-1 aspect-[3/4] max-h-[calc(100vh-200px)] rounded-sm border border-[#e8e2d8] overflow-hidden bg-white shadow-xs">
                <img src={imgs[activeImg]} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                <span className="absolute bottom-2 right-2 text-[9px] uppercase tracking-widest bg-black/50 text-white px-2 py-0.5 rounded-sm">
                  {activeImg + 1}/{imgs.length}
                </span>
              </div>
            </div>

            {/* Product info — price left */}
            <div className="col-span-6 flex flex-col gap-3.5 px-1">
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C9A96E]">Seller Product</span>

              <h1 className="text-3xl lg:text-4xl font-light leading-tight tracking-tight" style={{ fontFamily: "'Cormorant Garamond',serif" }}>
                {product.title}
              </h1>

              {/* Price — prominent, left aligned */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-[#1b1c1a]">{fmt(product.price) ?? '—'}</span>
                <span className="text-[11px] text-[#8c8275]">base price</span>
              </div>

              {product.description && (
                <div className="border-t border-b border-[#e8e2d8] py-2.5">
                  <p className="text-sm text-[#50463c] leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="space-y-1.5 text-[11px] text-[#8c8275]">
                <div className="flex justify-between"><span className="uppercase tracking-wider">SKU</span><span className="font-mono text-[#1b1c1a]">RW-{product._id?.slice(-6).toUpperCase()}</span></div>
                <div className="flex justify-between"><span className="uppercase tracking-wider">Variants</span><span className="text-[#1b1c1a] font-semibold">{variants.length}</span></div>
                <div className="flex justify-between"><span className="uppercase tracking-wider">Total Stock</span><span className="text-[#1b1c1a] font-semibold">{variants.reduce((a, v) => a + (v.stock || 0), 0)} units</span></div>
              </div>
            </div>
          </div>

          {/* ── Variants strip (bottom) ── */}
          <div className="shrink-0 border-t border-[#e8e2d8] bg-white/60">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8c8275]">
                Product Variants <span className="text-[#1b1c1a]">({variants.length})</span>
              </p>
              <button onClick={openAdd} id="add-variant-btn"
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#C9A96E] text-white text-[10px] uppercase tracking-widest font-semibold rounded hover:bg-[#b8955a] active:scale-[0.98] transition-all cursor-pointer shadow-sm">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Variant
              </button>
            </div>

            {/* Scrollable cards row */}
            <div className="max-w-6xl mx-auto px-6 pb-4 flex gap-3 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {variants.length === 0 ? (
                <div className="w-full flex items-center gap-4 py-5 px-5 border border-dashed border-[#e8e2d8] rounded-lg text-[#8c8275]">
                  <svg className="w-7 h-7 shrink-0 text-[#d4ccbf]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                  <div>
                    <p className="text-xs font-medium text-[#706456]">No variants yet</p>
                    <p className="text-[10px] mt-0.5">Click <strong>Add Variant</strong> to create size, color, or storage variants with individual stock tracking.</p>
                  </div>
                </div>
              ) : variants.map((v) => {
                const stockColor = v.stock === 0 ? 'text-[#9e3127] bg-[#fdf1f0]' : v.stock <= 5 ? 'text-[#7a5a00] bg-[#fdf8e1]' : 'text-[#2e7d32] bg-[#eef7ee]';
                return (
                  <div key={v.id} className="shrink-0 w-52 border border-[#e8e2d8] rounded-lg bg-white shadow-sm hover:shadow-md hover:border-[#C9A96E]/40 transition-all flex flex-col overflow-hidden">
                    {/* Mini image row */}
                    <div className="h-16 bg-[#f5f3f0] flex items-center justify-center overflow-hidden">
                      {v.images?.length ? (
                        <div className="flex h-full w-full">
                          {v.images.slice(0, 3).map((img, j) => (
                            <img key={j} src={imgUrl(img)} alt="" className="flex-1 h-full object-cover" style={{ maxWidth: `${100 / Math.min(v.images.length, 3)}%` }} />
                          ))}
                        </div>
                      ) : (
                        <svg className="w-6 h-6 text-[#d4ccbf]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 16.5v.75A2.25 2.25 0 005.25 19.5h13.5A2.25 2.25 0 0021 17.25V6.75A2.25 2.25 0 0018.75 4.5H5.25A2.25 2.25 0 003 6.75V16.5z" /></svg>
                      )}
                    </div>

                    <div className="p-3 flex flex-col gap-2 flex-1">
                      {/* Attributes */}
                      <div className="flex flex-wrap gap-1">
                        {v.attributes?.map((a, j) => (
                          <span key={j} className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-[#f5f0e8] border border-[#e8e2d8] rounded-full text-[#706456]">
                            <span className="text-[#C9A96E] font-semibold">{a.key}</span>: {a.value}
                          </span>
                        ))}
                      </div>

                      {v.price && <span className="text-base font-light text-[#1b1c1a]" style={{ fontFamily: "'Cormorant Garamond',serif" }}>{fmt(v.price)}</span>}

                      {/* Stock stepper */}
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#e8e2d8]">
                        <span className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full ${stockColor}`}>
                          {v.stock === 0 ? 'Out' : v.stock <= 5 ? 'Low' : 'In Stock'}
                        </span>
                        <div className="flex items-center border border-[#e8e2d8] rounded overflow-hidden">
                          <button onClick={() => changeStock(v.id, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-[#f5f0e8] border-r border-[#e8e2d8] transition-colors cursor-pointer text-[#706456]">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-[#1b1c1a]">{v.stock}</span>
                          <button onClick={() => changeStock(v.id, 1)} className="w-6 h-6 flex items-center justify-center hover:bg-[#f5f0e8] border-l border-[#e8e2d8] transition-colors cursor-pointer text-[#706456]">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                          </button>
                        </div>
                      </div>

                      {/* Edit / Delete */}
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(v)} className="flex-1 text-[9px] uppercase tracking-wider py-1.5 border border-[#e8e2d8] rounded text-[#706456] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors cursor-pointer">Edit</button>
                        <button onClick={() => setDelId(v.id)} className="px-2.5 py-1.5 border border-[#e8e2d8] rounded text-[#8c8275] hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* ════════════ DRAWER ════════════ */}
      {drawer && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-[#1b1c1a]/25 backdrop-blur-sm" onClick={closeDrawer} />
          <div className="absolute right-0 top-0 h-full w-[440px] max-w-full bg-[#fbf9f6] border-l border-[#e8e2d8] shadow-2xl flex flex-col">

            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e2d8] bg-white shrink-0">
              <div>
                <h3 className="text-xl font-light" style={{ fontFamily: "'Cormorant Garamond',serif" }}>
                  {editId ? 'Edit Variant' : 'Add Variant'}
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-[#8c8275] mt-0.5">Images & price are optional</p>
              </div>
              <button onClick={closeDrawer} id="close-drawer-btn" className="w-8 h-8 flex items-center justify-center rounded text-[#8c8275] hover:bg-[#f5f0e8] transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Images */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8c8275] block mb-1.5">Images ({form.images.length}/7)</label>
                {form.images.length < 7 && (
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                    onClick={() => fileRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-5 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${dragOver ? 'border-[#C9A96E] bg-[#fdf5e6]' : 'border-[#e8e2d8] hover:border-[#C9A96E]/50 hover:bg-[#fdf9f3]'}`}>
                    <svg className="w-6 h-6 text-[#C9A96E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                    <p className="text-xs text-[#706456]">Drop or click · {7 - form.images.length} remaining</p>
                    <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
                  </div>
                )}
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative w-14 h-14 rounded border border-[#e8e2d8] overflow-hidden group/img">
                        <img src={imgUrl(img)} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => rmImg(i)} className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Attributes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8c8275]">Attributes <span className="text-[#C9A96E]">*</span></label>
                  <button onClick={() => setForm(f => ({ ...f, attributes: [...f.attributes, { key: '', value: '' }] }))}
                    className="text-[10px] text-[#C9A96E] font-semibold uppercase tracking-wider cursor-pointer hover:text-[#b8955a]">
                    + Add
                  </button>
                </div>
                <div className="space-y-2">
                  {form.attributes.map((a, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input id={`attr-key-${i}`} type="text" placeholder="Color, Size…" value={a.key} onChange={e => setAttr(i, 'key', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-[#e8e2d8] rounded text-sm placeholder-[#c4bfb5] focus:outline-none focus:border-[#C9A96E] transition-colors" />
                      <input id={`attr-val-${i}`} type="text" placeholder="Red, M, 128GB…" value={a.value} onChange={e => setAttr(i, 'value', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-[#e8e2d8] rounded text-sm placeholder-[#c4bfb5] focus:outline-none focus:border-[#C9A96E] transition-colors" />
                      {form.attributes.length > 1 && (
                        <button onClick={() => setForm(f => ({ ...f, attributes: f.attributes.filter((_, j) => j !== i) }))}
                          className="w-7 h-7 flex items-center justify-center text-[#8c8275] hover:text-red-500 transition-colors cursor-pointer shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {err && <p className="text-[10px] text-red-500 mt-1.5">{err}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8c8275] block mb-1.5">
                  Price <span className="normal-case tracking-normal font-normal">(optional)</span>
                </label>
                <div className="flex gap-2">
                  <input id="variant-price" type="number" min="0" placeholder="e.g. 1799" value={form.price.amount}
                    onChange={e => setForm(f => ({ ...f, price: { ...f.price, amount: e.target.value } }))}
                    className="flex-1 px-3 py-2 bg-white border border-[#e8e2d8] rounded text-sm focus:outline-none focus:border-[#C9A96E] transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" />
                  <select id="variant-currency" value={form.price.currency} onChange={e => setForm(f => ({ ...f, price: { ...f.price, currency: e.target.value } }))}
                    className="px-3 py-2 bg-white border border-[#e8e2d8] rounded text-sm focus:outline-none focus:border-[#C9A96E] transition-colors cursor-pointer">
                    {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8c8275] block mb-1.5">Initial Stock</label>
                <div className="flex items-center w-32 border border-[#e8e2d8] rounded overflow-hidden bg-white">
                  <button onClick={() => setForm(f => ({ ...f, stock: Math.max(0, f.stock - 1) }))} className="w-9 h-9 flex items-center justify-center border-r border-[#e8e2d8] hover:bg-[#f5f0e8] transition-colors cursor-pointer text-[#706456]">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                  </button>
                  <input id="variant-stock" type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Math.max(0, Number(e.target.value)) }))}
                    className="flex-1 h-9 text-center text-sm font-semibold bg-transparent border-0 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" />
                  <button onClick={() => setForm(f => ({ ...f, stock: f.stock + 1 }))} className="w-9 h-9 flex items-center justify-center border-l border-[#e8e2d8] hover:bg-[#f5f0e8] transition-colors cursor-pointer text-[#706456]">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-[#e8e2d8] bg-white shrink-0">
              <button id="save-variant-btn" onClick={save} className="flex-1 py-2.5 bg-[#C9A96E] text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-[#b8955a] active:scale-[0.98] transition-all cursor-pointer">
                {editId ? 'Update' : 'Save'} Variant
              </button>
              <button id="cancel-drawer-btn" onClick={closeDrawer} className="px-5 py-2.5 border border-[#e8e2d8] text-[#1b1c1a] text-xs uppercase tracking-widest font-semibold rounded hover:bg-[#f5f0e8] transition-all cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ DELETE CONFIRM ════════ */}
      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1b1c1a]/30 backdrop-blur-sm" onClick={() => setDelId(null)} />
          <div className="relative bg-white border border-[#e8e2d8] rounded-lg p-5 max-w-xs w-full shadow-xl">
            <p className="text-sm font-medium text-[#1b1c1a] mb-1">Delete this variant?</p>
            <p className="text-xs text-[#8c8275] mb-4">This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => { setVariants(p => p.filter(v => v.id !== delId)); setDelId(null); }}
                className="flex-1 py-2 bg-[#9e3127] text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#8a2920] transition-colors cursor-pointer">Delete</button>
              <button onClick={() => setDelId(null)}
                className="flex-1 py-2 border border-[#e8e2d8] text-[#1b1c1a] text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#f5f0e8] transition-colors cursor-pointer">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

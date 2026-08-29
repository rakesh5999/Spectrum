import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useProduct } from '../hook/useProduct';

const ProductDetails = () => {
  const { productId } = useParams();
  const { handleGetProductById } = useProduct();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isMainHovered, setIsMainHovered] = useState(false);

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        setLoading(true);
        const data = await handleGetProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    }
    if (productId) fetchProductDetails();
  }, [productId]);

  const images = product?.images?.length
    ? product.images.map((img) => (typeof img === 'string' ? img : img.url))
    : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80'];

  const prevImage = (e) => {
    e?.stopPropagation();
    setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#fbf9f6] text-[#1b1c1a]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#1b1c1a] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#8c8275]">Loading Piece...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#fbf9f6] text-[#1b1c1a] gap-4 p-4">
        <h2 className="text-2xl font-serif text-[#1b1c1a]">Piece Not Found</h2>
        <p className="text-xs text-[#8c8275] text-center">The requested product is not available or has been removed.</p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-[#1b1c1a] text-white text-xs uppercase tracking-widest hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-all"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Editorial Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen lg:h-screen w-full flex flex-col bg-[#fbf9f6] text-[#1b1c1a] overflow-x-hidden lg:overflow-hidden selection:bg-[#C9A96E]/30"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Navbar */}
        <header className="h-16 px-4 sm:px-8 lg:px-12 flex items-center justify-between border-b border-[#e8e2d8] shrink-0 bg-[#fbf9f6]/95 backdrop-blur-sm z-20 sticky top-0">
          <Link to="/" className="flex flex-col">
            <span
              className="text-2xl sm:text-3xl font-light tracking-tight text-[#1b1c1a] hover:text-[#C9A96E] transition-colors"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Rewoven.
            </span>
            <span className="text-[8px] uppercase tracking-[0.35em] text-[#8c8275] -mt-1">
              Atelier & Studio
            </span>
          </Link>

          <Link
            to="/"
            className="text-xs uppercase tracking-[0.18em] text-[#706456] hover:text-[#1b1c1a] transition-colors flex items-center gap-1.5 font-medium group"
          >
            <span className="transition-transform group-hover:-translate-x-1">&larr;</span>
            <span className="hidden sm:inline">Back to Catalog</span>
            <span className="sm:hidden">Shop</span>
          </Link>
        </header>

        {/* Main Content Layout */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 w-full lg:max-h-[82vh] items-center">
            
            {/* Image Gallery Column */}
            <div className="lg:col-span-7 flex flex-row gap-2.5 sm:gap-4 h-[420px] sm:h-[480px] lg:h-[500px] items-center justify-center">
              
              {/* Vertical Slider Strip (Aside Main Image, No Scrollbar, Changes on Hover) */}
              {images.length > 1 && (
                <div className="flex flex-col gap-2 sm:gap-2.5 h-full overflow-y-auto shrink-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1">
                  {images.map((img, idx) => {
                    const isActive = activeImageIdx === idx;
                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setActiveImageIdx(idx)}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`relative w-14 h-18 sm:w-16 sm:h-20 lg:w-20 lg:h-24 rounded-sm overflow-hidden border cursor-pointer transition-all duration-200 shrink-0 ${
                          isActive
                            ? 'border-[#1b1c1a] ring-2 ring-[#C9A96E]/80 shadow-md scale-[1.02]'
                            : 'border-[#e8e2d8] opacity-65 hover:opacity-100 hover:border-[#8c8275]'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover pointer-events-none"
                        />
                        {isActive && (
                          <div className="absolute inset-0 bg-[#C9A96E]/10 pointer-events-none" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Main Image Container: Arrows appear directly on mouse hover */}
              <div
                onMouseEnter={() => setIsMainHovered(true)}
                onMouseLeave={() => setIsMainHovered(false)}
                className="relative flex-1 h-full max-h-[500px] bg-white rounded-sm border border-[#e8e2d8] overflow-hidden flex items-center justify-center shadow-xs select-none"
              >
                <img
                  src={images[activeImageIdx]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                />

                {/* Left Arrow Button: Appears on mouse hover over main image, slides on hover/click */}
                {isMainHovered && images.length > 1 && (
                  <button
                    onMouseEnter={prevImage}
                    onClick={prevImage}
                    aria-label="Previous Image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1b1c1a] text-white flex items-center justify-center shadow-2xl transition-all duration-200 cursor-pointer focus:outline-none z-20 hover:scale-110 hover:bg-[#C9A96E] hover:text-[#1b1c1a]"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Right Arrow Button: Appears on mouse hover over main image, slides on hover/click */}
                {isMainHovered && images.length > 1 && (
                  <button
                    onMouseEnter={nextImage}
                    onClick={nextImage}
                    aria-label="Next Image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1b1c1a] text-white flex items-center justify-center shadow-2xl transition-all duration-200 cursor-pointer focus:outline-none z-20 hover:scale-110 hover:bg-[#C9A96E] hover:text-[#1b1c1a]"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                {/* Counter Tag */}
                <span className="absolute bottom-2.5 right-2.5 text-[9px] sm:text-[10px] uppercase tracking-widest bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-xs z-10 pointer-events-none">
                  {activeImageIdx + 1} / {images.length}
                </span>
              </div>
            </div>

            {/* Details & Actions Column */}
            <div className="lg:col-span-5 flex flex-col justify-center gap-4 lg:gap-5 px-1 sm:px-2">
              
              {/* Category Tag & Status */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C9A96E]">
                    Limited Atelier Piece
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#eef7ee] text-[#2e7d32] border border-[#c8e6c9] text-[9px] uppercase tracking-widest font-semibold rounded-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32] animate-pulse" />
                    In Stock
                  </span>
                </div>

                <h1
                  className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#1b1c1a] leading-tight tracking-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {product.title}
                </h1>

                <div className="flex items-baseline gap-2.5 mt-2">
                  <span className="text-2xl sm:text-3xl font-medium text-[#1b1c1a] tracking-tight">
                    {product.price?.currency === 'INR' || !product.price?.currency ? '₹' : product.price.currency + ' '}
                    {Number(product.price?.amount || 0).toLocaleString()}
                  </span>
                  <span className="text-[11px] text-[#8c8275] tracking-wide">
                    (Taxes included)
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-b border-[#e8e2d8] py-3 sm:py-3.5">
                <span className="text-[10px] uppercase tracking-widest text-[#8c8275] block mb-1 font-semibold">
                  Description
                </span>
                <p className="text-xs sm:text-sm text-[#50463c] leading-relaxed line-clamp-3 sm:line-clamp-4">
                  {product.description || 'Crafted with premium materials and thoughtful craftsmanship.'}
                </p>
              </div>

              {/* Product Specifications */}
              <div className="space-y-1.5 text-[11px] text-[#8c8275]">
                <div className="flex items-center justify-between">
                  <span className="uppercase tracking-wider">SKU:</span>
                  <span className="font-mono text-[#1b1c1a] text-[10px] font-medium">
                    RW-{product._id ? product._id.slice(-6).toUpperCase() : 'ATELIER'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="uppercase tracking-wider">Seller:</span>
                  <span className="text-[#1b1c1a] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
                    Verified Atelier Partner
                  </span>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                <button
                  type="button"
                  className="flex-1 py-3.5 px-4 bg-white border border-[#1b1c1a] text-[#1b1c1a] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#1b1c1a] hover:text-[#fbf9f6] active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-xs text-center flex items-center justify-center gap-2 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4 transition-transform group-hover:scale-110"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                  Add to Cart
                </button>

                <button
                  type="button"
                  className="flex-1 py-3.5 px-4 bg-[#1b1c1a] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#C9A96E] hover:text-[#1b1c1a] active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-md text-center flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                    />
                  </svg>
                  Buy Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] text-[#8c8275] border-t border-[#e8e2d8]">
                <p>✓ 100% Authentic</p>
                <p>✓ Express Dispatch</p>
                <p>✓ 7-Day Returns</p>
              </div>

            </div>

          </div>
        </main>
      </div>
    </>
  );
};

export default ProductDetails;

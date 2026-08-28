import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useProduct } from "../hook/useProduct";
import { Link, useNavigate } from "react-router";
import { setUser } from "../../auth/state/auth.slice";

const Home = () => {
  const products = useSelector((state) => state.product.products) || [];
  const user = useSelector((state) => state.auth.user);
  const { handleGetAllProduct } = useProduct();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [addedToast, setAddedToast] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await handleGetAllProduct();
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    let list = Array.isArray(products) ? [...products] : [];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === "price-high") return (b.price?.amount || 0) - (a.price?.amount || 0);
      if (sortBy === "price-low") return (a.price?.amount || 0) - (b.price?.amount || 0);
      if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
      return 0;
    });

    return list;
  }, [products, searchTerm, sortBy]);

  const formatPrice = (priceObj) => {
    if (!priceObj) return "N/A";
    const amount = Number(priceObj.amount || 0).toLocaleString();
    const currency = priceObj.currency || "INR";
    const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
    return `${symbols[currency] || currency} ${amount}`;
  };

  const getImageUrl = (imageItem) => {
    if (!imageItem) return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
    if (typeof imageItem === "string") return imageItem;
    return imageItem.url || imageItem.fileUrl || imageItem.thumbnailUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
  };

  const handleAddToCart = (e, product) => {
    e?.stopPropagation();
    setCartCount((prev) => prev + 1);
    setAddedToast(product.title);
    setTimeout(() => setAddedToast(null), 2500);
  };

  return (
    <>
      {/* Editorial Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen w-full selection:bg-[#C9A96E]/30"
        style={{
          backgroundColor: "#fbf9f6",
          color: "#1b1c1a",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Toast Alert */}
        {addedToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1b1c1a] text-[#fbf9f6] px-5 py-3.5 shadow-2xl border border-[#C9A96E]/40 flex items-center gap-3 transition-all animate-bounce">
            <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />
            <p className="text-xs uppercase tracking-widest font-medium">
              Added <span className="font-semibold text-[#C9A96E]">"{addedToast}"</span> to bag
            </p>
          </div>
        )}

        {/* Top Notification Bar */}
        <div className="bg-[#1b1c1a] text-[#d0c5b5] text-[10px] uppercase tracking-[0.3em] py-2 text-center border-b border-[#2d2e2b]">
          Complimentary Worldwide Shipping on Orders Above ₹5,000 &bull; Limited Seasonal Drop
        </div>

        {/* Main Navbar */}
        <header className="border-b border-[#e8e2d8] sticky top-0 z-40 bg-[#fbf9f6]/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
            {/* Brand Logo */}
            <Link to="/" className="flex flex-col">
              <span
                className="text-2xl sm:text-3xl font-light tracking-tight text-[#1b1c1a] hover:text-[#C9A96E] transition-colors"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Rewoven.
              </span>
              <span className="text-[9px] uppercase tracking-[0.35em] text-[#8c8275] -mt-1">
                Atelier & Studio
              </span>
            </Link>

            {/* Live Search Input */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search curated pieces..."
                className="w-full bg-[#f3efe9] border border-transparent focus:border-[#C9A96E] text-xs px-4 py-2.5 outline-none transition-all placeholder:text-[#a59b8d] tracking-wide"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 text-xs text-[#8c8275] hover:text-[#1b1c1a]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center gap-3 sm:gap-6">
              {user ? (
                <div className="flex items-center gap-4">
                  {user.role === "seller" ? (
                    <Link
                      to="/seller/dashboard"
                      className="px-3.5 py-1.5 border border-[#1b1c1a] text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-[#1b1c1a] hover:text-[#fbf9f6] transition-all"
                    >
                      Seller Dashboard
                    </Link>
                  ) : (
                    <span className="text-xs text-[#8c8275]">
                      Welcome, <span className="text-[#1b1c1a] font-medium">{user.fullname || user.email}</span>
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-4">
                  <Link
                    to="/login"
                    className="text-xs uppercase tracking-[0.18em] text-[#1b1c1a] hover:text-[#C9A96E] transition-colors font-medium px-2 py-1"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 bg-[#1b1c1a] text-[#fbf9f6] text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-all"
                  >
                    Join
                  </Link>
                </div>
              )}

              {/* Shopping Bag Counter */}
              <div className="relative flex items-center cursor-pointer p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-[#1b1c1a]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C9A96E] text-[#1b1c1a] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Editorial Hero Section */}
        <section className="relative bg-[#f5f1eb] border-b border-[#e8e2d8] py-16 sm:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl">
              <span
                className="text-[11px] tracking-[0.35em] uppercase font-semibold text-[#C9A96E] block mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Exclusive Creations
              </span>
              <h2
                className="text-4xl sm:text-6xl font-light tracking-tight text-[#1b1c1a] leading-[1.1] mb-6"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Curated Luxury, <br />
                <span className="italic font-normal">Thoughtfully Crafted.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#706456] leading-relaxed mb-8 max-w-lg">
                Discover exceptional pieces made by independent creators, artisans, and premium sellers.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#catalog"
                  className="px-8 py-3.5 bg-[#1b1c1a] text-[#fbf9f6] text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-all"
                >
                  Explore Collection
                </a>
                {(!user || user.role !== "seller") && (
                  <Link
                    to="/register"
                    className="px-8 py-3.5 border border-[#1b1c1a] text-[#1b1c1a] text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-[#1b1c1a] hover:text-[#fbf9f6] transition-all"
                  >
                    Become a Seller
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Decorative Background Accent */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block opacity-20 pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(#C9A96E_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>
        </section>

        {/* Trust Badges Strip */}
        <section className="border-b border-[#e8e2d8] bg-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#1b1c1a]">Direct from Makers</p>
              <p className="text-[10px] text-[#8c8275]">100% Authentic Products</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#1b1c1a]">Secure Checkout</p>
              <p className="text-[10px] text-[#8c8275]">Encrypted Payments</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#1b1c1a]">Fast Dispatch</p>
              <p className="text-[10px] text-[#8c8275]">Worldwide Express Tracked</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#1b1c1a]">Easy Returns</p>
              <p className="text-[10px] text-[#8c8275]">7-Day Quality Guarantee</p>
            </div>
          </div>
        </section>

        {/* Main Products Catalog */}
        <main id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Controls Bar: Search & Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-[#e8e2d8] mb-8">
            <div>
              <h3
                className="text-2xl sm:text-3xl font-light text-[#1b1c1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                All Products ({filteredProducts.length})
              </h3>
              <p className="text-xs text-[#8c8275] mt-1">
                Showing all active listings from verified community sellers
              </p>
            </div>

            {/* Mobile Search Input */}
            <div className="w-full sm:hidden">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-[#f3efe9] border border-transparent focus:border-[#C9A96E] text-xs px-4 py-2.5 outline-none"
              />
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <span className="text-[11px] uppercase tracking-wider text-[#8c8275] whitespace-nowrap">
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#f3efe9] border border-transparent focus:border-[#C9A96E] text-xs px-3 py-2 outline-none font-medium cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-white border border-[#e8e2d8] p-4 animate-pulse">
                  <div className="aspect-square bg-[#ece7df] mb-4" />
                  <div className="h-4 bg-[#ece7df] w-3/4 mb-2" />
                  <div className="h-3 bg-[#ece7df] w-1/2 mb-4" />
                  <div className="h-4 bg-[#ece7df] w-1/3" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="text-center py-24 bg-white border border-dashed border-[#d0c5b5] p-8">
              <h4
                className="text-2xl font-light text-[#1b1c1a] mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                No Products Found
              </h4>
              <p className="text-xs text-[#8c8275] max-w-sm mx-auto mb-6">
                {searchTerm
                  ? `No items match your search for "${searchTerm}". Try another keyword.`
                  : "No products are currently available in the marketplace."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-6 py-2.5 bg-[#1b1c1a] text-[#fbf9f6] text-[10px] uppercase tracking-widest hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-all"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            /* Product Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((product) => {
                const primaryImage =
                  product.images && product.images.length > 0
                    ? getImageUrl(product.images[0])
                    : null;
                const imageCount = product.images?.length || 0;

                return (
                  <div
                    key={product._id}
                    onClick={() => {
                      setSelectedProduct(product);
                      setActiveImageIdx(0);
                    }}
                    className="group bg-white border border-[#e8e2d8] hover:border-[#C9A96E] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] cursor-pointer"
                  >
                    {/* Image Box */}
                    <div className="relative aspect-square bg-[#f5f3f0] overflow-hidden">
                      {primaryImage ? (
                        <img
                          src={primaryImage}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#b0a595] text-xs uppercase tracking-widest">
                          No Image
                        </div>
                      )}

                      {/* Multi-Photo Tag */}
                      {imageCount > 1 && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[9px] uppercase tracking-wider">
                          {imageCount} Views
                        </span>
                      )}

                      {/* Quick Add Overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3 gap-2">
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="flex-1 py-2 bg-[#1b1c1a] text-[#fbf9f6] text-[10px] uppercase tracking-[0.2em] font-medium text-center hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-all shadow-md"
                        >
                          Quick Add
                        </button>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <h4
                          className="font-normal text-lg tracking-tight text-[#1b1c1a] truncate group-hover:text-[#C9A96E] transition-colors"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                          title={product.title}
                        >
                          {product.title}
                        </h4>
                        <p className="text-xs text-[#706456] line-clamp-2 mt-1 mb-3 leading-relaxed">
                          {product.description || "No description provided."}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#f0ebe3] flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#1b1c1a]">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-[#a09485]">
                          View Piece &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Product Quick View / Detail Modal */}
        {selectedProduct && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="bg-[#fbf9f6] w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#C9A96E]/40 shadow-2xl relative flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/80 backdrop-blur-sm border border-[#e8e2d8] flex items-center justify-center text-sm hover:bg-[#1b1c1a] hover:text-white transition-all"
              >
                ✕
              </button>

              {/* Modal Left: Images */}
              <div className="md:w-1/2 p-6 flex flex-col gap-3 bg-[#f5f3f0]">
                <div className="aspect-square bg-white border border-[#e8e2d8] overflow-hidden relative">
                  <img
                    src={
                      selectedProduct.images && selectedProduct.images.length > 0
                        ? getImageUrl(selectedProduct.images[activeImageIdx])
                        : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
                    }
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnails */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {selectedProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`w-14 h-14 shrink-0 border overflow-hidden transition-all ${
                          activeImageIdx === idx
                            ? "border-[#C9A96E] ring-1 ring-[#C9A96E]"
                            : "border-[#e8e2d8] opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={getImageUrl(img)}
                          alt="thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Right: Details */}
              <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span
                    className="text-[10px] tracking-[0.3em] uppercase text-[#C9A96E] font-semibold block mb-1"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Original Artwork & Design
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl font-light text-[#1b1c1a] mb-2"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {selectedProduct.title}
                  </h3>

                  <div className="text-xl font-medium text-[#1b1c1a] mb-6">
                    {formatPrice(selectedProduct.price)}
                  </div>

                  <div className="border-t border-b border-[#e8e2d8] py-4 mb-6">
                    <p className="text-xs uppercase tracking-widest text-[#8c8275] mb-2 font-medium">
                      Description
                    </p>
                    <p className="text-xs sm:text-sm text-[#5a5043] leading-relaxed whitespace-pre-line">
                      {selectedProduct.description || "No description provided."}
                    </p>
                  </div>

                  <div className="text-[11px] text-[#8c8275] space-y-1 mb-6">
                    <p>
                      <strong>Product ID:</strong> {selectedProduct._id}
                    </p>
                    {selectedProduct.createdAt && (
                      <p>
                        <strong>Listed On:</strong>{" "}
                        {new Date(selectedProduct.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={(e) => {
                      handleAddToCart(e, selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-3.5 bg-[#1b1c1a] text-[#fbf9f6] text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-all"
                  >
                    Add to Bag
                  </button>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="px-5 py-3.5 border border-[#d0c5b5] text-[#1b1c1a] text-[11px] uppercase tracking-widest hover:bg-[#f5f3f0]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-[#e8e2d8] bg-[#f5f1eb] py-12 mt-16 text-center text-xs text-[#8c8275]">
          <p className="font-serif italic text-lg text-[#1b1c1a] mb-2">Rewoven Atelier</p>
          <p className="text-[10px] uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} Rewoven Inc. All Rights Reserved.
          </p>
        </footer>
      </div>
    </>
  );
};

export default Home;

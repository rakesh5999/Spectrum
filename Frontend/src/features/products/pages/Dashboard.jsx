import React, { useEffect, useState, useMemo } from "react";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router";

const Dashboard = () => {
  const { handleGetProduct } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts) || [];

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      await handleGetProduct();
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = Array.isArray(sellerProducts) ? [...sellerProducts] : [];

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
  }, [sellerProducts, searchTerm, sortBy]);

  // Calculations for stats
  const totalProducts = sellerProducts.length;
  const totalValue = sellerProducts.reduce(
    (acc, curr) => acc + (Number(curr.price?.amount) || 0),
    0
  );

  const formatPrice = (priceObj) => {
    if (!priceObj) return "N/A";
    const amount = Number(priceObj.amount || 0).toLocaleString();
    const currency = priceObj.currency || "INR";
    const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
    return `${symbols[currency] || currency} ${amount}`;
  };

  const getImageUrl = (imageItem) => {
    if (!imageItem) return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
    if (typeof imageItem === "string") return imageItem;
    return imageItem.url || imageItem.fileUrl || imageItem.thumbnailUrl || "";
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap"
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
        {/* Top Header */}
        <header className="border-b border-[#e8e2d8] sticky top-0 z-30 bg-[#fbf9f6]/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <span
                  className="text-[11px] tracking-[0.3em] uppercase font-semibold text-[#C9A96E] block"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Rewoven. Studio
                </span>
                <h1
                  className="text-2xl sm:text-3xl font-light tracking-tight text-[#1b1c1a]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Seller Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleGetProduct()}
                title="Refresh products"
                className="px-3.5 py-2.5 text-xs border border-[#d0c5b5] hover:border-[#1b1c1a] text-[#1b1c1a] transition-colors rounded-none flex items-center gap-1.5 cursor-pointer bg-transparent"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <Link
                to="/seller/create-product"
                className="px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] font-medium bg-[#1b1c1a] hover:bg-[#C9A96E] text-[#fbf9f6] hover:text-[#1b1c1a] transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>+ Add Product</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Key Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-5 border border-[#e8e2d8] bg-white/70 backdrop-blur-sm transition-all hover:border-[#C9A96E]">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] font-medium block mb-1">
                Total Products
              </span>
              <div
                className="text-3xl font-light text-[#1b1c1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {loading ? "..." : totalProducts}
              </div>
            </div>

            <div className="p-5 border border-[#e8e2d8] bg-white/70 backdrop-blur-sm transition-all hover:border-[#C9A96E]">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] font-medium block mb-1">
                Total Inventory Value
              </span>
              <div
                className="text-3xl font-light text-[#1b1c1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {loading ? "..." : `₹ ${totalValue.toLocaleString()}`}
              </div>
            </div>

            <div className="p-5 border border-[#e8e2d8] bg-white/70 backdrop-blur-sm transition-all hover:border-[#C9A96E]">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] font-medium block mb-1">
                Latest Product Added
              </span>
              <div
                className="text-xl font-light text-[#1b1c1a] truncate"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {loading
                  ? "..."
                  : sellerProducts.length > 0
                  ? sellerProducts[sellerProducts.length - 1]?.title || "N/A"
                  : "None"}
              </div>
            </div>
          </div>

          {/* Controls Bar: Search & Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#e8e2d8]">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search your collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-b border-[#d0c5b5] focus:border-[#C9A96E] outline-none py-2 text-sm placeholder:text-[#b0a595] transition-colors pr-8"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-2.5 text-xs text-[#7A6E63] hover:text-[#1b1c1a]"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-[#7A6E63]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-b border-[#d0c5b5] focus:border-[#C9A96E] outline-none py-1.5 text-xs uppercase tracking-wider cursor-pointer text-[#1b1c1a]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="title">Title: A-Z</option>
              </select>
            </div>
          </div>

          {/* Content States */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin mb-3"></div>
              <p
                className="text-lg text-[#7A6E63] font-light italic"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Curating your collection...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-[#d0c5b5] bg-white/40 p-8 max-w-xl mx-auto">
              <span
                className="text-3xl block mb-2 font-light text-[#C9A96E]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                No Products Found
              </span>
              <p className="text-sm text-[#7A6E63] mb-6 max-w-sm mx-auto">
                {searchTerm
                  ? `No products match your search "${searchTerm}".`
                  : "You haven't listed any items in your store yet."}
              </p>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 border border-[#1b1c1a] text-xs uppercase tracking-widest hover:bg-[#1b1c1a] hover:text-[#fbf9f6] transition-colors"
                >
                  Clear Search
                </button>
              ) : (
                <Link
                  to="/seller/create-product"
                  className="inline-block px-6 py-3 bg-[#1b1c1a] text-[#fbf9f6] text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-all"
                >
                  Create Your First Product
                </Link>
              )}
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const primaryImage =
                  product.images && product.images.length > 0
                    ? getImageUrl(product.images[0])
                    : null;

                const imageCount = product.images?.length || 0;

                return (
                  <div
                    key={product._id}
                    className="group flex flex-col bg-white border border-[#e8e2d8] hover:border-[#C9A96E] transition-all duration-300 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] cursor-pointer"
                    onClick={() => {
                      navigate(`/seller/product/${product._id}`);
                    }}
                  >
                    {/* Product Image Box */}
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

                      {/* Image Count Tag */}
                      {imageCount > 1 && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider">
                          {imageCount} Photos
                        </span>
                      )}

                      {/* Hover Overlay Button */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                        <span className="w-full py-2 bg-white/95 text-[#1b1c1a] text-[10px] uppercase tracking-[0.2em] font-medium text-center shadow-sm">
                          View Details
                        </span>
                      </div>
                    </div>

                    {/* Product Information */}
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <h3
                            className="font-normal text-lg tracking-tight text-[#1b1c1a] truncate group-hover:text-[#C9A96E] transition-colors"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            title={product.title}
                          >
                            {product.title}
                          </h3>
                        </div>

                        <p className="text-xs text-[#7A6E63] line-clamp-2 mb-3 leading-relaxed">
                          {product.description || "No description provided."}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#f0ebe3] flex items-center justify-between">
                        <span className="text-sm font-medium text-[#1b1c1a]">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-[10px] text-[#a09485]">
                          {product.createdAt
                            ? new Date(product.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                              })
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Dashboard;
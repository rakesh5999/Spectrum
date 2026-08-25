import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";

export const Register = () => {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
    isSeller: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setAuthError("");

    try {
      setLoading(true);
      await handleRegister({
        fullname: formData.fullname.trim(),
        email: formData.email.trim(),
        contact: formData.contact.trim(),
        password: formData.password,
        isSeller: formData.isSeller,
      });
      setSuccessMsg("Account created successfully! Welcome to Rewoven.");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        err.message ||
        "Registration failed";
      setAuthError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between selection:bg-[#FACC15] selection:text-black font-sans antialiased relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 -translate-x-1/2 w-[500px] h-[250px] bg-gradient-to-b from-[#FACC15]/8 via-[#FACC15]/2 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="fixed bottom-0 right-10 w-[400px] h-[300px] bg-[#EAB308]/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Navigation */}
      <header className="w-full z-30 py-3 sm:py-3.5 px-4 sm:px-8 lg:px-12 flex items-center justify-between border-b border-zinc-800/40 backdrop-blur-md bg-[#09090b]/70 shrink-0">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-2 h-2 rounded-full bg-[#FACC15] shadow-[0_0_12px_#FACC15] group-hover:scale-125 transition-transform" />
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold tracking-[0.22em] text-white uppercase font-['Outfit']">
              REWOVEN
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase font-mono text-[#FACC15]/90 -mt-0.5">
              Curated Apparel
            </span>
          </div>
        </a>

        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-zinc-400">
          <span className="hidden sm:inline font-light text-zinc-400">
            Already have an account?
          </span>
          <a
            href="/login"
            className="text-zinc-200 hover:text-[#FACC15] font-medium transition-colors duration-200 border-b border-transparent hover:border-[#FACC15] pb-0.5"
          >
            Sign in
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center py-2 sm:py-4 px-3 sm:px-6 lg:px-8 z-10 min-h-0">
        <div className="w-full max-w-6xl my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 xl:gap-8 items-stretch">
            
            {/* LEFT COLUMN: Editorial Showcase (Visible on Desktop / Large Screens) */}
            <div className="hidden lg:flex lg:col-span-5 flex-col justify-between relative rounded-2xl overflow-hidden border border-zinc-800/80 bg-gradient-to-b from-[#121216]/90 via-[#101013] to-[#09090b] p-5 xl:p-6 shadow-2xl group">
              {/* Background Editorial Visual with gradient mask */}
              <div className="absolute inset-0 z-0">
                <img
                  src="/rewoven_editorial.jpg"
                  alt="Rewoven Fashion Aesthetic"
                  className="w-full h-full object-cover object-top opacity-35 group-hover:scale-105 transition-transform duration-1000 ease-out filter grayscale-[30%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#0e0e11]/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/80 via-transparent to-[#09090b]/60" />
              </div>

              {/* Editorial Top Content */}
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/30 text-[#FACC15] text-[10px] font-mono tracking-wider uppercase backdrop-blur-md mb-3 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] animate-pulse" />
                  SS / 2026 Collection
                </div>
                <h2 className="text-2xl xl:text-3xl font-semibold tracking-tight text-white font-['Outfit'] leading-[1.2]">
                  The New Standard in Conscious Fashion.
                </h2>
                <p className="text-xs text-zinc-300/90 mt-2 leading-relaxed font-light line-clamp-2">
                  Join a discerning community of collectors, independent designers, and modern wardrobe minimalists.
                </p>
              </div>

              {/* Feature Highlights Pills */}
              <div className="relative z-10 my-4 space-y-2.5">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-900/70 backdrop-blur-md border border-zinc-800/60 text-xs text-zinc-300">
                  <div className="w-7 h-7 rounded-lg bg-[#FACC15]/10 text-[#FACC15] flex items-center justify-center shrink-0 border border-[#FACC15]/20">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-white block text-xs">Curated Independent Labels</span>
                    <span className="text-zinc-400 text-[10px]">Handcrafted silhouettes & bespoke tailoring.</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-900/70 backdrop-blur-md border border-zinc-800/60 text-xs text-zinc-300">
                  <div className="w-7 h-7 rounded-lg bg-[#FACC15]/10 text-[#FACC15] flex items-center justify-center shrink-0 border border-[#FACC15]/20">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-white block text-xs">Merchant & Seller Studio</span>
                    <span className="text-zinc-400 text-[10px]">List your clothes & scale your global audience.</span>
                  </div>
                </div>
              </div>

              {/* Bottom Editorial Quote */}
              <div className="relative z-10 pt-2.5 border-t border-zinc-800/50 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1 text-[#FACC15] text-[10px]">
                    ★★★★★
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">
                    25,000+ Fashion Connoisseurs
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 font-mono">EST. 2026</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Registration Form Canvas */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="bg-[#121215]/85 backdrop-blur-2xl border border-zinc-800/70 rounded-2xl p-4 sm:p-6 lg:p-6 xl:p-7 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] transition-all duration-300">
                
                {/* Form Header */}
                <div className="mb-3 sm:mb-4 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/20 text-[#FACC15] text-[10px] font-mono tracking-wider uppercase mb-1.5">
                    Fashion Membership
                  </div>
                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white font-['Outfit']">
                    Create Account
                  </h1>
                  <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 font-light leading-relaxed">
                    Step into Rewoven. Discover curated styles, conscious fashion, and seamless shopping.
                  </p>
                </div>

                {/* Error Banner */}
                {authError && (
                  <div className="mb-3 p-2.5 rounded-lg bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-start gap-2 animate-fadeIn">
                    <svg className="w-4 h-4 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{authError}</span>
                  </div>
                )}

                {/* Success Banner */}
                {successMsg && (
                  <div className="mb-3 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-start gap-2 animate-fadeIn">
                    <svg className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Form Elements */}
                <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3" noValidate>
                  
                  {/* Responsive Row: Full Name & Contact Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label
                        htmlFor="fullname"
                        className="block text-[10px] sm:text-[11px] uppercase tracking-wider font-mono text-zinc-400"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          id="fullname"
                          name="fullname"
                          type="text"
                          value={formData.fullname}
                          onChange={handleChange}
                          placeholder="Jane Doe"
                          className="w-full bg-[#09090b]/80 border border-zinc-800 focus:border-[#FACC15] text-zinc-100 placeholder-zinc-600 rounded-lg px-3 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#FACC15]/40 transition-all duration-200"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-1">
                      <label
                        htmlFor="contact"
                        className="block text-[10px] sm:text-[11px] uppercase tracking-wider font-mono text-zinc-400"
                      >
                        Contact Number
                      </label>
                      <div className="relative">
                        <input
                          id="contact"
                          name="contact"
                          type="tel"
                          value={formData.contact}
                          onChange={handleChange}
                          placeholder="9876543210"
                          className="w-full bg-[#09090b]/80 border border-zinc-800 focus:border-[#FACC15] text-zinc-100 placeholder-zinc-600 rounded-lg px-3 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#FACC15]/40 transition-all duration-200"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="block text-[10px] sm:text-[11px] uppercase tracking-wider font-mono text-zinc-400"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        className="w-full bg-[#09090b]/80 border border-zinc-800 focus:border-[#FACC15] text-zinc-100 placeholder-zinc-600 rounded-lg px-3 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#FACC15]/40 transition-all duration-200"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="block text-[10px] sm:text-[11px] uppercase tracking-wider font-mono text-zinc-400"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full bg-[#09090b]/80 border border-zinc-800 focus:border-[#FACC15] text-zinc-100 placeholder-zinc-600 rounded-lg px-3 py-2 sm:py-2.5 pr-10 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#FACC15]/40 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* isSeller Checkbox Card */}
                  <div className="pt-0.5 sm:pt-1">
                    <label
                      htmlFor="isSeller"
                      className={`group relative flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl border cursor-pointer select-none transition-all duration-300 ${
                        formData.isSeller
                          ? "bg-[#FACC15]/5 border-[#FACC15]/40 shadow-[0_0_20px_rgba(250,204,21,0.06)]"
                          : "bg-[#09090b]/50 border-zinc-800/80 hover:border-zinc-700"
                      }`}
                    >
                      <div className="relative flex items-center justify-center mt-0.5">
                        <input
                          id="isSeller"
                          name="isSeller"
                          type="checkbox"
                          checked={formData.isSeller}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-200 ${
                            formData.isSeller
                              ? "bg-[#FACC15] border-[#FACC15]"
                              : "bg-zinc-900 border-zinc-700 group-hover:border-zinc-500"
                          }`}
                        >
                          {formData.isSeller && (
                            <svg
                              className="w-3 h-3 text-black font-bold"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium text-white group-hover:text-zinc-100 transition-colors">
                            Register as a Seller
                          </span>
                          {formData.isSeller && (
                            <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded-full bg-[#FACC15]/20 text-[#FACC15] font-semibold tracking-wider">
                              Merchant
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 leading-snug">
                          Enable merchant privileges to list clothes, manage inventory & seller studio.
                        </p>
                      </div>
                    </label>
                  </div>

                  <a href="/api/auth/google" className="text-[13px] text-[#FACC15] hover:text-[#ebd024] font-medium transition-colors underline">
                    Continue with Google
                  </a>


                  {/* Submit CTA */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full relative overflow-hidden bg-[#FACC15] hover:bg-[#ebd024] active:scale-[0.99] text-zinc-950 font-semibold text-xs sm:text-sm tracking-wide py-2.5 sm:py-3 px-4 rounded-xl shadow-[0_8px_20px_-4px_rgba(250,204,21,0.25)] hover:shadow-[0_12px_25px_-4px_rgba(250,204,21,0.35)] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-zinc-950" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Terms and Privacy info */}
                <div className="mt-2.5 sm:mt-3 text-center">
                  <p className="text-[10px] sm:text-[11px] text-zinc-500 leading-snug">
                    By creating an account, you agree to Rewoven's{" "}
                    <a href="#terms" className="text-zinc-400 hover:text-[#FACC15] transition-colors underline underline-offset-2">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#privacy" className="text-zinc-400 hover:text-[#FACC15] transition-colors underline underline-offset-2">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full z-10 py-2.5 sm:py-3 px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-zinc-900/80 text-[11px] text-zinc-500 shrink-0">
        <div>
          <span>© {new Date().getFullYear()} Rewoven. Sustainable fashion & clothes.</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <a href="#security" className="hover:text-zinc-300 transition-colors">
            Security
          </a>
          <a href="#privacy" className="hover:text-zinc-300 transition-colors">
            Privacy
          </a>
          <a href="#support" className="hover:text-zinc-300 transition-colors">
            Concierge Support
          </a>
        </div>
      </footer>
    </div>
  );
};



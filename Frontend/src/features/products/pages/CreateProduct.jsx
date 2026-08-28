import React, { useState } from 'react';
import { useProduct } from '../hook/useProduct';
import { useNavigate } from 'react-router';

const CreateProduct = () => {
    const { handleCreateProduct } = useProduct();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR'
    });

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const selected = Array.from(e.target.files);
        if (images.length + selected.length > 7) {
            setError('Max 7 images.');
            return;
        }
        setError('');
        setImages(prev => [...prev, ...selected].slice(0, 7));
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, idx) => idx !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.length === 0) {
            setError('Please upload at least 1 image.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('priceAmount', formData.priceAmount);
            data.append('priceCurrency', formData.priceCurrency);
            images.forEach(img => data.append('images', img));

            await handleCreateProduct(data);
            navigate('/');
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to create product.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        color: '#1b1c1a',
        borderBottom: '1px solid #d0c5b5',
        fontFamily: "'Inter', sans-serif"
    };

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="h-screen h-dvh w-full flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden selection:bg-[#C9A96E]/30"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >
                <div className="w-full max-w-lg md:max-w-xl flex flex-col justify-center h-full max-h-[92vh]">

                    {/* Header */}
                    <div className="text-center mb-3 sm:mb-4 shrink-0">
                        <span
                            className="text-[11px] tracking-[0.3em] uppercase font-semibold block mb-1 text-[#C9A96E]"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            Rewoven.
                        </span>
                        <h1
                            className="text-2xl sm:text-3xl font-light tracking-tight text-[#1b1c1a]"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            Create Product
                        </h1>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-2 p-1.5 text-center text-xs text-red-600 border border-red-200 bg-red-50/70 shrink-0">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col justify-between flex-1 gap-3 sm:gap-4">

                        {/* Title */}
                        <div className="flex flex-col gap-0.5">
                            <label
                                htmlFor="title"
                                className="text-[10px] uppercase tracking-[0.18em] font-medium text-[#7A6E63]"
                            >
                                Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Classic Oversized Trench"
                                className="w-full bg-transparent outline-none py-1 sm:py-1.5 text-sm transition-colors duration-200 placeholder:text-[#d0c5b5]"
                                style={inputStyle}
                                onFocus={(e) => e.target.style.borderBottomColor = '#C9A96E'}
                                onBlur={(e) => e.target.style.borderBottomColor = '#d0c5b5'}
                            />
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-0.5">
                            <label
                                htmlFor="description"
                                className="text-[10px] uppercase tracking-[0.18em] font-medium text-[#7A6E63]"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={2}
                                value={formData.description}
                                onChange={handleChange}
                                required
                                placeholder="Fabric composition, fit, and details..."
                                className="w-full bg-transparent outline-none py-1 sm:py-1.5 text-sm transition-colors duration-200 resize-none leading-snug placeholder:text-[#d0c5b5]"
                                style={inputStyle}
                                onFocus={(e) => e.target.style.borderBottomColor = '#C9A96E'}
                                onBlur={(e) => e.target.style.borderBottomColor = '#d0c5b5'}
                            />
                        </div>

                        {/* Price & Currency */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-0.5">
                                <label
                                    htmlFor="priceAmount"
                                    className="text-[10px] uppercase tracking-[0.18em] font-medium text-[#7A6E63]"
                                >
                                    Price
                                </label>
                                <input
                                    id="priceAmount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="priceAmount"
                                    value={formData.priceAmount}
                                    onChange={handleChange}
                                    required
                                    placeholder="4999"
                                    className="w-full bg-transparent outline-none py-1 sm:py-1.5 text-sm transition-colors duration-200 placeholder:text-[#d0c5b5]"
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderBottomColor = '#C9A96E'}
                                    onBlur={(e) => e.target.style.borderBottomColor = '#d0c5b5'}
                                />
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <label
                                    htmlFor="priceCurrency"
                                    className="text-[10px] uppercase tracking-[0.18em] font-medium text-[#7A6E63]"
                                >
                                    Currency
                                </label>
                                <select
                                    id="priceCurrency"
                                    name="priceCurrency"
                                    value={formData.priceCurrency}
                                    onChange={handleChange}
                                    className="w-full bg-transparent outline-none py-1 sm:py-1.5 text-sm transition-colors duration-200 cursor-pointer"
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderBottomColor = '#C9A96E'}
                                    onBlur={(e) => e.target.style.borderBottomColor = '#d0c5b5'}
                                >
                                    <option value="INR">INR (₹)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                            </div>
                        </div>

                        {/* Images (Up to 7) */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="images"
                                    className="text-[10px] uppercase tracking-[0.18em] font-medium text-[#7A6E63]"
                                >
                                    Images ({images.length}/7)
                                </label>
                                {images.length < 7 && (
                                    <label
                                        htmlFor="images"
                                        className="text-[10px] uppercase tracking-[0.15em] cursor-pointer text-[#C9A96E] hover:underline font-medium"
                                    >
                                        + Upload
                                    </label>
                                )}
                            </div>

                            <input
                                id="images"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={images.length >= 7}
                            />

                            {images.length > 0 ? (
                                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                                    {images.map((file, idx) => (
                                        <div key={idx} className="relative aspect-square border border-[#d0c5b5] bg-[#f5f3f0] overflow-hidden group">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute inset-0 bg-black/60 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    {Array.from({ length: 7 - images.length }).map((_, i) => (
                                        <label
                                            key={i}
                                            htmlFor="images"
                                            className="aspect-square border border-dashed border-[#d0c5b5]/70 hover:border-[#C9A96E] flex items-center justify-center text-[10px] text-[#B5ADA3] hover:text-[#1b1c1a] cursor-pointer transition-colors"
                                        >
                                            +
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <label
                                    htmlFor="images"
                                    className="border border-dashed border-[#d0c5b5] hover:border-[#C9A96E] py-3.5 px-3 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-0.5 bg-[#f5f3f0]/40 hover:bg-[#f5f3f0]"
                                >
                                    <span className="text-xs text-[#1b1c1a] font-normal">Click to upload product images</span>
                                    <span className="text-[10px] text-[#7A6E63]">Up to 7 images</span>
                                </label>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2 shrink-0">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 cursor-pointer disabled:opacity-50"
                                style={{
                                    backgroundColor: '#1b1c1a',
                                    color: '#fbf9f6',
                                    fontFamily: "'Inter', sans-serif"
                                }}
                                onMouseEnter={e => {
                                    if (!loading) {
                                        e.currentTarget.style.backgroundColor = '#C9A96E';
                                        e.currentTarget.style.color = '#1b1c1a';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!loading) {
                                        e.currentTarget.style.backgroundColor = '#1b1c1a';
                                        e.currentTarget.style.color = '#fbf9f6';
                                    }
                                }}
                            >
                                {loading ? 'Creating...' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateProduct;

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Gift,
  Star,
  ChevronLeft,
  ChevronRight,
  Phone,
  CheckCircle,
  Eye,
  X,
  Share2
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { ProductPoster } from '../types';

interface FeaturedProductsSectionProps {
  onBackToHome: () => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  onBackToHome,
}) => {
  const { productsData, bankInfo } = contentData;
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [interestedProduct, setInterestedProduct] = useState<ProductPoster | null>(null);
  const [zoomPoster, setZoomPoster] = useState<ProductPoster | null>(null);

  const filteredPosters =
    selectedFilter === 'all'
      ? productsData.posters
      : productsData.posters.filter((p) => p.category === selectedFilter);

  const currentPoster = filteredPosters[activeIndex] || filteredPosters[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % filteredPosters.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + filteredPosters.length) % filteredPosters.length);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-[#003B70]" />
          <span>Quay lại màn hình chính</span>
        </button>

        <span className="text-xs font-medium text-slate-500">
          Chuyên mục: Sản phẩm dịch vụ nổi bật
        </span>
      </div>

      {/* Hero Header with distinctive VietinBank Red/Blue accent */}
      <div className="bg-gradient-to-r from-[#003B70] via-[#004B8D] to-[#ED1C24] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">
            <Gift className="w-4 h-4 text-amber-300" />
            <span className="uppercase tracking-wider">Ưu đãi & Tiện ích đặc quyền</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {productsData.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
            {productsData.description}
          </p>
        </div>
      </div>

      {/* Filter Chips (Exact requirement from PDF 5: Tất cả | Cá nhân | Hộ kinh doanh | Doanh nghiệp | Ưu đãi) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {productsData.categories.map((cat) => {
          const isActive = selectedFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedFilter(cat.id);
                setActiveIndex(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-[#003B70] text-white shadow-sm scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Carousel Mode Showcase (Recommended in PDF 5) */}
      {currentPoster && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Poster Image with Zoom */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative group max-w-sm w-full bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-md">
                <img
                  src={currentPoster.imageUrl}
                  alt={currentPoster.title}
                  className="w-full h-auto max-h-[460px] object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <button
                  onClick={() => setZoomPoster(currentPoster)}
                  className="absolute top-5 right-5 p-2 bg-black/60 hover:bg-black/80 text-white rounded-xl backdrop-blur-xs transition-all shadow-md opacity-80 group-hover:opacity-100"
                  title="Xem ảnh cỡ lớn"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <div className="mt-2 text-center text-[11px] text-slate-400 font-medium">
                  Poster {activeIndex + 1} / {filteredPosters.length} • Chạm để phóng to
                </div>
              </div>
            </div>

            {/* Poster Information & Actions */}
            <div className="w-full lg:w-1/2 space-y-5 text-left">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-red-100 text-[#ED1C24] border border-red-200">
                    {currentPoster.tag}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {currentPoster.categoryName}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {currentPoster.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {currentPoster.shortDescription}
                </p>
              </div>

              {/* Highlights bullets */}
              {currentPoster.highlights && (
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Đặc điểm nổi bật:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {currentPoster.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* "Tôi quan tâm" CTA Button (Strictly from PDF 5) */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => setInterestedProduct(currentPoster)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#ED1C24] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <Star className="w-4 h-4 fill-current text-yellow-300" />
                  <span>{productsData.interestButton}</span>
                </button>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={filteredPosters.length <= 1}
                    className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-30 transition-all"
                    title="Poster trước"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={filteredPosters.length <= 1}
                    className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-30 transition-all"
                    title="Poster kế tiếp"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vertical Mobile Card Grid (Also mentioned in PDF 5 as very suitable for mobile/touch) */}
      <div className="space-y-4 pt-4">
        <h3 className="text-base font-bold text-slate-900">
          Danh mục tất cả poster sản phẩm dịch vụ ({filteredPosters.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosters.map((poster, index) => (
            <div
              key={poster.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative bg-slate-50 p-4 border-b border-slate-100 flex justify-center">
                <img
                  src={poster.imageUrl}
                  alt={poster.title}
                  className="h-56 object-contain rounded-lg"
                />
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#003B70]">
                  {poster.tag}
                </span>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-left">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {poster.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {poster.shortDescription}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setInterestedProduct(poster)}
                    className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    {productsData.interestButton}
                  </button>
                  <button
                    onClick={() => setZoomPoster(poster)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600"
                    title="Xem ảnh"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Interest Modal Notification (Exact wording from PDF 5) */}
      {interestedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setInterestedProduct(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setInterestedProduct(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#ED1C24] flex items-center justify-center mx-auto shadow-xs">
              <Gift className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {interestedProduct.title}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                Thông báo tư vấn sản phẩm
              </h3>
            </div>

            {/* Exact notice text from PDF 5 */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed text-left space-y-2 font-medium">
              <p>
                Cảm ơn Quý khách đã quan tâm đến sản phẩm/dịch vụ này. Quý khách vui lòng liên hệ cán bộ VietinBank tại quầy để được tư vấn chi tiết.
              </p>
              <p className="font-bold text-[#003B70] pt-1 border-t border-slate-200">
                Hoặc liên hệ Chuyên viên tư vấn {bankInfo.advisor.name} - {bankInfo.advisor.phone}.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`tel:${bankInfo.advisor.rawPhone}`}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ED1C24] to-red-600 hover:from-red-600 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                <Phone className="w-4 h-4 animate-bounce" />
                <span>Gọi Chuyên viên tư vấn</span>
              </a>

              <button
                onClick={() => setInterestedProduct(null)}
                className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zoom Poster Modal */}
      {zoomPoster && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setZoomPoster(null)}
        >
          <div
            className="relative max-w-2xl max-h-[90vh] bg-white rounded-2xl p-4 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomPoster(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomPoster.imageUrl}
              alt={zoomPoster.title}
              className="w-auto h-auto max-h-[80vh] object-contain mx-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

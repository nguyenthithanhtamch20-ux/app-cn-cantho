import React, { useState } from 'react';
import {
  MapPin,
  ArrowLeft,
  Phone,
  Clock,
  ExternalLink,
  Search,
  Navigation,
  Building2,
  CheckCircle,
  X,
  Eye
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { BranchLocation } from '../types';

interface TransactionPointsSectionProps {
  onBackToHome: () => void;
}

export const TransactionPointsSection: React.FC<TransactionPointsSectionProps> = ({
  onBackToHome,
}) => {
  const { locationsData } = contentData;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [previewBranch, setPreviewBranch] = useState<BranchLocation | null>(null);

  const districts = ['all', 'Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Thốt Nốt', 'Phong Điền', 'Thới Lai'];

  const filteredBranches = locationsData.branches.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm);
    const matchesDistrict =
      selectedDistrict === 'all' || b.district.toLowerCase() === selectedDistrict.toLowerCase();
    return matchesSearch && matchesDistrict;
  });

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
          Chuyên mục: Mạng lưới điểm giao dịch
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#003B70] via-[#004B8D] to-[#00274D] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-cyan-200 border border-white/15">
            <MapPin className="w-4 h-4" />
            <span>Mạng Lưới Chi Nhánh & Phòng Giao Dịch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {locationsData.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {locationsData.subtitle}. Nhúng trực tiếp định vị Google Maps dẫn đường và hotline gọi điện ngay cho từng điểm giao dịch.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên phòng giao dịch, địa chỉ, số điện thoại..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:border-[#003B70] outline-hidden transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {districts.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDistrict(d)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedDistrict === d
                    ? 'bg-[#003B70] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d === 'all' ? 'Tất cả quận/huyện' : d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Branch Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBranches.map((item) => (
          <div
            key={item.stt}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
          >
            {/* Image Preview & Badge */}
            <div className="relative h-48 bg-slate-100 overflow-hidden group">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  // Fallback if image link is temporarily unavailable
                  (e.target as HTMLElement).style.opacity = '0.5';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#003B70] text-white shadow-md">
                  STT 0{item.stt}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-800">
                  {item.district}
                </span>
              </div>

              <button
                onClick={() => setPreviewBranch(item)}
                className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-xl backdrop-blur-xs transition-all opacity-80 group-hover:opacity-100"
                title="Xem ảnh chi tiết"
              >
                <Eye className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="text-base font-extrabold drop-shadow-sm">{item.name}</h3>
              </div>
            </div>

            {/* Information Body */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between text-left text-xs">
              <div className="space-y-3">
                {/* Address + Google Maps Link (PDF 4 specification) */}
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-slate-800 font-semibold leading-relaxed">
                      {item.address}
                    </p>
                    <a
                      href={item.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#003B70] font-bold mt-1 hover:underline text-[11px]"
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                      <span>Xem & Dẫn đường trên Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <Clock className="w-4 h-4 text-[#003B70] shrink-0 mt-0.5" />
                  <div className="space-y-1 text-slate-600">
                    <p>
                      <strong className="text-slate-800">Sáng:</strong> {item.workingHours.morning}
                    </p>
                    <p>
                      <strong className="text-slate-800">Chiều:</strong> {item.workingHours.afternoon}
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Call Button (PDF 4 specification: hotline bấm gọi được luôn) */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <span>Điện thoại:</span>
                  <span className="font-bold text-slate-800">{item.phone}</span>
                </div>

                <a
                  href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#003B70] to-blue-800 hover:from-blue-800 hover:to-[#003B70] text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                  <span>Bấm gọi ngay</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Branch Modal */}
      {previewBranch && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewBranch(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-4 overflow-hidden shadow-2xl relative space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">{previewBranch.name}</h3>
              <button
                onClick={() => setPreviewBranch(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={previewBranch.imageUrl}
              alt={previewBranch.name}
              className="w-full max-h-[60vh] object-contain rounded-2xl bg-slate-50"
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-600">{previewBranch.address}</span>
              <a
                href={previewBranch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-blue-700 hover:underline"
              >
                <span>Mở Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

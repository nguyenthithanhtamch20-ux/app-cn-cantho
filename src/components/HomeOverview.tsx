import React from 'react';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Award,
  PhoneCall,
  Clock,
  Gift
} from 'lucide-react';
import { ActiveModuleId } from '../types';
import contentData from '../data/contentData.json';

interface HomeOverviewProps {
  onSelectModule: (module: ActiveModuleId) => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({ onSelectModule }) => {
  const { bankInfo, modules } = contentData;

  const iconLookup: Record<string, React.ReactNode> = {
    HelpCircle: <HelpCircle className="w-6 h-6 text-blue-600" />,
    Smartphone: <Smartphone className="w-6 h-6 text-cyan-600" />,
    Gamepad2: <Gamepad2 className="w-6 h-6 text-amber-500" />,
    PiggyBank: <PiggyBank className="w-6 h-6 text-emerald-600" />,
    Calculator: <Calculator className="w-6 h-6 text-indigo-600" />,
    Sparkles: <Sparkles className="w-6 h-6 text-[#ED1C24]" />,
    MapPin: <MapPin className="w-6 h-6 text-sky-600" />,
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#003B70] via-[#00274D] to-[#001733] text-white p-6 sm:p-10 shadow-xl border border-blue-900/50">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-cyan-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Kiosk Tương Tác Quầy Giao Dịch • VietinBank Cần Thơ</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug">
            Kính chào Quý khách đến với <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-200">
              VietinBank Chi Nhánh Cần Thơ
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Hệ thống hỗ trợ tra cứu nhanh, tính toán khoản vay, lãi suất tiền gửi, hướng dẫn sử dụng iPay và trải nghiệm mini game nhận voucher xăng trong lúc chờ giao dịch.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
              <Clock className="w-4 h-4 text-cyan-300" />
              <span>Giờ GD: Sáng 8h-11h30 | Chiều 13h-16h30</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Chuẩn sinh trắc học QĐ 2345/QĐ-NHNN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 7 Module Cards */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Danh mục tiện ích tại quầy
            </h2>
            <p className="text-xs text-slate-500">
              Chạm vào tiện ích Quý khách muốn thao tác hoặc tìm hiểu
            </p>
          </div>
          <span className="text-xs font-bold text-[#003B70] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            7 Tính năng
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((item) => {
            const isHighlight = item.id === 'products';
            const isGame = item.id === 'game';

            return (
              <div
                key={item.id}
                onClick={() => onSelectModule(item.id as ActiveModuleId)}
                className={`group relative rounded-2xl p-6 transition-all duration-300 cursor-pointer text-left flex flex-col justify-between ${
                  isHighlight
                    ? 'bg-gradient-to-br from-white via-red-50/30 to-blue-50/40 border-2 border-[#ED1C24]/60 shadow-lg hover:shadow-2xl hover:border-[#ED1C24] ring-2 ring-red-500/10'
                    : isGame
                    ? 'bg-gradient-to-br from-amber-50/50 via-white to-red-50/40 border-2 border-amber-400/80 shadow-md hover:shadow-xl hover:border-amber-500'
                    : 'bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#003B70]/40'
                }`}
              >
                {/* Special Top Badges */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs ${
                      isHighlight
                        ? 'bg-red-100 text-[#ED1C24]'
                        : isGame
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-blue-50 text-[#003B70]'
                    }`}
                  >
                    {iconLookup[item.icon]}
                  </div>

                  {isHighlight ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#ED1C24] text-white shadow-xs">
                      <Gift className="w-3.5 h-3.5" />
                      Nổi Bật
                    </span>
                  ) : isGame ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500 text-white shadow-xs">
                      <Award className="w-3.5 h-3.5" />
                      Quà Xăng 2L
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      Mục 0{item.number}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2 mb-4">
                  <h3
                    className={`text-lg font-bold transition-colors ${
                      isHighlight
                        ? 'text-slate-900 group-hover:text-[#ED1C24]'
                        : 'text-slate-900 group-hover:text-[#003B70]'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.shortDesc}
                  </p>
                </div>

                {/* Action CTA */}
                <div
                  className={`pt-3 border-t flex items-center justify-between text-xs font-bold transition-colors ${
                    isHighlight
                      ? 'border-red-100 text-[#ED1C24]'
                      : isGame
                      ? 'border-amber-100 text-amber-700'
                      : 'border-slate-100 text-[#003B70]'
                  }`}
                >
                  <span>
                    {isHighlight
                      ? 'Khám phá sản phẩm'
                      : isGame
                      ? 'Bắt đầu chơi & nhận quà'
                      : 'Xem chi tiết'}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all group-hover:translate-x-1 ${
                      isHighlight
                        ? 'bg-[#ED1C24] text-white'
                        : isGame
                        ? 'bg-amber-500 text-white'
                        : 'bg-blue-50 text-[#003B70] group-hover:bg-[#003B70] group-hover:text-white'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advisor Support Card */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 border border-blue-200 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
        <div className="flex items-center gap-4 text-left">
          <div className="w-14 h-14 rounded-2xl bg-[#003B70] text-white flex items-center justify-center shrink-0 shadow-md">
            <PhoneCall className="w-7 h-7 text-cyan-300" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Hỗ trợ trực tiếp tại quầy giao dịch
            </span>
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Chuyên viên tư vấn: {bankInfo.advisor.name}
            </h4>
            <p className="text-xs text-slate-600">
              Quý khách cần giải đáp thêm hoặc tư vấn mở tài khoản, hồ sơ vay, xin vui lòng gọi ngay.
            </p>
          </div>
        </div>

        <a
          href={`tel:${bankInfo.advisor.rawPhone}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#003B70] to-blue-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
        >
          <PhoneCall className="w-4 h-4 text-cyan-300 animate-bounce" />
          <span>Gọi Hotline: {bankInfo.advisor.phone}</span>
        </a>
      </div>
    </div>
  );
};

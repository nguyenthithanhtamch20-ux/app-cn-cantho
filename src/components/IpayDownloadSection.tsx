import React from 'react';
import {
  Smartphone,
  Apple,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Zap,
  CreditCard,
  QrCode,
  ArrowLeft
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface IpayDownloadSectionProps {
  onBackToHome: () => void;
}

export const IpayDownloadSection: React.FC<IpayDownloadSectionProps> = ({ onBackToHome }) => {
  const { ipayData } = contentData;

  const iosQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    ipayData.iosLink
  )}`;
  const androidQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    ipayData.androidLink
  )}`;

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
          Chuyên mục: Tải ứng dụng VietinBank iPay
        </span>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-br from-[#003B70] via-[#004B8D] to-[#00274D] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-cyan-200 border border-white/15">
            <Smartphone className="w-4 h-4" />
            <span>VietinBank iPay Mobile v5.0+</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {ipayData.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            {ipayData.subtitle}. Mở tài khoản trực tuyến qua eKYC chỉ trong 1 phút, miễn phí 100% chuyển tiền và trải nghiệm hệ sinh thái thanh toán số vượt trội.
          </p>
        </div>
      </div>

      {/* 2 Download Cards with QR Codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* iOS Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                  <Apple className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Apple iOS</h3>
                  <p className="text-xs text-slate-500">Dành cho iPhone & iPad</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                App Store
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Quý khách mở camera điện thoại iPhone và quét mã QR bên dưới để tải trực tiếp trên App Store:
            </p>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2">
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100">
                <img
                  src={iosQrUrl}
                  alt="QR Code Tải iPay iOS"
                  className="w-44 h-44 object-contain"
                />
              </div>
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5" /> Quét mã bằng camera iPhone
              </span>
            </div>
          </div>

          <a
            href={ipayData.iosLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
          >
            <Apple className="w-4 h-4" />
            <span>Mở liên kết trên App Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Android Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Android</h3>
                  <p className="text-xs text-slate-500">Samsung, Xiaomi, Oppo...</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Google Play
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Quý khách mở ứng dụng Zalo, Máy ảnh hoặc Google Lens quét mã QR bên dưới để tải trên CH Play:
            </p>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2">
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100">
                <img
                  src={androidQrUrl}
                  alt="QR Code Tải iPay Android"
                  className="w-44 h-44 object-contain"
                />
              </div>
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5" /> Quét mã bằng camera điện thoại
              </span>
            </div>
          </div>

          <a
            href={ipayData.androidLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
          >
            <Smartphone className="w-4 h-4" />
            <span>Mở liên kết trên Google Play</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <h3 className="text-lg font-bold text-slate-900">
          Ưu điểm vượt trội của VietinBank iPay Mobile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ipayData.features.map((feat, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-[#003B70] text-white flex items-center justify-center shadow-xs">
                {i === 0 ? (
                  <Zap className="w-5 h-5 text-cyan-300" />
                ) : i === 1 ? (
                  <CheckCircle className="w-5 h-5 text-emerald-300" />
                ) : i === 2 ? (
                  <ShieldCheck className="w-5 h-5 text-yellow-300" />
                ) : (
                  <CreditCard className="w-5 h-5 text-rose-300" />
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900">{feat.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

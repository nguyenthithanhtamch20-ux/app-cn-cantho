import React from 'react';
import { Phone, ShieldCheck, MapPin, ExternalLink, Heart } from 'lucide-react';
import contentData from '../data/contentData.json';
import { ActiveModuleId } from '../types';

interface FooterProps {
  onNavigate: (module: ActiveModuleId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { bankInfo } = contentData;

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1 text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#003B70] text-white flex items-center justify-center font-black text-sm">
                V
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                VietinBank
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Ngân hàng TMCP Công Thương Việt Nam - {bankInfo.branch}. Ứng dụng số hoá trải nghiệm khách hàng tại quầy giao dịch.
            </p>
            <div className="flex items-center gap-2 text-slate-300 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>An toàn • Bảo mật • Vượt trội</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-left">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Danh mục tiện ích
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Giải đáp thắc mắc khách hàng
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ipay')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Tải App VietinBank iPay Mobile
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('savings')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Tính lãi tiền gửi tiết kiệm
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('loans')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Lịch trả nợ khoản vay (Dư nợ giảm dần)
                </button>
              </li>
            </ul>
          </div>

          {/* More Links */}
          <div className="space-y-3 text-left">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Dịch vụ & Game
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-cyan-300 transition-colors text-red-400 font-semibold"
                >
                  Sản phẩm dịch vụ nổi bật (Hot)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('game')}
                  className="hover:text-cyan-300 transition-colors text-amber-300 font-semibold"
                >
                  Thử thách Game săn voucher xăng 2L
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('locations')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Điểm giao dịch Cần Thơ & Google Maps
                </button>
              </li>
            </ul>
          </div>

          {/* Counter Support & Hotline */}
          <div className="space-y-3 text-left bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Hỗ trợ quầy giao dịch
            </h4>
            <p className="text-[11px] text-slate-300">
              Chuyên viên: <strong className="text-white">{bankInfo.advisor.name}</strong>
            </p>
            <a
              href={`tel:${bankInfo.advisor.rawPhone}`}
              className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#ED1C24] to-red-600 text-white font-bold rounded-xl text-xs shadow-xs hover:shadow-md transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hotline: {bankInfo.advisor.phone}</span>
            </a>
            <p className="text-[10px] text-slate-400 pt-1">
              Tổng đài VietinBank 24/7: 1900 558 868
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 Ngân hàng TMCP Công Thương Việt Nam (VietinBank). All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Đồng hành cùng phát triển</span>
            <span>•</span>
            <span className="text-cyan-400">VietinBank Cần Thơ</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

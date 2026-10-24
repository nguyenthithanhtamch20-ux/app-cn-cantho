import React, { useState } from 'react';
import { Phone, UserCheck, ShieldCheck, Home } from 'lucide-react';
import contentData from '../data/contentData.json';
import { ActiveModuleId } from '../types';

interface HeaderProps {
  activeModule: ActiveModuleId;
  onNavigate: (module: ActiveModuleId) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeModule, onNavigate }) => {
  const [logoError, setLogoError] = useState(false);
  const { bankInfo } = contentData;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branch */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="h-12 w-auto max-w-[200px] flex items-center justify-center overflow-hidden rounded-lg">
              {!logoError ? (
                <img
                  src={bankInfo.logoUrl}
                  alt="VietinBank"
                  onError={() => setLogoError(true)}
                  className="h-11 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex items-center gap-2 bg-[#003B70] text-white px-3 py-1.5 rounded-lg shadow-sm">
                  <div className="w-8 h-8 rounded-md bg-[#ED1C24] flex items-center justify-center font-black text-lg">
                    V
                  </div>
                  <div className="leading-tight text-left">
                    <span className="font-extrabold tracking-tight text-sm block">VietinBank</span>
                    <span className="text-[10px] text-cyan-200 uppercase font-medium">Nâng giá trị cuộc sống</span>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:block border-l border-slate-200 pl-3.5">
              <span className="text-xs font-bold text-[#003B70] uppercase tracking-wider block">
                {bankInfo.branch}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Tương tác Quầy Giao Dịch Thông Minh
              </span>
            </div>
          </div>

          {/* Quick Actions & Advisor */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {activeModule !== 'home' && (
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#003B70] hover:bg-slate-100 rounded-xl transition-all"
              >
                <Home className="w-4 h-4 text-[#003B70]" />
                <span className="hidden md:inline">Trang chủ</span>
              </button>
            )}

            {/* Officer Direct Contact Badge */}
            <a
              href={`tel:${bankInfo.advisor.rawPhone}`}
              className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl hover:shadow-xs transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-[#003B70] text-white flex items-center justify-center shadow-xs">
                <UserCheck className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="text-left text-xs leading-tight">
                <p className="text-slate-500 font-medium text-[10px]">Tư vấn tại quầy</p>
                <p className="font-bold text-[#003B70]">{bankInfo.advisor.name} - {bankInfo.advisor.phone}</p>
              </div>
            </a>

            {/* Quick Hotline Call Button */}
            <a
              href={`tel:${bankInfo.advisor.rawPhone}`}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#ED1C24] to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 text-xs font-bold"
              title="Gọi hỗ trợ trực tiếp tại quầy"
            >
              <Phone className="w-3.5 h-3.5 animate-pulse" />
              <span>Hotline Quầy: {bankInfo.advisor.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

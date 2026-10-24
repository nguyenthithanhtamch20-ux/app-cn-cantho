import React from 'react';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
  LayoutGrid
} from 'lucide-react';
import { ActiveModuleId } from '../types';
import contentData from '../data/contentData.json';

interface NavigationTabsProps {
  activeModule: ActiveModuleId;
  onSelect: (module: ActiveModuleId) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  faq: <HelpCircle className="w-4 h-4" />,
  ipay: <Smartphone className="w-4 h-4" />,
  game: <Gamepad2 className="w-4 h-4" />,
  savings: <PiggyBank className="w-4 h-4" />,
  loans: <Calculator className="w-4 h-4" />,
  products: <Sparkles className="w-4 h-4" />,
  locations: <MapPin className="w-4 h-4" />,
};

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeModule, onSelect }) => {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2.5">
          {/* Home button */}
          <button
            onClick={() => onSelect('home')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeModule === 'home'
                ? 'bg-[#003B70] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Tất cả dịch vụ</span>
          </button>

          {/* 7 Modules */}
          {contentData.modules.map((m) => {
            const isActive = activeModule === m.id;
            const isHighlight = m.id === 'products';
            const isGame = m.id === 'game';

            return (
              <button
                key={m.id}
                onClick={() => onSelect(m.id as ActiveModuleId)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#003B70] text-white shadow-xs'
                    : isHighlight
                    ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                    : isGame
                    ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className={isActive ? 'text-cyan-300' : isHighlight ? 'text-[#ED1C24]' : isGame ? 'text-amber-600' : 'text-[#003B70]'}>
                  {iconMap[m.id]}
                </span>
                <span>{m.title}</span>

                {isHighlight && (
                  <span className="ml-1 text-[9px] bg-[#ED1C24] text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold animate-pulse">
                    Hot
                  </span>
                )}
                {isGame && (
                  <span className="ml-1 text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                    Quà 2L
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

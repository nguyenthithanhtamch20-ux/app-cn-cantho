import React, { useState } from 'react';
import {
  PiggyBank,
  ArrowLeft,
  Video,
  ExternalLink,
  Info,
  TrendingUp,
  Percent,
  Calendar,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { formatCurrencyVND, formatNumberWithCommas, parseNumberInput } from '../utils/formatters';

interface SavingsCalculatorSectionProps {
  onBackToHome: () => void;
}

export const SavingsCalculatorSection: React.FC<SavingsCalculatorSectionProps> = ({
  onBackToHome,
}) => {
  const { savingsData } = contentData;
  const [depositInput, setDepositInput] = useState<string>('100000000');
  const [selectedMonths, setSelectedMonths] = useState<number>(12);
  const [rateInput, setRateInput] = useState<string>('5.0');
  const [errorMessage, setErrorMessage] = useState<{
    amount?: string;
    term?: string;
    rate?: string;
  }>({});

  const depositAmount = parseNumberInput(depositInput);
  const interestRate = parseFloat(rateInput) || 0;

  // Change term handler
  const handleTermChange = (months: number) => {
    setSelectedMonths(months);
    const found = savingsData.termRates.find((t) => t.months === months);
    if (found) {
      setRateInput(found.rate.toString());
    }
  };

  // Calculations for regular savings (trả lãi sau):
  // Lãi = (Số tiền gửi * Lãi suất %/năm * Kỳ hạn tháng) / 12
  const calculateInterest = () => {
    if (depositAmount <= 0 || interestRate < 0 || selectedMonths <= 0) return 0;
    return (depositAmount * (interestRate / 100) * selectedMonths) / 12;
  };

  const estimatedInterest = Math.round(calculateInterest());
  const totalReceived = depositAmount + estimatedInterest;

  // Validation
  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const clean = raw.replace(/[^0-9]/g, '');
    setDepositInput(clean);

    const val = parseInt(clean, 10);
    if (!clean || isNaN(val) || val <= 0) {
      setErrorMessage((prev) => ({
        ...prev,
        amount: savingsData.rules.depositAmount.error,
      }));
    } else {
      setErrorMessage((prev) => ({ ...prev, amount: undefined }));
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRateInput(val);
    const num = parseFloat(val);
    if (val === '' || isNaN(num) || num < 0 || num > 20) {
      setErrorMessage((prev) => ({
        ...prev,
        rate: savingsData.rules.interestRate.error,
      }));
    } else {
      setErrorMessage((prev) => ({ ...prev, rate: undefined }));
    }
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
          Chuyên mục: Tính lãi suất tiền gửi
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#003B70] via-[#004B8D] to-[#00274D] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-cyan-200 border border-white/15">
            <PiggyBank className="w-4 h-4" />
            <span>Tiết Kiệm Sinh Lời An Toàn</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {savingsData.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-200">
            {savingsData.subtitle}. Lãi suất hấp dẫn, bảo mật tuyệt đối tại ngân hàng thương mại nhà nước hàng đầu Việt Nam.
          </p>
        </div>

        {/* Video Tutorial Button from PDF 2 */}
        <a
          href={savingsData.videoGuideUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-bold shadow-md transition-all shrink-0 active:scale-95 hover:scale-105"
        >
          <Video className="w-4 h-4 fill-current" />
          <span>Video hướng dẫn gửi tiết kiệm</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form (PDF 2 UI Specification) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Tiền gửi dự tính</span>
            <span className="text-xs font-normal text-slate-500">Kỳ trả lãi sau</span>
          </h3>

          {/* Deposit Amount Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {savingsData.rules.depositAmount.label} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={formatNumberWithCommas(depositInput)}
                onChange={handleDepositChange}
                placeholder={savingsData.rules.depositAmount.placeholder}
                className={`w-full px-4 py-3.5 pr-14 text-base sm:text-lg font-bold rounded-2xl border ${
                  errorMessage.amount
                    ? 'border-red-500 bg-red-50/30 ring-2 ring-red-200'
                    : 'border-slate-300 focus:border-[#003B70] focus:ring-2 focus:ring-blue-100'
                } transition-all outline-hidden`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>
            {errorMessage.amount && (
              <p className="text-xs text-red-600 font-medium">{errorMessage.amount}</p>
            )}

            {/* Quick quick select buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[50000000, 100000000, 200000000, 500000000, 1000000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setDepositInput(amt.toString());
                    setErrorMessage((prev) => ({ ...prev, amount: undefined }));
                  }}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                    depositAmount === amt
                      ? 'bg-blue-50 text-[#003B70] border-blue-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {amt >= 1000000000 ? `${amt / 1000000000} Tỷ` : `${amt / 1000000} Triệu`}
                </button>
              ))}
            </div>
          </div>

          {/* Term Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {savingsData.rules.term.label} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {savingsData.termRates.map((term) => (
                <button
                  key={term.months}
                  type="button"
                  onClick={() => handleTermChange(term.months)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedMonths === term.months
                      ? 'bg-[#003B70] text-white border-[#003B70] shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <p className="text-xs font-bold">{term.label}</p>
                  <p
                    className={`text-[10px] font-medium ${
                      selectedMonths === term.months ? 'text-cyan-200' : 'text-slate-500'
                    }`}
                  >
                    {term.rate}%/năm
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {savingsData.rules.interestRate.label} <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500">Có thể tùy chỉnh theo thoả thuận</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                min="0"
                max="20"
                value={rateInput}
                onChange={handleRateChange}
                placeholder="5.0"
                className={`w-full px-4 py-3.5 pr-16 text-base font-bold rounded-2xl border ${
                  errorMessage.rate
                    ? 'border-red-500 bg-red-50/30'
                    : 'border-slate-300 focus:border-[#003B70]'
                } outline-hidden transition-all`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                %/năm
              </span>
            </div>
            {errorMessage.rate && (
              <p className="text-xs text-red-600 font-medium">{errorMessage.rate}</p>
            )}
          </div>
        </div>

        {/* Output Results Panel (PDF 2 UI Specification) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-[#00274D] to-[#001733] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="border-b border-white/15 pb-4">
              <span className="text-xs text-cyan-300 uppercase tracking-wider font-bold">
                Tiền lãi dự tính
              </span>
              <h3 className="text-xl font-bold mt-1 text-white">Kết quả tính toán</h3>
            </div>

            {/* Interest Profit */}
            <div className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-1">
              <span className="text-xs text-slate-300 font-medium">Số tiền lãi dự tính</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {formatCurrencyVND(estimatedInterest)}
              </div>
              <p className="text-[11px] text-slate-300">
                Nhận vào ngày đáo hạn ({selectedMonths} tháng)
              </p>
            </div>

            {/* Total Balance at Maturity */}
            <div className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-1">
              <span className="text-xs text-slate-300 font-medium">
                Tổng tiền nhận được (Gốc + Lãi)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300">
                {formatCurrencyVND(totalReceived)}
              </div>
              <p className="text-[11px] text-slate-300">
                Tiền gốc ban đầu: {formatCurrencyVND(depositAmount)}
              </p>
            </div>
          </div>

          {/* Quick tips & guarantee */}
          <div className="border-t border-white/15 pt-4 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bảo hiểm tiền gửi theo quy định của Ngân hàng Nhà nước</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-300 shrink-0" />
              <span>Gửi online trên iPay nhận thêm ưu đãi lãi suất +0.1% - 0.2%/năm</span>
            </div>
          </div>
        </div>
      </div>

      {/* VietinBank Interest Rate Reference Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Bảng lãi suất tiền gửi tiết kiệm VietinBank tham khảo
          </h3>
          <span className="text-xs text-slate-500 font-medium">Đơn vị: %/năm</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="py-3 px-4 font-bold">Kỳ hạn</th>
                <th className="py-3 px-4 font-bold">Tại quầy giao dịch</th>
                <th className="py-3 px-4 font-bold text-[#003B70]">Online qua iPay</th>
                <th className="py-3 px-4 font-bold">Hình thức lĩnh lãi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {savingsData.termRates.map((t) => (
                <tr key={t.months} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800">{t.label}</td>
                  <td className="py-3 px-4 font-semibold">{t.rate.toFixed(2)}%</td>
                  <td className="py-3 px-4 font-bold text-[#003B70]">{(t.rate + 0.15).toFixed(2)}%</td>
                  <td className="py-3 px-4">Cuối kỳ (Trả sau)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-400 italic">
          * Lãi suất trên chỉ mang tính chất tham khảo tại thời điểm tra cứu. Để có mức lãi suất chính xác và ưu đãi lớn nhất cho khoản tiền gửi của Quý khách, vui lòng liên hệ giao dịch viên tại quầy.
        </p>
      </div>
    </div>
  );
};

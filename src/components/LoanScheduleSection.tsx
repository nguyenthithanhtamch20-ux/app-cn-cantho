import React, { useState } from 'react';
import {
  Calculator,
  ArrowLeft,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  TrendingDown,
  Info,
  Calendar,
  DollarSign,
  X,
  CheckCircle2,
  Percent
} from 'lucide-react';
import contentData from '../data/contentData.json';
import {
  formatCurrencyVND,
  formatNumberWithCommas,
  parseNumberInput,
  calculateLoanSchedule,
  formatDateVN,
  parseDateString
} from '../utils/formatters';
import { LoanScheduleRow } from '../types';

interface LoanScheduleSectionProps {
  onBackToHome: () => void;
}

export const LoanScheduleSection: React.FC<LoanScheduleSectionProps> = ({ onBackToHome }) => {
  const { loansData } = contentData;

  // State with sensible defaults matching bank practices
  const [collateralInput, setCollateralInput] = useState<string>('1500000000');
  const [loanAmountInput, setLoanAmountInput] = useState<string>('500000000');
  const [termMonthsInput, setTermMonthsInput] = useState<number>(36);
  const [interestRateInput, setInterestRateInput] = useState<string>('8.0');
  const [disbursementDate, setDisbursementDate] = useState<string>('2026-10-24');
  const [paymentCycle, setPaymentCycle] = useState<'monthly' | 'quarterly' | 'semi-annually' | 'annually'>('monthly');
  const [paymentDayOfMonth, setPaymentDayOfMonth] = useState<number>(25);
  const [roundTo1000, setRoundTo1000] = useState<boolean>(true);

  // Modal detail
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Parse values
  const loanAmount = parseNumberInput(loanAmountInput);
  const collateralValue = parseNumberInput(collateralInput);
  const annualRate = parseFloat(interestRateInput) || 0;

  // Calculation results
  const result = calculateLoanSchedule({
    loanAmount,
    termMonths: termMonthsInput,
    annualInterestRate: annualRate,
    startDateStr: disbursementDate,
    paymentCycle,
    paymentDay: paymentDayOfMonth,
    roundTo1000,
  });

  const handlePrint = () => {
    window.print();
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
          Chuyên mục: Lịch trả nợ khoản vay
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#003B70] via-[#004B8D] to-[#00274D] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-cyan-200 border border-white/15">
            <Calculator className="w-4 h-4" />
            <span>Phương thức Dư Nợ Giảm Dần</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {loansData.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-200">
            {loansData.subtitle}. Lãi suất tính trên số dư gốc thực tế còn lại, giúp Quý khách tiết kiệm tổng chi phí lãi vay và chủ động kế hoạch tài chính.
          </p>
        </div>
      </div>

      {/* Main Grid: Form Input & Summary Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (Strictly NO SLIDER for loan amount per PDF 3) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Thông tin khoản vay</span>
            <span className="text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full font-semibold">
              Nhập trực tiếp
            </span>
          </h3>

          {/* Collateral Value (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Giá trị tài sản bảo đảm (VND)
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={formatNumberWithCommas(collateralInput)}
                onChange={(e) => setCollateralInput(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Ví dụ: 1,500,000,000"
                className="w-full px-4 py-3 pr-14 text-sm font-semibold rounded-2xl border border-slate-300 focus:border-[#003B70] focus:ring-2 focus:ring-blue-100 transition-all outline-hidden"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>
          </div>

          {/* Loan Amount Input (Strictly Input, NO slider as requested) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Số tiền vay <span className="text-red-500">*</span>
              </label>
              {collateralValue > 0 && (
                <span className="text-[11px] text-slate-500">
                  Tỷ lệ vay / TSBĐ: {((loanAmount / collateralValue) * 100).toFixed(1)}%
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={formatNumberWithCommas(loanAmountInput)}
                onChange={(e) => setLoanAmountInput(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Nhập số tiền vay (VND)"
                className="w-full px-4 py-3.5 pr-14 text-base sm:text-lg font-extrabold rounded-2xl border-2 border-blue-200 focus:border-[#003B70] focus:ring-2 focus:ring-blue-100 transition-all outline-hidden text-[#003B70]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#003B70]">
                VND
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[100000000, 200000000, 500000000, 1000000000, 2000000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setLoanAmountInput(amt.toString())}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${
                    loanAmount === amt
                      ? 'bg-blue-50 text-[#003B70] border-blue-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {amt >= 1000000000 ? `${amt / 1000000000} Tỷ` : `${amt / 1000000} Triệu`}
                </button>
              ))}
            </div>
          </div>

          {/* Loan Term & Interest Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Thời gian vay (Tháng) <span className="text-red-500">*</span>
              </label>
              <select
                value={termMonthsInput}
                onChange={(e) => setTermMonthsInput(Number(e.target.value))}
                className="w-full px-4 py-3 text-sm font-semibold rounded-2xl border border-slate-300 focus:border-[#003B70] bg-white transition-all outline-hidden cursor-pointer"
              >
                <option value={12}>12 Tháng (1 năm)</option>
                <option value={24}>24 Tháng (2 năm)</option>
                <option value={36}>36 Tháng (3 năm)</option>
                <option value={48}>48 Tháng (4 năm)</option>
                <option value={60}>60 Tháng (5 năm)</option>
                <option value={84}>84 Tháng (7 năm)</option>
                <option value={120}>120 Tháng (10 năm)</option>
                <option value={180}>180 Tháng (15 năm)</option>
                <option value={240}>240 Tháng (20 năm)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Lãi suất (%/Năm) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="25"
                  value={interestRateInput}
                  onChange={(e) => setInterestRateInput(e.target.value)}
                  className="w-full px-4 py-3 pr-14 text-sm font-semibold rounded-2xl border border-slate-300 focus:border-[#003B70] transition-all outline-hidden"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  %/Năm
                </span>
              </div>
            </div>
          </div>

          {/* Disbursement Date, Payment Cycle & Payment Day */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Ngày giải ngân
              </label>
              <input
                type="date"
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:border-[#003B70] bg-white outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Chu kỳ trả nợ
              </label>
              <select
                value={paymentCycle}
                onChange={(e) => setPaymentCycle(e.target.value as any)}
                className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:border-[#003B70] bg-white outline-hidden cursor-pointer"
              >
                <option value="monthly">Hằng tháng (/12)</option>
                <option value="quarterly">Hằng quý (/4)</option>
                <option value="semi-annually">6 Tháng (/2)</option>
                <option value="annually">Hằng năm (/1)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Ngày trả định kỳ
              </label>
              <select
                value={paymentDayOfMonth}
                onChange={(e) => setPaymentDayOfMonth(Number(e.target.value))}
                className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:border-[#003B70] bg-white outline-hidden cursor-pointer"
              >
                {[5, 10, 15, 20, 25, 28].map((d) => (
                  <option key={d} value={d}>
                    Ngày {d} hàng kỳ
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rounding Rule (PDF 3 section 2.3) */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="round1000"
                checked={roundTo1000}
                onChange={(e) => setRoundTo1000(e.target.checked)}
                className="w-4 h-4 text-[#003B70] rounded-sm focus:ring-[#003B70]"
              />
              <label htmlFor="round1000" className="text-xs text-slate-700 font-medium cursor-pointer">
                Làm tròn số đến 1.000 đồng (sai lệch điều chỉnh vào kỳ cuối)
              </label>
            </div>
            <span className="text-[11px] text-slate-400">Chuẩn nghiệp vụ VietinBank</span>
          </div>
        </div>

        {/* Summary Card (Visual specification matching PDF 3 page 1) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#00274D] via-[#003B70] to-[#001733] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div>
                <span className="text-xs text-cyan-300 uppercase tracking-wider font-bold">
                  Bảng ước tính nợ trả
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">Dư nợ giảm dần</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-lg">
                $
              </div>
            </div>

            {/* Monthly Range: Từ X đến Y */}
            <div className="bg-white/10 rounded-2xl p-4 sm:p-5 border border-white/10 space-y-2">
              <span className="text-xs text-slate-300 font-medium">Số tiền trả hàng tháng</span>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <span className="text-[11px] text-cyan-300 block">Kỳ đầu (cao nhất)</span>
                  <span className="text-lg sm:text-xl font-extrabold text-white">
                    {formatCurrencyVND(result.firstPeriodPayment)}
                  </span>
                </div>
                <span className="hidden sm:inline text-slate-400 font-medium">đến</span>
                <div>
                  <span className="text-[11px] text-emerald-300 block">Kỳ cuối (thấp nhất)</span>
                  <span className="text-lg sm:text-xl font-extrabold text-emerald-300">
                    {formatCurrencyVND(result.lastPeriodPayment)}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Interest & Total Repayment */}
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/10 text-xs">
                <span className="text-slate-300">Tổng lãi phải trả:</span>
                <span className="font-extrabold text-amber-300 text-sm">
                  {formatCurrencyVND(result.totalInterest)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10 text-xs">
                <span className="text-slate-300">Tổng gốc phải trả:</span>
                <span className="font-bold text-white text-sm">
                  {formatCurrencyVND(result.totalPrincipal)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 text-xs">
                <span className="text-slate-200 font-bold">Tổng gốc + Lãi:</span>
                <span className="font-extrabold text-cyan-300 text-base">
                  {formatCurrencyVND(result.totalPayment)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button: "Xem chi tiết" (Required in PDF 3) */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setShowDetailModal(true)}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-[#ED1C24] to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xem chi tiết lịch trả nợ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <p className="text-center text-[10px] text-slate-300">
              Xem toàn bộ bảng tính từng kỳ & xuất file / in trực tiếp
            </p>
          </div>
        </div>
      </div>

      {/* Principles Explanation from PDF 3 */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4 text-left">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-[#003B70]" />
          <span>Nguyên tắc & Công thức tính nghiệp vụ (Chuẩn VietinBank)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
            <p className="font-bold text-slate-800">1. Công thức tính từng kỳ:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Gốc trả mỗi kỳ = Số tiền vay / Tổng số kỳ trả nợ</li>
              <li>Lãi kỳ hiện tại = Dư nợ đầu kỳ × Lãi suất kỳ</li>
              <li>Tổng tiền trả kỳ = Gốc kỳ + Lãi kỳ</li>
            </ul>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
            <p className="font-bold text-slate-800">2. Quy đổi lãi suất & Ngày trả:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Hằng tháng: Lãi suất năm / 12 (Ví dụ: 12%/năm → 1%/tháng)</li>
              <li>Hằng quý: Lãi suất năm / 4 | 6 tháng: Lãi suất năm / 2</li>
              <li>Ngày trả nợ tự động sinh theo ngày định kỳ đã chọn ({paymentDayOfMonth} hàng kỳ)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Detailed Modal: "Bảng tính lịch trả nợ với dư nợ giảm dần" (PDF 3 Page 1 Bước 2) */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#003B70] to-[#00274D] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold">
                  Bảng tính lịch trả nợ với dư nợ giảm dần
                </h3>
                <p className="text-xs text-cyan-200">
                  Số tiền vay: {formatCurrencyVND(loanAmount)} • Thời gian: {termMonthsInput} tháng • Lãi suất: {annualRate}%/năm
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-all"
                  title="In bảng lịch trả nợ"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">In lịch</span>
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Table Content (Exact columns from PDF 3 page 1) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 print:p-0">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-slate-700 shadow-xs">
                  <tr>
                    <th className="py-3 px-3 font-bold text-center">STT</th>
                    <th className="py-3 px-3 font-bold">KỲ TRẢ NỢ</th>
                    <th className="py-3 px-3 font-bold text-right">SỐ GỐC CÒN LẠI</th>
                    <th className="py-3 px-3 font-bold text-right">GỐC</th>
                    <th className="py-3 px-3 font-bold text-right">LÃI</th>
                    <th className="py-3 px-3 font-bold text-right">TỔNG GỐC + LÃI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Period 0: Disbursement */}
                  <tr className="bg-blue-50/40 font-semibold text-slate-700">
                    <td className="py-2.5 px-3 text-center">0</td>
                    <td className="py-2.5 px-3">{formatDateVN(parseDateString(disbursementDate))} (Giải ngân)</td>
                    <td className="py-2.5 px-3 text-right">{formatCurrencyVND(loanAmount)}</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                  </tr>

                  {/* Scheduled Periods */}
                  {result.schedule.map((row) => (
                    <tr key={row.period} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 text-center font-medium text-slate-500">
                        {row.period}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {row.paymentDate}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-600">
                        {formatCurrencyVND(row.startingBalance)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-800">
                        {formatCurrencyVND(row.principal)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-amber-700 font-semibold">
                        {formatCurrencyVND(row.interest)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#003B70]">
                        {formatCurrencyVND(row.totalPayment)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Total Row matching PDF 3 page 1 */}
                <tfoot>
                  <tr className="bg-slate-800 text-white font-extrabold border-t-2 border-slate-900">
                    <td className="py-3.5 px-3 uppercase text-center font-black" colSpan={2}>
                      TỔNG
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-300">-</td>
                    <td className="py-3.5 px-3 text-right text-cyan-300">
                      {formatCurrencyVND(result.totalPrincipal)}
                    </td>
                    <td className="py-3.5 px-3 text-right text-amber-300">
                      {formatCurrencyVND(result.totalInterest)}
                    </td>
                    <td className="py-3.5 px-3 text-right text-emerald-400 text-sm">
                      {formatCurrencyVND(result.totalPayment)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                * Bảng tính mang tính chất tham khảo. Vui lòng liên hệ cán bộ tín dụng tại quầy để được thẩm định chi tiết.
              </span>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2 bg-[#003B70] text-white text-xs font-bold rounded-xl hover:bg-blue-800 transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

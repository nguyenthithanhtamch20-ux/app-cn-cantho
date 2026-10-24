import React, { useState } from 'react';
import {
  HelpCircle,
  KeyRound,
  CreditCard,
  ScanFace,
  Receipt,
  CalendarDays,
  ExternalLink,
  Youtube,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Phone,
  Smile,
  X,
  Maximize2
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { FaqItem, FaqStep } from '../types';

interface FaqSectionProps {
  onBackToHome: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onBackToHome }) => {
  const { faqData, bankInfo } = contentData;
  const [selectedItem, setSelectedItem] = useState<FaqItem | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'success' | 'need_support' | 'ended'>('idle');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const getFaqIcon = (id: string) => {
    switch (id) {
      case 'forgot-password':
        return <KeyRound className="w-6 h-6 text-blue-600" />;
      case 'close-card':
        return <CreditCard className="w-6 h-6 text-red-600" />;
      case 'biometrics':
        return <ScanFace className="w-6 h-6 text-indigo-600" />;
      case 'e-tax':
        return <Receipt className="w-6 h-6 text-emerald-600" />;
      case 'book-appointment':
        return <CalendarDays className="w-6 h-6 text-cyan-600" />;
      default:
        return <HelpCircle className="w-6 h-6 text-blue-600" />;
    }
  };

  const handleSelectFaq = (item: any) => {
    setSelectedItem(item);
    setCurrentStepIndex(0);
    setFeedbackStatus('idle');
  };

  const handleBackToMenu = () => {
    setSelectedItem(null);
    setCurrentStepIndex(0);
    setFeedbackStatus('idle');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Breadcrumb / Top Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={selectedItem ? handleBackToMenu : onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-[#003B70]" />
          <span>{selectedItem ? 'Quay lại danh mục câu hỏi' : 'Quay lại màn hình chính'}</span>
        </button>

        <span className="text-xs font-medium text-slate-500">
          Chuyên mục: Giải đáp thắc mắc khách hàng
        </span>
      </div>

      {/* View 1: Main Category Selection */}
      {!selectedItem && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Hỗ trợ thao tác trực tuyến</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {faqData.question}
            </h2>
            <p className="text-sm text-slate-600">
              Chọn nội dung bên dưới để xem hướng dẫn chi tiết từng bước có hình ảnh minh hoạ & video YouTube hướng dẫn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {faqData.categories.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleSelectFaq(item)}
                className="group relative bg-white border border-slate-200/90 hover:border-[#003B70] rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-xl cursor-pointer text-left flex items-start gap-4"
              >
                <div className="w-13 h-13 rounded-2xl bg-blue-50 group-hover:bg-[#003B70] transition-colors flex items-center justify-center shrink-0">
                  <span className="group-hover:text-white transition-colors">
                    {getFaqIcon(item.id)}
                  </span>
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      Mục 0{index + 1} • {item.steps.length} bước
                    </span>
                    <span className="text-xs text-slate-400 group-hover:text-[#003B70] font-semibold group-hover:translate-x-1 transition-all">
                      Xem ngay →
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#003B70] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 2: Step-by-Step Guide for Selected Topic */}
      {selectedItem && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header of Detail */}
          <div className="bg-gradient-to-r from-[#003B70] via-[#004B8D] to-[#003B70] text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-cyan-200 tracking-wider uppercase">
                  Hướng dẫn chi tiết
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {selectedItem.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200">
                  {selectedItem.desc}
                </p>
              </div>

              {selectedItem.videoUrl && (
                <a
                  href={selectedItem.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition-all shrink-0 hover:scale-105 active:scale-95"
                >
                  <Youtube className="w-4 h-4 fill-current" />
                  <span>Xem video trên YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Step navigation dots / tabs */}
            <div className="mt-6 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
              {selectedItem.steps.map((st, idx) => (
                <button
                  key={st.step}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    currentStepIndex === idx
                      ? 'bg-white text-[#003B70] shadow-sm scale-105'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  Bước {st.step}
                </button>
              ))}
            </div>
          </div>

          {/* Current Step Showcase */}
          <div className="p-6 sm:p-8 space-y-8">
            {selectedItem.steps[currentStepIndex] && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Step Text & Instructions */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#003B70] rounded-full text-xs font-bold border border-blue-200">
                    <span>Bước {selectedItem.steps[currentStepIndex].step} / {selectedItem.steps.length}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {selectedItem.steps[currentStepIndex].text}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Vui lòng quan sát màn hình minh hoạ bên cạnh và thao tác tương ứng trên ứng dụng VietinBank iPay của Quý khách.
                  </p>

                  {/* Navigation Buttons for steps */}
                  <div className="pt-4 flex items-center gap-3">
                    <button
                      onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentStepIndex === 0}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Bước trước</span>
                    </button>

                    <button
                      onClick={() =>
                        setCurrentStepIndex((prev) =>
                          Math.min(selectedItem.steps.length - 1, prev + 1)
                        )
                      }
                      disabled={currentStepIndex === selectedItem.steps.length - 1}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#003B70] text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-800 transition-all shadow-xs"
                    >
                      <span>Bước tiếp theo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Step Image */}
                <div className="lg:col-span-7 flex justify-center">
                  <div className="relative group max-w-sm sm:max-w-md w-full bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-inner">
                    <img
                      src={selectedItem.steps[currentStepIndex].imageUrl}
                      alt={`Bước ${selectedItem.steps[currentStepIndex].step}`}
                      className="w-full max-h-[460px] object-contain rounded-xl shadow-xs transition-transform group-hover:scale-[1.01]"
                      onError={(e) => {
                        // Fallback placeholder if github raw image fails to load
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <button
                      onClick={() => setPreviewImage(selectedItem.steps[currentStepIndex].imageUrl)}
                      className="absolute top-5 right-5 p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-xs transition-all shadow-md opacity-80 group-hover:opacity-100"
                      title="Phóng to ảnh"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <p className="text-center text-[11px] text-slate-400 mt-2 font-medium">
                      Hình minh hoạ Bước {selectedItem.steps[currentStepIndex].step}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Video Box at the bottom of the steps */}
            {selectedItem.videoUrl && (
              <div className="rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 text-left">
                  <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Youtube className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Xem trọn vẹn Video hướng dẫn thao tác
                    </h4>
                    <p className="text-xs text-slate-600">
                      Video trực quan từng bước giúp Quý khách dễ dàng thao tác chuẩn xác trên iPay
                    </p>
                  </div>
                </div>

                <a
                  href={selectedItem.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition-all shrink-0 hover:scale-105 active:scale-95"
                >
                  <Youtube className="w-4 h-4 fill-current" />
                  <span>Mở xem trên YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Mandatory Requirement from PDF:
                - Sau mỗi phần hướng dẫn xong, hỏi khách hàng thực hiện ổn hay chưa?
                - Nếu đã ổn: quay lại menu chính cho khách hàng lựa chọn tiếp.
                - Nếu chưa ổn: "Cảm ơn Quý khách đã phản hồi. Quý khách có thể liên hệ Chuyên viên tư vấn Lê Hoàng Hiệp – số điện thoại: 0907.800.525 để hỗ trợ trực tiếp. Em sẽ cố gắng cải thiện để phục vụ Quý khách tốt hơn!"
                - Mục "Kết thúc cuộc trò chuyện" bên cạnh phần "Quay lại menu chính"
                - Khi lựa chọn "Kết thúc cuộc trò chuyện": "Cảm ơn Quý khách đã sử dụng dịch vụ của VietinBank. Chúc Quý khách một ngày tốt lành!"
            */}
            <div className="border-t border-slate-200 pt-6">
              {feedbackStatus === 'idle' && (
                <div className="bg-slate-50 rounded-2xl p-6 text-center space-y-4 border border-slate-200">
                  <h4 className="text-base font-bold text-slate-800">
                    Anh/chị đã thực hiện ổn hay chưa?
                  </h4>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => setFeedbackStatus('success')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Đã ổn rồi, cảm ơn</span>
                    </button>

                    <button
                      onClick={() => setFeedbackStatus('need_support')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>Chưa ổn, cần hỗ trợ</span>
                    </button>

                    <button
                      onClick={handleBackToMenu}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition-all shadow-xs"
                    >
                      <span>Quay lại menu chính</span>
                    </button>

                    <button
                      onClick={() => setFeedbackStatus('ended')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all shadow-xs"
                    >
                      <span>Kết thúc cuộc trò chuyện</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Success Feedback */}
              {feedbackStatus === 'success' && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-emerald-900">
                      Rất vui vì đã hỗ trợ được Quý khách thành công!
                    </h4>
                    <p className="text-xs text-emerald-700">
                      Quý khách có muốn tiếp tục tra cứu các câu hỏi khác hoặc tính toán lãi suất không?
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleBackToMenu}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#003B70] hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      <span>Quay lại menu chính</span>
                    </button>
                    <button
                      onClick={() => setFeedbackStatus('ended')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition-all"
                    >
                      <span>Kết thúc cuộc trò chuyện</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Need Support Notice (Exact text from PDF 1) */}
              {feedbackStatus === 'need_support' && (
                <div className="rounded-2xl bg-amber-50 border border-amber-300 p-6 space-y-4 animate-in fade-in duration-200 text-left">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <h4 className="text-base font-bold text-amber-950">
                        Thông báo hỗ trợ trực tiếp từ Chuyên viên
                      </h4>
                      <p className="text-sm text-amber-900 leading-relaxed font-medium bg-amber-100/60 p-4 rounded-xl border border-amber-200">
                        “{bankInfo.supportMsgUnresolved}”
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    <a
                      href={`tel:${bankInfo.advisor.rawPhone}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ED1C24] hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                    >
                      <Phone className="w-4 h-4 animate-pulse" />
                      <span>Gọi ngay: {bankInfo.advisor.phone}</span>
                    </a>

                    <button
                      onClick={handleBackToMenu}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition-all"
                    >
                      <span>Quay lại menu chính</span>
                    </button>

                    <button
                      onClick={() => setFeedbackStatus('ended')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all"
                    >
                      <span>Kết thúc cuộc trò chuyện</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Ended Conversation (Exact text from PDF 1) */}
              {feedbackStatus === 'ended' && (
                <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-8 text-center space-y-4 animate-in fade-in duration-200">
                  <div className="w-14 h-14 rounded-full bg-blue-100 text-[#003B70] flex items-center justify-center mx-auto shadow-xs">
                    <Smile className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {bankInfo.farewellMsg}
                    </h3>
                    <p className="text-xs text-slate-500">
                      VietinBank luôn sẵn sàng đồng hành và phục vụ Quý khách trong mọi giao dịch tài chính.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={onBackToHome}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#003B70] hover:bg-blue-800 text-white text-xs font-bold shadow-md transition-all"
                    >
                      <span>Về trang chủ</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Modal Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-white rounded-2xl p-4 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Phóng to minh hoạ"
              className="w-auto h-auto max-h-[80vh] object-contain mx-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

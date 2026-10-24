export type ActiveModuleId =
  | 'home'
  | 'faq'
  | 'ipay'
  | 'game'
  | 'savings'
  | 'loans'
  | 'products'
  | 'locations';

export interface BankInfo {
  name: string;
  fullName: string;
  branch: string;
  logoUrl: string;
  localLogo: string;
  advisor: {
    name: string;
    title: string;
    phone: string;
    rawPhone: string;
  };
  hotline: string;
  supportMsgUnresolved: string;
  farewellMsg: string;
}

export interface FaqStep {
  step: number;
  text: string;
  imageUrl: string;
  localImage: string;
}

export interface FaqItem {
  id: string;
  title: string;
  desc: string;
  videoUrl?: string;
  videoId?: string;
  steps: FaqStep[];
}

export interface ProductPoster {
  id: string;
  category: string;
  categoryName: string;
  title: string;
  shortDescription: string;
  imageUrl: string;
  localImage: string;
  tag: string;
  highlights: string[];
}

export interface BranchLocation {
  stt: number;
  branch: string;
  name: string;
  address: string;
  imageUrl: string;
  localImage: string;
  mapUrl: string;
  workingHours: {
    morning: string;
    afternoon: string;
  };
  phone: string;
  district: string;
}

export interface LoanScheduleRow {
  period: number;
  paymentDate: string;
  startingBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  endingBalance: number;
}

declare global {
  interface Window {
    onFlappyVoucherWin?: (data: {
      score: number;
      voucherCode: string;
      reward: string;
      timestamp: string;
    }) => void;
    onFlappyVoucherLose?: (data: {
      score: number;
      timestamp: string;
    }) => void;
  }
}

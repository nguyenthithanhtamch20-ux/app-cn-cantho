import { LoanScheduleRow } from '../types';

/**
 * Format currency to Vietnamese format (e.g. 10,000,000 hoặc 10.000.000 VND)
 */
export function formatCurrencyVND(amount: number): string {
  if (isNaN(amount)) return '0 VND';
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' VND';
}

/**
 * Parse input string to raw number
 */
export function parseNumberInput(val: string): number {
  const clean = val.replace(/[^0-9]/g, '');
  return clean ? parseInt(clean, 10) : 0;
}

/**
 * Format input with thousand separators
 */
export function formatNumberWithCommas(val: number | string): string {
  if (val === '' || val === null || val === undefined) return '';
  const num = typeof val === 'string' ? parseNumberInput(val) : val;
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Format date to DD/MM/YYYY
 */
export function formatDateVN(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Parse YYYY-MM-DD string to Date object
 */
export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

/**
 * Calculate loan repayment schedule based on reducing balance
 * Rule:
 * - Gốc trả mỗi kỳ = Số tiền vay / Tổng số kỳ trả nợ.
 * - Lãi kỳ hiện tại = Dư nợ đầu kỳ × Lãi suất kỳ.
 * - Lãi suất kỳ:
 *   - Tháng: Năm / 12
 *   - Quý: Năm / 4
 *   - 6 tháng: Năm / 2
 *   - Năm: Năm
 * - Sai lệch làm tròn được điều chỉnh vào kỳ trả nợ cuối cùng.
 */
export function calculateLoanSchedule({
  loanAmount,
  termMonths,
  annualInterestRate,
  startDateStr,
  paymentCycle = 'monthly',
  paymentDay = 25,
  roundTo1000 = false,
}: {
  loanAmount: number;
  termMonths: number;
  annualInterestRate: number;
  startDateStr: string;
  paymentCycle: 'monthly' | 'quarterly' | 'semi-annually' | 'annually';
  paymentDay: number;
  roundTo1000?: boolean;
}): {
  schedule: LoanScheduleRow[];
  totalPrincipal: number;
  totalInterest: number;
  totalPayment: number;
  firstPeriodPayment: number;
  lastPeriodPayment: number;
} {
  if (loanAmount <= 0 || termMonths <= 0) {
    return {
      schedule: [],
      totalPrincipal: 0,
      totalInterest: 0,
      totalPayment: 0,
      firstPeriodPayment: 0,
      lastPeriodPayment: 0,
    };
  }

  // Months per period & cycle rate divisor
  let monthsPerPeriod = 1;
  let rateDivisor = 12;
  if (paymentCycle === 'quarterly') {
    monthsPerPeriod = 3;
    rateDivisor = 4;
  } else if (paymentCycle === 'semi-annually') {
    monthsPerPeriod = 6;
    rateDivisor = 2;
  } else if (paymentCycle === 'annually') {
    monthsPerPeriod = 12;
    rateDivisor = 1;
  }

  const totalPeriods = Math.max(1, Math.ceil(termMonths / monthsPerPeriod));
  const periodicRate = (annualInterestRate / 100) / rateDivisor;

  const roundFn = (val: number) => {
    if (roundTo1000) {
      return Math.round(val / 1000) * 1000;
    }
    return Math.round(val);
  };

  const rawStandardPrincipal = loanAmount / totalPeriods;
  const standardPrincipal = roundFn(rawStandardPrincipal);

  const schedule: LoanScheduleRow[] = [];
  let remainingBalance = loanAmount;
  let accumulatedPrincipal = 0;
  let accumulatedInterest = 0;

  const disbursementDate = parseDateString(startDateStr);

  for (let period = 1; period <= totalPeriods; period++) {
    const startingBalance = remainingBalance;

    // Calculate payment date: advance by monthsPerPeriod from disbursement month
    const targetMonth = disbursementDate.getMonth() + period * monthsPerPeriod;
    const targetYear = disbursementDate.getFullYear() + Math.floor(targetMonth / 12);
    const normalizedMonth = ((targetMonth % 12) + 12) % 12;

    // Find valid day in that month (handle Feb 28/29, 30 days)
    const maxDaysInMonth = new Date(targetYear, normalizedMonth + 1, 0).getDate();
    const actualDay = Math.min(paymentDay, maxDaysInMonth);
    const periodDate = new Date(targetYear, normalizedMonth, actualDay);

    // Interest
    const rawInterest = startingBalance * periodicRate;
    const interest = roundFn(rawInterest);

    // Principal: adjust in last period for rounding errors
    let principal = standardPrincipal;
    if (period === totalPeriods) {
      principal = loanAmount - accumulatedPrincipal;
    } else {
      // guard against exceeding
      if (accumulatedPrincipal + principal > loanAmount) {
        principal = loanAmount - accumulatedPrincipal;
      }
    }

    const totalPayment = principal + interest;
    remainingBalance = Math.max(0, startingBalance - principal);
    accumulatedPrincipal += principal;
    accumulatedInterest += interest;

    schedule.push({
      period,
      paymentDate: formatDateVN(periodDate),
      startingBalance,
      principal,
      interest,
      totalPayment,
      endingBalance: remainingBalance,
    });
  }

  const totalPrincipal = accumulatedPrincipal;
  const totalInterest = accumulatedInterest;
  const totalPayment = totalPrincipal + totalInterest;

  return {
    schedule,
    totalPrincipal,
    totalInterest,
    totalPayment,
    firstPeriodPayment: schedule[0]?.totalPayment || 0,
    lastPeriodPayment: schedule[schedule.length - 1]?.totalPayment || 0,
  };
}

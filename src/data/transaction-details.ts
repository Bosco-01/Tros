export interface TransactionDetailsData {
  id: string;
  customerName: string;
  eventCategory: string;
  eventTitle: string;
  amount: string;
  date: string;
  paymentType: string;
  paymentStatus: string;
}

export const mockTransactionDetails: TransactionDetailsData = {
  id: 'TRX348592',
  customerName: 'John Doe',
  eventCategory: 'Food',
  eventTitle: 'John Doe Bakries', // Spelled exactly to match Figma screenshot typo
  amount: '# 5,000.00',
  date: '02-28-2026',
  paymentType: 'Subscription Fees',
  paymentStatus: 'Successful',
};
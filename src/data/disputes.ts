export interface DisputeRowData {
  dispute_id: string;
  customer_name: string;
  transaction_id: string;
  payment_title: string;
  amount: string;
  date: string;
  status: 'pending' | 'resolved';
  admin_note?: string;
}

export const mockDisputesList: DisputeRowData[] = [
  {
    dispute_id: 'DSP-84958694',
    customer_name: 'John Doe',
    transaction_id: '#TRX348592',
    payment_title: 'Johndoe Bakeries',
    amount: '# 5,000',
    date: 'Feb 28',
    status: 'pending',
  },
  {
    dispute_id: 'DSP-84958695',
    customer_name: 'Sarah Jenkins',
    transaction_id: '#TRX348593',
    payment_title: 'Sarah Pastries',
    amount: '# 12,000',
    date: 'Feb 25',
    status: 'resolved',
    admin_note: 'Resolved and refunded to user wallet.'
  }
];
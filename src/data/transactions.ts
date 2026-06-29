export interface TransactionRowData {
  customerName: string;
  transactionId: string;
  paymentTitle: string;
  amount: string;
  date: string;
  paymentType: 'Subscription' | 'Ad';
  status: 'Successful' | 'Declined' | 'Pending';
}

export const mockTransactions: TransactionRowData[] = [
  {
    customerName: 'John Doe',
    transactionId: '#TRX348592',
    paymentTitle: 'Johndoe Bakeries',
    amount: '# 5,000',
    date: 'Feb 29',
    paymentType: 'Subscription',
    status: 'Successful',
  },
  {
    customerName: 'John Doe',
    transactionId: '#TRX348592',
    paymentTitle: 'Johndoe Bakeries',
    amount: '# 5,000',
    date: 'Feb 28',
    paymentType: 'Subscription',
    status: 'Declined',
  },
  {
    customerName: 'John Doe',
    transactionId: '#TRX348592',
    paymentTitle: 'Johndoe Bakeries',
    amount: '# 5,000',
    date: 'Feb 25',
    paymentType: 'Ad',
    status: 'Pending',
  },
  {
    customerName: 'John Doe',
    transactionId: '#TRX348592',
    paymentTitle: 'Johndoe Bakeries',
    amount: '# 5,000',
    date: 'Feb 20',
    paymentType: 'Subscription',
    status: 'Declined',
  },
  {
    customerName: 'John Doe',
    transactionId: '#TRX348592',
    paymentTitle: 'Johndoe Bakeries',
    amount: '# 5,000',
    date: 'Feb 13',
    paymentType: 'Subscription',
    status: 'Successful',
  },
];
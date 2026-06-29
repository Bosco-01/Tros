export interface SupportTicketRow {
  customerName: string;
  customerEmail: string;
  customerNumber: string;
  ticketId: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Answered' | 'Closed';
}

export const mockSupportTickets: SupportTicketRow[] = [
  {
    customerName: 'John Doe',
    customerEmail: 'JohnDoe@gmail.com',
    customerNumber: '+234 5769604034',
    ticketId: '# 2547482',
    subject: 'Refund request...',
    priority: 'High',
    status: 'Pending',
  },
  {
    customerName: 'John Doe',
    customerEmail: 'JohnDoe@gmail.com',
    customerNumber: '+234 5769604034',
    ticketId: '# 2547482',
    subject: 'Refund request...',
    priority: 'Medium', // Mapped to display "Meduim"
    status: 'Answered',
  },
  {
    customerName: 'John Doe',
    customerEmail: 'JohnDoe@gmail.com',
    customerNumber: '+234 5769604034',
    ticketId: '# 2547482',
    subject: 'Refund request...',
    priority: 'Low',
    status: 'Closed',
  },
  {
    customerName: 'John Doe',
    customerEmail: 'JohnDoe@gmail.com',
    customerNumber: '+234 5769604034',
    ticketId: '# 2547482',
    subject: 'Refund request...',
    priority: 'Medium',
    status: 'Answered',
  },
  {
    customerName: 'John Doe',
    customerEmail: 'JohnDoe@gmail.com',
    customerNumber: '+234 5769604034',
    ticketId: '# 2547482',
    subject: 'Refund request...',
    priority: 'Medium',
    status: 'Answered',
  },
];
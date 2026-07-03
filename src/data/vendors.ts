export interface VendorRowData {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  subscription: 'Active' | 'Inactive';
  amount: string;
  eventPost: 'Active' | 'Inactive';
  status: 'Active' | 'Pending' | 'Inactive';
}

export const mockVendors: VendorRowData[] = [
  {
    id: '#001294',
    fullName: 'John Doe',
    businessName: "John's Bakeries and Co.",
    email: 'JohnDoe@gmail.com',
    subscription: 'Active',
    amount: '# 5,000',
    eventPost: 'Active',
    status: 'Active',
  },
  {
    id: '#001295', // Unique ID
    fullName: 'John Doe',
    businessName: "John's Bakeries and Co.",
    email: 'JohnDoe@gmail.com',
    subscription: 'Inactive',
    amount: '-',
    eventPost: 'Active',
    status: 'Pending',
  },
  {
    id: '#001296', // Unique ID
    fullName: 'John Doe',
    businessName: "John's Bakeries and Co.",
    email: 'JohnDoe@gmail.com',
    subscription: 'Active',
    amount: '# 10,000',
    eventPost: 'Active',
    status: 'Active',
  },
  {
    id: '#001297', // Unique ID
    fullName: 'John Doe',
    businessName: "John's Bakeries and Co.",
    email: 'JohnDoe@gmail.com',
    subscription: 'Inactive',
    amount: '-',
    eventPost: 'Inactive',
    status: 'Inactive',
  },
  {
    id: '#001298', // Unique ID
    fullName: 'John Doe',
    businessName: "John's Bakeries and Co.",
    email: 'JohnDoe@gmail.com',
    subscription: 'Active',
    amount: '# 1,000',
    eventPost: 'Active',
    status: 'Active',
  },
];
export interface VendorProfileData {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  registeredDate: string;
  status: 'Active' | 'Inactive';
  subscriptionPlan: string;
  eventPostsCount: number;
  location: string;
  avatarUrl: string;
}

export interface VendorEventRowData {
  id: string;
  category: string;
  title: string;
  eventType: string;
  price: string;
  date: string;
  time: string;
  status: 'Active' | 'Closed' | 'Cancelled';
  totalUsers: string;
  rating: number;
  reviewsCount: number;
}

export const mockVendorProfile: VendorProfileData = {
  id: '001294',
  fullName: 'John Doe',
  businessName: "John's Bakries and Pastries",
  email: 'JohnDoe@gmail.com',
  registeredDate: '26th March 2026',
  status: 'Active',
  subscriptionPlan: 'Basic Plan',
  eventPostsCount: 3,
  location: 'No. 44 Agege Rd. Lagos',
  avatarUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=300&auto=format&fit=crop', // Baker chef portrait placeholder
};

export const mockVendorEvents: VendorEventRowData[] = [
  {
    id: '1',
    category: 'Nightlife',
    title: 'DJ Jimmy Jat ni...',
    eventType: 'BOOK',
    price: '# 10,000',
    date: '24th March 2024',
    time: '9:45 PM',
    status: 'Active',
    totalUsers: '1,080',
    rating: 4.5,
    reviewsCount: 68,
  },
  {
    id: '2',
    category: 'Music',
    title: 'DJ Jimmy Jat ni...',
    eventType: 'RSVP',
    price: '# 5,000',
    date: '24th March 2024',
    time: '9:45 PM',
    status: 'Closed',
    totalUsers: '750',
    rating: 5.0,
    reviewsCount: 112,
  },
  {
    id: '3',
    category: 'Nightlife',
    title: 'DJ Jimmy Jat ni...',
    eventType: 'BOOK',
    price: '# 10,000',
    date: '24th March 2024',
    time: '9:45 PM',
    status: 'Cancelled',
    totalUsers: '1,080',
    rating: 4.5,
    reviewsCount: 68,
  },
];
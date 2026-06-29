export interface UserProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  registeredDate: string;
  status: 'Active' | 'Inactive';
  eventsCount: number;
  avatarUrl: string;
}

export interface EventRowData {
  id: string;
  category: string;
  title: string;
  eventType: string;
  price: string;
  date: string;
  time: string;
  vendorName: string;
  vendorId: string;
  status: 'Active' | 'Closed';
}

export const mockUserProfile: UserProfileData = {
  id: '001294',
  fullName: 'John Doe',
  email: 'JohnDoe@gmail.com',
  phone: '+234 5558302119',
  registeredDate: '26th March 2026',
  status: 'Active',
  eventsCount: 3,
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop', // High quality placeholder
};

export const mockUserEvents: EventRowData[] = [
  {
    id: '1',
    category: 'Nightlife',
    title: 'DJ Jimmy Jat ni...',
    eventType: 'BOOK',
    price: '# 10,000',
    date: '24th March 2024',
    time: '9:45 PM',
    vendorName: 'DJ Jimmy Jat',
    vendorId: '# 0001023',
    status: 'Active',
  },
  {
    id: '2',
    category: 'Music',
    title: 'DJ Jimmy Jat ni...',
    eventType: 'RSVP',
    price: '# 15,000',
    date: '24th March 2024',
    time: '9:45 PM',
    vendorName: 'DJ Jimmy Jat',
    vendorId: '# 0001023',
    status: 'Active',
  },
  {
    id: '3',
    category: 'Nightlife',
    title: 'DJ Jimmy Jat ni...',
    eventType: 'BOOK',
    price: '# 10,000',
    date: '24th March 2024',
    time: '9:45 PM',
    vendorName: 'DJ Jimmy Jat',
    vendorId: '# 0001023',
    status: 'Closed',
  },
];
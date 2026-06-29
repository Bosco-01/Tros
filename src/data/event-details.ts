export interface EventDetailsData {
  id: string;
  category: string;
  eventType: string;
  title: string;
  totalUsers: string;
  price: string;
  dateTime: string;
  status: 'Active' | 'Inactive';
  rating: number;
  reviewsCount: number;
  bannerUrl: string;
}

export const mockEventDetails: EventDetailsData = {
  id: '001294',
  category: 'Nightlife',
  eventType: 'BOOK',
  title: 'DJ Jimmy Jat Night Show',
  totalUsers: '1,080',
  price: '# 5,000.00',
  dateTime: '24-03-2026 20:00',
  status: 'Active',
  rating: 4.5,
  reviewsCount: 68,
  bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop', // Stunning crowd banner placeholder
};
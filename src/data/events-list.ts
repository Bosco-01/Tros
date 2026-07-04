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
  status: string;
}

export const mockEventsList: EventRowData[] = [
  {
    id: '001294',
    category: 'Nightlife',
    title: 'DJ Jimmy Jat ni...',
    eventType: 'BOOK',
    price: '# 10,000',
    date: '24th March 2024',
    time: '9:45 PM',
    vendorName: 'DJ Jimmy Jat',
    vendorId: '# 0001023',
    status: 'Active'
  },
  {
    id: '001295',
    category: 'Music',
    title: 'DJ Jimmy Jat ni...',
    eventType: 'RSVP',
    price: '# 15,000',
    date: '24th March 2024',
    time: '9:45 PM',
    vendorName: 'DJ Jimmy Jat',
    vendorId: '# 0001023',
    status: 'Active'
  },
  {
    id: '001296',
    category: 'Nightlife',
    title: 'DJ Jimmy Jat ni...',
    eventType: 'BOOK',
    price: '# 10,000',
    date: '24th March 2024',
    time: '9:45 PM',
    vendorName: 'DJ Jimmy Jat',
    vendorId: '# 0001023',
    status: 'Pending'
  },
  {
    id: '001297',
    category: 'Hotel',
    title: 'DJ Jimmy Jat ni...',
    eventType: 'RSVP',
    price: '# 10,000',
    date: '24th March 2024',
    time: '9:45 PM',
    vendorName: 'DJ Jimmy Jat',
    vendorId: '# 0001023',
    status: 'Declined'
  },
  {
    id: '001298',
    category: 'Nightlife',
    title: 'DJ Jimmy Jat ni...',
    eventType: 'BOOK',
    price: '# 10,000',
    date: '24th March 2024',
    time: '9:45 PM',
    vendorName: 'DJ Jimmy Jat',
    vendorId: '# 0001023',
    status: 'Active'
  }
];
export interface EventReview {
  id: string;
  reviewerName: string;
  avatarUrl: string;
  rating: number;
  comment: string;
  date: string;
}

export interface EventDetailsData {
  id: string;
  category: string;
  eventType: string;
  title: string;
  vendorName: string;
  totalUsers: string;
  price: string; // If 'Free' or blank, displays as blank
  dateTime?: string;
  workingHours?: string;
  status: string;
  rating: number;
  reviewsCount: number;
  bannerUrls: string[];
  description: string;
  location: string; // Venue name
  address: string; // Venue address
}

export const mockEventDetails: EventDetailsData = {
  id: "001294",
  category: "Nightlife",
  eventType: "Booking Event",
  title: "DJ Jimmy Jat Night Show",
  vendorName: "DJ Jimmy Jat",
  totalUsers: "1,080",
  price: "Starting from ₦5,000.00", // Set to "" or "Free" to test the blank pricing logic
  dateTime: "24-03-2026 20:00",
  status: "Active",
  rating: 4.5,
  reviewsCount: 68,
  bannerUrls: [
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
  ],
  description:
    "Join us for an unforgettable night with Africa’s premier DJ, DJ Jimmy Jat, spinning the hottest tracks live in Lagos. Experience elite sound, spectacular light shows, and premium VIP lounges.",
  location: "Eko Hotels Dome",
  address: "No. 44 Adetokunbo Ademola St, Victoria Island, Lagos",
};

export const mockEventReviews: EventReview[] = [
  {
    id: "r1",
    reviewerName: "Sarah Jenkins",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    rating: 5,
    comment:
      "Absolutely legendary night! The sound setup was incredible and DJ Jimmy Jat was on fire.",
    date: "3 days ago",
  },
  {
    id: "r2",
    reviewerName: "Babajide Alao",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    rating: 4,
    comment:
      "Great atmosphere and crowd. Premium section was highly organized. Will definitely attend the next edition.",
    date: "1 week ago",
  },
];

export interface SubscriptionPackage {
  id: string;
  name: string;
  price: string;
  headerBg: string; // Custom header banner color
  features: string[];
}

export interface UserSubscriptionRow {
  userId: string;
  customerName: string;
  plan: 'Free Plan' | 'Basic Plan' | 'Premium Plan';
  status: 'Active' | 'Inactive';
}

export const mockPackages: SubscriptionPackage[] = [
  {
    id: 'free',
    name: 'Free Plan',
    price: '₦1,000',
    headerBg: 'bg-[#6312E1]', // Purple banner
    features: [
      '+20% event promotion',
      '+20% advanced analysis',
      '+20% advanced analysis',
      '+20% advanced analysis',
      '+20% advanced analysis',
      '+20% advanced analysis',
    ],
  },
  {
    id: 'basic',
    name: 'Basic Plan',
    price: '₦5,000',
    headerBg: 'bg-[#FF5C00]', // Vibrant Orange banner
    features: [
      '+20% event promotion',
      '+20% advanced analysis',
      '+20% advanced analysis',
      '+20% advanced analysis',
      '+20% advanced analysis',
      '+20% advanced analysis',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: '₦10,000',
    headerBg: 'bg-[#6312E1]', // Purple banner
    features: [
      '+20% event promotion',
      '+20% advanced analysis',
      '+20% advanced analysis',
      '+20% advanced analysis',
      '+20% advanced analysis',
      '+20% advanced analysis',
    ],
  },
];

export const mockUserSubscriptions: UserSubscriptionRow[] = [
  {
    userId: '#001294',
    customerName: 'John Doe',
    plan: 'Basic Plan',
    status: 'Active',
  },
  {
    userId: '#001294',
    customerName: 'John Doe',
    plan: 'Basic Plan',
    status: 'Active',
  },
];
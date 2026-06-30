export interface AppError {
  message: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  is_active: boolean;
  avatar_url?: string;
}

export interface AdminEvent {
  event_id: string;
  vendor_id: string;
  vendor_name: string;
  title: string;
  category: string;
  event_type: string;
  price: number;
  date_time: string;
  status: 'active' | 'on_hold' | 'cancelled' | 'pending_cancellation';
  total_users: number;
  rating: number;
  review_count: number;
}

export interface AdminEventDetail extends AdminEvent {
  description: string;
  cover_image_url: string;
  venue_name: string;
  venue_address: string;
}

export interface AdminVendor {
  vendor_id: string;
  full_name: string;
  business_name: string;
  email: string;
  subscription_status: string;
  subscription_amount: number;
  event_post_status: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  total_events: number;
}

export interface AdminVendorDetail extends AdminVendor {
  user_id: string;
  registered_date: string;
  phone_number: string;
  plan_name: string;
  address: string;
  state: string;
  city: string;
  status: string;
}

export interface DashboardResponse {
  total_events: number;
  total_users: number;
  total_vendors: number;
  total_subscriptions: number;
  total_bookings: number;
  total_revenue: number;
  events_trend_pct: number;
  users_trend_pct: number;
  vendors_trend_pct: number;
  subscriptions_trend_pct: number;
  pending_approvals: number;
  pending_verifications: number;
  recent_events: AdminEvent[];
  recent_vendors: AdminVendor[];
  message?: string;
}

export interface MonthlyCountItem {
  month: string;
  count: number;
}

export interface MonthlyAmountItem {
  month: string;
  amount: number;
}

export interface ReportsAnalyticsResponse {
  registered_events: number;
  active_vendors: number;
  total_revenue: number;
  refunds_issued: number;
  events_declined: number;
  vendors_declined: number;
  event_approvals: MonthlyCountItem[];
  revenue_trend: MonthlyAmountItem[];
  message?: string;
}

export interface CreateAdminRequest {
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
}

export interface CreateFAQRequest {
  question: string;
  answer: string;
  sort_order?: number;
}

export interface UpdateFAQRequest {
  question: string;
  answer: string;
  sort_order?: number;
  is_active: boolean;
}

export interface CreateSubscriptionPlanRequest {
  name: string;
  price: number;
  description?: string;
  max_events: number;
  max_tickets_per_event: number;
  can_access_reports?: boolean;
  can_broadcast?: boolean;
}

export interface UpdateSubscriptionPlanRequest extends CreateSubscriptionPlanRequest {
  is_active: boolean;
}

export interface DisputeRow {
  dispute_id: string;
  customer_name: string;
  transaction_id: string;
  payment_title: string;
  amount: number;
  date: string;
  status: 'pending' | 'resolved';
  admin_note?: string;
}

export interface SupportTicket {
  ticket_id: string;
  customer_name: string;
  customer_email: string;
  customer_number: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  complaint?: string;
  dateTime: string;
}

export interface TransactionRow {
  customerName: string;
  transactionId: string;
  paymentTitle: string;
  amount: string;
  date: string;
  paymentType: 'Subscription' | 'Ad';
  status: 'Successful' | 'Declined' | 'Pending';
}

export interface WithdrawalRequestRow {
  withdrawal_id: string;
  vendor_name: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  amount: number;
  status: 'pending' | 'successful' | 'failed';
  reference: string;
  date: string;
}

export interface VendorPageResponse {
  vendor: AdminVendorDetail;
  events: AdminEvent[];
  total_events: number;
}
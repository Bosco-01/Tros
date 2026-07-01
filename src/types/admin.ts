export interface MetricData {
  id: string;
  title: string;
  value: string;
  trend: 'up' | 'down';
  trendValue: string;
  trendPeriod: string;
  iconBg: string;
  iconType: 'users' | 'vendors' | 'events' | 'subscriptions';
}

export interface AppError {
  message: string;
}

export interface PaginatedResponse<T> {
  items?: T[];
  data?: T[];
  results?: T[];
  total?: number;
  count?: number;
  page?: number;
  limit?: number;
  total_pages?: number;
}

export interface AdminLoginResponse {
  ok?: boolean;
  admin?: AdminProfile;
  message?: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN' | string;
  is_active: boolean;
  avatar_url?: string;
}

export interface AdminStaff {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at?: string;
}

export interface AppUser {
  user_id?: string;
  id?: string;
  full_name?: string;
  name?: string;
  email: string;
  phone_number?: string;
  phone?: string;
  role?: string;
  is_active?: boolean;
  status?: string;
  state?: string;
  city?: string;
  created_at?: string;
  profile_picture?: string;
}

export interface UserBooking {
  booking_id?: string;
  id?: string;
  event_name?: string;
  event_title?: string;
  status?: string;
  reference?: string;
  amount?: number;
  created_at?: string;
  date?: string;
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
  status: 'active' | 'on_hold' | 'cancelled' | 'pending_cancellation' | string;
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
  verification_status: 'pending' | 'approved' | 'rejected' | string;
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

export interface VendorKYC {
  nin_url?: string;
  cac_url?: string;
  business_name?: string;
  cac_registered_number?: string;
  verification_status?: string;
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

export interface ReportListItem {
  report_id?: string;
  id?: string;
  title?: string;
  type?: string;
  generated_at?: string;
  status?: string;
}

export interface CreateAdminRequest {
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
}

export interface ChangeAdminPasswordRequest {
  current_password: string;
  new_password: string;
}

export interface CreateBroadcastRequest {
  channel: string;
  title: string;
  content: string;
  recipients?: string;
}

export interface BroadcastItem {
  broadcast_id?: string;
  id?: string;
  channel: string;
  title: string;
  content: string;
  recipients?: string;
  created_at?: string;
}

export interface FAQItem {
  faq_id?: string;
  id?: string;
  question: string;
  answer: string;
  sort_order?: number;
  is_active?: boolean;
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

export interface SubscriptionPlan {
  plan_id?: string;
  id?: string;
  name: string;
  price: number;
  description?: string;
  max_events?: number;
  max_tickets_per_event?: number;
  can_access_reports?: boolean;
  can_broadcast?: boolean;
  benefits?: string[];
  is_active?: boolean;
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

export interface VendorSubscription {
  subscription_id?: string;
  vendor_name?: string;
  plan_name?: string;
  status?: string;
  amount?: number;
  started_at?: string;
}

export interface DisputeRow {
  dispute_id: string;
  customer_name: string;
  transaction_id: string;
  payment_title: string;
  amount: number;
  date: string;
  status: 'pending' | 'resolved' | string;
  admin_note?: string;
}

export interface SupportTicket {
  ticket_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_number?: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low' | string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | string;
  complaint?: string;
  message?: string;
  dateTime?: string;
  created_at?: string;
}

export interface TransactionRow {
  transaction_id?: string;
  payment_id?: string;
  reference?: string;
  customer_name?: string;
  customerName?: string;
  user_name?: string;
  payment_title?: string;
  paymentTitle?: string;
  description?: string;
  type?: string;
  amount?: number | string;
  date?: string;
  created_at?: string;
  paid_at?: string;
  payment_type?: string;
  paymentType?: string;
  status?: string;
}

export interface TransactionRowData {
  customerName: string;
  transactionId: string;
  paymentTitle: string;
  amount: string;
  date: string;
  paymentType: string;
  status: string;
}

export interface WithdrawalRequestRow {
  withdrawal_id: string;
  vendor_name: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  amount: number;
  status: 'pending' | 'successful' | 'failed' | string;
  reference: string;
  date: string;
}

export interface VendorPageResponse {
  vendor: AdminVendorDetail;
  events: AdminEvent[];
  total_events: number;
}

export type PlatformSettings = Record<string, string>;

export interface MessageResponse {
  message?: string;
  ok?: boolean;
}

// UI profile shapes for detail pages
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
  status: string;
  totalUsers?: string;
  rating?: number;
  reviewsCount?: number;
}

export interface VendorProfileData {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  registeredDate: string;
  status: string;
  verificationStatus: string;
  subscriptionStatus: string;
  planName: string;
  address: string;
  state: string;
  city: string;
  eventsCount: number;
  avatarUrl: string;
}

export interface UserRowData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
}

export interface VendorRowData {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  subscription: string;
  amount: string;
  eventPost: string;
  status: string;
}

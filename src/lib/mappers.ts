import type { SupportTicketRow } from '@/data/support';
import type { TicketDetailsData } from '@/data/ticket-details';
import { activeLabel, formatCurrency, formatDate, titleCase } from '@/lib/api-helpers';
import { avatarOrPlaceholder } from '@/lib/media';
import type {
  AppUser,
  UserRowData,
  AdminVendor,
  VendorRowData,
  UserProfileData,
  VendorProfileData,
  UserBooking,
  AdminEvent,
  TransactionRow,
  TransactionRowData,
  EventRowData,
  SupportTicket,
  AdminVendorDetail,
} from '@/types/admin';

function normalizePriority(p?: string): SupportTicketRow['priority'] {
  const v = String(p || '').toLowerCase();
  if (v === 'high') return 'High';
  if (v === 'low') return 'Low';
  return 'Medium';
}

function normalizeTicketStatus(s?: string): SupportTicketRow['status'] {
  const v = String(s || '').toLowerCase();
  if (v === 'resolved') return 'Answered';
  if (v === 'closed') return 'Closed';
  return 'Pending';
}

export function mapSupportTicketToRow(ticket: SupportTicket): SupportTicketRow {
  return {
    customerName: ticket.customer_name || ticket.user_name || '—',
    customerEmail: ticket.customer_email || ticket.user_email || '—',
    customerNumber: ticket.customer_number || ticket.user_phone || '—',
    ticketId: ticket.ticket_id || '—',
    subject: ticket.subject || '—',
    priority: normalizePriority(ticket.priority),
    status: normalizeTicketStatus(ticket.status),
  };
}

export function mapSupportTicketToDetails(ticket: SupportTicket): TicketDetailsData {
  return {
    id: ticket.ticket_id || '—',
    subject: ticket.subject || '—',
    dateTime: ticket.dateTime || ticket.created_at || '—',
    complaint: ticket.complaint || ticket.message || '—',
  };
}

export function mapUserToRow(user: AppUser): UserRowData {
  const id = user.user_id || user.id || '';
  return {
    id,
    fullName: user.full_name || user.name || '—',
    email: user.email,
    phone: user.phone_number || user.phone || '—',
    status: activeLabel(user.is_active, user.status),
  };
}

export function mapVendorToRow(vendor: AdminVendor): VendorRowData {
  return {
    id: vendor.vendor_id,
    fullName: vendor.full_name,
    businessName: vendor.business_name,
    email: vendor.email,
    subscription: vendor.subscription_status || '—',
    amount: formatCurrency(vendor.subscription_amount),
    eventPost: vendor.event_post_status || '—',
    status: vendor.verification_status || 'pending',
  };
}

export function mapUserToProfile(user: AppUser, bookingsCount = 0): UserProfileData {
  const id = user.user_id || user.id || '';
  return {
    id,
    fullName: user.full_name || user.name || '—',
    email: user.email,
    phone: user.phone_number || user.phone || '—',
    registeredDate: formatDate(user.created_at),
    status: activeLabel(user.is_active, user.status),
    eventsCount: bookingsCount,
    avatarUrl: avatarOrPlaceholder(user.profile_picture),
  };
}

export function mapVendorToProfile(
  vendor: AdminVendorDetail | (AdminVendor & Partial<VendorProfileData>),
  eventsCount = 0,
): VendorProfileData {
  const detail = vendor as AdminVendorDetail;
  return {
    id: vendor.vendor_id,
    fullName: vendor.full_name,
    businessName: vendor.business_name,
    email: vendor.email,
    phone: detail.phone_number || '—',
    registeredDate: formatDate(detail.registered_date),
    status: detail.status || vendor.verification_status || 'pending',
    verificationStatus: vendor.verification_status || 'pending',
    subscriptionStatus: vendor.subscription_status || '—',
    planName: detail.plan_name || '—',
    address: detail.address || '—',
    state: detail.state || '—',
    city: detail.city || '—',
    eventsCount,
    avatarUrl: avatarOrPlaceholder(detail.profile_picture || detail.logo_url),
  };
}

export function mapTransactionToRow(tx: TransactionRow): TransactionRowData {
  return {
    customerName: tx.customer_name || tx.user_name || tx.customerName || '—',
    transactionId: tx.transaction_id || tx.payment_id || tx.reference || '—',
    paymentTitle: tx.payment_title || tx.paymentTitle || tx.description || tx.type || '—',
    amount: formatCurrency(tx.amount),
    date: formatDate(tx.date || tx.created_at || tx.paid_at),
    paymentType: titleCase(tx.payment_type || tx.paymentType || tx.type) || '—',
    status: titleCase(tx.status) || '—',
  };
}

export function mapBookingToEventRow(booking: UserBooking): EventRowData {
  return {
    id: booking.booking_id || booking.id || '—',
    category: 'Booking',
    title: booking.event_name || booking.event_title || '—',
    eventType: 'BOOK',
    price: formatCurrency(booking.amount),
    date: formatDate(booking.created_at || booking.date),
    time: '—',
    vendorName: '—',
    vendorId: '—',
    status: booking.status || '—',
  };
}

export function mapAdminEventToRow(event: AdminEvent): EventRowData {
  const dt = event.date_time ? new Date(event.date_time) : null;
  return {
    id: event.event_id,
    category: event.category || '—',
    title: event.title,
    eventType: event.event_type || '—',
    price: formatCurrency(event.price),
    date: dt ? formatDate(event.date_time) : '—',
    time: dt ? dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—',
    vendorName: event.vendor_name || '—',
    vendorId: event.vendor_id || '—',
    status: event.status || '—',
    totalUsers: String(event.total_users ?? '—'),
    rating: event.rating ?? 0,
    reviewsCount: event.review_count ?? 0,
  };
}

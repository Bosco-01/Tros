import { apiFetch } from './apiClient';
import * as T from '@/types/admin';

export const adminService = {
  // ==========================================
  // DASHBOARD & ANALYTICS
  // ==========================================
  getDashboardStats: (from?: string, to?: string, serverToken?: string) => {
    const query = new URLSearchParams();
    if (from) query.set('from', from);
    if (to) query.set('to', to);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<T.DashboardResponse>(`/admin/dashboard${queryString}`, {}, serverToken);
  },

  getReportsAnalytics: (from?: string, to?: string, serverToken?: string) => {
    const query = new URLSearchParams();
    if (from) query.set('from', from);
    if (to) query.set('to', to);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<T.ReportsAnalyticsResponse>(`/admin/reports/analytics${queryString}`, {}, serverToken);
  },

  // ==========================================
  // STAFF ADMIN MANAGEMENT
  // ==========================================
  listAdmins: (page = 1, limit = 20, serverToken?: string) => {
    return apiFetch<any>(`/admin/admins?page=${page}&limit=${limit}`, {}, serverToken);
  },

  createAdmin: (data: T.CreateAdminRequest) => {
    return apiFetch<any>('/admin/admins', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteAdmin: (id: string) => {
    return apiFetch<any>(`/admin/admins/${id}`, {
      method: 'DELETE',
    });
  },

  updateAdminStatus: (id: string, isActive: boolean) => {
    return apiFetch<any>(`/admin/admins/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: isActive }),
    });
  },

  // ==========================================
  // USER ACCOUNTS
  // ==========================================
  listUsers: (params: { search?: string; phone?: string; status?: string; page?: number; limit?: number }, serverToken?: string) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.phone) query.set('phone', params.phone);
    if (params.status) query.set('status', params.status);
    query.set('page', String(params.page || 1));
    query.set('limit', String(params.limit || 20));
    return apiFetch<any>(`/admin/users?${query.toString()}`, {}, serverToken);
  },

  getUserDetail: (userId: string, serverToken?: string) => {
    return apiFetch<any>(`/admin/users/${userId}`, {}, serverToken);
  },

  getUserBookings: (userId: string, page = 1, limit = 20, serverToken?: string) => {
    return apiFetch<any>(`/admin/users/${userId}/bookings?page=${page}&limit=${limit}`, {}, serverToken);
  },

  updateUserStatus: (userId: string, isActive: boolean) => {
    return apiFetch<any>(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: isActive }),
    });
  },

  // ==========================================
  // VENDOR ACCOUNTS
  // ==========================================
  listVendors: (params: { search?: string; status?: string; page?: number; limit?: number }, serverToken?: string) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.status) query.set('status', params.status);
    query.set('page', String(params.page || 1));
    query.set('limit', String(params.limit || 20));
    return apiFetch<any>(`/admin/vendors?${query.toString()}`, {}, serverToken);
  },

  getVendorPageBundle: (vendorId: string, page = 1, limit = 20, serverToken?: string) => {
    return apiFetch<T.VendorPageResponse>(`/admin/vendors/${vendorId}/page?page=${page}&limit=${limit}`, {}, serverToken);
  },

  getVendorKYC: (vendorId: string, serverToken?: string) => {
    return apiFetch<any>(`/admin/vendors/${vendorId}/kyc`, {}, serverToken);
  },

  updateVendorStatus: (vendorId: string, payload: { verification_status: 'pending' | 'approved' | 'rejected'; is_active?: boolean }) => {
    return apiFetch<any>(`/admin/vendors/${vendorId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  // ==========================================
  // EVENTS
  // ==========================================
  listEvents: (page = 1, limit = 20, serverToken?: string) => {
    return apiFetch<any>(`/admin/events?page=${page}&limit=${limit}`, {}, serverToken);
  },

  getEventDetail: (eventId: string, serverToken?: string) => {
    return apiFetch<T.AdminEventDetail>(`/admin/events/${eventId}`, {}, serverToken);
  },

  approveEventCancellation: (eventId: string) => {
    return apiFetch<any>(`/admin/events/${eventId}/approve-cancellation`, {
      method: 'POST',
    });
  },

  // ==========================================
  // FAQS
  // ==========================================
  listFAQs: (serverToken?: string) => {
    return apiFetch<any>('/admin/faqs', {}, serverToken);
  },

  createFAQ: (data: T.CreateFAQRequest) => {
    return apiFetch<any>('/admin/faqs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateFAQ: (faqId: string, data: T.UpdateFAQRequest) => {
    return apiFetch<any>(`/admin/faqs/${faqId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteFAQ: (faqId: string) => {
    return apiFetch<any>(`/admin/faqs/${faqId}`, {
      method: 'DELETE',
    });
  },

  // ==========================================
  // SUBSCRIPTION PACKAGES
  // ==========================================
  listSubscriptionPlans: (serverToken?: string) => {
    return apiFetch<any>('/admin/subscription-plans', {}, serverToken);
  },

  createSubscriptionPlan: (data: T.CreateSubscriptionPlanRequest) => {
    return apiFetch<any>('/admin/subscription-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateSubscriptionPlan: (planId: string, data: T.UpdateSubscriptionPlanRequest) => {
    return apiFetch<any>(`/admin/subscription-plans/${planId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // ==========================================
  // SUPPORT TICKETS
  // ==========================================
  listSupportTickets: (page = 1, limit = 20, serverToken?: string) => {
    return apiFetch<any>(`/admin/support?page=${page}&limit=${limit}`, {}, serverToken);
  },

  getSupportTicket: (ticketId: string, serverToken?: string) => {
    return apiFetch<any>(`/admin/support/${ticketId}`, {}, serverToken);
  },

  updateSupportTicketStatus: (ticketId: string, status: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    return apiFetch<any>(`/admin/support/${ticketId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // ==========================================
  // DISPUTES, TRANSACTIONS & WITHDRAWALS
  // ==========================================
  listTransactions: (page = 1, limit = 20, serverToken?: string) => {
    return apiFetch<any>(`/admin/transactions?page=${page}&limit=${limit}`, {}, serverToken);
  },

  listWithdrawals: (params: { search?: string; status?: string; from?: string; to?: string; page?: number; limit?: number }, serverToken?: string) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.status) query.set('status', params.status);
    if (params.from) query.set('from', params.from);
    if (params.to) query.set('to', params.to);
    query.set('page', String(params.page || 1));
    query.set('limit', String(params.limit || 20));
    return apiFetch<any>(`/admin/withdrawals?${query.toString()}`, {}, serverToken);
  },

  listDisputes: (page = 1, limit = 20, serverToken?: string) => {
    return apiFetch<any>(`/admin/disputes?page=${page}&limit=${limit}`, {}, serverToken);
  },

  resolveDispute: (disputeId: string, payload: { status: string; admin_note?: string }) => {
    return apiFetch<any>(`/admin/disputes/${disputeId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  // ==========================================
  // SYSTEM SETTINGS
  // ==========================================
  getSettings: (serverToken?: string) => {
    return apiFetch<any>('/admin/settings', {}, serverToken);
  },

  updateSetting: (key: string, value: string) => {
    return apiFetch<any>(`/admin/settings/${key}`, {
      method: 'PATCH',
      body: JSON.stringify({ value }),
    });
  },
};
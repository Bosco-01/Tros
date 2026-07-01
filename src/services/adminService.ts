import { apiFetch } from './apiClient';
import * as T from '@/types/admin';

export const adminService = {
  login: (email: string, password: string) => {
    return fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as T.MessageResponse).message || 'Login failed');
      return data as T.AdminLoginResponse;
    });
  },

  logout: () => {
    return fetch('/api/admin/logout', { method: 'POST' }).then((r) => r.json());
  },

  getProfile: (serverToken?: string) => {
    return apiFetch<T.AdminProfile>('/admin/profile', {}, serverToken);
  },

  changePassword: (data: T.ChangeAdminPasswordRequest) => {
    return apiFetch<T.MessageResponse>('/admin/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

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

  getReportsList: (page = 1, limit = 20, serverToken?: string) => {
    return apiFetch<T.PaginatedResponse<T.ReportListItem>>(
      `/admin/reports?page=${page}&limit=${limit}`,
      {},
      serverToken,
    );
  },

  listAdmins: (page = 1, limit = 20, serverToken?: string) => {
    return apiFetch<T.PaginatedResponse<T.AdminStaff>>(
      `/admin/admins?page=${page}&limit=${limit}`,
      {},
      serverToken,
    );
  },

  createAdmin: (data: T.CreateAdminRequest) => {
    return apiFetch<T.MessageResponse>('/admin/admins', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteAdmin: (id: string) => {
    return apiFetch<T.MessageResponse>(`/admin/admins/${id}`, { method: 'DELETE' });
  },

  updateAdminStatus: (id: string, isActive: boolean) => {
    return apiFetch<T.MessageResponse>(`/admin/admins/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: isActive }),
    });
  },

  listBroadcasts: (page = 1, limit = 20, serverToken?: string) => {
    return apiFetch<T.PaginatedResponse<T.BroadcastItem>>(
      `/admin/broadcasts?page=${page}&limit=${limit}`,
      {},
      serverToken,
    );
  },

  sendBroadcast: (data: T.CreateBroadcastRequest) => {
    return apiFetch<T.MessageResponse>('/admin/broadcasts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  listUsers: (
    params: { search?: string; phone?: string; status?: string; page?: number; limit?: number },
    serverToken?: string,
  ) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.phone) query.set('phone', params.phone);
    if (params.status) query.set('status', params.status);
    query.set('page', String(params.page || 1));
    query.set('limit', String(params.limit || 20));
    return apiFetch<T.PaginatedResponse<T.AppUser>>(`/admin/users?${query.toString()}`, {}, serverToken);
  },

  getUserDetail: (userId: string, serverToken?: string) => {
    return apiFetch<T.AppUser>(`/admin/users/${userId}`, {}, serverToken);
  },

  getUserBookings: (userId: string, page = 1, limit = 20, serverToken?: string) => {
    return apiFetch<T.PaginatedResponse<T.UserBooking>>(
      `/admin/users/${userId}/bookings?page=${page}&limit=${limit}`,
      {},
      serverToken,
    );
  },

  updateUserStatus: (userId: string, isActive: boolean) => {
    return apiFetch<T.MessageResponse>(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: isActive }),
    });
  },

  listVendors: (
    params: { search?: string; status?: string; page?: number; limit?: number },
    serverToken?: string,
  ) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.status) query.set('status', params.status);
    query.set('page', String(params.page || 1));
    query.set('limit', String(params.limit || 20));
    return apiFetch<T.PaginatedResponse<T.AdminVendor>>(
      `/admin/vendors?${query.toString()}`,
      {},
      serverToken,
    );
  },

  getVendorDetail: (vendorId: string, serverToken?: string) => {
    return apiFetch<T.AdminVendorDetail>(`/admin/vendors/${vendorId}`, {}, serverToken);
  },

  getVendorEvents: (vendorId: string, page = 1, limit = 20, serverToken?: string) => {
    return apiFetch<T.PaginatedResponse<T.AdminEvent>>(
      `/admin/vendors/${vendorId}/events?page=${page}&limit=${limit}`,
      {},
      serverToken,
    );
  },

  getVendorKYC: (vendorId: string, serverToken?: string) => {
    return apiFetch<T.VendorKYC>(`/admin/vendors/${vendorId}/kyc`, {}, serverToken);
  },

  getVendorPageBundle: (vendorId: string, page = 1, limit = 20, serverToken?: string) => {
    return apiFetch<T.VendorPageResponse>(
      `/admin/vendors/${vendorId}/page?page=${page}&limit=${limit}`,
      {},
      serverToken,
    );
  },

  updateVendorStatus: (
    vendorId: string,
    payload: { verification_status: 'pending' | 'approved' | 'rejected'; is_active?: boolean },
  ) => {
    return apiFetch<T.MessageResponse>(`/admin/vendors/${vendorId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  listEvents: (page = 1, limit = 20, serverToken?: string) => {
    return apiFetch<T.PaginatedResponse<T.AdminEvent>>(
      `/admin/events?page=${page}&limit=${limit}`,
      {},
      serverToken,
    );
  },

  getEventDetail: (eventId: string, serverToken?: string) => {
    return apiFetch<T.AdminEventDetail>(`/admin/events/${eventId}`, {}, serverToken);
  },

  approveEventCancellation: (eventId: string) => {
    return apiFetch<T.MessageResponse>(`/admin/events/${eventId}/approve-cancellation`, {
      method: 'POST',
    });
  },

  listTransactions: (page = 1, limit = 20, serverToken?: string) => {
    return apiFetch<T.PaginatedResponse<T.TransactionRow>>(
      `/admin/transactions?page=${page}&limit=${limit}`,
      {},
      serverToken,
    );
  },

  listWithdrawals: (
    params: { search?: string; status?: string; from?: string; to?: string; page?: number; limit?: number },
    serverToken?: string,
  ) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.status) query.set('status', params.status);
    if (params.from) query.set('from', params.from);
    if (params.to) query.set('to', params.to);
    query.set('page', String(params.page || 1));
    query.set('limit', String(params.limit || 20));
    return apiFetch<T.PaginatedResponse<T.WithdrawalRequestRow>>(
      `/admin/withdrawals?${query.toString()}`,
      {},
      serverToken,
    );
  },

  listDisputes: (page = 1, limit = 20, serverToken?: string) => {
    return apiFetch<T.PaginatedResponse<T.DisputeRow>>(
      `/admin/disputes?page=${page}&limit=${limit}`,
      {},
      serverToken,
    );
  },

  resolveDispute: (disputeId: string, payload: { status: string; admin_note?: string }) => {
    return apiFetch<T.MessageResponse>(`/admin/disputes/${disputeId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  listFAQs: (serverToken?: string) => {
    return apiFetch<T.FAQItem[] | T.PaginatedResponse<T.FAQItem>>('/admin/faqs', {}, serverToken);
  },

  createFAQ: (data: T.CreateFAQRequest) => {
    return apiFetch<T.MessageResponse>('/admin/faqs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateFAQ: (faqId: string, data: T.UpdateFAQRequest) => {
    return apiFetch<T.MessageResponse>(`/admin/faqs/${faqId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteFAQ: (faqId: string) => {
    return apiFetch<T.MessageResponse>(`/admin/faqs/${faqId}`, { method: 'DELETE' });
  },

  listSubscriptionPlans: (serverToken?: string) => {
    return apiFetch<T.SubscriptionPlan[] | T.PaginatedResponse<T.SubscriptionPlan>>(
      '/admin/subscription-plans',
      {},
      serverToken,
    );
  },

  createSubscriptionPlan: (data: T.CreateSubscriptionPlanRequest) => {
    return apiFetch<T.MessageResponse>('/admin/subscription-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateSubscriptionPlan: (planId: string, data: T.UpdateSubscriptionPlanRequest) => {
    return apiFetch<T.MessageResponse>(`/admin/subscription-plans/${planId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  listVendorSubscriptions: (page = 1, limit = 20, serverToken?: string) => {
    return apiFetch<T.PaginatedResponse<T.VendorSubscription>>(
      `/admin/subscriptions?page=${page}&limit=${limit}`,
      {},
      serverToken,
    );
  },

  listSupportTickets: (page = 1, limit = 20, serverToken?: string) => {
    return apiFetch<T.PaginatedResponse<T.SupportTicket>>(
      `/admin/support?page=${page}&limit=${limit}`,
      {},
      serverToken,
    );
  },

  getSupportTicket: (ticketId: string, serverToken?: string) => {
    return apiFetch<T.SupportTicket>(`/admin/support/${ticketId}`, {}, serverToken);
  },

  updateSupportTicketStatus: (
    ticketId: string,
    status: 'open' | 'in_progress' | 'resolved' | 'closed',
  ) => {
    return apiFetch<T.MessageResponse>(`/admin/support/${ticketId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  getSettings: (serverToken?: string) => {
    return apiFetch<T.PlatformSettings>('/admin/settings', {}, serverToken);
  },

  updateSetting: (key: string, value: string) => {
    return apiFetch<T.MessageResponse>(`/admin/settings/${key}`, {
      method: 'PATCH',
      body: JSON.stringify({ value }),
    });
  },
};

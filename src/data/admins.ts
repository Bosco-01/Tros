export interface AdminProfileData {
  name: string;
  phone: string;
  email: string;
  role: string;
  jobTitle: string;
}

export interface AdminUserRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  jobTitle: string;
}

export const mockAdminProfile: AdminProfileData = {
  name: 'Admin User',
  phone: '+234 576845930232',
  email: 'admin@gmail.com',
  role: 'Super admin',
  jobTitle: 'Platform Administrator',
};

export const mockAdminUsers: AdminUserRow[] = [
  {
    id: '#0001290',
    name: 'Admin User',
    phone: '+234 4758492042',
    email: 'Admin@gmail.com',
    role: 'Super Admin',
    jobTitle: 'Platform Admin...',
  },
  {
    id: '#0001290',
    name: 'Johncustomer',
    phone: '+234 4758492042',
    email: 'Dev@admin.com',
    role: 'DevOps Admin',
    jobTitle: 'DevOps Admin',
  },
  {
    id: '#0001290',
    name: 'Johncustomer',
    phone: '+234 4758492042',
    email: 'Dev@admin.com',
    role: 'DevOps Admin',
    jobTitle: 'DevOps Admin',
  },
  {
    id: '#0001290',
    name: 'Johncustomer',
    phone: '+234 4758492042',
    email: 'Dev@admin.com',
    role: 'DevOps Admin',
    jobTitle: 'DevOps Admin',
  },
  {
    id: '#0001290',
    name: 'Johncustomer',
    phone: '+234 4758492042',
    email: 'Dev@admin.com',
    role: 'DevOps Admin',
    jobTitle: 'DevOps Admin',
  },
  {
    id: '#0001290',
    name: 'Johncustomer',
    phone: '+234 4758492042',
    email: 'Dev@admin.com',
    role: 'DevOps Admin',
    jobTitle: 'DevOps Admin',
  },
];
/** Shared API response types */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  counts: {
    temples: number;
    festivals: number;
    media: number;
    users: number;
    contents: number;
  };
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  createdAt: string;
  user?: { name: string; email?: string };
}

export interface Temple {
  id: string;
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  translations?: { name: string; language: string }[];
  city?: { slug: string };
  state?: { slug: string };
  deityType?: { slug: string };
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  mediaType: string;
  storagePath: string;
  fileSize: number;
  altText?: string;
  createdAt: string;
  uploadedBy?: { name: string };
}

export interface SlugEntity {
  id: string;
  slug: string;
  isActive?: boolean;
  createdAt: string;
}

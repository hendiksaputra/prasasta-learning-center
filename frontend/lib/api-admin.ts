import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout for large uploads
});

// Add request interceptor to include auth token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If FormData, remove Content-Type to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await adminApi.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: async () => {
    await adminApi.post('/auth/logout');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },
  me: async () => {
    const response = await adminApi.get('/auth/me');
    return response.data;
  },
};

// Courses API
export const coursesApi = {
  list: async (params?: { search?: string; status?: string; page?: number; per_page?: number }) => {
    const response = await adminApi.get('/admin/courses', { params });
    return response.data;
  },
  get: async (id: number) => {
    const response = await adminApi.get(`/admin/courses/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await adminApi.post('/admin/courses', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await adminApi.put(`/admin/courses/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await adminApi.delete(`/admin/courses/${id}`);
    return response.data;
  },
};

// Instructors API
export const instructorsApi = {
  list: async (params?: { search?: string; page?: number; per_page?: number }) => {
    const response = await adminApi.get('/admin/instructors', { params });
    return response.data;
  },
  get: async (id: number) => {
    const response = await adminApi.get(`/admin/instructors/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await adminApi.post('/admin/instructors', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await adminApi.put(`/admin/instructors/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await adminApi.delete(`/admin/instructors/${id}`);
    return response.data;
  },
};

// Enrollments API
export const enrollmentsApi = {
  list: async (params?: { status?: string; course_id?: number; page?: number; per_page?: number }) => {
    const response = await adminApi.get('/admin/enrollments', { params });
    return response.data;
  },
  get: async (id: number) => {
    const response = await adminApi.get(`/admin/enrollments/${id}`);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await adminApi.put(`/admin/enrollments/${id}`, data);
    return response.data;
  },
};

// Categories API
export const categoriesApi = {
  // Public API for dropdowns (no auth required)
  list: async () => {
    // Use public API endpoint since categories don't require auth
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    try {
      const response = await fetch(`${apiUrl}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      // API returns array directly, wrap it in data property for consistency
      return Array.isArray(data) ? { data } : data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { data: [] };
    }
  },
  // Admin API for CRUD operations
  adminList: async (params?: { search?: string; is_active?: boolean; page?: number; per_page?: number }) => {
    const response = await adminApi.get('/admin/categories', { params });
    return response.data;
  },
  get: async (id: number) => {
    const response = await adminApi.get(`/admin/categories/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await adminApi.post('/admin/categories', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await adminApi.put(`/admin/categories/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await adminApi.delete(`/admin/categories/${id}`);
    return response.data;
  },
};

// Testimonials API
export const testimonialsApi = {
  list: async (params?: { search?: string; status?: string; page?: number; per_page?: number }) => {
    const response = await adminApi.get('/admin/testimonials', { params });
    return response.data;
  },
  get: async (id: number) => {
    const response = await adminApi.get(`/admin/testimonials/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await adminApi.post('/admin/testimonials', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await adminApi.put(`/admin/testimonials/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await adminApi.delete(`/admin/testimonials/${id}`);
    return response.data;
  },
};

// Gallery API
export const galleryApi = {
  list: async (params?: { search?: string; status?: string; category?: string; page?: number; per_page?: number }) => {
    const response = await adminApi.get('/admin/gallery', { params });
    return response.data;
  },
  get: async (id: number) => {
    const response = await adminApi.get(`/admin/gallery/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await adminApi.post('/admin/gallery', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await adminApi.put(`/admin/gallery/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await adminApi.delete(`/admin/gallery/${id}`);
    return response.data;
  },
};

// Facilities API
export const facilitiesApi = {
  list: async (params?: { search?: string; status?: string; is_featured?: boolean; page?: number; per_page?: number }) => {
    const response = await adminApi.get('/admin/facilities', { params });
    return response.data;
  },
  get: async (id: number) => {
    const response = await adminApi.get(`/admin/facilities/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await adminApi.post('/admin/facilities', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await adminApi.put(`/admin/facilities/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await adminApi.delete(`/admin/facilities/${id}`);
    return response.data;
  },
};

// Export adminApi as both default and named export for flexibility
export { adminApi };
export default adminApi;


import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  image?: string;
  price: number;
  duration_days: number;
  total_hours: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published' | 'archived';
  category: {
    id: number;
    name: string;
    slug: string;
  };
  instructors?: Array<{
    id: number;
    name: string;
    photo?: string;
  }>;
  lessons?: Array<{
    id: number;
    title: string;
    duration_minutes: number;
  }>;
  what_you_will_learn?: string;
  learning_objectives?: string;
  prerequisites?: string;
  course_materials?: string[];
  requirements?: string[];
  facilities?: string[];
  internship_opportunity?: string;
  certification_info?: string;
  certification_price?: number;
  registration_link?: string;
  registration_deadline?: string;
  limited_quota?: boolean;
  training_method?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Instructor {
  id: number;
  name: string;
  email: string;
  bio?: string;
  photo?: string;
  specialization?: string;
}

export const courseApi = {
  getAll: async (params?: {
    category_id?: number;
    level?: string;
    search?: string;
    featured?: boolean;
    page?: number;
  }) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get(`/courses/${slug}`);
    return response.data;
  },
};

export const categoryApi = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  },
};

export const instructorApi = {
  getAll: async () => {
    const response = await api.get('/instructors');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/instructors/${id}`);
    return response.data;
  },
};

export const enrollmentApi = {
  create: async (data: {
    course_id: number;
    name: string;
    email: string;
    phone: string;
    address?: string;
  }) => {
    const response = await api.post('/enrollments', data);
    return response.data;
  },
};

export default api;


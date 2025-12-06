import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// API base URL - can be overridden by environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Create axios instance with defaults
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token to requests
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle common errors
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear and redirect
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ============ Auth API ============

interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        role: string;
        name: string;
    };
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: string;
}

export const authApi = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const { data } = await api.post<LoginResponse>('/api/auth/login', { email, password });
        // Store token and user
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    },

    register: async (userData: RegisterData): Promise<{ message: string }> => {
        const { data } = await api.post('/api/auth/register', userData);
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    getToken: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    },

    getUser: () => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    },

    isAuthenticated: (): boolean => {
        return !!authApi.getToken();
    },
};

// ============ Cases API ============

export interface Case {
    id: string;
    readinessScore: number;
    status: 'READY' | 'MEDIATION_READY' | 'WAITING' | 'PARTIALLY_READY' | 'HIGH_RISK';
    lawyerConfirmed: boolean;
    witnessConfirmed: boolean;
    documentsReady: boolean;
    mediationWilling: 'NONE' | 'ONE_PARTY' | 'BOTH';
}

export interface CaseMetrics {
    total: number;
    ready: number;
    mediationReady: number;
    notReady: number;
    flaggedLawyers: number;
}

export const casesApi = {
    getAll: async (): Promise<Case[]> => {
        const { data } = await api.get<Case[]>('/api/cases');
        return data;
    },

    getMetrics: async (): Promise<CaseMetrics> => {
        const { data } = await api.get<CaseMetrics>('/api/cases/metrics');
        return data;
    },

    sendReminder: async (caseId: string): Promise<void> => {
        await api.post(`/api/cases/${caseId}/remind`);
    },
};

export default api;

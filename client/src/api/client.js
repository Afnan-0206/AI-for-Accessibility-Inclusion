import axios from 'axios';
import {
  getStoredMockDocuments,
  saveStoredMockDocuments,
  mockAnalyzeDocument,
  mockAskQuestion
} from '../mock/mockDocument';

// Base API URL configuration
const DEFAULT_API_URL = 'http://localhost:5000/api';
const rawApiUrl = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).trim().replace(/\/+$/, '');
export const API_BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

// Mock mode toggle:
// 1. Explicit VITE_USE_MOCK setting wins: 'true' -> mock, 'false' -> live API.
// 2. Otherwise: if a custom VITE_API_URL is configured (e.g. Render production URL), use the live API.
// 3. Fallback: if no custom backend URL is supplied, default to mock mode so preview demos never crash.
export const USE_MOCK =
  import.meta.env.VITE_USE_MOCK !== undefined
    ? import.meta.env.VITE_USE_MOCK === 'true'
    : Boolean(
        !import.meta.env.VITE_API_URL ||
        import.meta.env.VITE_API_URL.trim() === '' ||
        import.meta.env.VITE_API_URL === DEFAULT_API_URL
      );

// Token storage key
const TOKEN_KEY = 'samajh_auth_token';
const USER_KEY = 'samajh_auth_user';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || null;
}

export function setStoredAuth(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);

  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

// Request interceptor: attach Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor: 401 handling & predictable user-friendly errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearStoredAuth();
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
      return Promise.reject(new Error('Your session has expired. Please log in again.'));
    }

    const friendlyMessage = formatApiError(error);
    return Promise.reject(new Error(friendlyMessage));
  }
);

/**
 * Translates low-level errors into clear public-service friendly messages.
 */
export function formatApiError(error) {
  if (!error) return 'An unexpected error occurred. Please try again.';

  if (typeof error === 'string') return error;

  const serverMsg = error.response?.data?.error || error.response?.data?.message;
  if (serverMsg && typeof serverMsg === 'string') {
    return serverMsg;
  }

  if (
    error.code === 'ERR_NETWORK' ||
    error.message === 'Network Error' ||
    error.message?.includes('Network Error') ||
    error.message?.includes('ECONNREFUSED')
  ) {
    return 'Cannot connect to the Samajh backend server. Please make sure the server is running on port 5000.';
  }

  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'The request took too long. Please check your internet connection and try again.';
  }

  if (error.response) {
    const status = error.response.status;
    if (status === 400) return 'Invalid information provided. Please verify and try again.';
    if (status === 403) return 'You do not have permission to view or modify this document.';
    if (status === 404) return 'The requested document was not found.';
    if (status === 409) return 'An account with this email already exists. Please sign in instead.';
    if (status === 413) return 'Please choose a PDF or image smaller than 10 MB.';
    if (status >= 500) return 'The Samajh server encountered an issue. Please try again in a few moments.';
  }

  return error.message || 'We were unable to complete this action right now. Please try again.';
}

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------

export async function register({ name, email, password }) {
  if (USE_MOCK) {
    // Artificial small delay for realistic UX
    await new Promise((r) => setTimeout(r, 600));
    const mockUser = {
      id: `user-${Date.now()}`,
      name: name || 'Citizen User',
      email: email.toLowerCase(),
    };
    const mockToken = `mock-token-${Date.now()}`;
    setStoredAuth(mockToken, mockUser);
    return { user: mockUser, token: mockToken };
  }

  try {
    const res = await api.post('/auth/register', { name, email, password });
    const { token, user } = res.data;
    setStoredAuth(token, user);
    return { token, user };
  } catch (err) {
    throw new Error(formatApiError(err));
  }
}

export async function login({ email, password }) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    const mockUser = {
      id: 'mock-user-1',
      name: email.split('@')[0] || 'Citizen User',
      email: email.toLowerCase(),
    };
    const mockToken = `mock-token-${Date.now()}`;
    setStoredAuth(mockToken, mockUser);
    return { user: mockUser, token: mockToken };
  }

  try {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    setStoredAuth(token, user);
    return { token, user };
  } catch (err) {
    throw new Error(formatApiError(err));
  }
}

export async function getMe() {
  if (USE_MOCK) {
    const stored = getStoredUser();
    if (stored) return stored;
    return { id: 'mock-user-1', name: 'Citizen User', email: 'citizen@example.com' };
  }

  try {
    const res = await api.get('/auth/me');
    return res.data?.user || res.data;
  } catch (err) {
    throw new Error(formatApiError(err));
  }
}

// -------------------------------------------------------------
// Document Endpoints
// -------------------------------------------------------------

export async function analyzeDocument(file, language = 'en') {
  if (!file) {
    throw new Error('Please select a document or photo to analyze.');
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Please choose a PDF or image smaller than 10 MB.');
  }

  if (USE_MOCK) {
    // Simulate multi-step processing: upload -> reading
    await new Promise((r) => setTimeout(r, 1200));
    const result = mockAnalyzeDocument(file, language);
    return result;
  }

  try {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('language', language);

    const res = await api.post('/documents/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data?.document || res.data;
  } catch (err) {
    throw new Error(formatApiError(err) || 'Your document could not be analyzed. Please try again.');
  }
}

export async function getDocuments() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    return getStoredMockDocuments();
  }

  try {
    const res = await api.get('/documents');
    return res.data?.documents || res.data || [];
  } catch (err) {
    throw new Error(formatApiError(err));
  }
}

export async function getDocument(id) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const docs = getStoredMockDocuments();
    const doc = docs.find((d) => d.id === id);
    if (!doc) {
      throw new Error('The requested document was not found.');
    }
    return doc;
  }

  try {
    const res = await api.get(`/documents/${id}`);
    return res.data?.document || res.data;
  } catch (err) {
    throw new Error(formatApiError(err));
  }
}

export async function deleteDocument(id) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    const docs = getStoredMockDocuments();
    const remaining = docs.filter((d) => d.id !== id);
    saveStoredMockDocuments(remaining);
    return { success: true, id };
  }

  try {
    const res = await api.delete(`/documents/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(formatApiError(err));
  }
}

export async function askQuestion(id, { question, language = 'en' }) {
  if (!question || !question.trim()) {
    throw new Error('Please type or speak a question.');
  }

  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 700));
    const answer = mockAskQuestion(id, question, language);
    return {
      answer,
      documentId: id,
      question,
      createdAt: new Date().toISOString()
    };
  }

  try {
    const res = await api.post(`/documents/${id}/ask`, {
      question,
      language
    });
    return res.data;
  } catch (err) {
    throw new Error(formatApiError(err) || 'Could not find an answer right now. Please try again.');
  }
}

export default api;

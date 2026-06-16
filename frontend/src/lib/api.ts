import { useAuthStore } from './auth-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().accessToken;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(Array.isArray(error.message) ? error.message.join(', ') : error.message);
  }
  return response.json();
}

export const authApi = {
  register: (body: { name: string; email: string; password: string }) => api<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) => api<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  forgotPassword: (body: { email: string }) => api<{ ok: boolean; resetUrl?: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  resetPassword: (body: { token: string; password: string }) => api<{ ok: boolean }>('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
  me: () => api<User>('/auth/me'),
  logout: () => api<{ ok: boolean }>('/auth/logout', { method: 'POST' })
};

export type User = { id: string; name: string; email: string; role: 'USER' | 'ADMIN'; avatarUrl?: string };
export type AuthResponse = { user: User; accessToken: string; refreshToken: string };

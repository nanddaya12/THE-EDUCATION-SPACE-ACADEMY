import { ApiResponse } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api/v1';

class ApiClient {
  private getHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('erp_auth_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  public async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return await response.json();
      }
      return {
        success: false,
        error: { message: `Service returned ${response.status} (non-JSON response)`, statusCode: response.status }
      };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.message || 'Network Error', statusCode: 500 }
      };
    }
  }

  public async post<T>(endpoint: string, payload: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return await response.json();
      }
      return {
        success: false,
        error: { message: `Service returned ${response.status} (non-JSON response)`, statusCode: response.status }
      };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.message || 'Network Error', statusCode: 500 }
      };
    }
  }
}

export const apiClient = new ApiClient();

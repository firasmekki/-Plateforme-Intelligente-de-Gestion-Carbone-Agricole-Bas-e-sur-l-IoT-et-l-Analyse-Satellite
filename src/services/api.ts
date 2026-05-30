// API Service for AgroCarbon Backend
// Utilise le proxy Vite (/api -> http://localhost:3001)
const API_URL = '/api';

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    // Toujours lire depuis localStorage pour être sûr
    this.token = localStorage.getItem('token');
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>
    };

    const token = this.getToken();
    console.log('🔑 Token from localStorage:', token ? token.substring(0, 20) + '...' : 'NULL');
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('📡 Sending with Authorization header');
    } else {
      console.log('⚠️ WARNING: No token available!');
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async register(name: string, email: string, password: string, role: string = 'client') {
    return await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  // Users (Admin)
  async getUsers() {
    return await this.request('/users');
  }

  async getPendingUsers() {
    return await this.request('/users/pending');
  }

  async approveUser(userId: number) {
    return await this.request(`/users/${userId}/approve`, {
      method: 'PATCH'
    });
  }

  async rejectUser(userId: number) {
    return await this.request(`/users/${userId}/reject`, {
      method: 'PATCH'
    });
  }

  // Sensors
  async getCarbonData(farmId: string, period: string = '30d') {
    return await this.request(`/sensors/carbon/${farmId}?period=${period}`);
  }

  async getWaterData(farmId: string, period: string = '7d') {
    return await this.request(`/sensors/water/${farmId}?period=${period}`);
  }

  async getEnergyData(farmId: string, period: string = '7d') {
    return await this.request(`/sensors/energy/${farmId}?period=${period}`);
  }

  async getSensorSummary(farmId: string) {
    return await this.request(`/sensors/summary/${farmId}`);
  }

  async sendSensorData(measurement: string, tags: Record<string, string>, fields: Record<string, number>) {
    return await this.request('/sensors/data', {
      method: 'POST',
      body: JSON.stringify({ measurement, tags, fields })
    });
  }

  // Parcelles (Client)
  async getMyParcelles() {
    return await this.request('/parcelles/my');
  }

  async createParcelle(parcelle: any) {
    return await this.request('/parcelles', {
      method: 'POST',
      body: JSON.stringify(parcelle)
    });
  }

  async deleteParcelle(id: string) {
    return await this.request(`/parcelles/${id}`, {
      method: 'DELETE'
    });
  }

  // Admin: Toutes les parcelles
  async getAllParcelles() {
    return await this.request('/parcelles');
  }

  // Reports
  async getReports() {
    return await this.request('/reports');
  }

  async generateCarbonReport(farmId: string, period: string, title?: string) {
    return await this.request('/reports/generate/carbon', {
      method: 'POST',
      body: JSON.stringify({ farmId, period, title })
    });
  }

  async generateWaterReport(farmId: string, period: string, title?: string) {
    return await this.request('/reports/generate/water', {
      method: 'POST',
      body: JSON.stringify({ farmId, period, title })
    });
  }

  async uploadReport(formData: FormData) {
    const url = `${API_URL}/reports/upload`;
    const token = this.getToken();
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async downloadReport(reportId: number) {
    const url = `${API_URL}/reports/download/${reportId}`;
    const token = this.getToken();
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `report-${reportId}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async deleteReport(reportId: number) {
    return await this.request(`/reports/${reportId}`, {
      method: 'DELETE'
    });
  }
}

export const api = new ApiService();
export default api;

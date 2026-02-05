export const authService = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('staff_token', token);
    }
  },

  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('staff_token');
    }
    return null;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('staff_token');
      window.location.href = '/login';
    }
  },

  getAuthHeader: () => {
    const token = authService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};

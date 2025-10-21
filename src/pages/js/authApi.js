import axios from 'axios';
const API_BASE_URL = 'http://localhost:3000/api/auth';

export default class AuthApi {
  api = axios.create({
    baseURL: API_BASE_URL,
  });

  async register(email, password) {
    try {
      const response = await this.api.post(`/sign-up`, { email, password });

      console.log(response);
    } catch (error) {
      throw error.response.data;
    }
  }

  async login(email, password) {
    try {
      const response = await this.api.post(`/sign-in`, { email, password });

      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    } catch (error) {
      throw error.response.data;
    }
  }

  async verifyOTP(email, otp) {
    try {
      const response = await this.api.post(`/verifyOTP`, { email, otp });

      return response;
    } catch (error) {
      throw error.response.data;
    }
  }

  async resendOTP(email) {
    try {
      await this.api.post(`/send-otp`, { email });
    } catch (error) {
      throw error.response.data;
    }
  }

  async forgetPasswordSendOtp(email) {
    try {
      const response = await this.api.post(`/forgot-password/sendOTP`, {
        email,
      });

      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async forgetPasswordVerifyOtp(email, otp) {
    try {
      await this.api.post(`/forgot-password/verifyOTP`, { email, otp });
    } catch (error) {
      throw error.response.data;
    }
  }

  async forgetPasswordReset(email, newPassword) {
    try {
      await this.api.post(`/forgot-password/reset`, { email, newPassword });
    } catch (error) {
      throw error.response.data;
    }
  }
  async resetNewPassword(email, oldPassword, newPassword) {
    try {
      await this.api.post(`/reset-password`, {
        email,
        oldPassword,
        newPassword,
      });
    } catch (error) {
      throw error.response?.data || { message: 'Unknown error' };
    }
  }

  async logout() {
    localStorage.clear();
    window.location.href = './pages/login.html';
  }

  async refreshToken() {
    try {
      const response = await this.api.post(`/protected/refresh-token`);

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      return response;
    } catch (error) {
      throw error.response.data;
    }
  }
}

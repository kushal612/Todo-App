import axios from "axios";
const API_BASE_URL = "http://localhost:3000/api";

export default class authApi {
  api = axios.create({
    baseURL: API_BASE_URL,
  });

  async register(email, password) {
    try {
      // const response = await fetch(`${API_BASE_URL}/auth/sign-up/`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ email, password }),
      // });

      const response = await this.api.post(`/auth/sign-up`, {
        email,
        password,
      });
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      // const response = await fetch(`${API_BASE_URL}/auth/sign-in/`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ email, password }),
      // });

      const response = await this.api.post(`auth/sign-in`, { email, password });

      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  async verifyOTP(email, otp) {
    try {
      // const response = await fetch(`${API_BASE_URL}/auth/verifyOTP`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ email, otp }),
      // });

      const response = await this.api.post(`/auth/verifyOTP`, { email, otp });

      return response;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  }

  async resendOTP(email) {
    try {
      // const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ email }),
      // });

      const response = await this.api.post(`/auth/send-otp`, { email });
    } catch (error) {
      console.error("Error resending OTP:", error);
      throw error;
    }
  }

  async forgotPasswordSendOtp(email) {
    try {
      await this.api.post(`/auth/forgot-password/sendOTP`, { email });
    } catch (error) {
      console.error("Error resending OTP:", error);
      throw error;
    }
  }

  async forgotPasswordVerifyOtp(email, otp) {
    try {
      await this.api.post(`/auth/forgot-password/verifyOTP`, {
        email,
        otp,
      });
    } catch (error) {
      console.error("Error in otp verification", error);
      throw error;
    }
  }

  async forgotPasswordReset(email, newPassword) {
    try {
      await this.api.post(`/auth/forgot-password/reset`, {
        email,
        newPassword,
      });
    } catch (error) {
      console.error("Error in password reset", error);
      throw error;
    }
  }

  logout() {
    TokenManager.clearTokens();
    window.location.href = "./pages/login.html";
  }

  isAuthenticated() {
    return TokenManager.isAuthenticated();
  }

  getToken() {
    return TokenManager.getAccessToken();
  }

  // Add refresh token endpoint
  async refreshToken() {
    try {
      // const response = await fetch(`${APIInterceptor.API_BASE_URL}/auth/refresh-token`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ refreshToken }),
      // });

      const response = await this.api.post(`/auth/protected/refresh-token`);

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      return response;
    } catch (error) {
      console.error("Token refresh error:", error);
      TokenManager.clearTokens();
      throw error;
    }
  }
}

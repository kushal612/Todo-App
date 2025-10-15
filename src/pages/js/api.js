const API_BASE_URL = "http://localhost:3000";

export const authAPI = {
  async register(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sign-up/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sign-in/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      // // Store both tokens
      // if (data.accessToken && data.refreshToken) {
      //   TokenManager.setTokens(data.accessToken, data.refreshToken);
      // } else if (data.token) {
      //   // Backward compatibility: if only one token is provided
      //   TokenManager.setTokens(data.token, data.token);
      // }

      return data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  async verifyOTP(email, otp) {
    try {
      const response = await fetch(`${API_BASE_URL}/otp/verifyOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "OTP verification failed");
      }

      const data = await response.json();

      // // Store both tokens
      // if (data.accessToken && data.refreshToken) {
      //   TokenManager.setTokens(data.accessToken, data.refreshToken);
      // } else if (data.token) {
      //   // Backward compatibility: if only one token is provided
      //   TokenManager.setTokens(data.token, data.token);
      // }

      return data;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  },

  async resendOTP(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/otp/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to resend OTP");
      }

      return await response.json();
    } catch (error) {
      console.error("Error resending OTP:", error);
      throw error;
    }
  },

  logout() {
    TokenManager.clearTokens();
    window.location.href = "./pages/loginPage.html";
  },

  isAuthenticated() {
    return TokenManager.isAuthenticated();
  },

  getToken() {
    return TokenManager.getAccessToken();
  },

  // Add refresh token endpoint
  async refreshToken() {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await fetch(
        `${APIInterceptor.API_BASE_URL}/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      TokenManager.setTokens(data.accessToken, data.refreshToken);
      return data;
    } catch (error) {
      console.error("Token refresh error:", error);
      TokenManager.clearTokens();
      throw error;
    }
  },
};

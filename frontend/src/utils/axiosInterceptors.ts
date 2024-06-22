import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("This is the access token", accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(
          "http://localhost:5000/api/users/refresh-token",
          { refreshToken: refreshToken },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
        const newAccessToken = response.data.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        if (typeof err.response === "undefined") {
          alert(
            "A network error occurred. " +
              "This could be a CORS issue or a dropped internet connection. " +
              "It is not possible for us to know."
          );
        }
        console.error("Refresh token error", err.response?.data || err.message);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export type RequestConfig = {
  headers?: Record<string, string | undefined | boolean>;
};

const api = (BASE_URL?: string, requestConfig?: RequestConfig) => {
  const service = axios.create({
    baseURL: BASE_URL ?? API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...requestConfig?.headers,
    },
  });

  // Add a request interceptor
  service.interceptors.request.use(
    async function (config) {
      const token = localStorage.getItem("access_token");
      if (token && !config.headers?.skipAuth) {
        config.headers.Authorization = "Bearer " + token;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  return service;
};

export default api;

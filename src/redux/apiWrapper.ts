import api, { RequestConfig } from "./api";

export const get = async (
  url: string,
  baseURL?: string,
  requestConfig?: RequestConfig,
) => {
  try {
    const response = await api(baseURL, requestConfig).get(url);
    return response;
  } catch (err: any) {
    throw err;
  }
};

export const post = async (
  url: string,
  payload?: unknown,
  baseURL?: string,
  requestConfig?: RequestConfig,
) => {
  try {
    const response = await api(baseURL, requestConfig).post(url, payload);
    return response;
  } catch (err: any) {
    throw err;
  }
};

export const put = async (
  url: string,
  payload: unknown,
  baseURL?: string,
  requestConfig?: RequestConfig,
) => {
  try {
    const response = await api(baseURL, requestConfig).put(url, payload);
    return response;
  } catch (err: any) {
    throw err;
  }
};

export const remove = async (
  url: string,
  payload?: unknown,
  baseURL?: string,
  requestConfig?: RequestConfig,
) => {
  try {
    const response = await api(baseURL, requestConfig).delete(url, {
      data: payload,
    });
    return response;
  } catch (err: any) {
    throw err;
  }
};

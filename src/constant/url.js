// export const BASE_URL = "http://172.30.1.17:8080/api";

const isDev = process.env.NODE_ENV === "development";

export const BASE_URL = "https://bankone.kro.kr";

export const API_BASE_URL = `${BASE_URL}/api`;

export const SSE_BASE_URL = `${API_BASE_URL}/v1/sse/subscribe`;

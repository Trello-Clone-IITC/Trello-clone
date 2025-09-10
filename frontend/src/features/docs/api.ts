import { api } from "@/lib/axiosInstance";

export const getApiDocs = async () => {
  const response = await api.get("/apiDocs/openapi.json");
  return response.data;
};

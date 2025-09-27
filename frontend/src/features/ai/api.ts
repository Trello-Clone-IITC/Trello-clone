import { api } from "@/lib/axiosInstance";

export interface AIChatRequest {
  message: string;
  boardId?: string;
}

export interface AIChatResponse {
  response: string;
  functionCalls?: Array<{
    name: string;
    arguments: any;
    result: any;
  }>;
}

export interface AvailableFunctions {
  [key: string]: {
    name: string;
    description: string;
    parameters: any;
  };
}

export const aiApi = {
  chat: async (data: AIChatRequest): Promise<AIChatResponse> => {
    const response = await api.post("/ai/chat", data);
    return response.data.data;
  },

  getAvailableFunctions: async (): Promise<AvailableFunctions> => {
    const response = await api.get("/ai/functions");
    return response.data.data;
  },
};

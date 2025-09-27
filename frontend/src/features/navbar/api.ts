import { api } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/shared/types/apiResponse";
import type { SearchResultsDto } from "@ronmordo/contracts";

export const search = async (searchText: string) => {
  const { data } = await api.get<ApiResponse<SearchResultsDto>>(
    `/search?q=${searchText}`
  );
  return data.data;
};

import { useQuery } from "@tanstack/react-query";
import { getApiDocs } from "../api";

export const useGetDocs = () => {
  return useQuery({
    queryKey: ["api-docs"],
    queryFn: getApiDocs,
  });
};

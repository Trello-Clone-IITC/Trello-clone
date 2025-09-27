import { useQuery } from "@tanstack/react-query";
import { search } from "../api";

export const useSearch = (searchText: string) => {
  return useQuery({
    queryKey: ["search", searchText],
    queryFn: () => search(searchText),
  });
};

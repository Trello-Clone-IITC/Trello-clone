import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OnBoardingData } from "../types";
import { onBoarding } from "../api";

export const useOnBoarding = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["onBoarding"],
    mutationFn: async (data: OnBoardingData) => {
      onBoarding(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

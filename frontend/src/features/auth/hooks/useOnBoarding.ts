import { useMutation } from "@tanstack/react-query";
import type { OnBoardingData } from "../types";
import { onBoarding } from "../api";

export const useOnBoarding = () => {
  return useMutation({
    mutationKey: ["onBoarding"],
    mutationFn: async (data: OnBoardingData) => {
      onBoarding(data);
    },
  });
};

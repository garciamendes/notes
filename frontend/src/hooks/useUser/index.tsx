import { useQuery } from "@tanstack/react-query";
import api from "../../infra/api";
import type { AxiosError } from "axios";
import type { UserDetail } from "./schemas";

export const useUSer = () => {
  const me = useQuery({
    queryFn: async () => {
      try {
        const result = await api.get<UserDetail>("/api/user/me");
        return result.data
      } catch (error) {
        const err = error as AxiosError;
        const message = (err.response?.data as string) || err.message;

        throw new Error(message);
      }
    },
    queryKey: ['me']
  });

  return {
    me
  };
};

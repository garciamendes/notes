import { useMutation } from "@tanstack/react-query";
import type { UserLogin, UserLoginResponse, UserRegister } from "./schemas";
import api from "../../infra/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { queryClient } from "../../App";
import type { AxiosError } from "axios";

export const useAuth = () => {
  const navigator = useNavigate();

  const signup = useMutation({
    mutationFn: async (data: UserRegister) => {
      try {
        await api.post("/api/user/register", data);
      } catch (error) {
        const err = error as AxiosError;
        const message = (err.response?.data as string) || err.message;

        throw new Error(message);
      }
    },
    onSuccess: () => {
      toast.success("Cadastrado com sucesso");
      navigator("/auth/login", { replace: true });
    },
    onError: (error) => {
      const { message } = error;

      if (message) {
        toast.error(message);
        return;
      }

      toast.error("Erro ao tentar cadastrar");
    },
  });

  const signin = useMutation({
    mutationFn: async (data: UserLogin) => {
      try {
        const result = await api.post<UserLoginResponse>(
          "/api/user/login",
          data
        );

        return result;
      } catch (error) {
        const err = error as AxiosError;
        const message = (err.response?.data as string) || err.message;

        throw new Error(message);
      }
    },
    onSuccess: (response) => {
      const { token } = response.data;

      sessionStorage.setItem("token", token);
      navigator("/", { replace: true });
    },
    onError: (error) => {
      const { message } = error;

      if (message) {
        toast.error(message);
        return;
      }

      toast.error("Erro ao tentar logar");
    },
  });

  const isAuthenticated = () => {
    return !!sessionStorage.getItem("token");
  };

  const logout = () => {
    sessionStorage.clear();
    queryClient.clear();

    navigator("/auth/login", { replace: true });
  };

  return {
    signup,
    signin,
    isAuthenticated,
    logout,
  };
};

import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import type { LoginFormSchema } from "../components/forms/login";
import {
  getCustomerComplaints,
  loginUser,
  registerUser,
  type CustomerComplaints,
} from "../apis/backendApi";
import { useAuth } from "../context/AuthContext";
import type { RegisterFormSchema } from "../components/forms/register";
import type { ComplaintFilters } from "../routes";

export const useLoginUser = (onSuccess: () => void) => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (model: LoginFormSchema): Promise<string> => loginUser(model),
    onSuccess: (token) => {
      login(token);
      onSuccess();
    },
  });
};

export const useRegisterUser = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: (model: RegisterFormSchema): Promise<number> =>
      registerUser(model),
    onSuccess: () => onSuccess(),
  });
};

export const useGetCustomerComplaints = (filters: ComplaintFilters) => {
  return useQuery({
    queryKey: ["CustomerComplaints", filters],
    queryFn: (): Promise<CustomerComplaints[]> =>
      getCustomerComplaints(filters),
    staleTime: 1000,
    placeholderData: keepPreviousData,
  });
};

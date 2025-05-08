import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import type { LoginFormSchema } from "../components/forms/login";
import {
  createComment,
  createComplaint,
  editComplaint,
  getCategories,
  getComplaintById,
  getCustomerComplaints,
  getCustomers,
  getUsers,
  loginUser,
  registerUser,
  type Categories,
  type Customer,
  type CustomerComplaints,
  type User,
} from "../apis/backendApi";
import { useAuth } from "../context/AuthContext";
import type { RegisterFormSchema } from "../components/forms/register";
import type { ComplaintFilters } from "../routes";
import type { NewComplaintFormSchema } from "../components/forms/newComplaint";
import type { NewCommentFormSchema } from "../components/forms/newComment";

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

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["Users"],
    queryFn: (): Promise<User[]> => getUsers(),
  });
};

export const useGetCustomerComplaints = (
  filters: ComplaintFilters,
  searchValue: string,
) => {
  return useQuery({
    queryKey: ["CustomerComplaints", filters, searchValue],
    queryFn: (): Promise<CustomerComplaints[]> =>
      getCustomerComplaints(filters, searchValue),
    staleTime: 1000,
    placeholderData: keepPreviousData,
  });
};

export const useGetCustomerComplaintById = (complaintId: string) => {
  return useQuery({
    queryKey: ["CustomerComplaintById"],
    queryFn: (): Promise<CustomerComplaints> => getComplaintById(complaintId),
  });
};

export const useGetCustomers = () => {
  return useQuery({
    queryKey: ["Customers"],
    queryFn: (): Promise<Customer[]> => getCustomers(),
  });
};

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["Categories"],
    queryFn: (): Promise<Categories[]> => getCategories(),
  });
};

export const usePostComplaint = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: (model: NewComplaintFormSchema): Promise<string> =>
      createComplaint(model),
    onSuccess: () => onSuccess(),
  });
};

export const usePutComplaint = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: (data: {
      model: NewComplaintFormSchema;
      complaintId: number;
    }): Promise<string> => editComplaint(data.model, data.complaintId),
    onSuccess: () => onSuccess(),
  });
};

export const usePostComment = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: (model: NewCommentFormSchema): Promise<string> =>
      createComment(model),
    onSuccess: () => onSuccess(),
  });
};

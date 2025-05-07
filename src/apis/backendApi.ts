import type { LoginFormSchema } from "../components/forms/login";
import type { NewCommentFormSchema } from "../components/forms/newComment";
import type { NewComplaintFormSchema } from "../components/forms/newComplaint";
import type { RegisterFormSchema } from "../components/forms/register";
import type { Priority } from "../enums/index";
import type { ComplaintFilters } from "../routes";

const BASE_URL = "http://localhost:3000/";

export const createHeaders = (includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    "Content-type": "application/json",
  };

  if (includeAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: createHeaders(endpoint !== "login" && endpoint !== "register"),
    ...options,
  };

  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    let errorDetail = "Unknown error";
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.message || JSON.stringify(errorJson);
    } catch (e) {
      errorDetail = await response.text();
    }
    throw new Error(`API error: ${response.status} - ${errorDetail}`);
  }

  return response.json();
}

export async function loginUser(model: LoginFormSchema): Promise<string> {
  const responseData = await apiFetch<{ token: string }>("login", {
    method: "POST",
    body: JSON.stringify(model),
    headers: createHeaders(false),
  });

  return responseData.token;
}

export async function registerUser(model: RegisterFormSchema): Promise<number> {
  const responseData = await apiFetch<{ userid: number }>("register", {
    method: "POST",
    body: JSON.stringify({
      email: model.email,
      name: `${model.firstName} ${model.lastName}`,
      password: model.password,
    }),
    headers: createHeaders(false),
  });

  return responseData.userid;
}

export interface Customer {
  ID: number;
  Name: string;
  CreatedAt: Date;
}

interface User {
  ID: number;
  Email: string;
  Name: string;
}

interface Comment {
  ID: number;
  Comment: string;
  ComplaintID: number;
  CreatedAt: Date;
  CreatedBy: User;
}

export interface CustomerComplaints {
  ID: number;
  Description: string;
  Customer: Customer;
  CreatedAt: Date;
  ModifiedAt: Date;
  CreatedBy: User;
  Priority: Priority;
  Comments: Comment[];
}

export async function getCustomerComplaints(
  filters: ComplaintFilters,
): Promise<CustomerComplaints[]> {
  const params = new URLSearchParams();
  const addParam = (key: string, value: string): void => {
    params.append(key, value);
  };

  addParam("sortBy", filters.sortBy.selected);
  addParam("sortOrder", filters.sortOrder);
  if (filters.userId) {
    addParam("userId", filters.userId);
  }
  if (filters.customerId) {
    addParam("customerId", filters.customerId);
  }

  const endpoint = `api/complaints?${params.toString()}`;

  const responseData = await apiFetch<CustomerComplaints[]>(endpoint, {
    method: "GET",
    headers: createHeaders(),
  });

  return responseData;
}

export async function getComplaintById(complaintId: string) {
  const responseData = await apiFetch<CustomerComplaints>(
    `api/complaints/${complaintId}`,
    {
      method: "GET",
      headers: createHeaders(),
    },
  );

  return responseData;
}

export async function getCustomers() {
  const responseData = await apiFetch<Customer[]>("api/customers", {
    method: "GET",
    headers: createHeaders(),
  });

  return responseData;
}

export async function createComplaint(model: NewComplaintFormSchema) {
  const responseData = await apiFetch<string>("api/complaints/create", {
    method: "POST",
    body: JSON.stringify(model),
    headers: createHeaders(),
  });

  return responseData;
}

export async function editComplaint(
  model: NewComplaintFormSchema,
  complaintId: number,
) {
  const responseData = await apiFetch<string>(
    `api/complaints/edit/${complaintId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        description: model.description,
        priority: model.priority,
      }),
      headers: createHeaders(),
    },
  );

  return responseData;
}

export async function createComment(model: NewCommentFormSchema) {
  const responseData = await apiFetch<string>(
    `api/comments/create/${model.complaintId}`,
    {
      method: "POST",
      body: JSON.stringify({ comment: model.comment }),
      headers: createHeaders(),
    },
  );

  return responseData;
}

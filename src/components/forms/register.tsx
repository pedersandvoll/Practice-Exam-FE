import { Button, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useRegisterUser } from "../../hooks/apiHooks";
import { useNavigate } from "@tanstack/react-router";

const registerSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("This is not a valid email"),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type RegisterFormSchema = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const navigate = useNavigate();
  const { mutateAsync } = useRegisterUser(() => navigate({ to: "/login" }));
  const form = useForm({
    validators: {
      onChangeAsync: registerSchema,
      onChangeAsyncDebounceMs: 500,
    },
    onSubmit: async ({ value }) => {
      mutateAsync(value as RegisterFormSchema);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Stack
        gap={2}
        sx={{
          padding: "20px",
          backgroundColor: "#F5F5F5",
          width: "100%",
          minWidth: "300px",
          maxWidth: "600px",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h4">Sign up</Typography>
        <form.Field
          name="email"
          children={(field) => (
            <TextField
              autoFocus
              fullWidth
              variant="filled"
              label="Email"
              onChange={(e) => field.handleChange(e.target.value)}
              value={field.state.value}
              error={field.state.meta.isTouched && !!field.state.meta.errors[0]}
              helperText={
                field.state.meta.isTouched &&
                field.state.meta.errors[0]?.message
              }
              type="email"
              sx={{ minWidth: "400px" }}
            />
          )}
        />
        <form.Field
          name="firstName"
          children={(field) => (
            <TextField
              fullWidth
              variant="filled"
              label="First name"
              onChange={(e) => field.handleChange(e.target.value)}
              value={field.state.value}
              error={field.state.meta.isTouched && !!field.state.meta.errors[0]}
              helperText={
                field.state.meta.isTouched &&
                field.state.meta.errors[0]?.message
              }
              sx={{ minWidth: "400px" }}
            />
          )}
        />
        <form.Field
          name="lastName"
          children={(field) => (
            <TextField
              fullWidth
              variant="filled"
              label="Last name"
              onChange={(e) => field.handleChange(e.target.value)}
              value={field.state.value}
              error={field.state.meta.isTouched && !!field.state.meta.errors[0]}
              helperText={
                field.state.meta.isTouched &&
                field.state.meta.errors[0]?.message
              }
              sx={{ minWidth: "400px" }}
            />
          )}
        />
        <form.Field
          name="password"
          children={(field) => (
            <TextField
              fullWidth
              variant="filled"
              label="Password"
              onChange={(e) => field.handleChange(e.target.value)}
              value={field.state.value}
              error={field.state.meta.isTouched && !!field.state.meta.errors[0]}
              helperText={
                field.state.meta.isTouched &&
                field.state.meta.errors[0]?.message
              }
              type="password"
              sx={{ minWidth: "400px" }}
            />
          )}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit}
              variant="contained"
              fullWidth
            >
              {isSubmitting ? "..." : "Log in"}
            </Button>
          )}
        />
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Typography>Already have an account?</Typography>
          <Button onClick={() => navigate({ to: "/login" })}>Log in</Button>
        </Stack>
      </Stack>
    </form>
  );
}

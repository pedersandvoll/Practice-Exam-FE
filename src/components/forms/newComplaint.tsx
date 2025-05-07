import {
  Autocomplete,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useGetCustomers, usePostComplaint } from "../../hooks/apiHooks";
import { useQueryClient } from "@tanstack/react-query";

const newComplaintSchema = z.object({
  customername: z.string().min(1, { message: "Customer is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

export type NewComplaintFormSchema = z.infer<typeof newComplaintSchema>;

interface NewComplaintFormProps {
  onCancel: () => void;
}

export default function NewComplaintForm(props: NewComplaintFormProps) {
  const { onCancel } = props;
  const queryClient = useQueryClient();
  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["CustomerComplaints"],
    });
  };
  const { data } = useGetCustomers();
  const { mutateAsync } = usePostComplaint(onSuccess);
  const form = useForm({
    validators: {
      onChangeAsync: newComplaintSchema,
      onChangeAsyncDebounceMs: 500,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value as NewComplaintFormSchema);
      onCancel();
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
      <Stack gap={2}>
        <Typography variant="h5" component="div">
          Ny klage
        </Typography>
        <form.Field
          name="customername"
          children={(field) => (
            <Autocomplete
              freeSolo
              disableClearable
              options={data ? data.map((customer) => customer.Name) : []}
              onChange={(_, newValue) => field.handleChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  autoFocus
                  fullWidth
                  variant="filled"
                  label="Kunde"
                  onChange={(e) => field.handleChange(e.target.value)}
                  value={field.state.value}
                  error={!!field.state.meta.errors[0]}
                  helperText={field.state.meta.errors[0]?.message}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      type: "search",
                    },
                  }}
                />
              )}
            />
          )}
        />
        <form.Field
          name="description"
          children={(field) => (
            <TextField
              fullWidth
              variant="filled"
              label="Beskrivelse"
              onChange={(e) => field.handleChange(e.target.value)}
              value={field.state.value}
              error={field.state.meta.isTouched && !!field.state.meta.errors[0]}
              helperText={
                field.state.meta.isTouched &&
                field.state.meta.errors[0]?.message
              }
            />
          )}
        />
        <Stack direction="row" alignItems="center" gap={1}>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit}
                variant="contained"
                fullWidth
              >
                {isSubmitting ? "..." : "Lagre"}
              </Button>
            )}
          />
          <Button onClick={onCancel} variant="contained" fullWidth>
            Avbryt
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}

import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useGetCustomers } from "../../hooks/apiHooks";
import { Priority } from "../../enums";

const newComplaintSchema = z.object({
  customername: z.string().min(1, { message: "Customer is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  priority: z.nativeEnum(Priority, { message: "Priority is required" }),
});

export type NewComplaintFormSchema = z.infer<typeof newComplaintSchema>;

interface NewComplaintFormProps {
  onCancel: () => void;
  onSave: (model: NewComplaintFormSchema) => Promise<void>;
  defaultValues?: NewComplaintFormSchema;
  edit?: boolean;
}

export default function NewComplaintForm(props: NewComplaintFormProps) {
  const {
    onCancel,
    onSave,
    defaultValues = {
      customername: "",
      description: "",
      priority: Priority.Medium,
    },
    edit = false,
  } = props;
  const { data } = useGetCustomers();
  const form = useForm({
    defaultValues: defaultValues,
    validators: {
      onChangeAsync: newComplaintSchema,
      onChangeAsyncDebounceMs: 500,
    },
    onSubmit: async ({ value }) => {
      await onSave(value as NewComplaintFormSchema);
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
          {!edit ? "Ny klage" : "Rediger klage"}
        </Typography>
        {!edit ? (
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
        ) : (
          <Typography>{form.store.state.values.customername}</Typography>
        )}
        <form.Field
          name="description"
          children={(field) => (
            <TextField
              fullWidth
              multiline
              maxRows={4}
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
        <form.Field
          name="priority"
          children={(field) => (
            <FormControl fullWidth>
              <InputLabel>Prioritet</InputLabel>
              <Select
                variant="filled"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value as Priority)}
              >
                <MenuItem value={Priority.High}>Høy</MenuItem>
                <MenuItem value={Priority.Medium}>Medium</MenuItem>
                <MenuItem value={Priority.Low}>Lav</MenuItem>
              </Select>
            </FormControl>
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

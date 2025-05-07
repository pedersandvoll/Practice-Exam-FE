import { IconButton, InputBase, Paper, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { usePostComment } from "../../hooks/apiHooks";
import { useQueryClient } from "@tanstack/react-query";

const newCommentSchema = z.object({
  complaintId: z.number(),
  comment: z.string().min(1, { message: "Comment is required" }),
});

export type NewCommentFormSchema = z.infer<typeof newCommentSchema>;

interface NewCommentFormProps {
  complaintId: number;
}

export default function NewCommentForm(props: NewCommentFormProps) {
  const { complaintId } = props;
  const queryClient = useQueryClient();
  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["CustomerComplaintById"],
    });
  };
  const { mutateAsync } = usePostComment(onSuccess);
  const form = useForm({
    defaultValues: {
      comment: "",
      complaintId: complaintId,
    },
    validators: {
      onChange: newCommentSchema,
    },
    onSubmit: async ({ formApi, value }) => {
      mutateAsync(value as NewCommentFormSchema);
      formApi.reset();
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
      <Paper
        sx={{
          my: "10px",
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          boxShadow: "none",
          border: "1px solid #e0e0e0",
          backgroundColor: "#f8f8f8",
          borderRadius: 2,
        }}
      >
        <form.Field
          name="comment"
          children={(field) => (
            <InputBase
              fullWidth
              placeholder="Legg til kommentar"
              onChange={(e) => field.handleChange(e.target.value)}
              value={field.state.value}
              error={!!field.state.meta.errors[0]}
              sx={{ my: 2 }}
            />
          )}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <IconButton type="submit" disabled={!canSubmit}>
              {isSubmitting ? <CancelScheduleSendIcon /> : <SendIcon />}
            </IconButton>
          )}
        />
      </Paper>
    </form>
  );
}

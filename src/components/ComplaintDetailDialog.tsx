import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { Priority } from "../enums";
import type { CustomerComplaints } from "../apis/backendApi";
import NewCommentForm from "./forms/newComment";

interface ComplaintDetailDialogProps {
  isOpen: boolean;
  complaint: CustomerComplaints | undefined;
  isLoading: boolean;
}

export const getPriorityLabel = (priority: Priority) => {
  switch (priority) {
    case Priority.High:
      return { label: "Høy", color: "error" };
    case Priority.Medium:
      return { label: "Medium", color: "warning" };
    case Priority.Low:
      return { label: "Lav", color: "success" };
    default:
      return { label: "Ukjent", color: "default" };
  }
};

export default function ComplaintDetailDialog({
  isOpen,
  complaint,
  isLoading,
}: ComplaintDetailDialogProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Dialog
        open={isOpen}
        onClose={() => navigate({ to: "/" })}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              boxShadow: "none",
              border: "1px solid #e0e0e0",
            },
          },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 5,
            }}
          >
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!complaint) {
    return null;
  }

  const priorityInfo = getPriorityLabel(complaint.Priority);

  return (
    <Dialog
      open={isOpen}
      onClose={() => navigate({ to: "/" })}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            boxShadow: "none",
          },
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{complaint.Customer.Name}</Typography>
          <Chip
            label={priorityInfo.label}
            color={priorityInfo.color as any}
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          {complaint.Description}
        </Typography>

        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Kategori: {complaint.Category.Name}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Opprettet:{" "}
            {new Date(complaint.CreatedAt).toLocaleString("no-NO", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            av {complaint.CreatedBy.Name}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Sist endret:{" "}
            {new Date(complaint.ModifiedAt).toLocaleString("no-NO", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Kommentarer ({complaint.Comments.length})
        </Typography>

        <NewCommentForm complaintId={complaint.ID} />

        {complaint.Comments.length > 0 ? (
          <Stack spacing={2}>
            {complaint.Comments.map((comment) => (
              <Box
                key={comment.ID}
                sx={{ p: 2, bgcolor: "grey.100", borderRadius: 1 }}
              >
                <Typography variant="caption" color="text.secondary">
                  {comment.CreatedBy ? comment.CreatedBy.Name : "Unknown"} -{" "}
                  {new Date(comment.CreatedAt).toLocaleString("no-NO", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
                <Typography variant="body2">{comment.Comment}</Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Ingen kommentarer ennå
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => navigate({ to: "/" })}>Lukk</Button>
      </DialogActions>
    </Dialog>
  );
}


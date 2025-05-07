import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import {
  useGetCustomerComplaints,
  usePostComplaint,
  usePutComplaint,
} from "../hooks/apiHooks";
import { useState } from "react";
import { SortComplaintBy } from "../enums";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import EditIcon from "@mui/icons-material/Edit";
import CategoryIcon from "@mui/icons-material/Category";
import NewComplaintForm, {
  type NewComplaintFormSchema,
} from "../components/forms/newComplaint";
import { getPriorityLabel } from "../components/ComplaintDetailDialog";
import { useQueryClient } from "@tanstack/react-query";

const SortByOptions = {
  [SortComplaintBy.ModifiedAt]: "Sist redigert",
  [SortComplaintBy.CreatedAt]: "Sist lagd",
};

export interface ComplaintFilters {
  userId?: string;
  customerId?: string;
  sortBy: {
    selected: SortComplaintBy;
    options: typeof SortByOptions;
  };
  sortOrder: "asc" | "desc";
}

const initialComplaintFilters: ComplaintFilters = {
  sortBy: {
    selected: SortComplaintBy.ModifiedAt,
    options: SortByOptions,
  },
  sortOrder: "desc",
};

export const Route = createFileRoute("/")({
  beforeLoad: async ({ location }) => {
    const token = localStorage.getItem("token");
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Index,
});

interface IndexProps {
  children?: React.ReactNode;
}

export function Index(props: IndexProps) {
  const { children } = props;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["CustomerComplaints"],
    });
  };
  const { mutateAsync: asyncPostComplaint } = usePostComplaint(onSuccess);
  const { mutateAsync: asyncPutComplaint } = usePutComplaint(onSuccess);
  const [complaintFilter, setComplaintFilter] = useState<ComplaintFilters>(
    initialComplaintFilters,
  );
  const [newComplaint, setNewComplaint] = useState<boolean>(false);
  const [editComplaint, setEditComplaint] = useState<number[]>([]);
  const { data, isLoading } = useGetCustomerComplaints(complaintFilter);

  const handleSaveComplaint = async (model: NewComplaintFormSchema) => {
    await asyncPostComplaint(model);
  };

  const handleEditComplaint = async (
    model: NewComplaintFormSchema,
    complaintId: number,
  ) => {
    await asyncPutComplaint({ model: model, complaintId: complaintId });
  };

  const handleCancelEdit = (complaintId: number) => {
    setEditComplaint(editComplaint.filter((id) => id !== complaintId));
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "100px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ margin: "20px" }}>
      <Stack
        direction="row"
        alignItems="center"
        sx={{ flexWrap: "wrap", gap: "8px", padding: "20px" }}
      >
        <IconButton
          onClick={() => {
            setComplaintFilter({
              ...complaintFilter,
              sortOrder: complaintFilter.sortOrder === "asc" ? "desc" : "asc",
            });
          }}
        >
          <SwapVertIcon
            sx={{
              transform:
                complaintFilter.sortOrder === "asc"
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          />
        </IconButton>
        <FormControl sx={{ minWidth: "120px" }}>
          <Select
            defaultValue={complaintFilter.sortBy.selected}
            onChange={(event) => {
              setComplaintFilter({
                ...complaintFilter,
                sortBy: {
                  ...complaintFilter.sortBy,
                  selected: event.target.value as SortComplaintBy,
                },
              });
            }}
            sx={{
              height: "41px",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: "500",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "2px solid",
              },
            }}
          >
            {Object.entries(complaintFilter.sortBy.options).map(
              ([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ),
            )}
          </Select>
        </FormControl>
        <Button
          onClick={() => setNewComplaint(true)}
          disabled={newComplaint}
          variant="outlined"
          sx={{ marginLeft: "auto" }}
        >
          Lag ny klage
        </Button>
      </Stack>
      <Grid
        container
        spacing={2}
        sx={{
          alignItems: "stretch",
        }}
      >
        {newComplaint && (
          <Grid>
            <Card sx={{ width: 400 }} variant="outlined">
              <CardContent>
                <NewComplaintForm
                  onCancel={() => setNewComplaint(false)}
                  onSave={handleSaveComplaint}
                />
              </CardContent>
            </Card>
          </Grid>
        )}
        {data &&
          data.map((complaint) => {
            const priorityInfo = getPriorityLabel(complaint.Priority);

            if (editComplaint.includes(complaint.ID)) {
              return (
                <Grid>
                  <Card sx={{ width: 400 }} variant="outlined">
                    <CardContent>
                      <NewComplaintForm
                        onCancel={() => handleCancelEdit(complaint.ID)}
                        onSave={(model) =>
                          handleEditComplaint(model, complaint.ID)
                        }
                        defaultValues={{
                          customername: complaint.Customer.Name,
                          description: complaint.Description,
                          priority: complaint.Priority,
                          category: complaint.Category.ID,
                        }}
                        edit={true}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              );
            } else {
              return (
                <Grid key={complaint.ID}>
                  <Card
                    sx={{
                      maxWidth: 400,
                      width: "auto",
                      "&:hover": {
                        backgroundColor: "whitesmoke",
                        cursor: "pointer",
                      },
                      transition: "background-color 0.2s",
                    }}
                    variant="outlined"
                    onClick={() => {
                      navigate({
                        to: "/$complaintId",
                        params: { complaintId: complaint.ID.toString() },
                      });
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" alignItems="center">
                        <Typography variant="h5" component="div">
                          {complaint.Customer.Name}
                        </Typography>
                        <Chip
                          label={priorityInfo.label}
                          color={priorityInfo.color as any}
                          size="small"
                          sx={{ marginLeft: "auto" }}
                        />
                      </Stack>
                      <Stack direction="row" alignItems="center">
                        <CategoryIcon
                          sx={{ fontSize: "small", marginRight: 0.5 }}
                        />
                        <Typography variant="caption">
                          {complaint.Category.Name}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="body2"
                        sx={{
                          width: "365px",
                          wordWrap: "break-word",
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {complaint.Description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ width: "100%" }}
                      >
                        <Typography variant="caption">
                          {complaint.Comments.length} kommentarer
                        </Typography>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditComplaint([...editComplaint, complaint.ID]);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Stack>
                    </CardActions>
                  </Card>
                </Grid>
              );
            }
          })}
      </Grid>
      {children && children}
    </Box>
  );
}

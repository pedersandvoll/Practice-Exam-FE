import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useGetCustomerComplaints } from "../hooks/apiHooks";
import { useState } from "react";
import { SortComplaintBy } from "../enums";
import SwapVertIcon from "@mui/icons-material/SwapVert";

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
  component: Index,
});

function Index() {
  const [complaintFilter, setComplaintFilter] = useState<ComplaintFilters>(
    initialComplaintFilters,
  );
  const { data, isLoading } = useGetCustomerComplaints(complaintFilter);

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
      </Stack>
      <Grid container spacing={2}>
        {data &&
          data.map((complaint) => (
            <Grid>
              <Card sx={{ minWidth: 400 }} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="div">
                    {complaint.Customer.Name}
                  </Typography>
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
                  <Button size="small">
                    Kommentarer ({complaint.Comments.length})
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useGetCustomerComplaints } from "../hooks/apiHooks";
import { useState } from "react";

export interface ComplaintFilters {
  userId?: string;
  customerId?: string;
  sortBy: { selected: string; options: string[] };
  sortOrder: "asc" | "desc";
}

const initialComplaintFilters: ComplaintFilters = {
  sortBy: {
    selected: "modified_at",
    options: ["Sist redigert", "Sist lagd"],
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
        sx={{ flexWrap: "wrap", gap: "8px" }}
      >
        <FormControl sx={{ minWidth: "120px" }}>
          <Select
            defaultValue={complaintFilter.sortBy.selected}
            onChange={(event) => {
              setComplaintFilter({
                ...complaintFilter,
                sortBy: event.target.value,
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
            {complaintFilter.sortBy.options.map((sort, index) => (
              <MenuItem key={index} value={index.toString()}>
                {sort}
              </MenuItem>
            ))}
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

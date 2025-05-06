import { Grid } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import RegisterForm from "../components/forms/register";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", backgroundColor: "#00324E" }}
    >
      <RegisterForm />
    </Grid>
  );
}

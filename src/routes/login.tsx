import { Grid } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import LoginForm from "../components/forms/login";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", backgroundColor: "#00324E" }}
    >
      <LoginForm />
    </Grid>
  );
}

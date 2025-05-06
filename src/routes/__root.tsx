import {
  createRootRoute,
  Outlet,
  useMatchRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

export const Route = createRootRoute({
  component: () => {
    const matchRoute = useMatchRoute();
    const isAuthRoute =
      matchRoute({ to: "/login" }) || matchRoute({ to: "/register" });
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    return (
      <>
        <CssBaseline />
        {!isAuthRoute && (
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Kundeklager 360
                </Typography>
                {isAuthenticated ? (
                  <Button
                    color="inherit"
                    onClick={() => {
                      logout();
                      navigate({ to: "/login" });
                    }}
                  >
                    Logg ut
                  </Button>
                ) : (
                  <Button color="inherit" component={Link} to="/login">
                    Logg inn
                  </Button>
                )}
              </Toolbar>
            </AppBar>
          </Box>
        )}
        <Outlet />
        <TanStackRouterDevtools />
      </>
    );
  },
});

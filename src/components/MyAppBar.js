import { AppBar, Toolbar, Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

const MyAppBar = () => {
  const { currentUser } = useAuth();

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ backgroundColor: "green" }}>
        <Typography variant="h6">Speedy Speller</Typography>
        <div style={{ marginLeft: "auto" }}>
          {currentUser && (
            <Typography variant="body2">{currentUser.email}</Typography>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useAppState } from "../contexts/AppStateContext";
import { useNavigate } from "react-router-dom";

const MyAppBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { setSelectedItem } = useAppState();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClick = (componentName) => {
    setSelectedItem(componentName);
    setAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setSelectedItem(null);
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{ backgroundColor: "green" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Speedy Speller
          </Typography>
          <div style={{ marginLeft: "auto" }}>
            {user ? (
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ fontSize: "20px", textTransform: "none" }}
              >
                {user.email}
              </Button>
            ) : (
              // ...

              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{ fontSize: "16px" }}
              >
                Login
              </Button>
            )}
          </div>
        </Toolbar>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleMenuClick("WordPrompter")}>
            Practice
          </MenuItem>
          <hr style={{ margin: "5px 0px", borderColor: "#ffffff" }} />
          <MenuItem onClick={() => handleMenuClick("Lists")}>
            Manage Lists
          </MenuItem>
        </Menu>
      </AppBar>
    </>
  );
};

export default MyAppBar;

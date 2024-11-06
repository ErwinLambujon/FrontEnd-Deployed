import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Outlet, useNavigate } from "react-router-dom";
import { Avatar, IconButton, Menu, MenuItem, Divider } from "@mui/material";
import useAuth from "../hooks/useAuth";
import axios from "axios";

const UserAppbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { Logout } = useAuth();
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const menuItems = {
    home: "Home",
    venn: "Venn",
    saved: "Saved",
    rank: "Ranking",
    five_whys: "Five-Whys",
    hmw: "How Might We",
    report: "Report",
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await axios.get(
          "https://babyjoy456.pythonanywhere.com/api/user/get_currently_login/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUser();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoClick = () => {
    navigate("/home", { replace: true });
  };

  const handleMenuOptionClick = (path) => {
    navigate(`/${path}`, { replace: true });
    handleClose();
  };

  return (
    <Box>
      <AppBar
        position="static"
        elevation={2}
        sx={{
          bgcolor: "white",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0)",
          marginBottom: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 4,
            py: 2,
          }}
        >
          <Typography
            variant="h4"
            onClick={handleLogoClick}
            sx={{
              cursor: "pointer",
              fontWeight: "bold",
              color: "#186F65",
              "&:hover": { color: "#165" },
            }}
          >
            ElevateMe
          </Typography>

          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, color: "#444", marginBottom: -0.5 }}
                >
                  {user.first_name} {user.last_name}
                </Typography>
                <Typography variant="caption" sx={{ color: "#666" }}>
                  {user.user_type === "STUDENT" ? "Student" : "Teacher"}
                </Typography>
              </Box>
              <IconButton
                onClick={handleClick}
                sx={{
                  "&:hover": { bgcolor: "#f0f0f0" },
                  transition: "background-color 0.3s",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#186F65",
                    color: "white",
                    fontWeight: "bold",
                  }}
                  alt={user.first_name}
                >
                  {user.first_name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Box>
          )}

          <Menu
            id="avatar-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "avatar-menu-button",
            }}
            sx={{ mt: 1 }}
          >
            {Object.entries(menuItems).map(([key, value]) => (
              <MenuItem
                key={key}
                onClick={() =>
                  value === "Log Out" ? Logout() : handleMenuOptionClick(key)
                }
                sx={{
                  "&:hover": {
                    backgroundColor: "#f4f4f4",
                  },
                  px: 3,
                  py: 1,
                }}
              >
                {value}
              </MenuItem>
            ))}
            <Divider />
            <MenuItem
              onClick={Logout}
              sx={{
                color: "#d32f2f",
                "&:hover": { backgroundColor: "#ffebee" },
                px: 3,
                py: 1,
              }}
            >
              Log Out
            </MenuItem>
          </Menu>
        </Box>
      </AppBar>
      <Outlet />
    </Box>
  );
};

export default UserAppbar;

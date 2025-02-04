import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

const Sidebar = () => {
  return (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        backgroundColor: "#1F2937",
        color: "white",
        position: "fixed",
        top: 0,
        left: 0,
        padding: 2,
      }}
    >
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
      <Divider sx={{ backgroundColor: "white" }} />

      <List>
        {["⚙️ Part Master", "📝 Table"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              component={Link}
              to={index === 0 ? "/part" : "/table"}
            >
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;

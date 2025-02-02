import React, { useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import WidgetsIcon from "@mui/icons-material/Widgets";
import ListItemText from "@mui/material/ListItemText";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleMenuItemClick = () => {
    if (open) {
      setOpen(false);
    }
  };

  const DrawerList = (
    <Box role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {["⚙️Part Master", "📝Table"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              component={Link}
              to={index === 0 ? "/part" : "/table"}
              onClick={handleMenuItemClick}
            >
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <Button
        onClick={toggleDrawer(true)}
        className="lg:hidden  z-50 p-3 bg-gray-800 text-white rounded"
      >
      <WidgetsIcon />
      </Button>

      {/* Drawer for Sidebar */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        
      >
        <div className="flex justify-between items-center p-5 text-white bg-gray-800">
          <h2
            className={`text-2xl font-semibold`}
          >
            Admin Dashboard
          </h2>
        </div>

        {/* Drawer List (Menu Items) */}
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default Sidebar;

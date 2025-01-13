"use client";

import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  const toggleDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setIsDrawerOpen(false); 
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Minha Aplicação
          </Typography>
          <Button color="inherit" onClick={() => navigateTo("/user-groups")}>
            Grupos
          </Button>
          <Button color="inherit" onClick={() => navigateTo("/answers")}>
            Respostas
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={isDrawerOpen} onClose={() => toggleDrawer(false)}>
        <List sx={{ width: 250 }} role="presentation" onClick={() => toggleDrawer(false)} onKeyDown={() => toggleDrawer(false)}>
          <ListItem button onClick={() => navigateTo("/user-group")}>
            <ListItemText primary="Grupos" />
          </ListItem>
          <ListItem button onClick={() => navigateTo("/answers")}>
            <ListItemText primary="Respostas" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

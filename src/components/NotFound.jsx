import React from "react";
import { Box, Button } from "@mui/material";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/`;
    navigate(path);
  };

  return (
    <Box m="20px">
      <Header title="404" subtitle="The page you looking for is not found" />
      <Button type="submit" color="secondary" variant="contained" onClick={routeChange}>
        Return to HomePage
      </Button>
    </Box>
  );
};

export default NotFound;

import { Box, Stack, Button, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Menus = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [APIData, setAPIData] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let response = await axios.get(`https://localhost:7246/api/v1/Menus`);
    setAPIData(response.data["data"]);
  };

  const deleteTable = async (id) => {
    await axios
      .delete(`https://localhost:7246/api/v1/Menus/` + id)
      .finally(() => fetchData());
  };

  const directToCreateMenu = () => {
    let path = `/Menus/create`;
    navigate(path);
  };

  const directToUpdateMenu = (id) => {
    let path = `/Menus/update/` + id;
    navigate(path);
  };

  const directToMenuFoods = (id) => {
    let path = `/Menus/` + id + '/foods';
    navigate(path);
  };

  const columns = [
    {
      field: "index",
      headerName: "No.",
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
      flex: 0.2
    },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "isHidden",
      headerName: "Is Hidden",
      type: "boolean",
      flex: 0.5,
    },
    {
      field: "isDeleted",
      headerName: "Is Deleted",
      type: "boolean",
      flex: 0.5,
    },
    {
      field: "options",
      headerName: "Options",
      renderCell: (params) => {
        const currentRow = params.row;
        let viewFoodButton;
        let updateButton;
        let deleteButton;

        viewFoodButton = (
          <Button
            variant="outlined"
            color="warning"
            size="small"
            onClick={() => directToMenuFoods(currentRow["id"])}
          >
            View Foods
          </Button>
        );

        updateButton = (
          <Button
            variant="outlined"
            color="warning"
            size="small"
            onClick={() => directToUpdateMenu(currentRow["id"])}
          >
            Update
          </Button>
        );

        if (!currentRow["isDeleted"]) {
          deleteButton = (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => deleteTable(currentRow["id"])}
            >
              Delete
            </Button>
          );
        } else {
          deleteButton = null;
        }
        return (
          <Stack direction="row" spacing={2}>
            {viewFoodButton}
            {updateButton}
            {deleteButton}
          </Stack>
        );
      },
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header title="Menus" subtitle="List of Menus" />
      <Button
        variant="outlined"
        color="secondary"
        size="medium"
        onClick={directToCreateMenu}
      >
        Insert
      </Button>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={APIData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Menus;

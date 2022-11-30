import { Box, Stack, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [APIData, setAPIData] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let response = await axios.get(`https://oms-fa22se19.herokuapp.com/api/v1/Users`);
    setAPIData(response.data["data"]);
  };

  const deleteUser = async (id) => {
    await axios
      .delete(`https://oms-fa22se19.herokuapp.com/api/v1/Users/` + id)
      .finally(() => fetchData());
  };

  const directToCreateUser = () => {
    let path = `/users/create`;
    navigate(path);
  };

  const directToUpdateUser = (id) => {
    let path = `/users/update/` + id;
    navigate(path);
  };

  let index = 0;

  const columns = [
    {
      field: "index",
      headerName: "No.",
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "userName",
      headerName: "UserName",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "fullName",
      headerName: "FullName",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
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
        let updateButton = <Button></Button>;
        let deleteButton = <Button></Button>;

        updateButton = (
          <Button
            variant="outlined"
            color="warning"
            size="small"
            onClick={() => directToUpdateUser(currentRow["id"])}
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
              onClick={() => deleteUser(currentRow["id"])}
            >
              Delete
            </Button>
          );
        } else {
          deleteButton = null;
        }
        return (
          <Stack direction="row" spacing={2}>
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
      <Header title="USERS" subtitle="List of Users" />
      <Button
        variant="outlined"
        color="secondary"
        size="medium"
        onClick={directToCreateUser}
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

export default Users;

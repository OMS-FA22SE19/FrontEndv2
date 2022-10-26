import { Box, Stack, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import { fetchData } from "../../services/orderDetailsServices";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const TableTypes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [APIData, setAPIData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let response = await axios.get(`https://localhost:7246/api/v1/TableTypes`);
      setAPIData(response.data["data"]);
    };
    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    var requestBody = { id: id, status: status };
    await axios
      .put(`https://localhost:7246/api/v1/TableTypes/` + id, requestBody)
      .then(() => window.location.reload());
  };

  const deleteTable = async (id) => {
    await axios
      .put(`https://localhost:7246/api/v1/TableTypes/` + id)
      .then(() => window.location.reload());
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "chargePerSeat",
      headerName: "Charge per seat",
      type: "number",
      flex: 1,
    },
    {
        field: "canBeCombined",
        headerName: "Can Be Combined",
        type: "boolean",
        flex: 1,
      },
      {
        field: "isDeleted",
        headerName: "Is Deleted",
        type: "boolean",
        flex: 1,
      },
    {
      field: "options",
      headerName: "Options",
      renderCell: (params) => {
        const currentRow = params.row;
        return (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={() => updateStatus(currentRow["id"], "Processing")}
            >
              Update
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => deleteTable(currentRow["id"])}
            >
              Delete
            </Button>
          </Stack>
        );
      },
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header title="TABLE TYPES" subtitle="List of Table Types" />
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

export default TableTypes;

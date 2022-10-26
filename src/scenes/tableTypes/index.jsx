import { Box, Stack, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TableTypes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [APIData, setAPIData] = useState([]);

  let navigate = useNavigate(); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let response = await axios.get(`https://localhost:7246/api/v1/TableTypes`);
    setAPIData(response.data["data"]);
  };

  const deleteTable = async (id) => {
    await axios
      .delete(`https://localhost:7246/api/v1/TableTypes/` + id)
      .finally(() => fetchData());
  };

  const directToCreateTableType = () =>{ 
    let path = `/tableTypes/create`; 
    navigate(path);
  }

  const directToUpdateTableType = (id) =>{ 
    let path = `/tableTypes/update/` + id;   
    navigate(path);
  }

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
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
				let updateButton = <Button></Button>;
        let deleteButton = <Button></Button>;

				updateButton = (
					<Button
						variant="outlined"
						color="warning"
						size="small"
						onClick={() => directToUpdateTableType(currentRow["id"])}
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
        }
				else {
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
      <Header title="TABLE TYPES" subtitle="List of Table Types" />
      <Button
            variant="outlined"
						color="secondary"
						size="medium"
						onClick={directToCreateTableType}
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

export default TableTypes;

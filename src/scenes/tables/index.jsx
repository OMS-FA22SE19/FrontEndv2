import { Box, Stack, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Tables = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [APIData, setAPIData] = useState([]);
  const [editTable, setEditTable] = useState([]);

  const fetchData = async () => {
    let response = await axios.get(`https://localhost:7246/api/v1/Tables`);
    setAPIData(response.data["data"]);
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  let navigate = useNavigate(); 

  const updateTable = async (id) => {
    // var requestBody = { id: id, status: status };
    // await axios
    //   .put(`https://localhost:7246/api/v1/TableTypes/` + id, requestBody)
    //   .then(() => window.location.reload());
  };

  const deleteTable = async (id) => {
    await axios.delete(`https://localhost:7246/api/v1/Tables/` + id)
    .then()
    .catch((e) =>{
      fetchData()
    });
 };

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "numOfSeats",
      headerName: "Num Of Seats",
      type: "number",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
			field: "tableTypeName",
      headerName: "Table Type",
      flex: 1,
      renderCell: (params) => {
        const currentRow = params.row;
        return currentRow["tableType"]["name"];
      },
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
						onClick={() => directToUpdateTable(currentRow["id"])}
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

  const directToCreateTable = () =>{ 
    let path = `/tables/create`; 
    navigate(path);
  }

  const directToUpdateTable = (id) =>{ 
    let path = `/tables/update/` + id;   
    navigate(path);
  }

  return (
    <Box m="20px">
      <Header title="TABLES" subtitle="List of Tables" />
      <Button
            variant="outlined"
						color="secondary"
						size="medium"
						onClick={directToCreateTable}
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

export default Tables;

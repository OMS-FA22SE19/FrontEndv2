import { Box, Stack, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import { fetchData } from "../../services/orderDetailsServices";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from 'react';

const  OrderDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
	const [APIData, setAPIData] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
        let response = await axios.get(`https://localhost:7246/api/OrderDetails`)
        setAPIData(response.data["data"]);
      };
      fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    var requestBody = {id: id, status: status}
    await axios.put(`https://localhost:7246/api/OrderDetails/` + id, requestBody)
    .then(() => window.location.reload())
 };

  const columns = [
    { field: "id", headerName: "ID"},
    { field: "orderId", headerName: "Order ID", flex: 0.5 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "foodName",
      headerName: "Food",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
		{
			field: "options",
      headerName: "Options",
			renderCell: (params) => {
				const onClick = (e) => {
					const currentRow = params.row;
					return alert(JSON.stringify(currentRow, null, 4));
				};
				
				const currentRow = params.row;
				let optionButton = <Button></Button>;
				if(currentRow["status"] === 'Received') {
					optionButton = <Button variant="outlined" color="info" size="small" onClick={() => updateStatus(currentRow["id"], "Processing")}>Process</Button>
				}
				if(currentRow["status"] === 'Processing') {
					optionButton = <Button variant="outlined" color="warning" size="small" onClick={() => updateStatus(currentRow["id"], "Served")}>Serve</Button>
				}
				return (
					<Stack direction="row" spacing={2}>
						{optionButton}
					</Stack>
				);
			},
      flex: 1,
    }
  ];

  return (
    <Box m="20px">
      <Header
        title="ORDER DETAILS"
        subtitle="List of Order Details"
      />
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

export default OrderDetails;


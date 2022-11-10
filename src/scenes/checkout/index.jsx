import { Box, Stack, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Checkout = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [APIData, setAPIData] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [detailTitle, setDetailTitle] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let processingResponse = await axios.get(
      `https://localhost:7246/api/v1/Orders?Status=Processing`
    );
    let checkingResponse = await axios.get(
      `https://localhost:7246/api/v1/Orders?Status=Checking`
    );
    setAPIData([...processingResponse.data["data"], ...checkingResponse.data["data"]]);
  };

  const confirm = async (id) => {
    await axios
      .post(`https://localhost:7246/api/v1/Orders/` + id + "/Confirm")
      .then(() => fetchData());
  };

  const viewDetails = async (currentRow) => {
    var orderId = currentRow["id"];
    setDetailTitle("Details Of Order: " + orderId);
    setDetailData(currentRow["orderDetails"]);
    setOpen(true);
  };

  const orderColumns = [
    {
      field: "index",
      headerName: "No.",
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    { field: "tableId", headerName: "Table ID", flex: 0.5 },
    {
      field: "fullName",
      headerName: "User",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "phoneNumber", headerName: "Phone Number", flex: 0.5 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      cellClassName: "date-column--cell",
      renderCell: (params) => {
          const currentRow = params.row;
          return <div>{new Date(currentRow["date"]).toLocaleTimeString()}</div>;
      },
    },
    {
      field: "status",
      headerName: "Status",
    },
    {
      field: "amount",
      headerName: "Amount",
      headerAlign: "right",
      align: "right",
    },
    {
      field: "prePaid",
      headerName: "Deposit",
      headerAlign: "right",
      align: "right",
    },
    {
      field: "total",
      headerName: "Total",
      headerAlign: "right",
      align: "right",
    },
    {
      field: "details",
      headerName: "Details",
      renderCell: (params) => {
        const currentRow = params.row;
        return (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="info"
              size="small"
              onClick={() => viewDetails(currentRow)}
            >
              View Details
            </Button>
          </Stack>
        );
      },
      flex: 1,
    },
    {
      field: "options",
      headerName: "Options",
      renderCell: (params) => {
        const currentRow = params.row;
        if (currentRow["status"] === "Checking") {
          return (
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={() => confirm(currentRow["id"])}
            >
              Checkout
            </Button>
          );
        }
        return[];
      },
      flex: 1,
    },
  ];

  const detailColumns = [
    {
      field: "foodName",
      headerName: "Food",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "detailStatus",
      headerName: "Status",
      flex: 1,
      align: "left",
      renderCell: (params) => {
        const currentRow = params.row;
        return currentRow["status"];
      },
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
  ];

  return (
    <Box m="20px">
      <Header title="ORDERS" subtitle="List of Order" />
      <Box
        m="35px 0 0 0"
        height="40vh"
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
          columns={orderColumns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
      <br />
      {open && (
        <Box>
          <Header title="ORDER DETAILS" subtitle={detailTitle} />
          <Box
            m="0px 0 0 0"
            height="25vh"
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
              rows={detailData}
              columns={detailColumns}
              getRowId={(row) => row.foodName}
              components={{ Toolbar: GridToolbar }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Checkout;

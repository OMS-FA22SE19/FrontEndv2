import { Box, Stack, Button, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const Checkout = () => {
  const localSt = localStorage.getItem("token");
  const host = `https://localhost:7246`;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [APIData, setAPIData] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [detailTitle, setDetailTitle] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [searchBy, setSearchBy] = React.useState("TableId");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (localSt === null) {
      window.location.href = "/login";
    }
    const search = searchValue.trim();
    const searchByValue = searchBy.trim();
    let processingResponse = await axios.get(
      host +
        `/api/v1/Orders?Status=Processing` +
        `&searchBy=` +
        searchByValue +
        `&searchValue=` +
        search,
      {
        headers: { Authorization: `Bearer ${localSt}` },
      }
    );
    let checkingResponse = await axios.get(
      host +
        `/api/v1/Orders?Status=Checking` +
        `&searchBy=` +
        searchByValue +
        `&searchValue=` +
        search,
              {
        headers: { Authorization: `Bearer ${localSt}` },
      }
    );
    setAPIData([
      ...processingResponse.data["data"],
      ...checkingResponse.data["data"],
    ]);
  };

  const confirm = async (id) => {
    await axios
      .post(host + `/api/v1/Orders/` + id + "/Confirm",
            {
        headers: { Authorization: `Bearer ${localSt}` },
      })
      .then(() => fetchData());
  };

  const viewDetails = async (currentRow) => {
    const orderId = currentRow["id"];
    setDetailTitle("Details Of Order: " + orderId);
    setDetailData(currentRow["orderDetails"]);
    setOpen(true);
  };

  const orderColumns = [
    {
      field: "index",
      headerName: "No.",
      headerAlign: "center",
      align: "center",
      flex: 0.25,
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      field: "tableId",
      headerName: "Table ID",
      headerAlign: "right",
      align: "right",
      flex: 0.25,
    },
    {
      field: "fullName",
      headerName: "User",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      headerAlign: "right",
      align: "right",
      flex: 0.5,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      headerAlign: "right",
      align: "right",
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
      renderCell: (params) => {
        const currentRow = params.row;
        return <div>{currentRow["amount"].toLocaleString()}</div>;
      },
    },
    {
      field: "prePaid",
      headerName: "Deposit",
      headerAlign: "right",
      align: "right",
      renderCell: (params) => {
        const currentRow = params.row;
        return <div>{currentRow["prePaid"].toLocaleString()}</div>;
      },
    },
    {
      field: "total",
      headerName: "Total",
      headerAlign: "right",
      align: "right",
      renderCell: (params) => {
        const currentRow = params.row;
        return <div>{currentRow["total"].toLocaleString()}</div>;
      },
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
        return [];
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
      renderCell: (params) => {
        const currentRow = params.row;
        return <div>{currentRow["price"].toLocaleString()}</div>;
      },
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
      renderCell: (params) => {
        const currentRow = params.row;
        return <div>{currentRow["amount"].toLocaleString()}</div>;
      },
    },
  ];

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      fetchData();
    }
  };

  return (
    <Box m="20px">
      <Header title="ORDERS" subtitle="List of Order" />
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <Select
          sx={{ flex: 0.5 }}
          labelId="searchBy"
          id="searchBy"
          value={searchBy}
          onChange={(e) => {
            setSearchBy(e.target.value);
          }}
          label="Search By"
        >
          <MenuItem value="TableId">TableId</MenuItem>
          <MenuItem value="User">User</MenuItem>
          <MenuItem value="PhoneNumber">Phone Number</MenuItem>
        </Select>
        <InputBase
          onChange={handleSearchChange}
          sx={{ ml: 2, flex: 1 }}
          placeholder="Search"
          onKeyPress={handleKeyDown}
        />
        <IconButton onClick={fetchData} sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>
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

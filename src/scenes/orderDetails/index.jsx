import {
  Box,
  Stack,
  Button,
  useTheme,
  TextField,
  IconButton,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const OrderDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [APIData, setAPIData] = useState([]);
  const [promiseArguments, setPromiseArguments] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const noButtonRef = useRef(null);
  const [searchValue, setSearchValue] = React.useState("");
  const [tabValue, setTabValue] = React.useState(0);
  const [status, setStatus] = React.useState("Received");
  const [searchBy, setSearchBy] = React.useState("TableId");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const search = searchValue.trim();
    const searchByValue = searchBy.trim();
    let response = await axios.get(
      `https://localhost:7246/api/v1/OrderDetails` +
        `?status=` +
        status +
        `&searchBy=` +
        searchByValue +
        `&searchValue=` +
        search
    );

    console.log(status);

    const data = response.data["data"];
    let result = [];
    data.forEach((detail) => {
      let element = undefined;
      if (status === "Received" || status === "") {
        element = result.find((e) => {
          return (
            e.foodId == detail.foodId &&
            e.tableId == detail.tableId &&
            e.status == detail.status &&
            e.note == detail.note
          );
        });
      } else {
        element = result.find((e) => {
          return (
            e.foodId == detail.foodId &&
            e.tableId == detail.tableId &&
            e.date == new Date(detail.date).toLocaleTimeString() &&
            e.status == detail.status &&
            e.note == detail.note
          );
        });
      }
      if (element === undefined) {
        const orderDetail = {
          id: detail.id,
          orderId: detail.orderId,
          userId: detail.userId,
          phoneNumber: detail.phoneNumber,
          tableId: detail.tableId,
          date: new Date(detail.date).toLocaleTimeString(),
          status: detail.status,
          foodId: detail.foodId,
          foodName: detail.foodName,
          note: detail.note,
          price: detail.price,
          ids: [detail.id],
        };
        result.push(orderDetail);
      } else {
        element.ids.push(detail.id);
      }
    });
    setAPIData(result);
  };

  const fetchDataWithStatus = async (value) => {
    const search = searchValue.trim();
    let response = await axios.get(
      `https://localhost:7246/api/v1/OrderDetails` +
        `?status=` +
        value +
        `&searchValue=` +
        search
    );

    const data = response.data["data"];
    let result = [];
    data.forEach((detail) => {
      let element = undefined;
      if (status === "Received") {
        element = result.find((e) => {
          return (
            e.foodId == detail.foodId &&
            e.tableId == detail.tableId &&
            e.status == detail.status &&
            e.note == detail.note
          );
        });
      } else {
        element = result.find((e) => {
          return (
            e.foodId == detail.foodId &&
            e.tableId == detail.tableId &&
            e.date == new Date(detail.date).toLocaleTimeString() &&
            e.status == detail.status &&
            e.note == detail.note
          );
        });
      }
      if (element === undefined) {
        const orderDetail = {
          id: detail.id,
          orderId: detail.orderId,
          userId: detail.userId,
          phoneNumber: detail.phoneNumber,
          tableId: detail.tableId,
          date: new Date(detail.date).toLocaleTimeString(),
          status: detail.status,
          foodId: detail.foodId,
          foodName: detail.foodName,
          note: detail.note,
          price: detail.price,
          ids: [detail.id],
        };
        result.push(orderDetail);
      } else {
        element.ids.push(detail.id);
      }
    });
    setAPIData(result);
  };

  const handleEntered = () => {
    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
    // noButtonRef.current?.focus();
  };

  const handleUpdateYes = async () => {
    const { row, status } = promiseArguments;
    try {
      // Make the HTTP request to save in the backend
      for (let i = 0; i < quantity; i++) {
        const id = row.ids.pop();
        if (id !== undefined) {
          await updateStatus(id, status);
        }
      }
      setPromiseArguments(null);
      setQuantity(0);
    } catch (error) {
      setPromiseArguments(null);
      setQuantity(0);
      console.log(error);
    }
  };

  const handleUpdateNo = () => {
    setPromiseArguments(null);
  };

  function handleQuantityChange(e) {
    setQuantity(e.target.value);
  }

  const renderConfirmEditDialog = () => {
    if (!promiseArguments) {
      return null;
    }

    const { row, status } = promiseArguments;

    return (
      <Dialog
        maxWidth="xs"
        TransitionProps={{ onEntered: handleEntered }}
        open={!!promiseArguments}
      >
        <DialogTitle>Updating status</DialogTitle>
        <DialogContent dividers>{`Pressing 'Yes' to confirm.`}</DialogContent>
        <TextField
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
        ></TextField>
        <DialogActions>
          <Button ref={noButtonRef} onClick={handleUpdateNo}>
            No
          </Button>
          <Button
            onClick={() => {
              handleUpdateYes();
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const updateStatus = async (id, status) => {
    let requestBody = { id: id, status: status };
    await axios
      .put(`https://localhost:7246/api/v1/OrderDetails/` + id, requestBody)
      .then(() => fetchData());
  };

  const columns = [
    {
      field: "id",
      headerName: "No.",
      headerAlign: "center",
      align: "center",
      flex: 0.25,
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      field: "tableId",
      headerName: "Table ID",
      flex: 0.25,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      headerAlign: "right",
      align: "right",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      headerAlign: "right",
      align: "right",
      flex: 1,
    },
    {
      field: "foodName",
      headerName: "Food",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "note",
      headerName: "Note",
      headerAlign: "left",
      align: "left",
      flex: 2,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
      renderCell: (params) => {
        const currentRow = params.row;
        currentRow.quantity = currentRow?.ids?.length ?? 0;
        return currentRow.quantity;
      },
    },
    {
      field: "options",
      headerName: "Options",
      renderCell: (params) => {
        const currentRow = params.row;
        let optionButton = <Button></Button>;
        if (currentRow["status"] === "Received") {
          optionButton = (
            <Button
              variant="outlined"
              color="info"
              size="small"
              onClick={() => {
                setQuantity(currentRow.quantity);
                setPromiseArguments({ row: currentRow, status: "Processing" });
              }}
            >
              Process
            </Button>
          );
        }
        if (currentRow["status"] === "Processing") {
          optionButton = (
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={() => {
                setQuantity(currentRow.quantity);
                setPromiseArguments({ row: currentRow, status: "Served" });
              }}
            >
              Serve
            </Button>
          );
        }
        return (
          <Stack direction="row" spacing={2}>
            {optionButton}
          </Stack>
        );
      },
      flex: 1,
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

  const handleTabChange = (event, newValue) => {
    let status = "Received";
    switch (newValue) {
      case 0:
        setStatus("Received");
        break;
      case -3:
        setStatus("Reserved");
        status = "Reserved";
        break;
      case 1:
        setStatus("Processing");
        status = "Processing";
        break;
      case 2:
        setStatus("Served");
        status = "Served";
        break;
      default:
        break;
    }
    setTabValue(newValue);
    fetchDataWithStatus(status);
  };

  return (
    <Box m="20px">
      <Header title="ORDER DETAILS" subtitle="List of Order Details" />
      <Box sx={{ width: "100%", bgcolor: colors.blueAccent[700] }}>
        <Tabs
          value={tabValue}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleTabChange}
        >
          <Tab value={0} label="Received" />
          <Tab value={-3} label="Reserved" />
          <Tab value={1} label="Processing" />
          <Tab value={2} label="Served" />
        </Tabs>
      </Box>
      {/* SEARCH BAR */}
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
          <MenuItem value="PhoneNumber">Phone Number</MenuItem>
          <MenuItem value="FoodName">Food</MenuItem>
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
      {renderConfirmEditDialog()}
      <Box
        m="40px 0 0 0"
        height="65vh"
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

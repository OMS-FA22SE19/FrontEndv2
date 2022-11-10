import { Box, Stack, Button, useTheme, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

const OrderDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [APIData, setAPIData] = useState([]);
  const [promiseArguments, setPromiseArguments] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const noButtonRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let response = await axios.get(
      `https://localhost:7246/api/v1/OrderDetails`
    );
    // setAPIData(response.data["data"]);
    const data = response.data["data"];
    let result = [];
    data.forEach((detail) => {
      const element = result.find(e => {
        return e.foodId == detail.foodId && e.tableId == detail.tableId && e.date == new Date(detail.date).toLocaleTimeString() && e.status == detail.status;
      })
      if(element === undefined) {
        const orderDetail = 
          {
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
            ids: [detail.id]
          }
        result.push(orderDetail)
      }
      else {
        element.ids.push(detail.id);
      }
    })
    setAPIData(result);
  };

  const handleEntered = () => {
    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
    // noButtonRef.current?.focus();
  };

  const handleUpdateYes = async () => {
    const { row, status} = promiseArguments;
    try {
      // Make the HTTP request to save in the backend
      for(let i = 0; i < quantity; i++) {
        const id = row.ids.pop();
        if(id !== undefined) {
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

  function handleQuantityChange (e) {
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
        <DialogContent dividers>
        {`Pressing 'Yes' to confirm.`}
        </DialogContent>
        <TextField type="number" onChange={handleQuantityChange} ></TextField>
        <DialogActions>
          <Button ref={noButtonRef} onClick={handleUpdateNo}>
            No
          </Button>
          <Button onClick={() => {
            handleUpdateYes();
          }}>Yes</Button>
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
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    { field: "tableId", headerName: "Table ID" },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1
    },
    {
      field: "date",
      headerName: "Date",
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
      headerName: "quantity",
      flex: 1,
      renderCell: (params) => {
        const currentRow = params.row;
        return currentRow?.ids?.length ?? 0;
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
                setPromiseArguments({row: currentRow, status: "Processing"});
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
                setPromiseArguments({row: currentRow, status: "Served"});
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

  return (
    <Box m="20px">
      <Header title="ORDER DETAILS" subtitle="List of Order Details" />
      {renderConfirmEditDialog()}
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

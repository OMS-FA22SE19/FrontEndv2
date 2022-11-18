import * as React from "react";
import Button from "@mui/material/Button";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import {
  DataGrid,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import axios from "axios";
import { Box, useTheme, IconButton } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const Reservations = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const noButtonRef = React.useRef(null);
  const [deleteArguments, setDeleteArguments] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState(null);
  const [tabValue, setTabValue] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState("");
  const [status, setStatus] = React.useState("Reserved");

  const handleCloseSnackbar = () => setSnackbar(null);

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteYes = async () => {
    const { id, name } = deleteArguments;

    try {
      // Make the HTTP request to save in the backend
      handleCancelReservation(id);
      setDeleteArguments(null);
      setSnackbar({
        children: "Reservation " + name + " successfully deleted",
        severity: "success",
      });
    } catch (error) {
      setDeleteArguments(null);
    }
  };

  const handleCancelReservation = async (id) => {
    await axios
      .delete(`https://localhost:7246/api/v1/Reservations/` + id)
      .then((response) => {
        if (response.status === 204) {
          fetchData();
        }
      })
      .catch((error) => console.log(error));
  };

  const handleEntered = () => {
    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
    // noButtonRef.current?.focus();
  };

  

  const renderConfirmDeleteDialog = () => {
    if (!deleteArguments) {
      return null;
    }

    const { name } = deleteArguments;

    return (
      <Dialog
        maxWidth="xs"
        TransitionProps={{ onEntered: handleEntered }}
        open={!!deleteArguments}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent dividers>
          {`Pressing 'Yes' will remove ${name}.`}
        </DialogContent>
        <DialogActions>
          <Button
            ref={noButtonRef}
            onClick={() => {
              setDeleteArguments(null);
            }}
          >
            No
          </Button>
          <Button onClick={handleDeleteYes}>Yes</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const fetchData = async () => {
    const search = searchValue.trim();
    let response = await axios.get(
      `https://localhost:7246/api/v1/Reservations` + `?status=` + status + `&searchValue=` + search
    );
    setRows(response.data["data"]);
  };

  const fetchDataWithStatus = async (status) => {
    const search = searchValue.trim();
    let response = await axios.get(
      `https://localhost:7246/api/v1/Reservations` + `?status=` + status + `&searchValue=` + search
    );
    setRows(response.data["data"]);
  };

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleDeleteClick = (id, name) => () => {
    setDeleteArguments({ id, name });
  };

  

  const columns = [
    {
      field: "index",
      headerName: "No.",
      renderCell: (index) => {
        let id = index.api.getRowIndex(index?.row?.id) + 1;
        return id;
      },
      flex: 0.1,
    },
    {
      field: "user",
      headerName: "Customer",
      flex: 1,
      renderCell: (params) => {
        const currentRow = params.row;
        return currentRow["user"]["fullName"];
      },
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 0.5,
      renderCell: (params) => {
        const currentRow = params.row;
        return currentRow["user"]["phoneNumber"];
      },
    },
    {
      field: "numOfPeople",
      headerName: "People",
      type: "number",
      flex: 0.3,
    },
    {
      field: "tableType",
      headerName: "Table Type",
      flex: 0.5,
    },
    {
      field: "numOfSeats",
      headerName: "Seats",
      type: "number",
      flex: 0.3,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      flex: 0.3,
    },
    {
      field: "prePaid",
      headerName: "Deposit",
      type: "number",
      flex: 0.5,
    },
    {
      field: "startTime",
      headerName: "Start Time",
      flex: 1,
      renderCell: (params) => {
        const currentRow = params.row;
        return new Date(currentRow["startTime"]).toLocaleString();
      },
    },
    {
      field: "endTime",
      headerName: "End Time",
      type: "Date",
      flex: 1,
      renderCell: (params) => {
        const currentRow = params.row;
        return new Date(currentRow["endTime"]).toLocaleString();
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      getActions: (params) => {
        const currentRow = params.row;
        const id = currentRow.id;
        const name = currentRow.name;
        const status = currentRow.status;

        if (
          status.toLowerCase() === "available" ||
          status.toLowerCase() === "reserved"
        ) {
          return [
            <GridActionsCellItem
              icon={<PlaylistRemoveIcon />}
              label="Delete"
              onClick={handleDeleteClick(id, name)}
              color="inherit"
            />,
          ];
        }

        return [];
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

  const handleTabChange = (event, newValue) => {
    let status = "Reserved";
    switch (newValue) {
      case 0:
        setStatus("Reserved");
        break;
      case 1:
        setStatus("Available");
        status = "Available";
        break;
      case 2:
        setStatus("CheckIn");
        status = "CheckIn";
        break;
      case 3:
        setStatus("Cancelled");
        status = "Cancelled";
        break;
      default:
        break;
    }
    setTabValue(newValue);
    fetchDataWithStatus(status);
  };

  return (
    <Box m="20px">
      <Header title="RESERVATIONS" subtitle="List of Reservations" />
      <Box sx={{ width: "100%", bgcolor: colors.blueAccent[700] }}>
        <Tabs
          value={tabValue}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleTabChange}
        >
          <Tab label="Reserved" />
          <Tab label="Available" />
          <Tab label="CheckIn" />
          <Tab label="Cancelled" />
        </Tabs>
      </Box>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
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
      {renderConfirmDeleteDialog()}
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
          "& .Mui-error": {
            backgroundColor: colors.redAccent[700],
            color: `${colors.redAccent[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          experimentalFeatures={{ newEditingApi: true }}
          onProcessRowUpdateError={(error) => {
            if (
              error.message ===
              "Cannot read properties of undefined (reading 'id')"
            ) {
              window.location.reload();
            } else {
              console.log(error);
            }
          }}
        />
      </Box>
      {!!snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={4000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Box>
  );
};

export default Reservations;

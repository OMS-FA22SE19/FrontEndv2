import * as React from "react";
import Button from "@mui/material/Button";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import axios from "axios";
import { Box, useTheme, IconButton, Stack } from "@mui/material";
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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DoneIcon from "@mui/icons-material/Done";
import QrCodeAction from "./qrCodeAction";
import { host, version } from "../../data/DataSource/dataSource";

const Reservations = () => {
  const localSt = localStorage.getItem("token");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const noButtonRef = React.useRef(null);
  const [deleteArguments, setDeleteArguments] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState(null);
  const [searchValue, setSearchValue] = React.useState("");
  const [tabValue, setTabValue] = React.useState(0);
  const [status, setStatus] = React.useState("Available");
  const [searchBy, setSearchBy] = React.useState("FullName");

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
    if (localSt === null) {
      window.location.href = "/login";
    }
    await axios
      .delete(host + `/api/` + version + `/Reservations/` + id, {
        headers: { Authorization: `Bearer ${localSt}` },
      })
      .then((response) => {
        if (response.status === 204) {
          fetchData();
        }
      })
      .catch((error) => console.log(error));
  };

  async function handleCheckinReservation(id) {
    if (localSt === null) {
      window.location.href = "/login";
    }
    await axios
      .get(host + `/api/` + version + `/Reservations/` + id + `/checkin`, {
        headers: { Authorization: `Bearer ${localSt}` },
      })
      .then((response) => {
        if (response.status === 200) {
          fetchData();
        }
      })
      .catch((error) => console.log(error));
  }

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
    if (localSt === null) {
      window.location.href = "/login";
    }
    const search = searchValue.trim();
    const searchByValue = searchBy.trim();
    let response = await axios.get(
      host +
        `/api/` +
        version +
        `/Reservations` +
        `?status=` +
        status +
        `&searchBy=` +
        searchByValue +
        `&searchValue=` +
        search,
      {
        headers: { Authorization: `Bearer ${localSt}` },
      }
    );
    setRows(response.data["data"]);
  };

  const fetchDataWithStatus = async (status) => {
    if (localSt === null) {
      window.location.href = "/login";
    }
    const search = searchValue.trim();
    const searchByValue = searchBy.trim();
    let response = await axios.get(
      host +
        `/api/` +
        version +
        `/Reservations` +
        `?status=` +
        status +
        `&searchBy=` +
        searchByValue +
        `&searchValue=` +
        search,
      {
        headers: { Authorization: `Bearer ${localSt}` },
      }
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
      headerAlign: "center",
      align: "center",
      flex: 0.25,
      renderCell: (index) => {
        let id = index.api.getRowIndex(index?.row?.id) + 1;
        return id;
      },
    },
    {
      field: "user",
      headerName: "Customer",
      flex: 1,
      renderCell: (params) => {
        const currentRow = params.row;
        return currentRow["fullName"];
      },
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      headerAlign: "right",
      align: "right",
      flex: 0.5,
      renderCell: (params) => {
        const currentRow = params.row;
        return currentRow["phoneNumber"];
      },
    },
    {
      field: "numOfPeople",
      headerName: "People",
      type: "number",
      headerAlign: "right",
      align: "right",
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
      headerAlign: "right",
      align: "right",
      flex: 0.3,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      headerAlign: "right",
      align: "right",
      flex: 0.3,
    },
    {
      field: "tableId",
      headerName: "Table ID",
      hide: tabValue !== 2,
      flex: 0.4,
    },
    {
      field: "prePaid",
      headerName: "Deposit",
      type: "number",
      headerAlign: "right",
      align: "right",
      flex: 0.5,
      renderCell: (params) => {
        const currentRow = params.row;
        return <div>{currentRow["prePaid"].toLocaleString()}</div>;
      },
    },
    {
      field: "startTime",
      headerName: "Start Time",
      headerAlign: "right",
      align: "right",
      flex: 1,
      renderCell: (params) => {
        const currentRow = params.row;
        return new Date(currentRow["startTime"]).toLocaleString();
      },
    },
    {
      field: "endTime",
      headerName: "End Time",
      headerAlign: "right",
      align: "right",
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
        const newDate = new Date(new Date().getTime() + 15*60000);
        if (status.toLowerCase() === "available") {
          return [
            <GridActionsCellItem
              icon={<PlaylistRemoveIcon />}
              label="Delete"
              onClick={handleDeleteClick(id, name)}
              color="inherit"
            />,
          ];
        }

        if (status.toLowerCase() === "reserved") {
          const value = newDate.getTime() > new Date(currentRow.startTime).getTime();
          if(value) {
            return [
              <GridActionsCellItem
                icon={<DoneIcon />}
                label="CheckIn"
                onClick={() => handleCheckinReservation(id)}
                color="inherit"
              />,
              <GridActionsCellItem
                icon={<PlaylistRemoveIcon />}
                label="Delete"
                onClick={handleDeleteClick(id, name)}
                color="inherit"
              />,
            ];    
          }
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
    let statusValue = "Available";
    switch (newValue) {
      case 0:
        setStatus("Available");
        break;
      case 1:
        setStatus("Reserved");
        statusValue = "Reserved";
        break;
      case 2:
        setStatus("CheckIn");
        statusValue = "CheckIn";
        break;
      case 3:
        setStatus("Cancelled");
        statusValue = "Cancelled";
        break;
      default:
        break;
    }
    setTabValue(newValue);
    fetchDataWithStatus(statusValue);
  };

  return (
    <Box m="20px">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Header title="RESERVATIONS" subtitle="List of Reservations" />
        <QrCodeAction fetchData={fetchData} />
      </Stack>
      <Box sx={{ width: "100%", bgcolor: colors.blueAccent[700] }}>
        <Tabs
          value={tabValue}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleTabChange}
        >
          <Tab value={0} label="Available" />
          <Tab value={1} label="Reserved" />
          <Tab value={2} label="CheckIn" />
          <Tab value={3} label="Cancelled" />
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
          <MenuItem value="FullName">Customer</MenuItem>
          <MenuItem value="PhoneNumber">Phone Number</MenuItem>
          <MenuItem value="NumOfPeople">People</MenuItem>
          <MenuItem value="TableType">Table Type</MenuItem>
          <MenuItem value="NumOfSeats">Seat</MenuItem>
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
          initialState={{
            sorting: {
              sortModel: [{ field: 'startTime' }],
            },
          }}
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

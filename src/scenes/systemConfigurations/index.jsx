import { Box, Button, useTheme, IconButton } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { GridRowModes, DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import TextField from "@mui/material/TextField";

const SystemConfiguration = () => {
  const host = `https://localhost:7246`;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const noButtonRef = React.useRef(null);
  const [promiseArguments, setPromiseArguments] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState(null);
  const [searchValue, setSearchValue] = React.useState("");
  const [value, setValue] = React.useState(null);
  const [error, setError] = React.useState("");
  const [startTime, setStartTime] = React.useState("00:00");
  const [endTime, setEndTime] = React.useState("00:00");

  const handleCloseSnackbar = () => setSnackbar(null);

  const processRowUpdate = React.useCallback(
    (newRow, oldRow) =>
      new Promise((resolve, reject) => {
        const mutation = computeMutation(newRow, oldRow);
        if (mutation) {
          // Save the arguments to resolve or reject the promise later
          setPromiseArguments({ resolve, reject, newRow, oldRow });
        } else {
          resolve(oldRow); // Nothing was changed
        }
      }),
    []
  );

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateNo = () => {
    const { oldRow, resolve } = promiseArguments;
    resolve(oldRow); // Resolve with the old row to not update the internal state
    setPromiseArguments(null);
  };

  const handleUpdateYes = async () => {
    const { newRow, oldRow, reject, resolve } = promiseArguments;

    try {
      // Make the HTTP request to save in the backend
      let response;
      response = await handleUpdate(newRow.name, newRow.value);
      setSnackbar({
        children: "Setting successfully saved",
        severity: "success",
      });
      resolve(response);
      setPromiseArguments(null);
    } catch (error) {
      setSnackbar({ children: "Name can't be empty", severity: "error" });
      reject(oldRow);
      setPromiseArguments(null);
      console.log(error);
    }
  };

  const handleUpdate = async (name, value) => {
    const requestBody = {
      name: name,
      value: value,
    };
    await axios
      .put(host + `/api/v1/AdminSettings/`, requestBody)
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

  const renderConfirmEditDialog = () => {
    if (!promiseArguments) {
      return null;
    }

    const { newRow, oldRow } = promiseArguments;
    computeMutation(newRow, oldRow);

    return (
      <Dialog
        maxWidth="xs"
        TransitionProps={{ onEntered: handleEntered }}
        open={!!promiseArguments}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent dividers>{`Pressing 'Yes' to confirm.`}</DialogContent>
        <DialogActions>
          <Button ref={noButtonRef} onClick={handleUpdateNo}>
            No
          </Button>
          <Button onClick={handleUpdateYes}>Yes</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const fetchData = async () => {
    const search = searchValue.trim();
    let response = await axios.get(
      host + `/api/v1/AdminSettings` + `?searchValue=` + search
    );
    setRows(response.data["data"]);
  };

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id, value) => () => {
    setValue(value);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    setIsEditing(true);
  };

  const handleSaveClick = (currentRow) => () => {
    const errorMessage = isValid(currentRow.name, currentRow.value);
    if (errorMessage.length > 0) {
      setError(errorMessage);
      return;
    }
    const id = currentRow.name;
    handleUpdate(id, value);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    setIsEditing(false);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    setIsEditing(false);
  };

  function isValid(name, value, constant) {
    let errorMessage = "";
    switch (name) {
      case "StartTime":
        const endTime = rows.find((element) => {
          return element.name === "EndTime";
        }).value;
        value >= endTime
          ? (errorMessage = "StartTime must start prior EndTime: " + endTime)
          : (errorMessage = "");
        break;
      case "EndTime":
        const startTime = rows.find((element) => {
          return element.name === "StartTime";
        }).value;
        value < startTime
          ? (errorMessage = "EndTime must start after StartTime: " + startTime)
          : (errorMessage = "");
        break;
      case "MinReservationDuration":
        value < 15
          ? (errorMessage =
              "MinReservationDuration must not be less than 15 minutes")
          : (errorMessage = "");
        break;
      case "MaxReservationDuration":
        value > 180
          ? (errorMessage =
              "MaxReservationDuration must not be more than 180 minutes")
          : (errorMessage = "");
        break;
      case "MaxEdit":
        value < 0
          ? (errorMessage = "MaxEdit must be more than 0")
          : (errorMessage = "");
        break;
      case "ReservationTable ":
        value < 0
          ? (errorMessage = "ReservationTable must be more than 0")
          : (errorMessage = "");
        break;
      default:
        break;
    }
    return errorMessage;
  }

  const columns = [
    {
      field: "index",
      headerName: "No.",
      renderCell: (index) => index.api.getRowIndex(index.row.name) + 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => {
        const name = params.row.name;
        switch (name) {
          case "MinReservationDuration":
            return "Min Meal Duration (minutes)";
          case "MaxReservationDuration":
            return "Max Meal Duration (minutes)";
          case "MaxEdit":
            return "Max Reservation Edit (times)";
          case "ReservationTable":
            return "Available Tables For Reservation (%)";
          case "StartTime":
            return "Opening Time";
          case "EndTime":
            return "Closing Time";
          default:
            return name;
        }
      },
    },
    {
      field: "value",
      headerName: "Value",
      headerAlign: "right",
      align: "right",
      flex: 0.5,
      editable: true,
      renderEditCell: (params) => {
        const currentRow = params.row;
        const name = currentRow.name;
        const handleChange = (event) => {
          setError(isValid(name, event.target.value));
          setValue(event.target.value);
        };
        switch (name) {
          case "StartTime":
          case "EndTime":
            return (
              <Box
                display="flex"
                backgroundColor={colors.primary[400]}
                borderRadius="3px"
              >
                <TextField
                  error={error.length === 0 ? false : true}
                  type="time"
                  value={value}
                  onChange={handleChange}
                />
              </Box>
            );
          case "MinReservationDuration":
          case "MaxReservationDuration":
          case "MaxEdit":
          case "ReservationTable ":
            return (
              <TextField
                error={error.length === 0 ? false : true}
                type="number"
                value={value}
                onChange={handleChange}
              />
            );
          default:
            return null;
        }
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: (params) => {
        const currentRow = params.row;
        const name = currentRow.name;
        const isInEditMode = rowModesModel[name]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              disabled={error.length !== 0}
              label="Save"
              onClick={handleSaveClick(currentRow)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(name)}
              color="inherit"
            />,
          ];
        }

        if (isEditing && !isInEditMode) {
          return [];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(name, currentRow.value)}
            color="inherit"
          />,
        ];
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

  return (
    <Box m="20px">
      <Header title="CONFIGURATION SETTINGS" subtitle="List of Settings" />
      {error.length === 0 ? null : <Alert severity="error">{error}</Alert>}
      {renderConfirmEditDialog()}
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase
          onChange={handleSearchChange}
          sx={{ ml: 2, flex: 1 }}
          placeholder="Search name, chargePerSeat"
          onKeyPress={handleKeyDown}
        />
        <IconButton onClick={fetchData} sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>
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
          getRowId={(row) => row.name}
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
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

function computeMutation(newRow, oldRow) {
  if (newRow.value !== oldRow.value) {
    return `Value from '${oldRow.value}' to '${newRow.value}'`;
  }
  return null;
}

export default SystemConfiguration;

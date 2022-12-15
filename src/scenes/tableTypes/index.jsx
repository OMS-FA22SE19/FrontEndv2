import { Box, Button, useTheme, IconButton } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import RestoreIcon from "@mui/icons-material/Restore";
import { GridRowModes, DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { EditToolbar } from "./EditToolbar";
import useViewModel from "./viewModel";
import TextField from "@mui/material/TextField";
import Checkbox from '@mui/material/Checkbox';

const TableTypes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const noButtonRef = React.useRef(null);
  const [promiseArguments, setPromiseArguments] = React.useState(null);
  const [deleteArguments, setDeleteArguments] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState(null);
  const [error, setError] = useState([]);
  const [name, setName] = React.useState("");
  const [chargePerSeat, setChargePerSeat] = React.useState(0);
  const [canBeCombined, setCanBeCombined] = React.useState(false);
  const [valid, setValid] = React.useState(true);

  const viewModelProps = { setRows, setSnackbar };
  const {
    getTableTypes,
    addTableType,
    updateTableType,
    deleteTableType,
    recoverTableType,
  } = useViewModel(viewModelProps);

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
    getTableTypes();
  }, []);

  const handleUpdateNo = () => {
    const { oldRow, resolve } = promiseArguments;
    resolve(oldRow); // Resolve with the old row to not update the internal state
    setPromiseArguments(null);
    getTableTypes();
  };

  const handleUpdateYes = async () => {
    const { newRow, oldRow, reject, resolve } = promiseArguments;

    try {
      // Make the HTTP request to save in the backend
      let response;
      const newTableType = {
        id: newRow.id,
        name: name,
        chargePerSeat: chargePerSeat,
        canBeCombined: canBeCombined,
      };
      console.log(newTableType);
      if (newRow.isNew !== undefined) {
        response = await addTableType(newTableType);
      } else {
        response = await updateTableType(newTableType);
      }
      setSnackbar({
        children: "Table Type successfully saved",
        severity: "success",
      });
      resolve(response);
      setPromiseArguments(null);
    } catch (error) {
      setSnackbar({ children: error.message, severity: "error" });
      reject(oldRow);
      setPromiseArguments(null);
      console.log(error);
    }
  };

  const handleDeleteYes = async () => {
    const { id, name } = deleteArguments;

    try {
      // Make the HTTP request to save in the backend
      deleteTableType(id);
      setDeleteArguments(null);
      setSnackbar({
        children: "Table Type " + name + " successfully deleted",
        severity: "success",
      });
    } catch (error) {
      setDeleteArguments(null);
    }
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

  function renderConfirmDeleteDialog() {
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
  }

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (currentRow) => () => {
    const id = currentRow.id;
    setName(currentRow.name);
    setChargePerSeat(currentRow.chargePerSeat);
    setCanBeCombined(currentRow.canBeCombined);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    setIsEditing(true);
  };

  const handleSaveClick = (currentRow) => () => {
    const id = currentRow.id;
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    setIsAdding(false);
    setIsEditing(false);
    console.log("a");
  };

  function isValid(name, value) {
    let isValid = true;
    switch (name) {
      case "name":
        if (value.trim() === "") {
          isValid = false;
          let existed = error.filter((e) => e.key === 1);
          if (existed.length === 0) {
            setError((oldError) => [
              ...oldError,
              { key: 1, value: "Name is required" },
            ]);
          }
        } else {
          const removedError = error.filter((error) => error.key !== 1);
          setError(removedError);
        }
        if (value.trim().length < 2 || value.trim().length.length > 256) {
          isValid = false;
          let existed = error.filter((e) => e.key === 2);
          if (existed.length === 0) {
            setError((oldError) => [
              ...oldError,
              { key: 2, value: "Length Name must be between 2 and 256" },
            ]);
          }
        } else {
          const removedError = error.filter((error) => error.key !== 2);
          setError(removedError);
        }
        break;
      case "chargePerSeat":
        if (value < 0) {
          isValid = false;
          let existed = error.filter((e) => e.key === 3);
          if (existed.length === 0) {
            setError((oldError) => [
              ...oldError,
              { key: 3, value: "ChargePerSeat must be greater than 0" },
            ]);
          }
        } else {
          const removedError = error.filter((error) => error.key !== 3);
          setError(removedError);
        }
        break;
      default:
        break;
    }
    setValid(isValid);
    return isValid;
  }

  const handleDeleteClick = (id, name) => () => {
    setDeleteArguments({ id, name });
  };

  const handleRecoverClick = (id) => () => {
    recoverTableType(id);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row?.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row?.id !== id));
    }
    setIsAdding(false);
    setIsEditing(false);
    setError([]);
  };

  const columns = [
    {
      field: "index",
      headerName: "No.",
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      editable: true,
      renderEditCell: (params) => {
        const handleChange = (event) => {
          isValid("name", event.target.value);
          setName(event.target.value);
        };

        return (
          <TextField
            error={error.length === 0 ? false : true}
            type="string"
            value={name}
            onChange={handleChange}
          />
        );
      },
    },
    {
      field: "quantity",
      headerName: "Quantity",
      headerAlign: "right",
      align: "right",
      flex: 0.5,
    },
    {
      field: "chargePerSeat",
      headerName: "Charge per seat",
      type: "number",
      headerAlign: "right",
      align: "right",
      flex: 0.5,
      editable: true,
      renderCell: (params) => {
        const currentRow = params.row;
        return currentRow["chargePerSeat"]?.toLocaleString() ?? 0;
      },
      renderEditCell: (params) => {
        const handleChange = (event) => {
          isValid("chargePerSeat", event.target.value);
          setChargePerSeat(event.target.value);
        };

        return (
          <TextField
            error={error.length === 0 ? false : true}
            type="number"
            value={chargePerSeat}
            onChange={handleChange}
          />
        );
      },
    },
    {
      field: "canBeCombined",
      headerName: "Can Be Combined",
      type: "boolean",
      flex: 0.5,
      editable: true,
      renderEditCell: (params) => {
        const handleChange = (event) => {
          isValid("canBeCombined", event.target.value);
          setCanBeCombined(event.target.value === "on" ? true : false);
        };

        return (
          <Checkbox onChange={handleChange} />
        );
      },
    },
    {
      field: "isDeleted",
      headerName: "Is Deleted",
      type: "boolean",
      flex: 0.5,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: (params) => {
        const currentRow = params.row;
        const id = currentRow.id;
        const name = currentRow.name;
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (currentRow["isDeleted"]) {
          return [
            <GridActionsCellItem
              icon={<RestoreIcon />}
              label="Restore"
              onClick={handleRecoverClick(id)}
            />,
          ];
        }

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              disabled={error.length !== 0 || !valid}
              onClick={handleSaveClick(currentRow)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
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
            onClick={handleEditClick(currentRow)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id, name)}
            color="inherit"
          />,
        ];
      },
      flex: 1,
    },
  ];

  function computeMutation(newRow, oldRow) {
    if (name !== oldRow.name) {
      return `Name from '${oldRow.name}' to '${name}'`;
    }
    if (chargePerSeat !== oldRow.chargePerSeat) {
      return `Charge Per Seat from '${oldRow.chargePerSeat}' to '${chargePerSeat}'`;
    }
    if (canBeCombined !== oldRow.canBeCombined) {
      return `Can Be Combined from '${oldRow.canBeCombined}' to '${canBeCombined}'`;
    }
    return null;
  }

  const handleSearchChange = (event) => {
    getTableTypes(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <Box m="20px">
      <Header title="TABLE TYPES" subtitle="List of Table Types" />
      {error.length === 0
        ? null
        : error.map((message) => (
            <Alert key={message.key} severity="error">
              {message.value}
            </Alert>
          ))}
      {renderConfirmEditDialog()}
      {renderConfirmDeleteDialog()}
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
        <IconButton onClick={getTableTypes} sx={{ p: 1 }}>
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
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          components={{
            Toolbar: EditToolbar,
          }}
          componentsProps={{
            toolbar: {
              rows,
              setRows,
              setRowModesModel,
              isAdding,
              setIsAdding,
              name,
              setName,
              chargePerSeat,
              setChargePerSeat,
              canBeCombined,
              setCanBeCombined,
              valid,
              setValid,
            },
          }}
          experimentalFeatures={{ newEditingApi: true }}
          onProcessRowUpdateError={(error) => {
            if (
              error.message ===
              "Cannot read properties of undefined (reading 'id')"
            ) {
              // window.location.reload();
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

export default TableTypes;

import * as React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import RestoreIcon from "@mui/icons-material/Restore";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
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

const CourseTypes = () => {
  const host = `https://localhost:7246`
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const noButtonRef = React.useRef(null);
  const [promiseArguments, setPromiseArguments] = React.useState(null);
  const [deleteArguments, setDeleteArguments] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState(null);
  const [searchValue, setSearchValue] = React.useState("");

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
      if (newRow.isNew !== undefined) {
        response = await handleAdd(newRow);
      } else {
        response = await handleUpdate(newRow);
      }
      setSnackbar({
        children: "Course Type successfully saved",
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

  const handleDeleteYes = async () => {
    const { id, name } = deleteArguments;

    try {
      // Make the HTTP request to save in the backend
      handleDelete(id);
      setDeleteArguments(null);
      setSnackbar({
        children: "Course Type " + name + " successfully deleted",
        severity: "success",
      });
    } catch (error) {
      setDeleteArguments(null);
    }
  };

  const handleDelete = async (id) => {
    await axios
      .delete(host + `/api/v1/CourseTypes/` + id)
      .then((response) => {
        if (response.status === 204) {
          fetchData();
        }
      })
      .catch((error) => console.log(error));
  };

  const handleRecover = async (id) => {
    await axios
      .put(host + `/api/v1/CourseTypes/` + id + `/recover`)
      .then((response) => {
        if (response.status === 204) {
          fetchData();
        }
      })
      .catch((error) => console.log(error));
  };

  const handleUpdate = async (currentRow) => {
    const requestBody = {
      id: currentRow["id"],
      name: currentRow["name"],
      description: currentRow["description"],
    };
    await axios
      .put(
        host + `/api/v1/CourseTypes/` + currentRow["id"],
        requestBody
      )
      .catch(() => {})
      .finally(() => fetchData());
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
      host + `/api/v1/CourseTypes` + `?searchValue=` + search
    );
    setRows(response.data["data"]);
  };

  const handleAdd = async (currentRow) => {
    const requestBody = {
      name: currentRow["name"],
      description: currentRow["description"],
    };
    await axios
      .post(host + `/api/v1/CourseTypes/`, requestBody)
      .catch(() => {})
      .finally(() => fetchData());
  };

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    setIsEditing(true);
  };

  const handleSaveClick = (currentRow) => () => {
    const id = currentRow.id;
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    setIsAdding(false);
    setIsEditing(false);
  };

  const handleDeleteClick = (id, name) => () => {
    setDeleteArguments({ id, name });
  };

  const handleRecoverClick = (id) => () => {
    handleRecover(id);
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
  };

  const columns = [
    {
      field: "index",
      headerName: "No.",
      renderCell: (index) => {
        let id = index.api.getRowIndex(index?.row?.id) + 1;
        return id;
      },
      flex: 0.15,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.75,
      editable: true,
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value.trim() === "";
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      editable: true,
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
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id, name)}
              color="inherit"
            />,
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
            onClick={handleEditClick(id)}
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
      flex: 0.5,
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
      <Header title="COURSE TYPES" subtitle="List of Course Types" />
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase
          onChange={handleSearchChange}
          sx={{ ml: 2, flex: 1 }}
          placeholder="Search name, description"
          onKeyPress={handleKeyDown}
        />
        <IconButton onClick={fetchData} sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>
      {renderConfirmEditDialog()}
      {renderConfirmDeleteDialog()}
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
          processRowUpdate={processRowUpdate}
          components={{
            Toolbar: EditToolbar,
          }}
          componentsProps={{
            toolbar: { rows, setRows, setRowModesModel, isAdding, setIsAdding },
          }}
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

function EditToolbar(props) {
  const { rows, setRows, setRowModesModel, isAdding, setIsAdding } = props;

  const handleClick = () => {
    const id = Math.max(...rows.map((o) => o.id)) + 1;

    setIsAdding(true);
    setRows((oldRows) => [
      ...oldRows,
      { id, name: "", description: "", isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  if (!isAdding) {
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add New Course Type
        </Button>
      </GridToolbarContainer>
    );
  }
}

function computeMutation(newRow, oldRow) {
  if (newRow.name !== oldRow.name) {
    return `Name from '${oldRow.name}' to '${newRow.name}'`;
  }
  if (newRow.description !== oldRow.description) {
    return `Description from '${oldRow.description}' to '${newRow.description}'`;
  }
  return null;
}

export default CourseTypes;

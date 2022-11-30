import { Box, Button, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import RestoreIcon from "@mui/icons-material/Restore";
import {
  GridRowModes,
  useGridApiContext,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";

const Tables = () => {
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
  const [getTableTypes, setTableTypes] = useState([]);

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
    fetchTableTypes();
  }, []);

  const fetchTableTypes = async () => {
    await axios
      .get(`https://oms-fa22se19.herokuapp.com/api/v1/TableTypes`)
      .then((response) => setTableTypes(response.data["data"]));
  };

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
        children: "Table Type successfully saved",
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
        children: "Table Type " + name + " successfully deleted",
        severity: "success",
      });
    } catch (error) {
      setDeleteArguments(null);
    }
  };

  const handleDelete = async (id) => {
    await axios
      .delete(`https://oms-fa22se19.herokuapp.com/api/v1/Tables/` + id)
      .then((response) => {
        if (response.status === 204) {
          fetchData();
        }
      })
      .catch((error) => console.log(error));
  };

  const handleRecover = async (id) => {
    await axios
      .put(`https://oms-fa22se19.herokuapp.com/api/v1/Tables/` + id + `/recover`)
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
      numOfSeats: currentRow["numOfSeats"],
      status: currentRow["status"],
      tableTypeId: currentRow["tableTypeId"]
    };
    await axios
      .put(
        `https://oms-fa22se19.herokuapp.com/api/v1/Tables/` + currentRow["id"],
        requestBody
      )
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
    let response = await axios.get(`https://oms-fa22se19.herokuapp.com/api/v1/Tables`);
    setRows(response.data["data"]);
  };

  const handleAdd = async (currentRow) => {
    const requestBody = {
      name: currentRow["name"],
      chargePerSeat: currentRow["chargePerSeat"],
    };
    await axios
      .post(`https://oms-fa22se19.herokuapp.com/api/v1/Tables/`, requestBody)
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

  function SelectEditInputTableTypeCell(props) {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();

    const handleChange = async (event) => {
      await apiRef.current.setEditCellValue({
        id,
        field,
        value: event.target.value,
      });
      apiRef.current.stopCellEditMode({ id, field });
    };

    return (
      <Select
        value={value}
        onChange={handleChange}
        size="small"
        sx={{ height: 1 }}
        native
        autoFocus
      >
        {getTableTypes.map((val) => {
          return (
            <option value={val.id} key={val.id}>
              {val.name}
            </option>
          );
        })}
      </Select>
    );
  }

  SelectEditInputTableTypeCell.propTypes = {
    /**
     * The column field of the cell that triggered the event.
     */
    field: PropTypes.string.isRequired,
    /**
     * The grid row id.
     */
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    /**
     * The cell value.
     * If the column has `valueGetter`, use `params.row` to directly access the fields.
     */
    value: PropTypes.any,
  };

  const renderSelectEditInputTableTypeCell = (params) => {
    return <SelectEditInputTableTypeCell {...params} />;
  };

  function SelectEditInputStatusCell(props) {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();
  
    const handleChange = async (event) => {
      await apiRef.current.setEditCellValue({ id, field, value: event.target.value });
      apiRef.current.stopCellEditMode({ id, field });
    };
  
    return (
      <Select
        value={value}
        onChange={handleChange}
        size="small"
        sx={{ height: 1 }}
        native
        autoFocus
      >
        <option>Available</option>
        <option>Occupied</option>
        <option>Reserved</option>
      </Select>
    );
  }
  
  SelectEditInputStatusCell.propTypes = {
    /**
     * The column field of the cell that triggered the event.
     */
    field: PropTypes.string.isRequired,
    /**
     * The grid row id.
     */
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    /**
     * The cell value.
     * If the column has `valueGetter`, use `params.row` to directly access the fields.
     */
    value: PropTypes.any,
  };
  
  const renderSelectEditInputStatusCell = (params) => {
    return <SelectEditInputStatusCell {...params} />;
  };

  const columns = [
    {
      field: "index",
      headerName: "No.",
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      field: "numOfSeats",
      headerName: "Num Of Seats",
      type: "number",
      editable: true,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      editable: true,
      renderEditCell: renderSelectEditInputStatusCell,
    },
    {
      field: "tableTypeId",
      headerName: "Table Type",
      flex: 1,
      editable: true,
      renderCell: (params) => {
        const currentRow = params.row;
        return currentRow["tableType"]["name"];
      },
      renderEditCell: renderSelectEditInputTableTypeCell,
    },
    {
      field: "isDeleted",
      headerName: "Is Deleted",
      type: "boolean",
      flex: 1,
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
            <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id, name)}
            color="inherit"
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
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header title="TABLES" subtitle="List of Tables" />
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
      { id, numOfSeats: 1, status: "Available", isNew: true },
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
          Add New Table
        </Button>
      </GridToolbarContainer>
    );
  }
}

function computeMutation(newRow, oldRow) {
  if (newRow.numOfSeats !== oldRow.numOfSeats) {
    return `NumOfSeats from '${oldRow.numOfSeats}' to '${newRow.numOfSeats}'`;
  }
  if (newRow.tableTypeId !== oldRow.tableTypeId) {
    return `TableTypeId from '${oldRow.tableTypeId}' to '${newRow.tableTypeId}'`;
  }
  if (newRow.status !== oldRow.status) {
    return `Status from '${oldRow.status}' to '${newRow.status}'`;
  }
  return null;
}

export default Tables;

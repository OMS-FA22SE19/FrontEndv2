import { Box, Stack, Button } from "@mui/material";
import { DataGrid, GridToolbar, GridCellEditStopReasons } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';

const MenuFoods = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [APIData, setAPIData] = useState([]);
  const { menuId } = useParams();
  const [menuName, setMenuName] = useState("");

  const noButtonRef = React.useRef(null);
  const [promiseArguments, setPromiseArguments] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState(null);

  function computeMutation(newRow, oldRow) {
    if (newRow.price !== oldRow.price) {
      return `Price from '${oldRow.price}' to '${newRow.price}'`;
    }
    return null;
  }

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
    [],
  );

  const handleNo = () => {
    const { oldRow, resolve } = promiseArguments;
    resolve(oldRow); // Resolve with the old row to not update the internal state
    setPromiseArguments(null);
  };

  const handleYes = async () => {
    const { newRow, oldRow, reject, resolve } = promiseArguments;

    try {
      // Make the HTTP request to save in the backend
      const response = await updatePrice(newRow);
      setSnackbar({ children: 'Price successfully saved', severity: 'success' });
      resolve(response);
      setPromiseArguments(null);
    } catch (error) {
      reject(oldRow);
      setPromiseArguments(null);
    }
  };

  const handleEntered = () => {
    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
    // noButtonRef.current?.focus();
  };  

  const renderConfirmDialog = () => {
    if (!promiseArguments) {
      return null;
    }

    const { newRow, oldRow } = promiseArguments;
    const mutation = computeMutation(newRow, oldRow);

    return (
      <Dialog
        maxWidth="xs"
        TransitionProps={{ onEntered: handleEntered }}
        open={!!promiseArguments}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent dividers>
          {`Pressing 'Yes' will change ${mutation}.`}
        </DialogContent>
        <DialogActions>
          <Button ref={noButtonRef} onClick={handleNo}>
            No
          </Button>
          <Button onClick={handleYes}>Yes</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const fetchData = async () => {
    let response = await axios.get(
      `https://localhost:7246/api/v1/Menus/` + menuId + `/Food`
    );
    setAPIData(response.data["data"]);
  };

  const getMenuInfo = async () => {
    let response = await axios.get(
      `https://localhost:7246/api/v1/Menus/` + menuId
    );
    setMenuName(response.data["data"]["name"]);
  };

  useEffect(() => {
    fetchData();
    getMenuInfo();
  }, []);

  let navigate = useNavigate();

  const updatePrice = async (currentRow) => { 
    const requestBody = {id: menuId, foodId: currentRow["id"], price: currentRow["price"]};
    let response = await axios.put(`https://localhost:7246/api/v1/Menus/` + menuId + `/Food/` + currentRow["id"], requestBody)
      .catch(() => {})
      .finally(() => fetchData());
  }

  const deleteFood = async (id) => {
    await axios
      .delete(`https://localhost:7246/api/v1/Menus/` + menuId + `/Food/` + id)
      .then()
      .catch()  
      .finally((e) => {
        fetchData();
      });
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
      flex: 0.7,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "ingredient",
      headerName: "Ingredient",
      flex: 1,
    },
    {
      field: "available",
      headerName: "Available",
      type: "boolean",
      flex: 0.5,
    },
    {
      field: "pictureUrl",
      headerName: "picture",
      renderCell: (params) => {
        const currentRow = params.row;
        return (
          <img
            {...srcset(currentRow["pictureUrl"], 250, 200, 2, 2)}
            alt="Food image"
          />
        );
      },
      flex: 1,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      flex: 0.5,
      editable: true
    },
    {
      field: "courseTypeName",
      headerName: "Course Type",
      flex: 1,
      renderCell: (params) => {
        const currentRow = params.row;
        return currentRow["courseType"]["name"];
      },
    },
    {
      field: "FoodTypeName",
      headerName: "Food Type",
      flex: 1,
      renderCell: (params) => {
        const currentRow = params.row;
        let foodTypes = "";
        currentRow["types"].map((type) => {
          foodTypes += type.name + ", ";
        });

        return <div>{foodTypes.slice(0, -2)}</div>;
      },
    },
    {
      field: "isDeleted",
      headerName: "Is Deleted",
      type: "boolean",
      flex: 0.5,
    },
    {
      field: "options",
      headerName: "Options",
      renderCell: (params) => {
        const currentRow = params.row;
        let deleteButton = <Button></Button>;

        deleteButton = (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => deleteFood(currentRow["id"])}
          >
            Remove
          </Button>
        );
        
        return (
          <Stack direction="row" spacing={2}>
            {deleteButton}
          </Stack>
        );
      },
      flex: 1,
    },
  ];

  const directToCreateFood = () => {
    let path = `/menu/` + menuId + '/foods/add';
    navigate(path);
  };

  return (
    <Box m="20px">
      {renderConfirmDialog()}
      <Header title="FOODS" subtitle={"List of Foods in Menu: " + menuName}/>
      <Button
        variant="outlined"
        color="secondary"
        size="medium"
        onClick={directToCreateFood}
      >
        Insert
      </Button>
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
          processRowUpdate={processRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
      {!!snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Box>
  );
};

function srcset(image, width, height, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${width * cols}&h=${
      height * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export default MenuFoods;



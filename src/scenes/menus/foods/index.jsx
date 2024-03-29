import { Box, Stack, Button, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import useViewModel from "./viewModel";

const MenuFoods = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [APIData, setAPIData] = useState([]);
  const { menuId } = useParams();
  const [menuName, setMenuName] = useState("");
  const [searchBy, setSearchBy] = React.useState("Name");
  const noButtonRef = React.useRef(null);
  const [promiseArguments, setPromiseArguments] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState(null);
  const viewModelProps = { setAPIData, setMenuName, setSnackbar };
  const {
    getMenuFoods,
    getMenuById,
    getFoods,
    updateMenuFood,
    removeFood,
  } = useViewModel(viewModelProps);

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
    []
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
      const response = await updateMenuFood(newRow);
      setSnackbar({
        children: "Price successfully saved",
        severity: "success",
      });
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

  useEffect(() => {
    getMenuFoods(menuId, searchBy, "");
    getMenuById(menuId);
  }, []);

  let navigate = useNavigate();

  const columns = [
    {
      field: "index",
      headerName: "No.",
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      field: "pictureUrl",
      headerName: "Picture",
      renderCell: (params) => {
        const currentRow = params.row;
        return (
          <img width={100} src={currentRow["pictureUrl"]} alt="Food image" />
        );
      },
      flex: 1,
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
      field: "price",
      headerName: "Price",
      type: "number",
      flex: 0.5,
      renderCell: (params) => {
        const currentRow = params.row;
        return currentRow["price"].toLocaleString();
      },
      editable: true,
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
        let deleteButton;

        deleteButton = (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => removeFood(menuId, currentRow["id"])}
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
    let path = `/menu/` + menuId + "/foods/add";
    navigate(path);
  };

  const handleSearchChange = (event) => {
    getMenuFoods(menuId, searchBy, event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  // function FoodSelect() {
  //   return (
  //     <Autocomplete
  //       id="country-select-demo"
  //       sx={{ width: 300 }}
  //       options={getFoods}
  //       autoHighlight
  //       getOptionLabel={(option) => option.name}
  //       renderOption={(props, option) => (
  //         <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
  //           <img
  //             loading="lazy"
  //             width="20"
  //             src={option.pictureUrl}
  //             srcSet={option.pictureUrl +` 2x`}
  //             alt=""
  //           />
  //           {option.name} ({option.id})
  //         </Box>
  //       )}
  //       renderInput={(params) => (
  //         <TextField
  //           {...params}
  //           label="Choose a food"
  //           inputProps={{
  //             ...params.inputProps,
  //             autoComplete: 'new-password', // disable autocomplete and autofill
  //           }}
  //         />
  //       )}
  //     />
  //   );
  // }

  return (
    <Box m="20px">
      {renderConfirmDialog()}
      <Header title="FOODS" subtitle={"List of Foods in Menu: " + menuName} />
      <Button
        variant="outlined"
        color="secondary"
        size="medium"
        onClick={directToCreateFood}
      >
        Insert
      </Button>
      {/* <FoodSelect/> */}
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
          <MenuItem value="Name">Name</MenuItem>
          <MenuItem value="Description">Description</MenuItem>
          <MenuItem value="Ingredient">Ingredient</MenuItem>
          <MenuItem value="CourseType">Course Type</MenuItem>
          <MenuItem value="FoodType">Food Type</MenuItem>
        </Select>
        <InputBase
          onChange={handleSearchChange}
          sx={{ ml: 2, flex: 1 }}
          placeholder="Search"
          onKeyPress={handleKeyDown}
        />
        <IconButton onClick={() => getMenuFoods(menuId, searchBy, "")} sx={{ p: 1 }}>
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

export default MenuFoods;

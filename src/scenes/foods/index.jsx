import { Box, Stack, Button, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

const Foods = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [APIData, setAPIData] = useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [searchBy, setSearchBy] = React.useState("Name");

  const fetchData = async () => {
    const search = searchValue.trim();
    const searchByValue = searchBy.trim();
    let response = await axios.get(
      `https://localhost:7246/api/v1/Foods` +
        `?searchBy=` +
        searchByValue +
        `&searchValue=` +
        search
    );
    setAPIData(response.data["data"]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  let navigate = useNavigate();

  const deleteFood = async (id) => {
    await axios
      .delete(`https://localhost:7246/api/v1/Foods/` + id)
      .then()
      .finally((e) => {
        fetchData();
      });
  };

  const recoverFood = async (id) => {
    await axios
      .put(`https://localhost:7246/api/v1/Foods/` + id + `/recover`)
      .then()
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
        let updateButton;
        let deleteButton;
        let recoverButton;

        if (!currentRow["isDeleted"]) {
          updateButton = (
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={() => directToUpdateFood(currentRow["id"])}
            >
              Update
            </Button>
          );

          deleteButton = (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => deleteFood(currentRow["id"])}
            >
              Delete
            </Button>
          );
        } else {
          recoverButton = (
            <Button
              variant="outlined"
              color="info"
              size="small"
              onClick={() => recoverFood(currentRow["id"])}
            >
              Recover
            </Button>
          );

          deleteButton = (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => deleteFood(currentRow["id"])}
            >
              Delete
            </Button>
          );
        }
        return (
          <Stack direction="row" spacing={2}>
            {updateButton}
            {deleteButton}
            {recoverButton}
          </Stack>
        );
      },
      flex: 1,
    },
  ];

  const directToCreateFood = () => {
    let path = `/foods/create`;
    navigate(path);
  };

  const directToUpdateFood = (id) => {
    let path = `/foods/update/` + id;
    navigate(path);
  };

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
      <Header title="FOODS" subtitle="List of Foods" />
      <Button
        variant="outlined"
        color="secondary"
        size="medium"
        onClick={directToCreateFood}
      >
        Insert
      </Button>
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
          rows={APIData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
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

export default Foods;

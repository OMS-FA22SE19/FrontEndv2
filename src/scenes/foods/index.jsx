import { Box, Stack, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Foods = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [APIData, setAPIData] = useState([]);

  const fetchData = async () => {
    let response = await axios.get(`https://localhost:7246/api/v1/Foods`);
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

  const columns = [
    {
      field: "index",
      headerName: "No.",
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.7
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
        return <img {...srcset(currentRow["pictureUrl"], 250, 200, 2, 2)} alt='Food image'/>;
      },
      flex: 1,
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
        let updateButton = <Button></Button>;
        let deleteButton = <Button></Button>;

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

        if (!currentRow["isDeleted"]) {
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
          deleteButton = null;
        }
        return (
          <Stack direction="row" spacing={2}>
            {updateButton}
            {deleteButton}
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
import { Box, Stack, Button, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { host, version } from "../../data/DataSource/dataSource";
import { UserContext } from "../../context/UserContext";

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [APIData, setAPIData] = useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [searchBy, setSearchBy] = React.useState("Id");
  const localSt = localStorage.getItem("token");
  const { user } = React.useContext(UserContext);

  let navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

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
        `/Users` +
        `?searchBy=` +
        searchByValue +
        `&searchValue=` +
        search,
      {
        headers: { Authorization: `Bearer ${localSt}` },
      }
    );
    setAPIData(response.data["data"]);
  };

  const deleteUser = async (id) => {
    if (localSt === null) {
      window.location.href = "/login";
    }
    await axios
      .delete(host + `/api/` + version + `/Users/` + id, {
        headers: { Authorization: `Bearer ${localSt}` },
      })
      .finally(() => fetchData());
  };

  const recoverUser = async (id) => {
    if (localSt === null) {
      window.location.href = "/login";
    }
    await axios
      .delete(host + `/api/` + version + `/Users/` + id, {
        headers: { Authorization: `Bearer ${localSt}` },
      })
      .finally(() => fetchData());
  };

  const directToCreateUser = () => {
    let path = `/users/create`;
    navigate(path);
  };

  const directToUpdateUser = (id) => {
    let path = `/users/update/` + id;
    navigate(path);
  };

  let index = 0;

  const columns = [
    {
      field: "index",
      headerName: "No.",
      headerAlign: "center",
      align: "center",
      flex: 0.25,
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "userName",
      headerName: "UserName",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "fullName",
      headerName: "FullName",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      headerAlign: "right",
      align: "right",
      flex: 0.5,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
    },
    {
      field: "isDeleted",
      headerName: "Status",
      type: "boolean",
      flex: 0.5,
      renderCell: (params) => {
        const currentRow = params.row;
        if (currentRow.isDeleted) {
          return "Disabled";
        }
        return "Active";
      },
    },
    {
      field: "options",
      headerName: "Options",
      renderCell: (params) => {
        const currentRow = params.row;

        if (!currentRow["isDeleted"] && user.id != currentRow["id"]) {
          return (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="warning"
                size="small"
                onClick={() => directToUpdateUser(currentRow["id"])}
              >
                Update
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => deleteUser(currentRow["id"])}
              >
                Delete
              </Button>
            </Stack>
          );
        }

        if (currentRow["isDeleted"]) {
          return (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="warning"
                size="small"
                onClick={() => recoverUser(currentRow["id"])}
              >
                Recover
              </Button>
            </Stack>
          );
        }
        return (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={() => directToUpdateUser(currentRow["id"])}
            >
              Update
            </Button>
          </Stack>
        );
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
      <Header title="USERS" subtitle="List of Users" />
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
          <MenuItem value="Id">Id</MenuItem>
          <MenuItem value="UserName">UserName</MenuItem>
          <MenuItem value="FullName">FullName</MenuItem>
          <MenuItem value="Email">Email</MenuItem>
          <MenuItem value="PhoneNumber">Phone Number</MenuItem>
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
      <Button
        variant="outlined"
        color="secondary"
        size="medium"
        onClick={directToCreateUser}
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

export default Users;

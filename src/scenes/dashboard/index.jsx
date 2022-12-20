import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions, mockTrendingFood } from "../../data/mockData";
import ReceiptIcon from "@mui/icons-material/Receipt";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import axios from "axios";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { host, version } from "../../data/DataSource/dataSource";
import { GetCustomerStatisticUseCase } from "../../domain/useCase/dashboard/GetCustomerStatistic";
import { GetFoodStatisticUseCase } from "../../domain/useCase/dashboard/GetFoodStatistic";
import { GetMonthlyOrdersReservationsUseCase } from "../../domain/useCase/dashboard/GetMonthlyOrdersReservations";
import { GetRoyalCustomersUseCase } from "../../domain/useCase/dashboard/GetRoyalCustomers";
import { GetTrendingFoodUseCase } from "../../domain/useCase/dashboard/GetTrendingFood";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [newCustomers, setNewCustomers] = React.useState([]);
  const [newFoods, setNewFoods] = React.useState([]);
  const [ordersReservations, setOrdersReservations] = React.useState([]);
  const [royalCustomers, setRoyalCustomers] = React.useState([]);
  const [trendingFood, setTrendingFood] = React.useState([]);

  const fetchData = async () => {
    const customerStatistic = await GetCustomerStatisticUseCase();
    setNewCustomers(customerStatistic.data);

    const foodStatistic = await GetFoodStatisticUseCase();
    setNewFoods(foodStatistic.data);

    const monthlyOrdersReservation = await GetMonthlyOrdersReservationsUseCase();
    setOrdersReservations(monthlyOrdersReservation.data);

    const royalCustomerList = await GetRoyalCustomersUseCase();
    setRoyalCustomers(royalCustomerList.data);

    const trendingFood = await GetTrendingFoodUseCase();
    console.log(trendingFood.data);
    setTrendingFood(trendingFood.data);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "No.",
      renderCell: (index) => index.api.getRowIndex(index.row.phoneNumber) + 1,
    },
    { field: "name", headerName: "Customer Name" },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "quantity",
      headerName: "Order Times",
      flex: 2,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box></Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Monthly Trending Food
            </Typography>
          </Box>
          {trendingFood.map((food, i) => (
            <Box
              key={`${food.name}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box gridColumn="span 4">
                <Typography variant="h6" color={colors.grey[100]}>
                  #{i+1}
                </Typography>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {food.name}
                </Typography>
              </Box>
              {/* <Box color={colors.grey[100]}>{food.quantity}x</Box> */}
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                Order {food.quantity}x
              </Box>
            </Box>
          ))}
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={newCustomers.customers}
            subtitle="New Customers"
            progress="0.30"
            increase={"+" + newCustomers.increase}
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={newFoods.food}
            subtitle="Food"
            progress="0.75"
            increase={"+" + newFoods.increase}
            icon={
              <FastfoodIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={ ordersReservations.orders + " / " + ordersReservations.reservations}
            subtitle="Monthly Orders/Reservations"
            progress="0.75"
            increase={"+" + ordersReservations.increase}
            icon={
              <ReceiptIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 8"
          height="55vh"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Header
            title="TOP LOYAL CUSTOMERS"
            subtitle="List of Monthly Royal Customers"
          />
          <Box
            m="5px 0 0 0"
            display="flex"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            height="45vh"
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
            <DataGrid getRowId={(row) => row.phoneNumber} rows={royalCustomers} columns={columns} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

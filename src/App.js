import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Form from "./scenes/form";
import FAQ from "./scenes/faq";
import OrderDetails from "./scenes/orderDetails";
import Users from "./scenes/users";
import CreateUser from "./scenes/users/create";
import UpdateUser from "./scenes/users/update";
import TableTypes from "./scenes/tableTypes";
import CreateTableType from "./scenes/tableTypes/create";
import UpdateTableType from "./scenes/tableTypes/update";
import Menus from "./scenes/menus";
import CreateMenu from "./scenes/menus/create";
import UpdateMenu from "./scenes/menus/update";
import AddFood from "./scenes/menus/addFood";
import MenuFoods from "./scenes/menus/foods";
import Foods from "./scenes/foods";
import CreateFoods from "./scenes/foods/create";
import UpdateFoods from "./scenes/foods/update";
import CreateTable from "./scenes/tables/create";
import UpdateTable from "./scenes/tables/update";
import Tables from "./scenes/tables";
import Checkout from "./scenes/checkout";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/orderDetails" element={<OrderDetails />} />
              <Route path="/tableTypes" element={<TableTypes />} />
              <Route path="/tableTypes/create" element={<CreateTableType />} />
              <Route path="/tableTypes/update/:id" element={<UpdateTableType />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/create" element={<CreateUser />} />
              <Route path="/users/update/:id" element={<UpdateUser />} />
              <Route path="/menus" element={<Menus />} />
              <Route path="/menus/create" element={<CreateMenu />} />
              <Route path="/menus/update/:id" element={<UpdateMenu />} />
              <Route path="/menu/:menuId/foods/add" element={<AddFood />} />
              <Route path="/menus/:menuId/foods" element={<MenuFoods />} />
              <Route path="/foods" element={<Foods />} />
              <Route path="/foods/create" element={<CreateFoods />} />
              <Route path="/foods/update/:id" element={<UpdateFoods />} />
              <Route path="/tables" element={<Tables />} />
              <Route path="/tables/create" element={<CreateTable />} />
              <Route path="/tables/update/:id" element={<UpdateTable />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/geography" element={<Geography />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
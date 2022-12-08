import { useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import OrderDetails from "./scenes/orderDetails";
import Users from "./scenes/users";
import CreateUser from "./scenes/users/create";
import UpdateUser from "./scenes/users/update";
import TableTypes from "./scenes/tableTypes";
import Menus from "./scenes/menus/index/index";
import AddFood from "./scenes/menus/foods/addFood";
import MenuFoods from "./scenes/menus/foods";
import Foods from "./scenes/foods";
import CreateFoods from "./scenes/foods/create";
import UpdateFoods from "./scenes/foods/update";
import Tables from "./scenes/tables";
import CourseTypes from "./scenes/courseTypes";
import FoodTypes from "./scenes/foodTypes";
import Checkout from "./scenes/checkout";
import Reservations from "./scenes/reservations";
import SystemConfiguration from "./scenes/systemConfigurations";
import Login from "./scenes/login";
import Logout from "./scenes/login/logout";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import "./firebase/firebase";
import { UserContext } from "./context/UserContext";
import NotFound from "./components/NotFound";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const { user } = useContext(UserContext);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {user ? <Sidebar isSidebar={isSidebar} /> : null}
          <main className="content">
            {user ? <Topbar setIsSidebar={setIsSidebar} /> : null}
            {user ? Routing(user) : <Login />}
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

function Routing(user) {
  switch (user.role) {
    case "Administrator":
      return (
        <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/create" element={<CreateUser />} />
            <Route path="/users/update/:id" element={<UpdateUser />} />
            <Route path="/configuration" element={<SystemConfiguration />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
      );
    case "Restaurant Owner":
      return (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/menus" element={<Menus />} />
          <Route path="/menu/:menuId/foods/add" element={<AddFood />} />
          <Route path="/menus/:menuId/foods" element={<MenuFoods />} />
          <Route path="/foods" element={<Foods />} />
          <Route path="/foods/create" element={<CreateFoods />} />
          <Route path="/foods/update/:id" element={<UpdateFoods />} />
          <Route path="/tableTypes" element={<TableTypes />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/courseTypes" element={<CourseTypes />} />
          <Route path="/foodTypes" element={<FoodTypes />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    case "Staff":
      return (
        <Routes>
          <Route path="/" element={<Reservations />} />
          <Route path="/orderDetails" element={<OrderDetails />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    case "Chef":
      return (
        <Routes>
          <Route path="/" element={<OrderDetails />} />
          <Route path="/orderDetails" element={<OrderDetails />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    default:
      return (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
  }
}

export default App;

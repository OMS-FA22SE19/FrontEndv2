import { host, version } from "./dataSource";
import axios from "axios";

const COLLECTION = "Dashboard";
const localSt = localStorage.getItem("token");

export async function GetCustomerStatistic() {
  if (localSt === null) {
    window.location.href = "/login";
  }
  return await axios
    .get(host + `/api/` + version + `/` + COLLECTION + `/Customers`, {
      headers: { Authorization: `Bearer ${localSt}` },
    })
    .then((response) => response.data);
}

export async function GetFoodStatistic() {
  if (localSt === null) {
    window.location.href = "/login";
  }
  return await axios
    .get(host + `/api/` + version + `/` + COLLECTION + `/Foods`, {
      headers: { Authorization: `Bearer ${localSt}` },
    })
    .then((response) => response.data);
}

export async function GetMonthlyOrdersReservations() {
  if (localSt === null) {
    window.location.href = "/login";
  }
  return await axios
    .get(host + `/api/` + version + `/` + COLLECTION + `/OrdersReservations`, {
      headers: { Authorization: `Bearer ${localSt}` },
    })
    .then((response) => response.data);
}

export async function GetRoyalCustomers() {
  if (localSt === null) {
    window.location.href = "/login";
  }
  return await axios
    .get(host + `/api/` + version + `/` + COLLECTION + `/RoyalCustomers`, {
      headers: { Authorization: `Bearer ${localSt}` },
    })
    .then((response) => response.data);
}

export async function GetTrendingFood() {
  if (localSt === null) {
    window.location.href = "/login";
  }
  return await axios
    .get(host + `/api/` + version + `/` + COLLECTION + `/TrendingFood`, {
      headers: { Authorization: `Bearer ${localSt}` },
    })
    .then((response) => response.data);
}
import axios from "axios"

const host = "https://localhost:7246";

export function fetchData() {
    return axios.get(host + "/api/OrderDetails").then(response => response.data);
  }
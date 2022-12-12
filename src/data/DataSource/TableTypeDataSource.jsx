import { host, version } from "./dataSource";
import axios from "axios";

const COLLECTION = "TableTypes";
const localSt = localStorage.getItem("token");

export async function GetAll(searchValue) {
  if(localSt === null) {
    window.location.href = "/login";
  }
  const search = searchValue.trim();
  return await axios
    .get(
      host + `/api/v` + version + `/` + COLLECTION + `?searchValue=` + search,
      {
        headers: { Authorization: `Bearer ${localSt}` },
      }
    )
    .then((response) => response.data);
}

export async function CreateTableType(newTableTypeData) {
  if(localSt === null) {
    window.location.href = "/login";
  }
  const requestBody = {
    name: newTableTypeData["name"],
    chargePerSeat: newTableTypeData["chargePerSeat"],
    canBeCombined: newTableTypeData["canBeCombined"],
  };
  return await axios.post(
    host + `/api/v` + version + `/` + COLLECTION,
    requestBody,
    {
      headers: { Authorization: `Bearer ${localSt}` },
    }
  );
}

export async function UpdateTableType(newTableTypeData) {
  if(localSt === null) {
    window.location.href = "/login";
  }
  const requestBody = {
    id: newTableTypeData["id"],
    name: newTableTypeData["name"],
    chargePerSeat: newTableTypeData["chargePerSeat"],
    canBeCombined: newTableTypeData["canBeCombined"],
  };
  return await axios.put(
    host + `/api/v` + version + `/` + COLLECTION + "/" + newTableTypeData["id"],
    requestBody,
    {
      headers: { Authorization: `Bearer ${localSt}` },
    }
  );
}

export async function DeleteTableType(id) {
  if(localSt === null) {
    window.location.href = "/login";
  }
  return await axios.delete(
    host + `/api/v` + version + `/` + COLLECTION + "/" + id,
    {
      headers: { Authorization: `Bearer ${localSt}` },
    }
  );
}

export async function RecoverTableType(id) {
  if(localSt === null) {
    window.location.href = "/login";
  }
  return await axios.put(
    host + `/api/v` + version + `/` + COLLECTION + "/" + id + "/recover",
    {
      headers: { Authorization: `Bearer ${localSt}` },
    }
  );
}


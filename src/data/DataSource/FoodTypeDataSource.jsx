import { host, version } from "./dataSource";
import axios from "axios";

const COLLECTION = "Types";
const localSt = localStorage.getItem("token");

export async function GetAll(searchValue) {
  if(localSt === null) {
    window.location.href = "/login";
  }
  const search = searchValue.trim();
  return await axios
    .get(
      host + `/api/` + version + `/` + COLLECTION + `?searchValue=` + search,
      {
        headers: { Authorization: `Bearer ${localSt}` },
      }
    )
    .then((response) => response.data);
}

export async function CreateFoodType(newFoodTypeData) {
  if(localSt === null) {
    window.location.href = "/login";
  }
  const requestBody = {
    name: newFoodTypeData["name"],
    description: newFoodTypeData["description"],
  };
  return await axios.post(
    host + `/api/` + version + `/` + COLLECTION,
    requestBody,
    {
      headers: { Authorization: `Bearer ${localSt}` },
    }
  );
}

export async function UpdateFoodType(newFoodTypeData) {
  if(localSt === null) {
    window.location.href = "/login";
  }
  const requestBody = {
    id: newFoodTypeData["id"],
    name: newFoodTypeData["name"],
    description: newFoodTypeData["description"],
  };
  return await axios.put(
    host +
      `/api/` +
      version +
      `/` +
      COLLECTION +
      "/" +
      newFoodTypeData["id"],
    requestBody,
    {
      headers: { Authorization: `Bearer ${localSt}` },
    }
  );
}

export async function DeleteFoodType(id) {
  if(localSt === null) {
    window.location.href = "/login";
  }
  return await axios.delete(
    host + `/api/` + version + `/` + COLLECTION + "/" + id,
    {
      headers: { Authorization: `Bearer ${localSt}` },
    }
  );
}

export async function RecoverFoodType(id) {
  if(localSt === null) {
    window.location.href = "/login";
  }
  return await axios.put(
    host + `/api/` + version + `/` + COLLECTION + "/" + id + "/recover",
    {
      headers: { Authorization: `Bearer ${localSt}` },
    }
  );
}

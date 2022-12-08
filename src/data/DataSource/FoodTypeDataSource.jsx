import { host, version } from "./dataSource";
import axios from "axios";

const COLLECTION = "Types";

export async function GetAll(searchValue) {
  const search = searchValue.trim();
  return await axios
    .get(
      host + `/api/v` + version + `/` + COLLECTION + `?searchValue=` + search
    )
    .then((response) => response.data);
}

export async function CreateFoodType(newFoodTypeData) {
  const requestBody = {
    name: newFoodTypeData["name"],
    description: newFoodTypeData["description"],
  };
  return await axios.post(
    host + `/api/v` + version + `/` + COLLECTION,
    requestBody
  );
}

export async function UpdateFoodType(newFoodTypeData) {
  const requestBody = {
    id: newFoodTypeData["id"],
    name: newFoodTypeData["name"],
    description: newFoodTypeData["description"],
  };
  return await axios.put(
    host +
      `/api/v` +
      version +
      `/` +
      COLLECTION +
      "/" +
      newFoodTypeData["id"],
    requestBody
  );
}

export async function DeleteFoodType(id) {
  return await axios.delete(
    host + `/api/v` + version + `/` + COLLECTION + "/" + id
  );
}

export async function RecoverFoodType(id) {
  return await axios.put(
    host + `/api/v` + version + `/` + COLLECTION + "/" + id + "/recover"
  );
}

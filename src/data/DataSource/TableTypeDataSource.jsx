import { host, version } from "./dataSource";
import axios from "axios";

const COLLECTION = "TableTypes";

export async function GetAll(searchValue) {
  const search = searchValue.trim();
  return await axios
    .get(
      host + `/api/v` + version + `/` + COLLECTION + `?searchValue=` + search
    )
    .then((response) => response.data);
}

export async function CreateTableType(newTableTypeData) {
  const requestBody = {
    name: newTableTypeData["name"],
    chargePerSeat: newTableTypeData["chargePerSeat"],
    canBeCombined: newTableTypeData["canBeCombined"],
  };
  return await axios.post(
    host + `/api/v` + version + `/` + COLLECTION,
    requestBody
  );
}

export async function UpdateTableType(newTableTypeData) {
  const requestBody = {
    id: newTableTypeData["id"],
    name: newTableTypeData["name"],
    chargePerSeat: newTableTypeData["chargePerSeat"],
    canBeCombined: newTableTypeData["canBeCombined"],
  };
  return await axios.put(
    host + `/api/v` + version + `/` + COLLECTION + "/" + newTableTypeData["id"],
    requestBody
  );
}

export async function DeleteTableType(id) {
  return await axios.delete(
    host + `/api/v` + version + `/` + COLLECTION + "/" + id
  );
}

export async function RecoverTableType(id) {
  return await axios.put(
    host + `/api/v` + version + `/` + COLLECTION + "/" + id + "/recover"
  );
}


import { host, version } from "./dataSource";
import axios from "axios";

const COLLECTION = "Foods";
const localSt = localStorage.getItem("token");

export async function GetAll(searchBy, searchValue) {
  if (localSt === null) {
    window.location.href = "/login";
  }
  const search = searchValue.trim();
  return await axios
    .get(
      host +
        `/api/v` +
        version +
        `/` +
        COLLECTION +
        `?searchBy=` +
        searchBy +
        `&searchValue=` +
        search,
      {
        headers: { Authorization: `Bearer ${localSt}` },
      }
    )
    .then((response) => response.data);
}

export async function CreateFood(formData) {
  if (localSt === null) {
    window.location.href = "/login";
  }
  return await axios({
    method: "post",
    url: host + `/api/v` + version + `/` + COLLECTION,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localSt}`,
    },
  });
}

export async function UpdateFood(formData) {
  if (localSt === null) {
    window.location.href = "/login";
  }
  return await axios({
    method: "PUT",
    url: host + `/api/v` + version + `/` + COLLECTION + formData.id,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localSt}`,
    },
  });
}

export async function DeleteFood(id) {
  if (localSt === null) {
    window.location.href = "/login";
  }
  return await axios.delete(
    host + `/api/v` + version + `/` + COLLECTION + "/" + id,
    {
      headers: { Authorization: `Bearer ${localSt}` },
    }
  );
}

export async function RecoverFood(id) {
  if (localSt === null) {
    window.location.href = "/login";
  }
  return await axios.put(
    host + `/api/v` + version + `/` + COLLECTION + "/" + id + "/recover",
    null,
    {
      headers: { Authorization: `Bearer ${localSt}` },
    }
  );
}

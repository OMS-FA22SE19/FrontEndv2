import { host, version } from "./dataSource";
import axios from "axios";

const COLLECTION = "CourseTypes";
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

export async function CreateCourseType(newCourseTypeData) {
  if(localSt === null) {
    window.location.href = "/login";
  }
  const requestBody = {
    name: newCourseTypeData["name"],
    description: newCourseTypeData["description"],
  };
  return await axios.post(
    host + `/api/v` + version + `/` + COLLECTION,
    requestBody,
    {
      headers: { Authorization: `Bearer ${localSt}` },
    }
  );
}

export async function UpdateCourseType(newCourseTypeData) {
  if(localSt === null) {
    window.location.href = "/login";
  }
  const requestBody = {
    id: newCourseTypeData["id"],
    name: newCourseTypeData["name"],
    description: newCourseTypeData["description"],
  };
  return await axios.put(
    host +
      `/api/v` +
      version +
      `/` +
      COLLECTION +
      "/" +
      newCourseTypeData["id"],
    requestBody,
    {
      headers: { Authorization: `Bearer ${localSt}` },
    }
  );
}

export async function DeleteCourseType(id) {
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

export async function RecoverCourseType(id) {
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

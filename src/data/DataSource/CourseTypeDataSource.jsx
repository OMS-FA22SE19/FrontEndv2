import { host, version } from "./dataSource";
import axios from "axios";

const COLLECTION = "CourseTypes";

export async function GetAll(searchValue) {
  const search = searchValue.trim();
  return await axios
    .get(
      host + `/api/v` + version + `/` + COLLECTION + `?searchValue=` + search
    )
    .then((response) => response.data);
}

export async function CreateCourseType(newCourseTypeData) {
  const requestBody = {
    name: newCourseTypeData["name"],
    description: newCourseTypeData["description"],
  };
  return await axios.post(
    host + `/api/v` + version + `/` + COLLECTION,
    requestBody
  );
}

export async function UpdateCourseType(newCourseTypeData) {
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
    requestBody
  );
}

export async function DeleteCourseType(id) {
  return await axios.delete(
    host + `/api/v` + version + `/` + COLLECTION + "/" + id
  );
}

export async function RecoverCourseType(id) {
  return await axios.put(
    host + `/api/v` + version + `/` + COLLECTION + "/" + id + "/recover"
  );
}

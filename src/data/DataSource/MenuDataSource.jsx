import { host, version } from "./dataSource";
import axios from "axios";

const COLLECTION = "Menus";

export async function GetAll(searchValue) {
  const search = searchValue.trim();
  return await axios
    .get(
      host + `/api/v` + version + `/` + COLLECTION + `?searchValue=` + search
    )
    .then((response) => response.data);
}

export async function CreateMenu(newMenuData) {
  const requestBody = {
    name: newMenuData["name"],
    description: newMenuData["description"],
  };
  return await axios.post(
    host + `/api/v` + version + `/` + COLLECTION,
    requestBody
  );
}

export async function UpdateMenu(newMenuData) {
  const requestBody = {
    id: newMenuData["id"],
    name: newMenuData["name"],
    description: newMenuData["description"],
    available: newMenuData["available"],
  };
  return await axios.put(
    host + `/api/v` + version + `/` + COLLECTION + "/" + newMenuData["id"],
    requestBody
  );
}

export async function DeleteMenu(id) {
  return await axios.delete(
    host + `/api/v` + version + `/` + COLLECTION + "/" + id
  );
}

export async function RecoverMenu(id) {
  return await axios.put(
    host + `/api/v` + version + `/` + COLLECTION + "/" + id + "/recover"
  );
}

export async function GetFoodFromMenu(menuId) {
  return await axios.get(
    host + `/api/v` + version + `/` + COLLECTION + "/" + menuId + "/Food/"
  );
}

export async function AddExistedFoodToMenu(newMenuFoodData) {
  const requestBody = {
    price: newMenuFoodData["price"],
  };
  return await axios.post(
    host +
      `/api/v` +
      version +
      `/` +
      COLLECTION +
      "/" +
      newMenuFoodData["menuId"] +
      "/Food/" +
      newMenuFoodData["foodId"],
    requestBody
  );
}

export async function AddNewFoodToMenu(menuId, formData) {
  return await axios({
    method: "post",
    url:
      host + `/api/v` + version + `/` + COLLECTION + "/" + menuId + "/NewFood",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function UpdatePriceFoodOfMenu(menuId, menuFoodData) {
  const requestBody = {
    price: menuFoodData["price"],
  };
  await axios.put(
    host + `/api/v1/Menus/` + menuId + `/Food/` + menuFoodData["foodId"],
    requestBody
  );
}

export async function RemoveFoodFromMenu(menuId, foodId) {
  return await axios.delete(
    host +
      `/api/v` +
      version +
      `/` +
      COLLECTION +
      "/" +
      menuId +
      "/Food/" +
      foodId
  );
}

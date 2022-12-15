import { host, version } from "./dataSource";
import axios from "axios";

const COLLECTION = "Menus";
const localSt = localStorage.getItem("token");

export async function GetAll(searchValue) {
  if (localSt === null) {
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

export async function GetById(menuId) {
  if (localSt === null) {
    window.location.href = "/login";
  }
  return await axios
    .get(
      host + `/api/v` + version + `/` + COLLECTION + `/` + menuId,
      {
        headers: { Authorization: `Bearer ${localSt}` },
      }
    )
    .then((response) => response.data);
}

export async function CreateMenu(newMenuData) {
  if (localSt === null) {
    window.location.href = "/login";
  }
  const requestBody = {
    name: newMenuData["name"],
    description: newMenuData["description"],
  };
  return await axios.post(
    host + `/api/v` + version + `/` + COLLECTION,
    requestBody,
    {
      headers: { Authorization: `Bearer ${localSt}` },
    }
  );
}

export async function UpdateMenu(newMenuData) {
  if (localSt === null) {
    window.location.href = "/login";
  }
  const requestBody = {
    id: newMenuData["id"],
    name: newMenuData["name"],
    description: newMenuData["description"],
    available: newMenuData["available"],
  };
  return await axios.put(
    host + `/api/v` + version + `/` + COLLECTION + "/" + newMenuData["id"],
    requestBody,
    {
      headers: { Authorization: `Bearer ${localSt}` },
    }
  );
}

export async function DeleteMenu(id) {
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

export async function RecoverMenu(id) {
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

export async function GetFoodFromMenu(menuId, searchBy, searchValue = "") {
  if (localSt === null) {
    window.location.href = "/login";
  }
  console.log("a");
  const search = searchValue.trim();
  return await axios.get(
    host +
      `/api/v` +
      version +
      `/` +
      COLLECTION +
      `/` +
      menuId +
      `/Food?SearchBy=` +
      searchBy +
      `&SearchValue=` +
      search,
    {
      headers: { Authorization: `Bearer ${localSt}` },
    }
  );
}

export async function AddExistedFoodToMenu(menuId, newMenuFoodData) {
  if (localSt === null) {
    window.location.href = "/login";
  }
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
      menuId +
      "/Food/" +
      newMenuFoodData["foodId"],
    requestBody,
    {
      headers: { Authorization: `Bearer ${localSt}` },
    }
  );
}

export async function AddNewFoodToMenu(menuId, formData) {
  if (localSt === null) {
    window.location.href = "/login";
  }
  return await axios({
    method: "post",
    url:
      host + `/api/v` + version + `/` + COLLECTION + "/" + menuId + "/NewFood",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localSt}`,
    },
  });
}

export async function UpdatePriceFoodOfMenu(menuId, menuFoodData) {
  if (localSt === null) {
    window.location.href = "/login";
  }
  const requestBody = {
    price: menuFoodData["price"],
  };
  await axios.put(
    host + `/api/v1/Menus/` + menuId + `/Food/` + menuFoodData["foodId"],
    requestBody,
    {
      headers: { Authorization: `Bearer ${localSt}` },
    }
  );
}

export async function RemoveFoodFromMenu(menuId, foodId) {
  if (localSt === null) {
    window.location.href = "/login";
  }
  return await axios.delete(
    host +
      `/api/v` +
      version +
      `/` +
      COLLECTION +
      "/" +
      menuId +
      "/Food/" +
      foodId,
    {
      headers: { Authorization: `Bearer ${localSt}` },
    }
  );
}

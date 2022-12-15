import {
  GetAll,
  CreateMenu,
  UpdateMenu,
  DeleteMenu,
  RecoverMenu,
  GetFoodFromMenu,
  AddExistedFoodToMenu,
  AddNewFoodToMenu,
  UpdatePriceFoodOfMenu,
  RemoveFoodFromMenu,
  GetById
} from "../DataSource/MenuDataSource";

export async function GetMenus(searchValue) {
  return await GetAll(searchValue);
}

export async function AddNewMenu(newMenuData) {
  return await CreateMenu(newMenuData);
}

export async function UpdateNewMenu(newMenuData) {
  return await UpdateMenu(newMenuData);
}

export async function DeleteOldMenu(id) {
  return await DeleteMenu(id);
}

export async function RecoverDeletedMenu(id) {
  return await RecoverMenu(id);
}

export async function GetAllFoodFromMenu(menuId, searchBy, searchValue) {
  return await GetFoodFromMenu(menuId, searchBy, searchValue);
}

export async function GetMenuByMenuId(menuId) {
  return await GetById(menuId);
}

export async function AddFoodToMenu(menuId, newMenuFoodData) {
  return await AddExistedFoodToMenu(menuId, newMenuFoodData);
}
export async function CreateNewFoodToMenu(menuId, formData) {
  return await AddNewFoodToMenu(menuId, formData);
}

export async function UpdateFoodOfMenu(menuId, menuFoodData) {
  return await UpdatePriceFoodOfMenu(menuId, menuFoodData);
}

export async function RemoveFoodOfMenu(menuId, foodId) {
  return await RemoveFoodFromMenu(menuId, foodId);
}


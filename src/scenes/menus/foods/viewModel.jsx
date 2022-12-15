import { GetFoodFromMenuUseCase } from "../../../domain/useCase/menu/GetFoodFromMenu"; 
import { AddExistedFoodToMenuUseCase } from "../../../domain/useCase/menu/AddExistedFoodToMenu"; 
import { AddNewFoodToMenuUseCase } from "../../../domain/useCase/menu/AddNewFoodToMenu";
import { RemoveFoodFromMenuUseCase } from "../../../domain/useCase/menu/RemoveFoodFromMenu"; 
import { UpdateFoodOfMenuUseCase } from "../../../domain/useCase/menu/UpdateFoodOfMenu"; 
import { GetFoodUseCase } from "../../../domain/useCase/food/GetFoods";
import { GetMenuByIdUseCase } from "../../../domain/useCase/menu/GetMenuById";

export default function FoodListViewModel(props) {
  const { setAPIData, setMenuName, setSnackbar } = props;

  async function getMenuFoods(menuId, searchBy, searchValue = "") {
    const result = await GetFoodFromMenuUseCase(menuId, searchBy, searchValue);
    setAPIData(result.data.data);
  }

  async function getMenuById(menuId) {
    let response =  await GetMenuByIdUseCase(menuId);
    setMenuName(response.data["name"]);
  }

  async function getFoods(searchBy = "name", searchValue = "") {
    const result = await GetFoodUseCase(searchBy, searchValue);
    setAPIData(result.data);
  }

  async function addExistedFood(menuId, newMenuFoodData) {
    try {
      const response = await AddExistedFoodToMenuUseCase(menuId, newMenuFoodData);
      if (response.data.succeeded) {
        getMenuFoods(menuId);
      } else {
        setSnackbar(response.data?.message);
      }
    } catch (error) {
      if (error.response?.data?.errors === undefined) {
        setSnackbar(error.message);
        return;
      }
      setSnackbar(error.response?.data?.errors);
    }
  }

  async function addNewFood(menuId, formData) {
    try {
      const response = await AddNewFoodToMenuUseCase(menuId, formData);
      if (response.data.succeeded) {
        getMenuFoods(menuId);
      } else {
        setSnackbar(response.data?.message);
      }
    } catch (error) {
      if (error.response?.data?.errors === undefined) {
        setSnackbar(error.message);
        return;
      }
      setSnackbar(error.response?.data?.errors);
    }
  }

  async function updateMenuFood(menuId, menuFoodData) {
    try {
      const response = await UpdateFoodOfMenuUseCase(menuId, menuFoodData);
      if (response.status === 204) {
        getMenuFoods(menuId);
      } else {
        setSnackbar(response.data?.message);
      }
    } catch (error) {
      if (error.response?.data?.errors === undefined) {
        setSnackbar(error.message);
        return;
      }
      setSnackbar(error.response?.data?.errors);
    }
  }

  async function removeFood(menuId, foodId) {
    try {
      const response = await RemoveFoodFromMenuUseCase(menuId, foodId);
      if (response.status === 204) {
        getMenuFoods(menuId);
      } else {
        setSnackbar(response.data?.message);
      }
    } catch (error) {
      if (error.response?.data?.errors === undefined) {
        setSnackbar(error.message);
        return;
      }
      setSnackbar(error.response?.data?.errors);
    }
  }

  return {
    getMenuFoods,
    getMenuById,
    getFoods,
    addExistedFood,
    addNewFood,
    updateMenuFood,
    removeFood,
  };
}

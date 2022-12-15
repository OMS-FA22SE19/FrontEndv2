import { GetFoodUseCase } from "../../domain/useCase/food/GetFoods";
import { AddFoodUseCase } from "../../domain/useCase/food/AddNewFood";
import { DeleteFoodUseCase } from "../../domain/useCase/food/DeleteOldFood";
import { RecoverFoodUseCase } from "../../domain/useCase/food/RecoverDeletedFood";
import { UpdateFoodUseCase } from "../../domain/useCase/food/UpdateNewFood";

export default function FoodListViewModel(props) {
  const { setRows, setSnackbar } = props;

  async function getFoods(searchBy, searchValue = "") {
    const result = await GetFoodUseCase(searchBy, searchValue);
    setRows(result.data);
  }

  async function addFood(newFoodData) {
    try {
      const response = await AddFoodUseCase(newFoodData);
      if (response.data.succeeded) {
        getFoods("Name", "");
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

  async function updateFood(currentRow) {
    try {
      const response = await UpdateFoodUseCase(currentRow);
      if (response.status === 204) {
        getFoods("Name", "");
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

  async function deleteFood(id) {
    try {
      const response = await DeleteFoodUseCase(id);
      if (response.status === 204) {
        getFoods("Name", "");
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

  async function recoverFood(id) {
    try {
      const response = await RecoverFoodUseCase(id);
      if (response.status === 204) {
        getFoods("Name", "");
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
    getFoods,
    addFood,
    updateFood,
    deleteFood,
    recoverFood,
  };
}

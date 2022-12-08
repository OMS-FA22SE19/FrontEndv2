import { GetFoodTypesUseCase } from "../../domain/useCase/foodType/GetFoodTypes";
import { AddFoodTypeUseCase } from "../../domain/useCase/foodType/AddNewFoodType";
import { UpdateFoodTypeUseCase } from "../../domain/useCase/foodType/UpdateNewFoodType";
import { DeleteFoodTypeUseCase } from "../../domain/useCase/foodType/DeleteOldFoodType";
import { RecoverFoodTypesUseCase } from "../../domain/useCase/foodType/RecoverDeletedFoodType";

export default function FoodTypeListViewModel(props) {
  const { setRows, setSnackbar } = props;

  async function getFoodTypes(searchValue = "") {
    const result = await GetFoodTypesUseCase(searchValue);
    setRows(result.data);
  }

  async function addFoodType(newFoodTypeData) {
    try {
      const response = await AddFoodTypeUseCase(newFoodTypeData);
      if (response.data.succeeded) {
        getFoodTypes();
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

  async function updateFoodType(currentRow) {
    try {
      const response = await UpdateFoodTypeUseCase(currentRow);
      if (response.status === 204) {
        getFoodTypes();
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

  async function deleteFoodType(id) {
    try {
      const response = await DeleteFoodTypeUseCase(id);
      if (response.status === 204) {
        getFoodTypes();
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

  async function recoverFoodType(id) {
    try {
      const response = await RecoverFoodTypesUseCase(id);
      if (response.status === 204) {
        getFoodTypes();
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
    getFoodTypes,
    addFoodType,
    updateFoodType,
    deleteFoodType,
    recoverFoodType
  };
}

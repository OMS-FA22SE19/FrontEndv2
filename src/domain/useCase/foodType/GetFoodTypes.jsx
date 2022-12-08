import { GetFoodTypes } from "../../../data/Repository/FoodTypeRepository";

export async function GetFoodTypesUseCase(searchValue) {
    return await GetFoodTypes(searchValue);
}
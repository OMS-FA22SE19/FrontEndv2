import { GetFoods } from "../../../data/Repository/FoodRepository";

export async function GetFoodUseCase(searchBy, searchValue) {
    return await GetFoods(searchBy, searchValue);
}
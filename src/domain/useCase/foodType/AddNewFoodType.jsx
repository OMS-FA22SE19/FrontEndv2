import { AddNewFoodType } from "../../../data/Repository/FoodTypeRepository";

export async function AddFoodTypeUseCase(newFoodTypeData) {
    return await AddNewFoodType(newFoodTypeData);
}
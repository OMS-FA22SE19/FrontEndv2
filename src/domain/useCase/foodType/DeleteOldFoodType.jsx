import { DeleteOldFoodType } from "../../../data/Repository/FoodTypeRepository";

export async function DeleteFoodTypeUseCase(id) {
    return await DeleteOldFoodType(id);
}
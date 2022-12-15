import { DeleteOldFood } from "../../../data/Repository/FoodRepository";

export async function DeleteFoodUseCase(id) {
    return await DeleteOldFood(id);
}
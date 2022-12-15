import { AddNewFood } from "../../../data/Repository/FoodRepository";

export async function AddFoodUseCase(formData) {
    return await AddNewFood(formData);
}
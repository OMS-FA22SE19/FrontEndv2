import { UpdateNewFood } from "../../../data/Repository/FoodRepository";

export async function UpdateFoodUseCase(formData) {
    return await UpdateNewFood(formData);
}
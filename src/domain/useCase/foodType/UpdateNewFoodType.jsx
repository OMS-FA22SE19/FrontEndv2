import { UpdateNewFoodType } from "../../../data/Repository/FoodTypeRepository";

export async function UpdateFoodTypeUseCase(newFoodTypeData) {
    return await UpdateNewFoodType(newFoodTypeData);
}
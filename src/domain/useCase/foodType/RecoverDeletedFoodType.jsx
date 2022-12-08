import { RecoverDeletedFoodType } from "../../../data/Repository/FoodTypeRepository";

export async function RecoverFoodTypesUseCase(id) {
    return await RecoverDeletedFoodType(id);
}
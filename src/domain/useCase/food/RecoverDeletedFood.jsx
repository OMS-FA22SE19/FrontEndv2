import { RecoverDeletedFood } from "../../../data/Repository/FoodRepository";

export async function RecoverFoodUseCase(id) {
    return await RecoverDeletedFood(id);
}
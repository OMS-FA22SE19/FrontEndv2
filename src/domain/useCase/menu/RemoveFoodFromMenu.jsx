import { RemoveFoodOfMenu } from "../../../data/Repository/MenuRepository";

export async function RemoveFoodFromMenuUseCase(menuId, foodId) {
    return await RemoveFoodOfMenu(menuId, foodId);
}
import { AddFoodToMenu } from "../../../data/Repository/MenuRepository";

export async function AddExistedFoodToMenuUseCase(menuId, newMenuFoodData) {
    return await AddFoodToMenu(menuId, newMenuFoodData);
}
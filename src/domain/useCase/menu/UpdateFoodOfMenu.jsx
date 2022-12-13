import { UpdateFoodOfMenu } from "../../../data/Repository/MenuRepository";

export async function UpdateFoodOfMenuUseCase(menuId, menuFoodData) {
    return await UpdateFoodOfMenu(menuId, menuFoodData);
}
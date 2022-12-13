import { GetAllFoodFromMenu } from "../../../data/Repository/MenuRepository";

export async function GetFoodFromMenuUseCase(menuId) {
    return await GetAllFoodFromMenu(menuId);
}
import { GetAllFoodFromMenu } from "../../../data/Repository/MenuRepository";

export async function GetFoodFromMenuUseCase(menuId, searchBy, searchValue) {
    return await GetAllFoodFromMenu(menuId, searchBy, searchValue);
}
import { GetMenuByMenuId } from "../../../data/Repository/MenuRepository";

export async function GetMenuByIdUseCase(menuId) {
    return await GetMenuByMenuId(menuId);
}
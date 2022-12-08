import { GetMenus } from "../../../data/Repository/MenuRepository";

export async function GetMenusUseCase(searchValue) {
    return await GetMenus(searchValue);
}
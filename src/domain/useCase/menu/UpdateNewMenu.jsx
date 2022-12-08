import { UpdateNewMenu } from "../../../data/Repository/MenuRepository";

export async function UpdateMenusUseCase(newMenuData) {
    return await UpdateNewMenu(newMenuData);
}
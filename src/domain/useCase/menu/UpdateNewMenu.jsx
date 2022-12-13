import { UpdateNewMenu } from "../../../data/Repository/MenuRepository";

export async function UpdateMenuUseCase(newMenuData) {
    return await UpdateNewMenu(newMenuData);
}
import { AddNewMenu } from "../../../data/Repository/MenuRepository";

export async function AddMenuUseCase(newMenuData) {
    return await AddNewMenu(newMenuData);
}
import { CreateNewFoodToMenu } from "../../../data/Repository/MenuRepository";

export async function AddNewFoodToMenuUseCase(menuId, formData) {
    return await CreateNewFoodToMenu(menuId, formData);
}
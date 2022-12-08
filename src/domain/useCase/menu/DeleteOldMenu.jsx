import { DeleteOldMenu } from "../../../data/Repository/MenuRepository";

export async function DeleteMenuUseCase(id) {
    return await DeleteOldMenu(id);
}
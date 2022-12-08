import { RecoverDeletedMenu } from "../../../data/Repository/MenuRepository";

export async function RecoverMenusUseCase(id) {
    return await RecoverDeletedMenu(id);
}
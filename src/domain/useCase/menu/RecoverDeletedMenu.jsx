import { RecoverDeletedMenu } from "../../../data/Repository/MenuRepository";

export async function RecoverMenuUseCase(id) {
    return await RecoverDeletedMenu(id);
}
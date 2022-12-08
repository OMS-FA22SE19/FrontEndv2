import { RecoverDeletedTableType } from "../../../data/Repository/TableTypeRepository";

export async function RecoverTableTypesUseCase(id) {
    return await RecoverDeletedTableType(id);
}
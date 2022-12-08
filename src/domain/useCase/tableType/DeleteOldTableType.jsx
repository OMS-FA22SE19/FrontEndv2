import { DeleteOldTableType } from "../../../data/Repository/TableTypeRepository";

export async function DeleteTableTypeUseCase(id) {
    return await DeleteOldTableType(id);
}
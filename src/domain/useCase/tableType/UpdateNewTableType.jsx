import { UpdateNewTableType } from "../../../data/Repository/TableTypeRepository";

export async function UpdateTableTypesUseCase(newTableTypeData) {
    return await UpdateNewTableType(newTableTypeData);
}
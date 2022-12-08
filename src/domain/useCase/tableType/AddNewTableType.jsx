import { AddNewTableType } from "../../../data/Repository/TableTypeRepository";

export async function AddTableTypesUseCase(newTableTypeData) {
    return await AddNewTableType(newTableTypeData);
}
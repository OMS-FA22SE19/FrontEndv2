import { GetTableTypes } from "../../../data/Repository/TableTypeRepository";

export async function GetTableTypesUseCase(searchValue) {
    return await GetTableTypes(searchValue);
}
import { GetAll, CreateTableType, UpdateTableType, DeleteTableType, RecoverTableType } from "../DataSource/TableTypeDataSource";

export async function GetTableTypes(searchValue) {
    return await GetAll(searchValue);
}

export async function AddNewTableType(newTableTypeData) {
    return await CreateTableType(newTableTypeData);;
}

export async function UpdateNewTableType(newTableTypeData) {
    return await UpdateTableType(newTableTypeData);;
}

export async function DeleteOldTableType(id) {
    return await DeleteTableType(id);;
}

export async function RecoverDeletedTableType(id) {
    return await RecoverTableType(id);;
}
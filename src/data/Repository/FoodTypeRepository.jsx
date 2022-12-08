import { GetAll, CreateFoodType, UpdateFoodType, DeleteFoodType, RecoverFoodType } from "../DataSource/FoodTypeDataSource";

export async function GetFoodTypes(searchValue) {
    return await GetAll(searchValue);
}

export async function AddNewFoodType(newFoodTypeData) {
    return await CreateFoodType(newFoodTypeData);;
}

export async function UpdateNewFoodType(newFoodTypeData) {
    return await UpdateFoodType(newFoodTypeData);;
}

export async function DeleteOldFoodType(id) {
    return await DeleteFoodType(id);;
}

export async function RecoverDeletedFoodType(id) {
    return await RecoverFoodType(id);;
}
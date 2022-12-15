import { GetAll, CreateFood, UpdateFood, DeleteFood, RecoverFood } from "../DataSource/FoodDataSource";

export async function GetFoods(searchBy, searchValue) {
    return await GetAll(searchBy, searchValue);
}

export async function AddNewFood(formData) {
    return await CreateFood(formData);;
}

export async function UpdateNewFood(formData) {
    return await UpdateFood(formData);;
}

export async function DeleteOldFood(id) {
    return await DeleteFood(id);;
}

export async function RecoverDeletedFood(id) {
    return await RecoverFood(id);;
}
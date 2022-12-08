import { GetAll, CreateCourseType, UpdateCourseType, DeleteCourseType, RecoverCourseType } from "../DataSource/CourseTypeDataSource";

export async function GetCourseTypes(searchValue) {
    return await GetAll(searchValue);
}

export async function AddNewCourseType(newCourseTypeData) {
    return await CreateCourseType(newCourseTypeData);;
}

export async function UpdateNewCourseType(newCourseTypeData) {
    return await UpdateCourseType(newCourseTypeData);;
}

export async function DeleteOldCourseType(id) {
    return await DeleteCourseType(id);;
}

export async function RecoverDeletedCourseType(id) {
    return await RecoverCourseType(id);;
}
import { GetCourseTypes } from "../../../data/Repository/CourseTypeRepository";

export async function GetCourseTypeUseCase(searchValue) {
    return await GetCourseTypes(searchValue);
}
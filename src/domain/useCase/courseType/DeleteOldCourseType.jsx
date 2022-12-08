import { DeleteOldCourseType } from "../../../data/Repository/CourseTypeRepository";

export async function DeleteCourseTypeUseCase(id) {
    return await DeleteOldCourseType(id);
}
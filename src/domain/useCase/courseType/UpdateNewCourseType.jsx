import { UpdateNewCourseType } from "../../../data/Repository/CourseTypeRepository";

export async function UpdateCourseTypeUseCase(newCourseTypeData) {
    return await UpdateNewCourseType(newCourseTypeData);
}
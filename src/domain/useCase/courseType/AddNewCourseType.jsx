import { AddNewCourseType } from "../../../data/Repository/CourseTypeRepository";

export async function AddCourseTypeUseCase(newCourseTypeData) {
    return await AddNewCourseType(newCourseTypeData);
}
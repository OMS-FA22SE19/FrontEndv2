import { RecoverDeletedCourseType } from "../../../data/Repository/CourseTypeRepository";

export async function RecoverCourseTypeUseCase(id) {
    return await RecoverDeletedCourseType(id);
}
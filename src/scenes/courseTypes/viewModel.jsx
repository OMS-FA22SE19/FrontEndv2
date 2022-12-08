import { GetCourseTypeUseCase } from "../../domain/useCase/courseType/GetCourseTypes";
import { AddCourseTypeUseCase } from "../../domain/useCase/courseType/AddNewCourseType";
import { UpdateCourseTypeUseCase } from "../../domain/useCase/courseType/UpdateNewCourseType";
import { DeleteCourseTypeUseCase } from "../../domain/useCase/courseType/DeleteOldCourseType";
import { RecoverCourseTypeUseCase } from "../../domain/useCase/courseType/RecoverDeletedCourseType";

export default function CourseTypeListViewModel(props) {
  const { setRows, setSnackbar } = props;

  async function getCourseTypes(searchValue = "") {
    const result = await GetCourseTypeUseCase(searchValue);
    setRows(result.data);
  }

  async function addCourseType(newCourseTypeData) {
    try {
      const response = await AddCourseTypeUseCase(newCourseTypeData);
      if (response.data.succeeded) {
        getCourseTypes();
      } else {
        setSnackbar(response.data?.message);
      }
    } catch (error) {
      if (error.response?.data?.errors === undefined) {
        setSnackbar(error.message);
        return;
      }
      setSnackbar(error.response?.data?.errors);
    }
  }

  async function updateCourseType(currentRow) {
    try {
      const response = await UpdateCourseTypeUseCase(currentRow);
      if (response.status === 204) {
        getCourseTypes();
      } else {
        setSnackbar(response.data?.message);
      }
    } catch (error) {
      if (error.response?.data?.errors === undefined) {
        setSnackbar(error.message);
        return;
      }
      setSnackbar(error.response?.data?.errors);
    }
  }

  async function deleteCourseType(id) {
    try {
      const response = await DeleteCourseTypeUseCase(id);
      if (response.status === 204) {
        getCourseTypes();
      } else {
        setSnackbar(response.data?.message);
      }
    } catch (error) {
      if (error.response?.data?.errors === undefined) {
        setSnackbar(error.message);
        return;
      }
      setSnackbar(error.response?.data?.errors);
    }
  }

  async function recoverCourseType(id) {
    try {
      const response = await RecoverCourseTypeUseCase(id);
      if (response.status === 204) {
        getCourseTypes();
      } else {
        setSnackbar(response.data?.message);
      }
    } catch (error) {
      if (error.response?.data?.errors === undefined) {
        setSnackbar(error.message);
        return;
      }
      setSnackbar(error.response?.data?.errors);
    }
  }

  return {
    getCourseTypes,
    addCourseType,
    updateCourseType,
    deleteCourseType,
    recoverCourseType
  };
}

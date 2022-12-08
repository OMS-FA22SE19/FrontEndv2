import { GetTableTypesUseCase } from "../../domain/useCase/tableType/GetTableTypes";
import { AddTableTypesUseCase } from "../../domain/useCase/tableType/AddNewTableType";
import { UpdateTableTypesUseCase } from "../../domain/useCase/tableType/UpdateNewTableType";
import { DeleteTableTypeUseCase } from "../../domain/useCase/tableType/DeleteOldTableType";
import { RecoverTableTypesUseCase } from "../../domain/useCase/tableType/RecoverDeletedTableType";

export default function TableTypeListViewModel(props) {
  const { setRows, setSnackbar } = props;

  async function getTableTypes(searchValue = "") {
    const result = await GetTableTypesUseCase(searchValue);
    setRows(result.data);
  }

  async function addTableType(newTableTypeData) {
    try {
      const response = await AddTableTypesUseCase(newTableTypeData);
      if (response.data.succeeded) {
        getTableTypes();
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

  async function updateTableType(currentRow) {
    try {
      const response = await UpdateTableTypesUseCase(currentRow);
      if (response.status === 204) {
        getTableTypes();
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

  async function deleteTableType(id) {
    try {
      const response = await DeleteTableTypeUseCase(id);
      if (response.status === 204) {
        getTableTypes();
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

  async function recoverTableType(id) {
    try {
      const response = await RecoverTableTypesUseCase(id);
      if (response.status === 204) {
        getTableTypes();
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
    getTableTypes,
    addTableType,
    updateTableType,
    deleteTableType,
    recoverTableType
  };
}

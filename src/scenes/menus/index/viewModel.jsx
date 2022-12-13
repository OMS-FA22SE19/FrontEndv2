import { GetMenusUseCase } from "../../../domain/useCase/menu/GetMenus";
import { AddMenuUseCase } from "../../../domain/useCase/menu/AddNewMenu";
import { UpdateMenuUseCase } from "../../../domain/useCase/menu/UpdateNewMenu";
import { DeleteMenuUseCase } from "../../../domain/useCase/menu/DeleteOldMenu";
import { RecoverMenuUseCase } from "../../../domain/useCase/menu/RecoverDeletedMenu";

export default function MenuListViewModel(props) {
  const { setRows, setSnackbar } = props;

  async function getMenus(searchValue = "") {
    const result = await GetMenusUseCase(searchValue);
    setRows(result.data);
  }

  async function addMenu(newMenuData) {
    try {
      const response = await AddMenuUseCase(newMenuData);
      if (response.data.succeeded) {
        getMenus();
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

  async function updateMenu(currentRow) {
    try {
      const response = await UpdateMenuUseCase(currentRow);
      if (response.status === 204) {
        getMenus();
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

  async function deleteMenu(id) {
    try {
      const response = await DeleteMenuUseCase(id);
      if (response.status === 204) {
        getMenus();
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

  async function recoverMenu(id) {
    try {
      const response = await RecoverMenuUseCase(id);
      if (response.status === 204) {
        getMenus();
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
    getMenus,
    addMenu,
    updateMenu,
    deleteMenu,
    recoverMenu
  };
}

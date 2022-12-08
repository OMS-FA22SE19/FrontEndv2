import * as React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid";

export function EditToolbar(props) {
  const { rows, setRows, setRowModesModel, isAdding, setIsAdding, name, setName, description, setDescription, setValid } = props;

  const handleClick = () => {
    const id = Math.max(...rows.map((o) => o.id)) + 1;
    setName("");
    setDescription("");
    setValid(false);
    setIsAdding(true);
    setRows((oldRows) => [
      ...oldRows,
      { id, name: {name}, description: {description}, isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  if (!isAdding) {
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add New Course Type
        </Button>
      </GridToolbarContainer>
    );
  }
}

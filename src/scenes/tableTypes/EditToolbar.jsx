import { Button } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid";

export function EditToolbar(props) {
  const {
    rows,
    setRows,
    setRowModesModel,
    isAdding,
    setIsAdding,
    name,
    setName,
    chargePerSeat,
    setChargePerSeat,
    canBeCombined,
    setCanBeCombined,
    valid,
    setValid,
  } = props;

  const handleClick = () => {
    const id = Math.max(...rows.map((o) => o.id)) + 1;
    setName("");
    setChargePerSeat(0);
    setCanBeCombined(false);
    setValid(false);
    setIsAdding(true);
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        name: {name},
        quantity: 0,
        chargePerSeat: {chargePerSeat},
        canBeCombined: {canBeCombined},
        isNew: true,
      },
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
          Add New Table Type
        </Button>
      </GridToolbarContainer>
    );
  }
}

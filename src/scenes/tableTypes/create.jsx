import { Box, Button, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import FormControlLabel from "@mui/material/FormControlLabel";

const CreateTableType = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [canBeCombined, setCanBeCombined] = useState(false);

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/tableTypes`;
    navigate(path);
  };

	const handleCheckBoxChange = (event) => {
		setCanBeCombined(event.target.checked);
	}

  const handleFormSubmit = async (values) => {
    const requestBody = {
      name: values.name,
			chargePerSeat: values.chargePerSeat,
      canBeCombined: values.canBeCombined
    };
    await axios.post(`https://localhost:7246/api/v1/TableTypes`, requestBody);
    routeChange();
  };

  return (
    <Box m="20px">
      <Header title="CREATE TABLE TYPE" subtitle="Create a New Table Type" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="string"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Charge Per Seat"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.chargePerSeat}
                name="chargePerSeat"
                error={!!touched.chargePerSeat && !!errors.chargePerSeat}
                helperText={touched.chargePerSeat && errors.chargePerSeat}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.canBeCombined}
                  onChange={(e) => {
										values.canBeCombined = e.target.checked;
										handleCheckBoxChange(e);
									}}
                  color="secondary"
                />
              }
              label="Can Be Combined"
            />
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Table
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  chargePerSeat: yup.number().required("required"),
  canBeCombined: yup.boolean().required("required"),
});
const initialValues = {
  name: "",
  chargePerSeat: 0,
  canBeCombined: false,
};

export default CreateTableType;

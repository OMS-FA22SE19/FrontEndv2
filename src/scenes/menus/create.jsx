import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import FormControlLabel from "@mui/material/FormControlLabel";

const CreateMenu = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [isHidden, setIsHidden] = useState(false);

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/menus`;
    navigate(path);
  };

  const handleCheckBoxChange = (event) => {
    setIsHidden(event.target.checked);
  };

  const handleFormSubmit = async (values) => {
    const requestBody = {
      name: values.name,
      description: values.description,
      isHidden: values.isHidden,
    };
    await axios
      .post(`https://localhost:7246/api/v1/Menus`, requestBody)
      .finally(() => routeChange());
  };

  return (
    <Box m="20px">
      <Header title="CREATE MENU" subtitle="Create a New Menu" />
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
                type="string"
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isHidden}
                  onChange={(e) => {
                    handleCheckBoxChange(e);
                    values.isHidden = isHidden;
                  }}
                  color="secondary"
                />
              }
              label="Hidden"
            />
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Menu
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
  description: yup.string().required("required")
});
const initialValues = {
  name: "",
  description: "",
  isHidden: true,
};

export default CreateMenu;

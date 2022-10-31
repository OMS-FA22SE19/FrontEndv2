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
import { useParams } from "react-router-dom";

const UpdateUser = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    await axios
      .get(`https://localhost:7246/api/v1/users/` + id)
      .then((response) => {
        const fullName = response.data["data"].fullName;
        const email = response.data["data"].email;
        const phoneNumber = response.data["data"].phoneNumber;

        initialValues.email = email;
        initialValues.fullName = fullName;
        initialValues.phoneNumber = phoneNumber;
      });
  };

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/users`;
    navigate(path);
  };

  const handleFormSubmit = async (values) => {
    const requestBody = {
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      role: values.role,
    };
    await axios
      .put(`https://localhost:7246/api/v1/users/` + id, requestBody)
      .finally(() => routeChange());
  };

  return (
    <Box m="20px">
      <Header title="UPDATE USER" subtitle={"Update User Id: " + id} />
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
                label="Role"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.role}
                name="role"
                error={!!touched.role && !!errors.role}
                helperText={touched.role && errors.role}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="string"
                label="FullName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fullName}
                name="fullName"
                error={!!touched.fullName && !!errors.fullName}
                helperText={touched.fullName && errors.fullName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="string"
                label="Phone Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phoneNumber}
                name="phoneNumber"
                error={!!touched.phoneNumber && !!errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  fullName: yup.string().required("required"),
  phoneNumber: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  role: yup.string().required("required"),
});
const initialValues = {
  fullName: "",
  phoneNumber: "",
  role: "",
};

export default UpdateUser;

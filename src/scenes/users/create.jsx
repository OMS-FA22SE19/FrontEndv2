import { Box, Button, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import React, {  } from "react";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { host, version } from "../../data/DataSource/dataSource";

const CreateUser = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const localSt = localStorage.getItem("token");
  const [role, setRole] = React.useState("Administrator");
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/users`;
    navigate(path);
  };

  const handleFormSubmit = async (values) => {
    if(localSt === null) {
      window.location.href = "/login";
    }
    const requestBody = {
      fullName: values.fullName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      password: values.password,
      role: role,
    };
    await axios.post(host + `/api/` + version + `/Users`, requestBody,
    {
      headers: { Authorization: `Bearer ${localSt}` },
    });
    routeChange();
  };

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User" />
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
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <FormControl fullWidth>
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={role}
                  label="Role"
                  onChange={(event) => setRole(event.target.value)}
                >
                  <MenuItem value="Administrator" key="Administrator">
                    Administrator
                  </MenuItem>
                  <MenuItem value="Restaurant Owner" key="Restaurant Owner">
                    Restaurant Owner
                  </MenuItem>
                  <MenuItem value="Staff" key="Staff">
                    Staff
                  </MenuItem>
                  <MenuItem value="Chef" key="Chef">
                    Chef
                  </MenuItem>
                  <MenuItem value="Customer" key="Customer">
                    Customer
                  </MenuItem>
                </Select>
                <FormHelperText hidden>Required</FormHelperText>
              </FormControl>
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
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Confirm Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.passwordConfirmation}
                name="passwordConfirmation"
                error={
                  !!touched.passwordConfirmation &&
                  !!errors.passwordConfirmation
                }
                helperText={
                  touched.passwordConfirmation && errors.passwordConfirmation
                }
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button onClick={() => handleFormSubmit(values)} type="submit" color="secondary" variant="contained">
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
  email: yup.string().email("invalid email").required("required"),
  phoneNumber: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  password: yup
    .string()
    .required("required"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  role: yup.string().required("required"),
});
const initialValues = {
  fullName: "",
  email: "",
  phoneNumber: "",
  password: "",
  passwordConfirmation: "",
  role: "",
};

export default CreateUser;

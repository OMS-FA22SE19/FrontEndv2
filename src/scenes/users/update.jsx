import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { host, version } from "../../data/DataSource/dataSource";

const UpdateUser = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { id } = useParams();
  const localSt = localStorage.getItem("token");
  const [role, setRole] = React.useState("Administrator");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (localSt === null) {
      window.location.href = "/login";
    }
    await axios
      .get(host + `/api/` + version + `/users/` + id, {
        headers: { Authorization: `Bearer ${localSt}` },
      })
      .then((response) => {
        const fullName = response.data["data"].fullName;
        const email = response.data["data"].email;
        const phoneNumber = response.data["data"].phoneNumber;
        const roleValue = response.data["data"].role;

        initialValues.email = email;
        initialValues.fullName = fullName;
        initialValues.phoneNumber = phoneNumber;
        initialValues.role = roleValue;
        setRole(roleValue);
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
    console.log({ requestBody });
    await axios
      .put(host + `/api/` + version + `/users/` + id, requestBody, {
        headers: { Authorization: `Bearer ${localSt}` },
      })
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
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="warning" variant="contained">
                Update User
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

import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { UserContext } from "../../context/UserContext";
import Alert from "@mui/material/Alert";
import { host, version } from "../../data/DataSource/dataSource";

const Login = () => {
  const { user } = useContext(UserContext);
  const [error, setError] = React.useState("");

  let navigate = useNavigate();
  const routeChange = () => {
    if (user !== null) {
      window.location.href = "/";
    }
  };

  useEffect(() => routeChange, []);

  const handleFormSubmit = async (values) => {
    const requestBody = {
      Email: values.email,
      Password: values.password,
    };
    await axios
      .post(host + "/api/" + version + "/Authentication", requestBody)
      .then((response) => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        const token = response["data"].data.jwtToken;
        if (response.status === 200 && token !== null) {
          localStorage.setItem("token", token);
          return;
        }
        throw new Error("Something went wrong! Please try again");
      })
      .then(() => {
        values.email = "";
        values.password = "";
      })
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error.request.status === 401);
        if (error.response.status === 401 || error.request.status === 401) {
          setError("Wrong username or password");
          return;
        }
        setError(error.response.data.message);
      });
  };

  return (
    <Box m="20px">
      <Header title="Sign In" subtitle="Login to OMS" />
      {error === "" ? null : <Alert severity="error">{error}</Alert>}
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
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 1, sm: 1, md: 1 }}
            >
              <Grid item xs={2} sm={4} md={4} key={1}>
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
                  sx={{ gridColumn: "span 1" }}
                />
              </Grid>
              <Grid item xs={2} sm={4} md={4} key={2}>
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
                  sx={{ gridColumn: "span 1" }}
                />
              </Grid>
              <Grid item xs={2} sm={4} md={4} key={3}>
                <Button type="submit" color="secondary" variant="contained">
                  Login
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  // email: yup.string().email("invalid email").required("required"),
  email: yup.string().required("required"),
  password: yup.string().required("required"),
});
const initialValues = {
  email: "",
  password: "",
};

export default Login;

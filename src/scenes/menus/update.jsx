import { Box, Button, TextField } from "@mui/material";
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

const UpdateMenu= () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [getIsHidden, setIsHidden] = useState(false);
  const [getName, setName] = useState("");
  const [getDescription, setDescription] = useState("");

  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, []);

  const initialValues = {
    name: { getName },
    description: { getDescription },
    isHidden: { getIsHidden },
  };

  const fetchData = async () => {
    await axios
      .get(`https://localhost:7246/api/v1/menus/` + id)
      .then((response) => {
        const isHidden = response.data["data"].isHidden;
        const name = response.data["data"].name;
        const description = response.data["data"].description;

    
        setIsHidden(isHidden);
        setName(name);
        setDescription(description);

        initialValues.isHidden = isHidden;
        initialValues.name = name;
        initialValues.description = description;
      });
  };

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
      id: id,
      name: values.name,
      description: values.description,
      isHidden: values.isHidden,
    };
    
    await axios
      .put(`https://localhost:7246/api/v1/menus/` + id, requestBody)
      .finally(() => routeChange());
  };

  return (
    <Box m="20px">
      <Header
        title="UPDATE MENU"
        subtitle={"Update Menu ID: " + id}
      />
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
                  checked={values.isHidden}
                  onChange={(e) => {
                    values.isHidden = e.target.checked;
                    handleCheckBoxChange(e);
                  }}
                  color="secondary"
                />
              }
              label="IsHidden"
            />
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Menu
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
  description: yup.string().required("required"),
  isHidden: yup.boolean().required("required"),
});

export default UpdateMenu;

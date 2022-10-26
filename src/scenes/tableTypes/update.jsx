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

const UpdateTableType = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [getCanBeCombined, setCanBeCombined] = useState(false);
  const [getName, setName] = useState("");
  const [getChargePerSeat, setChargePerSeat] = useState("");

  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, []);

  const initialValues = {
    name: { getName },
    chargePerSeat: { getChargePerSeat },
    canBeCombined: { getCanBeCombined },
  };

  const fetchData = async () => {
    await axios
      .get(`https://localhost:7246/api/v1/TableTypes/` + id)
      .then((response) => {
        const canBeCombined = response.data["data"].canBeCombined;
        const name = response.data["data"].name;
        const chargePerSeat = response.data["data"].chargePerSeat;

    
        setCanBeCombined(canBeCombined);
        setName(name);
        setChargePerSeat(chargePerSeat);

        initialValues.canBeCombined = canBeCombined;
        initialValues.name = name;
        initialValues.chargePerSeat = chargePerSeat;
      });
  };

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/tableTypes`;
    navigate(path);
  };

  const handleCheckBoxChange = (event) => {
    setCanBeCombined(event.target.checked);
  };

  const handleFormSubmit = async (values) => {
    const requestBody = {
      id: id,
      name: values.name,
      chargePerSeat: values.chargePerSeat,
      canBeCombined: values.canBeCombined,
    };
    await axios
      .put(`https://localhost:7246/api/v1/TableTypes/` + id, requestBody)
      .finally(() => routeChange());
  };

  return (
    <Box m="20px">
      <Header
        title="UPDATE TABLE TYPE"
        subtitle={"Update Table Type ID: " + id}
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
                Update Table Type
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

export default UpdateTableType;

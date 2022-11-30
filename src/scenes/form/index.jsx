import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import * as React from "react";
import axios from "axios";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [demoReservation, setDemoReservation] = React.useState([]);

  const handleFormSubmit = async (values) => {
    var query = {
      startTime: values.startTime,
      endTime: values.endTime,
      numOfCheckInReservation: values.numOfCheckInReservation,
      numOfAvailableReservation: values.numOfAvailableReservation,
      numOfCancelledReservation: values.numOfCancelledReservation,
    };

    await axios
    .post(`https://localhost:7246/api/v1/Demo/Reservation`, query)
    .then((response) => setDemoReservation(response.data["data"]));
  };

  return (
    <Box m="20px">
      <Header
        title="Demo Reservation"
        subtitle="Create Multiple Reservations"
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
                type="time"
                label="StartTime"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.startTime}
                name="startTime"
                error={!!touched.startTime && !!errors.startTime}
                helperText={touched.startTime && errors.startTime}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="time"
                label="EndTime"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.endTime}
                name="endTime"
                error={!!touched.endTime && !!errors.endTime}
                helperText={touched.endTime && errors.endTime}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="string"
                label="Console Log"
                onBlur={handleBlur}
                onChange={handleChange}
                value={demoReservation}
                name="Reservation Console Log"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Num Of CheckIn Reservations"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.numOfCheckInReservation}
                name="numOfCheckInReservation"
                error={
                  !!touched.numOfCheckInReservation &&
                  !!errors.numOfCheckInReservation
                }
                helperText={
                  touched.numOfCheckInReservation &&
                  errors.numOfCheckInReservation
                }
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Num Of Available Reservations"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.numOfAvailableReservation}
                name="numOfAvailableReservation"
                error={
                  !!touched.numOfAvailableReservation &&
                  !!errors.numOfAvailableReservation
                }
                helperText={
                  touched.numOfAvailableReservation &&
                  errors.numOfAvailableReservation
                }
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Num Of Cancelled Reservations"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.numOfCancelledReservation}
                name="numOfCancelledReservation"
                error={
                  !!touched.numOfCancelledReservation &&
                  !!errors.numOfCancelledReservation
                }
                helperText={
                  touched.numOfCancelledReservation &&
                  errors.numOfCancelledReservation
                }
                sx={{ gridColumn: "span 1" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Reservations
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  numOfCheckInReservation: yup.number().moreThan(-1),
  numOfAvailableReservation: yup.number().moreThan(-1),
  numOfCancelledReservation: yup.number().moreThan(-1),
});
const initialValues = {
  startTime: "11:00",
  endTime: "",
  numOfCheckInReservation: 0,
  numOfAvailableReservation: 0,
  numOfCancelledReservation: 0,
};

export default Form;

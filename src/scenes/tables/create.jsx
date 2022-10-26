import { Box, Button, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import React, { useEffect, useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { useNavigate } from "react-router-dom";

const CreateTable = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [tableTypes, setTableTypes] = useState([]);
  const [tableTypeId, setTableTypeId] = React.useState('');

  const handleSelectChange = (event) => {
    setTableTypeId(event.target.value);
  };

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/tables`; 
    navigate(path);
  }


  const handleFormSubmit = async (values) => {
    const requestBody = {numOfSeats: values.numOfSeats, tableTypeId: values.tableTypeId}
    await axios
      .post(`https://localhost:7246/api/v1/Tables`, requestBody);
    routeChange();
  };
  
  const getTableTypes = async () => {
    await axios
      .get(`https://localhost:7246/api/v1/TableTypes`)
      .then((response) => setTableTypes(response.data["data"]));
  };

  useEffect(() => {
    getTableTypes();
  }, []);

  return (
    <Box m="20px">
      <Header title="CREATE TABLE" subtitle="Create a New Table" />
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
              <InputLabel id="demo-simple-select-label">Table Type</InputLabel>
              <Select
                labelId="tableTypeId-label"
                id="tableTypeId"
                value={tableTypeId}
                label="Table Type"
                onChange={e => {
                  values.tableTypeId = e.target.value;
                  handleSelectChange(e);
                }}
              >
                {tableTypes.map((val) => {
                  return (
                    <MenuItem value={val.id} key={val.id}>{val.name}</MenuItem>
                )})}
              </Select>
              <FormHelperText hidden>Required</FormHelperText>
              </FormControl>
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="numOfSeats"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.numOfSeats}
                name="numOfSeats"
                error={!!touched.numOfSeats && !!errors.numOfSeats}
                helperText={touched.numOfSeats && errors.numOfSeats}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
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
  tableTypeId: yup.number().required("required"),
  numOfSeats: yup.number().required("required"),
});
const initialValues = {
  tableTypeId: "",
  numOfSeats: "",
};

export default CreateTable;

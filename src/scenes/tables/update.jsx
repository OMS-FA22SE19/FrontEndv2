import { Box, Button, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import React, { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const UpdateTable = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [tableTypes, setTableTypes] = useState([]);
  const [getTableTypeId, setTableTypeId] = useState("");
  const [getNumOfSeats, setNumOfSeats] = useState("");
  const [getStatus, setStatus] = useState("");
  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getTableTypes();
  }, []);

  const handleTableTypeSelectChange = (event) => {
    setTableTypeId(event.target.value);
  };

  const handleStatusSelectChange = (event) => {
    setStatus(event.target.value);
  };

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/tables`;
    navigate(path);
  };

  let initialValues = {
    tableTypeId: { getTableTypeId },
    numOfSeats: { getNumOfSeats },
    status: { getStatus },
  };

  const fetchData = async () => {
    await axios
      .get(`https://localhost:7246/api/v1/Tables/` + id)
      .then((response) => {
        const tblTypeId = response.data["data"]["tableType"].id;
        const numOfSeats = response.data["data"].numOfSeats;
        const status = response.data["data"].status;

        setTableTypeId(tblTypeId);
        setNumOfSeats(numOfSeats);
        setStatus(status);

        initialValues.tableTypeId = tblTypeId;
        initialValues.numOfSeats = numOfSeats;
        initialValues.status = status;
      });
  };

  const handleFormSubmit = async (values) => {
    const requestBody = {
      id: id,
      numOfSeats: values.numOfSeats,
      tableTypeId: values.tableTypeId,
      status: values.status,
    };
    await axios.put(`https://localhost:7246/api/v1/Tables/` + id, requestBody)
    .finally(() => routeChange());
  };

  const getTableTypes = async () => {
    await axios
      .get(`https://localhost:7246/api/v1/TableTypes`)
      .then((response) => setTableTypes(response.data["data"]));
  };

  const checkoutSchema = yup.object().shape({
    tableTypeId: yup.number().required("required"),
    numOfSeats: yup.number().required("required"),
  });

  return (
    <Box m="20px">
      <Header title="UPDATE TABLE" subtitle={"Update Table Id: " + id} />
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
                <InputLabel id="demo-simple-select-label">
                  Table Type
                </InputLabel>
                <Select
                  labelId="tableTypeId-label"
                  id="tableTypeId"
                  value={getTableTypeId}
                  label="Table Type"
                  onChange={(e) => {
                    values.tableTypeId = e.target.value;
                    handleTableTypeSelectChange(e);
                  }}
                >
                  {tableTypes.map((val) => {
                    return (
                      <MenuItem value={val.id} key={val.id}>
                        {val.name}
                      </MenuItem>
                    );
                  })}
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
              <FormControl fullWidth>
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  value={getStatus}
                  label="Table Type"
                  onChange={(e) => {
                    values.status = e.target.value;
                    handleStatusSelectChange(e);
                  }}
                >
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Occupied">Occupied</MenuItem>
                  <MenuItem value="Reserved ">Reserved </MenuItem>
                </Select>
                <FormHelperText hidden>Required</FormHelperText>
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="warning" variant="contained">
                Update Table
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default UpdateTable;

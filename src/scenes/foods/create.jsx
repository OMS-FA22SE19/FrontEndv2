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
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import FormControlLabel from "@mui/material/FormControlLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";

const CreateFood = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const host = `https://localhost:7246`
  const [getCourseTypes, setCourseTypes] = useState([]);
  const [getFoodTypes, setFoodTypes] = useState([]);
  const [getCourseTypeId, setCourseTypeId] = React.useState("");
  const [getAvailable, setAvailable] = useState("");
  const [getFoodTypeIds, setFoodTypeIds] = React.useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCourseTypeSelectChange = (event) => {
    setCourseTypeId(event.target.value);
  };

  const handleFoodTypeSelectChange = (event) => {
    setFoodTypeIds(event.target.value);
  };

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/foods`;
    navigate(path);
  };

  const handleFormSubmit = async (values) => {
		values.picture = selectedImage;
		let formData = new FormData();
		formData.append("name", values.name);
		formData.append("description", values.description);
		formData.append("ingredient", values.ingredient);
		formData.append("available", values.available);
		formData.append("picture", values.picture);
		formData.append("courseTypeId", values.courseTypeId);
		getFoodTypeIds.map((val) => {
			formData.append("types", val);
		})
    await axios({
			method: "post",
			url: "https://oms-fa22se19.herokuapp.com/api/v1/Foods",
			data: formData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				console.log(response);
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			})
			.finally(function () {
				routeChange();
			});
  };

  const fetchCourseTypes = async () => {
    await axios
      .get(host + `/api/v1/CourseTypes`)
      .then((response) => setCourseTypes(response.data["data"]));
  };

  const fetchFoodTypes = async () => {
    await axios
      .get(host + `/api/v1/Types`)
      .then((response) => setFoodTypes(response.data["data"]));
  };

  const handleCheckBoxChange = (event) => {
    setAvailable(event.target.checked);
  };

  useEffect(() => {
    fetchCourseTypes();
    fetchFoodTypes();
  }, []);

  return (
    <Box m="20px">
      <Header title="CREATE FOOD" subtitle="Create New Food" />
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
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.available}
                    onChange={(e) => {
                      values.available = e.target.checked;
                      handleCheckBoxChange(e);
                    }}
                    color="secondary"
                  />
                }
                label="Available"
              />
              <TextField
                fullWidth
                variant="filled"
                type="string"
                label="Description "
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="string"
                label="Ingredient"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.ingredient}
                name="ingredient"
                error={!!touched.ingredient && !!errors.ingredient}
                helperText={touched.ingredient && errors.ingredient}
                sx={{ gridColumn: "span 4" }}
              />
              <FormControl fullWidth>
                <InputLabel id="courseType-select-label">
                  Course Type
                </InputLabel>
                <Select
                  labelId="courseType-label"
                  id="courseType"
                  value={getCourseTypeId}
                  label="Course Type"
                  onChange={(e) => {
                    values.courseTypeId = e.target.value;
                    handleCourseTypeSelectChange(e);
                  }}
                >
                  {getCourseTypes.map((val) => {
                    return (
                      <MenuItem value={val.id} key={val.id}>
                        {val.name}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText hidden>Required</FormHelperText>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="type-select-label">Food Type</InputLabel>
                <Select
                  labelId="type-label"
                  id="type"
                  value={getFoodTypeIds}
                  multiple
                  label="Food Type"
                  onChange={(e) => {
                    values.types = e.target.value;
                    handleFoodTypeSelectChange(e);
                  }}
                >
                  {getFoodTypes.map((val) => {
                    return (
                      <MenuItem value={val.id} key={val.id}>
                        {val.name}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText hidden>Required</FormHelperText>
              </FormControl>
              <Box>
                <h1>Upload Image</h1>
                {selectedImage && (
                  <div>
                    <img
                      alt="not fount"
                      width={"250px"}
                      src={URL.createObjectURL(selectedImage)}
                    />
                    <br />
                    <button onClick={() => setSelectedImage(null)}>
                      Remove
                    </button>
                  </div>
                )}
                <br />

                <br />
                <input
                  type="file"
                  name="myImage"
                  onChange={(event) => {
                    console.log(event.target.files[0]);
                    setSelectedImage(event.target.files[0]);
                  }}
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Food
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
  ingredient: yup.string().required("required"),
  available: yup.boolean().required("required"),
  courseTypeId: yup.number().required("required"),
  // types: yup.array().required("required"),
});
const initialValues = {
  name: "",
  description: "",
  ingredient: "",
  available: true,
  picture: null,
  courseTypeId: "",
  types: [],
};

export default CreateFood;

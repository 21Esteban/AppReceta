import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../config/colors";
import { SPACING } from "../config/space";
import * as ImagePicker from "expo-image-picker";
import * as yup from "yup";
import { Formik } from "formik";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import FormSubmitButton from "../form/FormSubmit";
import axios from "axios";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

DropDownPicker.setListMode("SCROLLVIEW");

//Esquema de validacion para validar nuestras imagenes

const ValidationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(3, "name invalido")
    .required("El name es obligatorio"),
  description: yup
    .string()
    .trim()
    .min(3, "Descripcion invalida")
    .required("la descripcion es obligatoria"),
  rating: yup.number().min(0).max(5).required("el rating es requerido"),
});

export default function RecipesActionScreen({ route }) {
  const receta = route.params;

  const [image, setImage] = useState(receta?.imgUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const navigation = useNavigation();
  const getCategories = async () => {
    try {
      const { data } = await axios.get("/category");
      setCategories(data.data);
    } catch (error) {
      console.log("error en getCategories", error.message);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const datas = categories.map((item) => {
    return {
      label: item.name,
      value: item._id,
    };
  });

  const recipesInfo = {
    name: receta?.name || "",
    description: receta?.description || "",
    rating: receta?.rating || "",
    category: receta?.category || "",
  };

  //funcion para escoger una imagen de nuestro dispositivo movil

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],  //aspecto de nuestar imagen
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveRecipes = async (formData) => {
    try {
      setIsLoading(true);
      await axios.post("/recipes", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("Error en saveRecipes", error.message);
    }
  };

  //Actualizar

  const updateRecipes = async (formData) => {
    try {
      setIsLoading(true);

      await axios.put(`/recipes/${receta._id}`, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.log("Error en updateRecipes", error.message);
    }
  };

  const actions = async (values, formikActions) => {
    console.log(category);
    console.log(values);
    const { name, description, rating } = values;

    const formData = new FormData();
    if (receta) {
      if (receta.imgUrl !== image) {
        formData.append("img", {
          name: "generico.jpg",
          uri: image,
          type: "image/jpg",
        });
      }
    } else {
      if (image) {
        formData.append("img", {
          name: "generico.jpg",
          uri: image,
          type: "image/jpg",
        });
      }
    }

    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("rating", rating);

    receta ? await updateRecipes(formData) : await saveRecipes(formData);

    formikActions.resetForm();
    formikActions.setSubmitting(false);
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="red" size={80} />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={{...styles.backButton,marginTop:15}}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" color={"black"} size={65}  />
        </TouchableOpacity>
        <FormContainer>
          <Formik
            initialValues={recipesInfo}
            validationSchema={ValidationSchema}
            onSubmit={actions}
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => {
              const { name, description, rating } = values;
              return (
                <>
                  <FormInput
                    value={name}
                    error={touched.name && errors.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("titulo")}
                    label="Titulo"
                    placeholder="Titulo"
                  />
                  <FormInput
                    value={description}
                    error={touched.description && errors.description}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    label="Description"
                    placeholder="Description"
                  />
                  <FormInput
                    value={rating}
                    error={touched.rating && errors.rating}
                    onChangeText={handleChange("rating")}
                    onBlur={handleBlur("rating")}
                    label="Rating"
                    placeholder="Rating"
                    keyboardType="numeric"
                  />
                  <Text style={{ fontWeight: "bold" }}>Categoria</Text>
                  <DropDownPicker
                    open={open}
                    value={category}
                    items={datas}
                    setOpen={setOpen}
                    setValue={setCategory}
                    setItems={setCategories}
                    style={{
                      backgroundColor: colors.light, marginTop:5
                    }}
                    labelStyle={{
                      color: colors.blue,
                    }}
                  />
                  {/* Imagen */}
                  <View>
                    <TouchableOpacity
                      style={styles.uploadBtnContainer}
                      onPress={() => pickImage()}
                    >
                      {image ? (
                        <Image
                          source={{ uri: image }}
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        <Text style={styles.uploadBtn}>Seleccionar Imagen</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                  <Button
                    submitting={isSubmitting}
                    onPress={handleSubmit}
                    title={receta ? "actualizar" : "Guardar"}
                  />
                </>
              );
            }}
          </Formik>
        </FormContainer>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
    backgroundColor: "white",
  },

  uploadBtnContainer: {
    height: 100,
    width: 100,
    borderColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    overflow: "hidden",
    marginVertical: 10,
    // marginLeft: 100,
    alignSelf: "center",
  },
  uploadBtn: {
    textAlign: "center",
    fontSize: 16,
    opacity: 0.3,
    fontWeight: "bold",
    color: colors.light,
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 5,
  },
});

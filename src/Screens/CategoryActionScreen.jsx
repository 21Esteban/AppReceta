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
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

//Esquema de validacion para validar nuestras imagenes

const ValidationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(3, "name invalido")
    .required("El name es obligatorio"),
  description: yup.string().trim().min(3, "Descripcion invalida"),
});

export default function CategoryActionScreen({ route }) {
  const category = route.params;
  const [image, setImage] = useState(category?.imgUrl || null);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const categoryInfo = {
    name: category?.name || "",
    description: category?.description || "",
    _id: category?._id || "",
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

  const saveCategory = async (formData) => {
    try {
      setIsLoading(true);
      await axios.post("/category", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("Error en saveCategory", error.message);
    }
  };

  //Actualizar

  const updateCategory = async (formData) => {
    try {
      setIsLoading(true);

      await axios.put(`/category/${category._id}`, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.log("Error en updateCategory", error.message);
    }
  };

  const actions = async (values, formikActions) => {
    const { name, description } = values;

    const formData = new FormData();
    if (category) {
      if (category.imgUrl !== image) {
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
    category ? await updateCategory(values) : await saveCategory(formData);

    formikActions.resetForm();
    formikActions.setSubmitting(false);
    navigation.navigate("Home");
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
            initialValues={categoryInfo}
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
              const { name, description } = values;
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
                    title={category ? "actualizar" : "Guardar"}
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
    alignSelf: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    overflow: "hidden",
    marginVertical: 10,
    borderRadius: 50,
    // marginLeft: 100,
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

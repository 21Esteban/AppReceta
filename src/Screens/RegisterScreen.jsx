import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";

import * as yup from "yup";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import { Formik } from "formik";

import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";

const ValidationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(3, "name invalido")
    .required("El name es obligatorio"),
  email: yup
    .string()
    .email("debe ser un email valido")
    .required("el email es obligatorio"),
  password: yup
    .string()
    .min(3, "password invalida")
    .required("la contraseña es requerida"),
});

const RegisterScreen = () => {
  const navigation = useNavigation();

  const userInfo = {
    name: "",
    email: "",
    password: "",
  };

  const saveUser = async (values) => {
    try {
      const { data } = await axios.post("/user/register", values);
    } catch (error) {
      console.log("error en saveUser", error.message);
    }
  };

  const actions = async (values, formikActions) => {
    const { name, email, password } = values;

    // const formData = new FormData();

    // formData.append("name", name);
    // formData.append("email", email);
    // formData.append("password", password);

    //await saveUser(formData);
    await saveUser(values);

    formikActions.resetForm();
    formikActions.setSubmitting(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ justifyContent: "center", flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 25, backgroundColor: "white" }}
      >
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Image
            style={{ width: 100, height: 100 }}
            source={require("../config/imgs/grupo.png")}
          />
        </View>

        <Text
          style={{
            // fontFamily: 'Roboto-Medium',
            fontSize: 28,
            fontWeight: "500",
            color: "#333",
            marginBottom: 30,
            alignSelf: "center",
          }}
        >
          Registrarse
        </Text>

        <Text style={{ textAlign: "center", color: "#666", marginBottom: 30 }}>
          Rellena cada Campo
        </Text>

        <Formik
          initialValues={userInfo}
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
            const { name, email, password } = values;
            return (
              <>
                <FormInput
                  label={"Nombre"}
                  value={name}
                  error={touched.name && errors.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  icon={
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color="#666"
                      style={{ marginRight: 5 }}
                    />
                  }
                />

                <FormInput
                  label={"Correo"}
                  value={email}
                  error={touched.email && errors.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  icon={
                    <MaterialIcons
                      name="alternate-email"
                      size={20}
                      color="#666"
                      style={{ marginRight: 5 }}
                    />
                  }
                  keyboardType="email-address"
                />

                <FormInput
                  label={"Contraseña"}
                  value={password}
                  error={touched.password && errors.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  secureTextEntry={true}
                  icon={
                    <Ionicons
                      name="ios-lock-closed-outline"
                      size={20}
                      color="#666"
                      style={{ marginRight: 5 }}
                    />
                  }
                />
                <Button
                  submitting={isSubmitting}
                  onPress={handleSubmit}
                  title={"Registrar"}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginBottom: 30,
                  }}
                >
                  <Text>ya te registraste?</Text>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ color: "#060707", fontWeight: "700" }}>
                      {" "}
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            );
          }}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

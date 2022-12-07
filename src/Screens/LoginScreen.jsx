import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";

import FormInput from "../form/FormInput";

import { useNavigation } from "@react-navigation/native";
import * as yup from "yup";
import { Formik } from "formik";
import axios from "axios";
import FormContainer from "../form/FormContainer";

const ValidationSchema = yup.object({
  email: yup
    .string()
    .email("se requiere un email valido")
    .min(3, "email invalido")
    .required("El email es obligatorio"),
  password: yup
    .string()
    .trim()
    .min(3, "password invalida")
    .required("la password es obligatoria"),
});

const LoginScreen = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState({});

  const userInfo = {
    email: "",
    password: "",
  };
  const getUser = async (values) => {
    try {
      const { data } = await axios.post("/user/login", values);

      setUser(data.data);
    } catch (error) {
      console.log("error en getUser", error.message);
    }
  };

  const actions = async (values, formikActions) => {
    const { email, password } = values;

    await getUser(values);
    formikActions.resetForm();
    formikActions.setSubmitting(false);
    navigation.navigate("Home", user.name);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", backgroundColor: "white" }}
    >
      <View
        name="Login"
        options={{
          tabBarStyle: { display: "none" },
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      />

      <View style={{ paddingHorizontal: 25, alignItems: "center" }}>
        <View style={{ alignItems: "center" }}></View>

        <Text
          style={{
            // fontFamily: 'Roboto-Medium',
            fontSize: 28,
            fontWeight: "500",
            color: "#333",
            marginBottom: 30,
          }}
        >
          Ingresar
        </Text>

        <FormContainer>
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
              const { email, password } = values;
              return (
                <>
                  <FormInput
                    value={email}
                    error={touched.email && errors.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    label="Correo"
                    placeholder="Correo"
                    keyboardType="email-address"
                  />

                  <FormInput
                    value={password}
                    error={touched.password && errors.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    label="Contraseña"
                    placeholder="Contraseña"
                    secureTextEntry={true}
                  />

                  <Text
                    style={{
                      textAlign: "center",
                      color: "#666",
                      marginBottom: 30,
                    }}
                  ></Text>

                  <Button
                    submitting={isSubmitting}
                    onPress={handleSubmit}
                    title={"Ingresar"}
                  />
                </>
              );
            }}
          </Formik>
        </FormContainer>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <Text>Nuevo en la App? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ color: "#060707", fontWeight: "700" }}>
              {" "}
              Registrar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

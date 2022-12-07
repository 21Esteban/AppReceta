import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../config/colors";
import { SPACING } from "../config/space";
import axios from "axios";

import { LinearGradient } from "expo-linear-gradient";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
const screenHeight = Dimensions.get("screen").height;

export default function RecipesActionScreen({ route }) {
  const isFocused = useIsFocused();
  const [isloadin, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const [category, setCategory] = useState({});
  const [receta, setReceta] = useState({});

  //Con este id buscamos el post que apretemos , recordemos que en el params es por donde listamos un solo id , un solo post
  const _id = route.params;

  const navigation = useNavigation();

  //hacemos la funcion para poder obtener ese post individual

  const getCategory = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/category/${_id}`);
      setCategory(data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(`error en la funcion getCategory `, error.message);
    }
  };

  const getRecetas = async () => {
    try {
      const { data } = await axios.get("/recipes");
      setReceta(data.data);
    } catch (error) {
      console.log("error en getRecetas", error.message);
    }
  };

  useEffect(() => {
    isFocused && getCategory();
  }, [isFocused]);

  const deleteCategory = async () => {
    try {
      setIsRemoving(true);

      // if (receta) {
      //   Alert.alert(
      //     "Esta categoria no se puede eliminar porque tiene productos enlazados"
      //   );
      // }
      await axios.delete(`/category/${category._id}`);
      navigation.goBack();
      setIsRemoving(false);
    } catch (error) {
      setIsRemoving(false);
      console.log("error en deleteCategory", error.message);
    }
  };

  if (isloadin || isRemoving) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="red" size={80} />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.imageContainer}>
        <View style={styles.imageBorder}>
          <Image source={{ uri: category.imgUrl }} style={styles.image} />
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={styles.title}>{category.name}</Text>
        <Text style={styles.subtitle}>{category.description}</Text>
      </View>
      <View style={{ padding: 2 }}>
        <TouchableOpacity
          style={styles.buttonRadius}
          onPress={() => navigation.navigate("CategoryActionScreen", category)}
        >
          <LinearGradient
            style={styles.gradient}
            colors={[colors["white"], colors.white]}
          >
            <Ionicons
              name="create-outline"
              color={colors.black}
              size={SPACING * 3}
            ></Ionicons>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonRadius}
          onPress={() => deleteCategory()}
        >
          <LinearGradient
            style={styles.gradient}
            colors={[colors["white"], colors.white]}
          >
            <Ionicons
              name="trash-outline"
              color={colors.black}
              size={SPACING * 3}
            ></Ionicons>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* boton de volver */}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="arrow-back-outline" color={"black"} size={70} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: screenHeight * 0.6,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
    padding: 70,
  },
  imageBorder: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 25,
  },
  image: {
    flex: 1,
  },
  title: {
    color: colors.black,
    fontSize: SPACING * 3,
    fontWeight: "bold",
  },
  subtitle: {
    color: colors.black,
    fontSize: SPACING * 2,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 5,
  },
  buttonsContainer: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignposts: "center",
  },
  buttonRadius: {
    overflow: "hidden",
    borderRadius: SPACING / 2,
    margin: 3,
  },

  gradient: {
    paddingHorizontal: SPACING,
    paddingVertical: SPACING / 3,
  },
});

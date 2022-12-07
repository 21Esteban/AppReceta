import {
  Button,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const ITEM_WIDTH = width / 2 - 10 * 3;

export default function HomeScreen() {
  const isFocused = useIsFocused();
  const [search, setSearch] = useState({
    nameCategory: "",
  });

  const handleChange = (value, field) => {
    setSearch({ [field]: value });
  };

  //top para saber el tamaño de todos los dispositivos

  const { top } = useSafeAreaInsets();

  //Ruta
  const navigation = useNavigation();

  //Guardar nuestras categorias

  const [category, setCategory] = useState([]);
  const [receta, setReceta] = useState([]);

  const getReceta = async () => {
    try {
      const { data } = await axios.get("/recipes");
      setReceta(data.data);
    } catch (error) {
      console.log(`error en la funcion getReceta `, error.message);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getReceta();
      getCategory();
    }
  }, [isFocused]);

  //Obtener las categorias

  const getCategory = async () => {
    try {
      //para poder acceder y obtener la peticion del axios en la desectructuracion tiene que ser data, que por lo general lo definimos cuando estamos en el backend

      // const {category} = await axios.get("/category")  ASI ESTA MAL

      const { data } = await axios.get("/category");

      //Ahora esa informacion que obtuvimos gracias al axios la guardamos en nuestro setCategory

      setCategory(data.data);
    } catch (error) {
      console.log(`error en la funcion getCategory `, error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ ...styles.viewpadre, top: top + 20 }}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ marginHorizontal: 20 }}
              onPress={() => navigation.navigate("CategoryActionScreen")}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 10,
                  marginBottom: 7,
                  alignSelf: "center",
                }}
              >
                <Ionicons name="albums" color={"#93c5fd"} size={20} />
              </View>

              <Text
                style={{ color: "white", fontSize: 15, fontWeight: "bold" }}
              >
                Subir Categoria
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginHorizontal: 20 }}>
              <View
                style={{
                  backgroundColor: "white",
                  padding: 10,
                  borderRadius: 100,
                  marginBottom: 7,
                  marginTop: 15,
                  alignSelf: "center",
                }}
              >
                <Ionicons name="person" color={"#93c5fd"} size={30} />
              </View>

              <Text
                style={{ color: "white", fontSize: 15, fontWeight: "bold" }}
              >
                Bienvenido {}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginHorizontal: 20 }}
              onPress={() => navigation.navigate("RecipesActionScreen")}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 10,
                  marginBottom: 7,
                  alignSelf: "center",
                }}
              >
                <Ionicons name="beer" color={"#93c5fd"} size={20} />
              </View>

              <Text
                style={{ color: "white", fontSize: 15, fontWeight: "bold" }}
              >
                Subir Receta
              </Text>
            </TouchableOpacity>
          </View>

          {/* TextInput busqueda */}

          {/* <View
            style={{
              padding: 10,
              flexDirection: "row",
              borderRadius: 15,
              marginTop: 20,
              paddingHorizontal: 50,
              justifyContent: "center",
              alignItems: "center",

              backgroundColor: "white",
              ...styles.shadow,
            }}
          >
            <Ionicons name="search" color={"#71717a"} size={15} />
            <TextInput
              placeholder="Buscar categoria"
              style={{ marginLeft: 8 }}
              onChangeText={(value) => handleChange(value, "search")}
            />
          </View> */}

          <View style={{ flexDirection: "row", marginTop: 10, padding: 2 }}>
            <Text style={{ fontWeight: "bold", color: "white", fontSize: 23 }}>
              CATEGORIAS
            </Text>
          </View>

          <FlatList
            style={{ marginTop: 10 * 2 }}
            data={category}
            keyExtractor={(item) => item._id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: "white",
                  marginHorizontal: 13,
                  borderRadius: 18,
                  marginBottom: 150,
                  width: 100,
                  height: 100,
                  alignContent: "flex-start",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("CategoryScreen", item._id)
                  }
                >
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 18,
                    }}
                    source={{ uri: item.imgUrl }}
                  />
                </TouchableOpacity>
              </View>
            )}
          />

          <View
            style={{
              ...styles.shadow,
              backgroundColor: "white",
              width: "100%",
              padding: 15,
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>RECETAS</Text>
          </View>

          {/* recetas */}
          <FlatList
            style={{ marginTop: 1, marginBottom: 100 }}
            data={receta}
            keyExtractor={(item) => item._id.toString()}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  width: ITEM_WIDTH,
                  marginBottom: 10 * 2,
                  backgroundColor: "white",
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  marginTop: 15,
                  marginHorizontal: 5,
                  alignItems: "center",
                  borderRadius: 20,
                }}
                key={item._id}
                onPress={() =>
                  navigation.navigate("RecipeDetailScreen", item._id)
                }
              >
                <Image
                  style={{
                    width: "100%",
                    height: ITEM_WIDTH + 10 * 1,
                    borderRadius: 20,
                  }}
                  source={{ uri: item.imgUrl }}
                />
                <Text
                  style={{
                    fontSize: 10 * 2,
                    fontWeight: "700",
                    marginTop: 10,
                    color: "#93c5fd",
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: 7 * 2,
                    fontWeight: "500",
                    marginTop: 10,
                  }}
                >
                  {item.description}
                </Text>
                <Text
                  style={{
                    fontSize: 8 * 3,
                    fontWeight: "700",
                    marginTop: 10,
                  }}
                >
                  {item.category.name}
                </Text>

                <Text style={{ fontSize: 10 * 1, fontWeight: "700" }}></Text>

                <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                  {item.rating}
                  <Ionicons name="star" color={"#93c5fd"} size={30} />
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  viewpadre: {
    alignItems: "center",
    flex: 1,
  },

  shadow: {
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 7,
  },

  viewFlat: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 13,
  },
});

//aqui voy

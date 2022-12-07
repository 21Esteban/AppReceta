import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import currencyFormatter from "currency-formatter";
import CastItem from "./CastItem";

    export default function RecipesActionScreen({recetas}) {
  return (
    <>
      {/* Detalles */}

      <View style={{ marginHorizontal: 20 }}>
        <View style={{ flexDirection: "row" }}>
          <Ionicons
            name="star-outline"
            size={20}
            color="gray"
            style={{ marginRight: 5 }}
          />

          {/* Puntuacion */}
          <Text>{recetas.vote_average}</Text>

          {/* Generos */}

          <Text style={{ marginLeft: 5 }}>
            -{recetas.genres.map((g) => g.name).join(", ")}
          </Text>
        </View>

        {/* Historia */}

        <Text style={{ marginTop: 10, fontSize: 25, fontWeight: "bold" }}>
          Historia
        </Text>

        <Text style={{ fontSize: 16 }}>{recetas.overview}</Text>

        {/* Presupuesto */}

        <Text style={{ marginTop: 10, fontSize: 25, fontWeight: "bold" }}>
          Presupuesto
        </Text>

        <Text>
          {currencyFormatter.format(recetas.budget, { code: "USD" })}
        </Text>

        {/* actores */}

        <View style={{ marginTop: 10, marginBottom: 25 }}>
          <Text style={{ fontWeight: "bold", fontSize: 25, marginTop: 10 }}>
            Actores
          </Text>

          {/* Simepre que vayamosa recorrer algo hagamoslo con el flatList */}

          <FlatList data={cast} renderItem={({item})=><CastItem actor={item}/>} keyExtractor={(item)=>item.id.toString()}
          style={{marginTop:10, height:70}} horizontal={true}/>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});

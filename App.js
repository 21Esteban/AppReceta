import { NavigationContainer } from "@react-navigation/native";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import Navigation, { MyStacks } from "./src/navigation/Navigation";

axios.defaults.baseURL = "http://192.168.1.2:4000";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {/* <Navigation /> */}
      <MyStacks />
      
    </NavigationContainer>
  );
}

import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function Movie({movie, height=420 , width=300}) {
 
const navigation = useNavigation()

  return (
    <TouchableOpacity style={{width,height,marginHorizontal:2,paddingBottom:20,paddingHorizontal:7}} onPress={()=>navigation.navigate("DetailScreen",movie)}>
        <View style={styles.imgContainer}>
            <Image source={{uri}} style={styles.image}/>
        </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({

    image:{
        flex:1,
        borderRadius:18,
    },


imgContainer:{
    flex:1,
    borderRadius:15,
    shadowColor: "#000000",
shadowOffset: {
  width: 5,
  height: 3,
},
shadowOpacity:  0.17,
shadowRadius: 3.05,
elevation: 4
}

})
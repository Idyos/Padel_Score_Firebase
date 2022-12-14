import { StyleSheet, Text, View, Dimensions, Pressable, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Surface } from "react-native-paper";
import { Chip } from "react-native-paper";

const windowHeight = Dimensions.get("window").height;

const Profile = () => {
  return (
    <Surface style={styles.partidaInfo} elevation={1}>
     <Text>HOLAAA</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  partidaInfo: {
    justifyContent: "space-between",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    borderRadius: 15,
    alignItems: "center",
    transform: [{ translateX: 8 }],
    padding: 25,
    width: "95%",
    height: windowHeight / 4,
    //backgroundColor: "#f0f8ff",
  },
  title: {
    fontSize: 20,
  },
  partidaDetalles: {
    position: 'relative',
    width: "100%",
    alignItems: 'center',
    justifyContent: "space-between",
    flexDirection: 'row',
  },
  partidoNoTerminado: {
    alignSelf: 'flex-end',
    marginBottom: -15,
    marginRight: -15,
    marginTop: -15,
    height: "30%",
  },

  setContainer: { 
    flexDirection: "row", 
    position: 'absolute', 
    left: 0, 
    right: 0, 
    justifyContent: 'center',
  },

  set: {
    marginHorizontal: 3,
  },
});

export default Profile;

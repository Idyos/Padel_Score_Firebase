import { Text, View, StyleSheet, Pressable } from "react-native";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {faFloppyDisk} from "@fortawesome/free-solid-svg-icons";

const Principal = ({navigation}) => {
  return (
    <View style={styles.principal}>
      <Pressable style={styles.partidaNueva} onPress={() => {navigation.navigate("nueva-partida");}}>
        <FontAwesomeIcon icon={faPlus} color="white" size={50}/>
        <Text style={styles.partidaNuevaTexto}>Nueva Partida</Text>
      </Pressable>
      <Pressable style={styles.partidaAnterior}>
      <FontAwesomeIcon icon={faFloppyDisk} size={80}/>
        <Text style={styles.partidaAnteriorTexto}>Partidas Anteriores</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  principal: {
    height: "100%",
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: 'space-evenly',
  },
  partidaNueva: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    justifyContent: "center",
    margin: 10,
    alignItems: "center",
    justifyContent: 'space-evenly',
    backgroundColor: "orange",
    width: "50%",
    height: "25%",
    padding: 10,
    borderRadius: 10,
  },

  partidaNuevaTexto: {
    color: 'white',
    fontSize: 20,
  },
  

  partidaAnterior: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    justifyContent: "center",
    margin: 10,
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    width: "80%",
    height: "40%",
    justifyContent: 'space-evenly',
    padding: 10,
    borderRadius: 10,
  },

  partidaAnteriorTexto: {
    fontSize: 25,
  },
});

export default Principal;

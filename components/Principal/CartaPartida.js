import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import React, { useEffect, useState } from "react";

const windowHeight = Dimensions.get("window").height;

const CartaPartida = ({item}) => {

console.log(item[2]);

    return (
        <View style={styles.partidaInfo}>
        <Text style={styles.title}> {item[0]===undefined ? "" : item[0].equipo1.nombre} / {item[0]===undefined ? "" : item[0].equipo2.nombre}</Text>
          <View style={styles.partidaDetalles}>
            <View>
              <Text>{item[0]===undefined ? "" : item[0].equipo1.jugadores.jugador1.nombre}</Text>
              <Text>{item[0]===undefined ? "" : item[0].equipo1.jugadores.jugador2.nombre}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.set}>
              <Text>{item[2].set1===undefined ? "?" : item[2].set1.equipo1}</Text>
                <Text>{item[2].set1===undefined ? "?" : item[2].set1.equipo2}</Text>
              </View>
              <View style={styles.set}>
              <Text>{item[2].set2===undefined ? "?" : item[2].set2.equipo1}</Text>
                <Text>{item[2].set2===undefined ? "?" : item[2].set2.equipo2}</Text>
              </View>
              <View style={styles.set}>
              <Text>{item[2].set3===undefined ? "?" : item[2].set3.equipo1}</Text>
                <Text>{item[2].set3===undefined ? "?" : item[2].set3.equipo2}</Text>
              </View>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text>{item[0]===undefined ? "" : item[0].equipo2.jugadores.jugador1.nombre}</Text>
              <Text>{item[0]===undefined ? "" : item[0].equipo2.jugadores.jugador2.nombre}</Text> 
            </View>
          </View>
        </View>
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
    backgroundColor: "#f0f8ff",
  },
  title: {
    fontSize: 20,
  },
  partidaDetalles: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  set: {
    marginHorizontal: 3,
  },
});

export default CartaPartida;

import { StyleSheet, View, Dimensions, Pressable, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Surface } from "react-native-paper";
import { Chip, Text } from "react-native-paper";
import { withTheme } from "react-native-paper";

const windowHeight = Dimensions.get("window").height;

const CartaPartida = ({ item, theme }) => {

  const sets = item[2];
  const players = item[0];

  return (
    <Surface style={[styles.partidaInfo, { backgroundColor: theme.colors.primaryContainer }]} elevation={1}>
      <Text style={[styles.title, { color: theme.colors.primary, }]}> {item[0] === undefined ? "" : item[0].equipo1.nombre} / {item[0] === undefined ? "" : item[0].equipo2.nombre}</Text>
      <View style={styles.partidaDetalles}>
          <View style={styles.setContainer}>
            <FlatList
            style={{flexDirection: 'row'}}
              data={Object.keys(item[2])}
              renderItem={({ item }) => <View style={styles.set}><Text style={{ color: theme.colors.primary }}>{sets[item].equipo1.games}</Text><Text style={{ color: theme.colors.primary }}>{sets[item].equipo2.games}</Text></View>}
            />
          </View>
        <FlatList
          style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }}
          data={Object.keys(item[0])}
          renderItem={({ item, index }) => <View><Text style={index == 1 ? { textAlign: 'right', color: theme.colors.primary } : { textAlign: 'auto', color: theme.colors.primary }}>{players[item].jugadores.jugador1.nombre}</Text><Text style={index == 1 ? { textAlign: 'right', color: theme.colors.primary } : { textAlign: 'auto', color: theme.colors.primary }}>{players[item].jugadores.jugador2.nombre}</Text></View>}
          listKey={(item, index) => index.toString()}
        />
      </View>
      {/* <Chip style={styles.partidoNoTerminado} icon="alert-circle-outline">Este partido no se ha terminado.</Chip>*/}
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

export default withTheme(CartaPartida);

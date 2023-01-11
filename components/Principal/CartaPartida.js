import {
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  FlatList,
  Animated,
} from "react-native";
import React, { useRef, useState } from "react";
import { Surface } from "react-native-paper";
import { Chip, Text } from "react-native-paper";
import { withTheme } from "react-native-paper";
import { doc, getDoc } from "firebase/firestore";
import { database } from "../../src/config/fb";
import { Easing } from "react-native-reanimated";


const windowHeight = Dimensions.get("window").height;

const CartaPartida = ({ item, theme, animation }) => {
  const [partidaTerminada, setPartidaTerminada] = useState(true);

  const estadoPartida = async () => {
    const partida = doc(database, `Partidas/${item[1]}`);
    const partidaInfo = await getDoc(partida);
    setPartidaTerminada(partidaInfo.data().partidaTerminada);
  };



  estadoPartida();
  const players = item[0];
  return (
      <Surface
        style={[
          styles.partidaInfo,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
        elevation={1}
      >
        <Text style={[styles.title, { color: theme.colors.primary }]}>
          {" "}
          {item[0] === undefined ? "" : item[0].equipo1.nombre} /{" "}
          {item[0] === undefined ? "" : item[0].equipo2.nombre}
        </Text>
        <View style={styles.partidaDetalles}>
          <View style={styles.setContainer}>
            <FlatList
              style={{ flexDirection: "row" }}
              data={item[3]}
              renderItem={({ item }) => (
                <View style={styles.set}>
                  <Text style={{ color: theme.colors.primary }}>
                    {item.equipo1}
                  </Text>
                  <Text style={{ color: theme.colors.primary }}>
                    {item.equipo2}
                  </Text>
                </View>
              )}
            />
          </View>
          <FlatList
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
            data={Object.getOwnPropertyNames(item[0])}
            renderItem={({ item, index }) => (
              <View>
                <Text
                  style={
                    index == 1
                      ? { textAlign: "right", color: theme.colors.primary }
                      : { textAlign: "auto", color: theme.colors.primary }
                  }
                >
                  {players[item].jugadores.jugador1.nombre}
                </Text>
                <Text
                  style={
                    index == 1
                      ? { textAlign: "right", color: theme.colors.primary }
                      : { textAlign: "auto", color: theme.colors.primary }
                  }
                >
                  {players[item].jugadores.jugador2.nombre}
                </Text>
              </View>
            )}
            listKey={(item, index) => index.toString()}
          />
        </View>
        {partidaTerminada ? (
          ""
        ) : (
          <Chip
            elevated={true}
            elevation={1}
            style={styles.partidoNoTerminado}
            textStyle={{ color: theme.colors.onErrorContainer }}
            icon="alert-circle-outline"
          >
            Este partido no se ha terminado.
          </Chip>
        )}
        <Animated.View
                  style={[
                    styles.barraDeCarga,
                    {
                      backgroundColor: theme.colors.error,
                      width: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "117%"],
                      }),
                    },
                  ]}
                ></Animated.View>
      </Surface>
  );
};

const styles = StyleSheet.create({
  barraDeCarga: {
    padding: 0,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "10%",
    height: "138.5%",
    zIndex: -1,
    left: 0,
    bottom: 0,
    top: 0,
    borderRadius: 15,
  },

  partidaInfo: {
    overflow: "hidden",
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
    position: "relative",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  partidoNoTerminado: {
    alignSelf: "flex-end",
    marginBottom: -15,
    marginRight: -15,
    marginTop: -15,
    height: "30%",
  },

  setContainer: {
    flexDirection: "row",
    position: "absolute",
    left: 0,
    right: 0,
    justifyContent: "center",
  },

  set: {
    marginHorizontal: 3,
  },
});

export default withTheme(CartaPartida);

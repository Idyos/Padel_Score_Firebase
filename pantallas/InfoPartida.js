import { StyleSheet, View, FlatList, BackHandler, Animated} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState, useRef } from "react";
import { Divider, SegmentedButtons, Text, withTheme } from "react-native-paper";
import { AuthErrorCodes } from "@firebase/auth";
import { Easing } from "react-native-reanimated";

const GraficoInfo = ({
  matchData,
  matchFunc,
  match,
  value,
  setSetData,
  setData,
}) => {
  const infoMatchEquipo1 = matchData.params[0].equipo1.jugadores;
  const infoMatchEquipo2 = matchData.params[0].equipo2.jugadores;
  const infoSets = matchData.params[2];
  const infoEquipo1 = matchData.params[0].equipo1;
  const infoEquipo2 = matchData.params[0].equipo2;

  useEffect(() => {
    if (value == 0) {
      matchFunc([
        {
          name: "Break Points",
          equipo1: infoEquipo1.breakPointsExito,
          equipo2: infoEquipo2.breakPointsExito,
        },
        {
          name: "Puntos de Oro",
          equipo1: infoEquipo1.puntosOro,
          equipo2: infoEquipo2.puntosOro,
        },
        {
          name: "Winners",
          equipo1:
            infoMatchEquipo1.jugador1.winners +
            infoMatchEquipo1.jugador2.winners,

          equipo2:
            infoMatchEquipo2.jugador1.winners +
            infoMatchEquipo2.jugador2.winners,
        },
        {
          name: "Smashes",
          equipo1:
            infoMatchEquipo1.jugador1.smashesExito +
            infoMatchEquipo1.jugador2.smashesExito,

          equipo2:
            infoMatchEquipo2.jugador1.smashesExito +
            infoMatchEquipo2.jugador2.smashesExito,
        },
        {
          name: "Unforced Errors",
          equipo1:
            infoMatchEquipo1.jugador1.unfError +
            infoMatchEquipo1.jugador2.unfError,

          equipo2:
            infoMatchEquipo2.jugador1.unfError +
            infoMatchEquipo2.jugador2.unfError,
        },
      ]);
    }
    for (let i = 1; i <= Object.keys(infoSets).length; i++) {
      if (value == i) {
        matchFunc([
          {
            name: "Break Points",
            equipo1: infoSets["set" + value].datosJugadores.equipo1.breakPointsExito,
            equipo2: infoSets["set" + value].datosJugadores.equipo2.breakPointsExito,
          },
          {
            name: "Puntos de Oro",
            equipo1: infoSets["set" + value].datosJugadores.equipo1.puntosOro,
            equipo2: infoSets["set" + value].datosJugadores.equipo2.puntosOro,
          },
          {
            name: "Winners",
            equipo1:
              infoSets["set" + value].datosJugadores.equipo1.jugador1.winners +
              infoSets["set" + value].datosJugadores.equipo1.jugador2.winners,

            equipo2:
              infoSets["set" + value].datosJugadores.equipo2.jugador1.winners +
              infoSets["set" + value].datosJugadores.equipo2.jugador2.winners,
          },
          {
            name: "Smashes",
            equipo1:
              infoSets["set" + value].datosJugadores.equipo1.jugador1
                .smashesExito +
              infoSets["set" + value].datosJugadores.equipo1.jugador2
                .smashesExito,

            equipo2:
              infoSets["set" + value].datosJugadores.equipo2.jugador1
                .smashesExito +
              infoSets["set" + value].datosJugadores.equipo2.jugador2
                .smashesExito,
          },
          {
            name: "Unforced Errors",
            equipo1:
              infoSets["set" + value].datosJugadores.equipo1.jugador1.unfError +
              infoSets["set" + value].datosJugadores.equipo1.jugador2.unfError,

            equipo2:
              infoSets["set" + value].datosJugadores.equipo2.jugador1.unfError +
              infoSets["set" + value].datosJugadores.equipo2.jugador2.unfError,
          },
        ]);
      }
    }
  }, [value]);

  const animation = useRef(new Animated.Value(0)).current;

  



  useEffect(() => {
    animation.setValue(0);
    Animated.timing(animation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
      easing: Easing.bezierFn(.32,-0.01,.27,1),
    }).start();
   
  }, [value])

  

  return (
    <View style={styles.graficosContainer}>
      <FlatList
        data={match}
        renderItem={({ item }) =>
       
          item.name == "Break Points" ? (
            <View style={styles.Graficos}>
              <View style={styles.grafico}>
                <View style={styles.graficoInfo}>
                  <Text style={{ marginLeft: 13 }}>{item.equipo1}</Text>
                  <Text>{item.name}</Text>
                  <Text style={{ marginRight: 13 }}>{item.equipo2}</Text>
                </View>
                <View style={styles.grafico1}>
                  <Animated.View
                    style={{
                      marginLeft: 1,
                      borderTopEndRadius: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, item.equipo1==0 ? 0 : (item.equipo1*100)/(item.equipo1+item.equipo2)/5.5]  
                      }),
                      borderBottomEndRadius: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, item.equipo1==0 ? 0 : (item.equipo1*100)/(item.equipo1+item.equipo2)/5.5]  
                      }),
                      width: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", item.equipo1==0 ? "0%" : (item.equipo1*100)/(item.equipo1+item.equipo2)+"%"]  
                    }),
                      height: "100%",
                      backgroundColor: "green",
                    }}
                  ></Animated.View>
                </View>
                <View style={styles.grafico2}>
                  <Animated.View
                    style={{
                      marginLeft: 1,
                      borderTopEndRadius: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, item.equipo2==0 ? 0 : (item.equipo2*100)/(item.equipo1+item.equipo2)/5.5]  
                      }),
                      borderBottomEndRadius: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, item.equipo2==0 ? 0 : (item.equipo2*100)/(item.equipo1+item.equipo2)/5.5]  
                      }),
                      height: "100%",
                      width: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", item.equipo2==0 ? "0%" : (item.equipo2*100)/(item.equipo1+item.equipo2)+"%"]  
                      }),
                      backgroundColor: "orange",
                    }}
                  ></Animated.View>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.Graficos}>
              <View style={styles.grafico}>
                <View style={styles.graficoInfo}>
                  <Text style={{ marginLeft: 13 }}>{item.equipo1}</Text>
                  <Text>{item.name}</Text>
                  <Text style={{ marginRight: 13 }}>{item.equipo2}</Text>
                </View>
                <View style={styles.grafico1}>
                  <Animated.View
                    style={{ 
                      marginLeft: 1,
                      borderTopEndRadius: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, item.equipo1==0 ? 0 : (item.equipo1*100)/(item.equipo1+item.equipo2)/5.5]  
                      }),
                      borderBottomEndRadius: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, item.equipo1==0 ? 0 : (item.equipo1*100)/(item.equipo1+item.equipo2)/5.5]  
                      }),
                      width: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", item.equipo1==0 ? "0%" : (item.equipo1*100)/(item.equipo1+item.equipo2)+"%"]  
                    }),
                      height: "100%",
                      backgroundColor: "green",
                    }}
                  ></Animated.View>
                </View>
                <View style={styles.grafico2}>
                  <Animated.View
                    style={{
                      marginLeft: 1,
                      borderTopEndRadius: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, item.equipo2==0 ? 0 : (item.equipo2*100)/(item.equipo1+item.equipo2)/5.5]  
                      }),
                      borderBottomEndRadius: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, item.equipo2==0 ? 0 : (item.equipo2*100)/(item.equipo1+item.equipo2)/5.5]  
                      }),
                      height: "100%",
                      width: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", item.equipo2==0 ? "0%" : (item.equipo2*100)/(item.equipo1+item.equipo2)+"%"]  
                      }),
                      backgroundColor: "orange",
                    }}
                  ></Animated.View>
                </View>
              </View>
            </View>
          )
        }
        keyExtractor={(item, index) => "key" + index}
      />
    </View>
  );
};

const InfoPartida = ({ route, theme }) => {
  const infoTeam = route.params[0];
  const infoSets = route.params[2];
  const [setsResults, setSetsResults] = useState([
    { value: "0", label: "Partida" },
  ]);
  const [setData, setSetData] = useState([]);

  useEffect(() => {
    if (setsResults.length === 1) {
      Object.keys(infoSets).map((item, index) => {
        setSetsResults((current) => [
          ...current,
          {
            value: `${index + 1}`,
            label: `Set ${index + 1}`,
          },
        ]);
      });
    }
  }, []);

  const [infoMatch, setInfoMatch] = useState([]);
  const [value, setValue] = useState("0");

  return (
    <View
      style={[styles.pantalla, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.setsInfo}>
        <View style={[styles.team, { justifyContent: "space-between" }]}>
          <Text>Players:</Text>
          <Text>Score</Text>
        </View>
        <Divider bold={true} />
        <View style={[styles.team, { width: "76%" }]}>
          <View>
            <Text>{infoTeam.equipo1.jugadores.jugador1.nombre}</Text>
            <Text>{infoTeam.equipo1.jugadores.jugador2.nombre}</Text>
          </View>
          <View style={styles.setsPerTeam}>
            <View>
              <FlatList
                contentContainerStyle={styles.setsPerTeam}
                data={Object.keys(infoSets)}
                renderItem={({ item }) => (
                  <Text style={styles.setResult}>
                    {infoSets[item].datosJugadores.equipo1.games}
                  </Text>
                )}
              />
            </View>
          </View>
        </View>
        <View style={[styles.team, { width: "76%" }]}>
          <View>
            <Text>{infoTeam.equipo2.jugadores.jugador1.nombre}</Text>
            <Text>{infoTeam.equipo2.jugadores.jugador2.nombre}</Text>
          </View>
          <View>
            <FlatList
              contentContainerStyle={styles.setsPerTeam}
              data={Object.keys(infoSets)}
              renderItem={({ item }) => (
                <Text style={styles.setResult}>
                  {infoSets[item].datosJugadores.equipo2.games}
                </Text>
              )}
            />
          </View>
        </View>
      </View>
      <SafeAreaView style={styles.container}>
        <SegmentedButtons
          showSelectedCheck={false}
          value={value}
          onValueChange={setValue}
          buttons={setsResults}
        />
      </SafeAreaView>
      <View style={styles.infoPorSets}>
        <View style={styles.teamUnder}>
          <View>
            <Text>{infoTeam.equipo1.jugadores.jugador1.nombre}</Text>
            <Text>{infoTeam.equipo1.jugadores.jugador2.nombre}</Text>
          </View>
        </View>
        <View style={styles.setsPerTeam}>
          <Text>
            <FlatList
              contentContainerStyle={styles.setsPerTeam}
              data={Object.keys(infoSets)}
              renderItem={({ item }) => (
                <Text style={styles.setResult}>
                  {infoSets[item].datosJugadores.equipo1.games}-
                  {infoSets[item].datosJugadores.equipo2.games}
                </Text>
              )}
            />
          </Text>
        </View>

        <View style={styles.teamUnder}>
          <View>
            <Text style={{ textAlign: "right" }}>
              {infoTeam.equipo2.jugadores.jugador1.nombre}
            </Text>
            <Text style={{ textAlign: "right" }}>
              {infoTeam.equipo2.jugadores.jugador2.nombre}
            </Text>
          </View>
        </View>
      </View>
      <GraficoInfo
        matchData={route}
        matchFunc={setInfoMatch}
        match={infoMatch}
        value={value}
        sets={setsResults}
        setSetData={setSetData}
        setData={setData}
      />
    </View>
  );
};

export default withTheme(InfoPartida);

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    height: "10%",
  },

  setsInfo: {
    justifyContent: "space-around",
    flexDirection: "column",
  },

  container: {
    padding: 20,
    alignItems: "center",
  },
  team: {
    alignSelf: "center",
    width: "80%",
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  teamUnder: {
    //marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoPorSets: {
    alignSelf: "center",
    width: "90%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  setsPerTeam: {
    flexDirection: "row",
  },

  setResult: {
    marginHorizontal: 3,
  },

  Graficos: {
    marginVertical: 5,
    alignSelf: "center",
    justifyContent: "space-between",
    width: "80%",
    flexDirection: "column",
  },

  graficoInfo: {
    zIndex: 1,
    width: "100%",
    alignSelf: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  grafico: {
    alignSelf: "center",

    alignItems: "center",
    height: 35,
    width: "110%",
    position: "relative",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  grafico1: {
    borderEndWidth: 2,
    borderRadius: 30,
    transform: [{ rotateY: "180deg" }],
    position: "absolute",
    height: "100%",
    width: "50%",
  },

  grafico2: {
    borderEndWidth: 2,
    borderRadius: 30,
    left: "50%",
    position: "absolute",
    height: "100%",
    width: "50%",
  },

  graficosContainer: {
    marginVertical: 25,
  },
});

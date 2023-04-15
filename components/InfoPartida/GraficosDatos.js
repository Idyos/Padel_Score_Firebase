import { View, FlatList, Animated, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Text } from "react-native-paper";
import { Easing, EasingNode } from "react-native-reanimated";

const GraficoInfo = ({
  matchData,
  matchFunc,
  match,
  value,
  dataType,
  tipoJugadores,
}) => {
  const infoSets = matchData.params[2];
  const infoEquipo1 = matchData.params[0].equipo1;
  const infoEquipo2 = matchData.params[0].equipo2;

  const getAllMatchData = (dataType) => {
    let partidaEntera;
    if(!dataType){
      partidaEntera =[
        {
          name: "Break Points",
          equipo1: [0, 0],
          equipo2: [0, 0],
        },
        {
          name: "Puntos de Oro",
          equipo1: 0,
          equipo2: 0,
        },
        {
          name: "Winners",
          equipo1: 0 + 0,
          equipo2: 0 + 0,
        },
        {
          name: "Smashes",
          equipo1: 0 + 0,
          equipo2: 0 + 0,
        },
        {
          name: "Unforced Errors",
          equipo1: 0 + 0,
          equipo2: 0 + 0,
        },
      ];
    }
    else{
      partidaEntera =[
        {
          name: "Winners",
          equipo1: 0,
          equipo2: 0,
        },
        {
          name: "Smashes",
          equipo1: 0,
          equipo2: 0,
        },
        {
          name: "Unforced Errors",
          equipo1: 0,
          equipo2: 0,
        },
      ];
    }
    for (let i = 1; i <= Object.keys(infoSets).length; i++) {
      if(!dataType){
        partidaEntera=[
          {
            name: "Break Points",
            equipo1: partidaEntera[0].equipo1=[partidaEntera[0].equipo1[0]+infoSets["set" + i].datosJugadores.equipo1.breakPointsExito, partidaEntera[0].equipo1[1]+infoSets["set" + i].datosJugadores.equipo1.breakPoints],
            equipo2: partidaEntera[0].equipo2=[partidaEntera[0].equipo2[0]+infoSets["set" + i].datosJugadores.equipo2.breakPointsExito, partidaEntera[0].equipo2[1]+infoSets["set" + i].datosJugadores.equipo2.breakPoints], },
          {
            name: "Puntos de Oro",
            equipo1: partidaEntera[1].equipo1=partidaEntera[1].equipo1+infoSets["set" + i].datosJugadores.equipo1.puntosOro,
            equipo2: partidaEntera[1].equipo2=partidaEntera[1].equipo2+infoSets["set" + i].datosJugadores.equipo2.puntosOro,
          },
          {
            name: "Winners",
            equipo1: partidaEntera[2].equipo1= partidaEntera[2].equipo1+(infoSets["set" + i].datosJugadores.equipo1.jugador1.winners + infoSets["set" + i].datosJugadores.equipo1.jugador2.winners),
            equipo2: partidaEntera[2].equipo2= partidaEntera[2].equipo2+(infoSets["set" + i].datosJugadores.equipo2.jugador1.winners + infoSets["set" + i].datosJugadores.equipo2.jugador2.winners),
          },
          {
            name: "Smashes",
            equipo1: partidaEntera[3].equipo1= partidaEntera[3].equipo1+(infoSets["set" + i].datosJugadores.equipo1.jugador1.smashesExito + infoSets["set" + i].datosJugadores.equipo1.jugador2.smashesExito),
            equipo2: partidaEntera[3].equipo2= partidaEntera[3].equipo2+(infoSets["set" + i].datosJugadores.equipo2.jugador1.smashesExito + infoSets["set" + i].datosJugadores.equipo2.jugador2.smashesExito),
          },
          {
            name: "Unforced Errors",
            equipo1: partidaEntera[4].equipo1= partidaEntera[4].equipo1+(infoSets["set" + i].datosJugadores.equipo1.jugador1.unfError + infoSets["set" + i].datosJugadores.equipo1.jugador2.unfError),
            equipo2: partidaEntera[4].equipo2= partidaEntera[4].equipo2+(infoSets["set" + i].datosJugadores.equipo2.jugador1.unfError + infoSets["set" + i].datosJugadores.equipo2.jugador2.unfError),
          },
        ]
      }
      else{
        partidaEntera=[
          {
            name: "Winners",
            equipo1: partidaEntera[0].equipo1= partidaEntera[0].equipo1+(tipoJugadores == false
            ? infoEquipo1.position == false
              ? infoSets["set"+i].datosJugadores.equipo1.jugador2.winners
              : infoSets["set"+i].datosJugadores.equipo1.jugador1.winners
            : infoEquipo1.position == true
              ? infoSets["set"+i].datosJugadores.equipo1.jugador2.winners
              : infoSets["set"+i].datosJugadores.equipo1.jugador1.winners),
            equipo2: partidaEntera[0].equipo2= partidaEntera[0].equipo2+(tipoJugadores == false
              ? infoEquipo2.position == false
                ? infoSets["set"+i].datosJugadores.equipo2.jugador2.winners
                : infoSets["set"+i].datosJugadores.equipo2.jugador1.winners
              : infoEquipo2.position == true
                ? infoSets["set"+i].datosJugadores.equipo2.jugador2.winners
                : infoSets["set"+i].datosJugadores.equipo2.jugador1.winners),
            },
          {
            name: "Smashes",
            equipo1: partidaEntera[1].equipo1= partidaEntera[1].equipo1+(tipoJugadores == false
              ? infoEquipo1.position == false
                ? infoSets["set"+i].datosJugadores.equipo1.jugador2.smashesExito
                : infoSets["set"+i].datosJugadores.equipo1.jugador1.smashesExito
              : infoEquipo1.position == true
                ? infoSets["set"+i].datosJugadores.equipo1.jugador2.smashesExito
                : infoSets["set"+i].datosJugadores.equipo1.jugador1.smashesExito),
            equipo2: partidaEntera[1].equipo2= partidaEntera[1].equipo2+(tipoJugadores == false
              ? infoEquipo2.position == false
                ? infoSets["set"+i].datosJugadores.equipo2.jugador2.smashesExito
                : infoSets["set"+i].datosJugadores.equipo2.jugador1.smashesExito
              : infoEquipo2.position == true
                ? infoSets["set"+i].datosJugadores.equipo2.jugador2.smashesExito
                : infoSets["set"+i].datosJugadores.equipo2.jugador1.smashesExito),
          },
          {
            name: "Unforced Errors",
            equipo1: partidaEntera[2].equipo1= partidaEntera[2].equipo1+(tipoJugadores == false
              ? infoEquipo1.position == false
                ? infoSets["set"+i].datosJugadores.equipo1.jugador2.unfError
                : infoSets["set"+i].datosJugadores.equipo1.jugador1.unfError
              : infoEquipo1.position == true
                ? infoSets["set"+i].datosJugadores.equipo1.jugador2.unfError
                : infoSets["set"+i].datosJugadores.equipo1.jugador1.unfError),
            equipo2: partidaEntera[2].equipo2= partidaEntera[2].equipo2+(tipoJugadores == false
              ? infoEquipo2.position == false
                ? infoSets["set"+i].datosJugadores.equipo2.jugador2.unfError
                : infoSets["set"+i].datosJugadores.equipo2.jugador1.unfError
              : infoEquipo2.position == true
                ? infoSets["set"+i].datosJugadores.equipo2.jugador2.unfError
                : infoSets["set"+i].datosJugadores.equipo2.jugador1.unfError),  
          },
        ]
      }
    }
    return partidaEntera;
  }

  useEffect(() => {
    if (dataType == false && value == 0) {
      matchFunc(getAllMatchData(dataType));
    }
    if (dataType == true && value == 0) {
      matchFunc(getAllMatchData(dataType));
    }
    // for (let i = 1; i <= Object.keys(infoSets).length; i++) {
      if (dataType == false && value > 0) {
        matchFunc([
          {
            name: "Break Points",
            equipo1: [
              infoSets["set" + value].datosJugadores.equipo1.breakPointsExito,
              infoSets["set" + value].datosJugadores.equipo1.breakPoints,
            ],

            equipo2: [
              infoSets["set" + value].datosJugadores.equipo2.breakPointsExito,
              infoSets["set" + value].datosJugadores.equipo2.breakPoints,
            ],
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
      if (dataType == true && value > 0) {
        matchFunc([
          {
            name: "Winners",
            equipo1:
              tipoJugadores == false
                ? infoEquipo1.position == false
                  ? infoSets["set" + value].datosJugadores.equipo1.jugador2
                      .winners
                  : infoSets["set" + value].datosJugadores.equipo1.jugador1
                      .winners
                : infoEquipo1.position == true
                ? infoSets["set" + value].datosJugadores.equipo1.jugador2
                    .winners
                : infoSets["set" + value].datosJugadores.equipo1.jugador1
                    .winners,

            equipo2:
              tipoJugadores == false
                ? infoEquipo2.position == false
                  ? infoSets["set" + value].datosJugadores.equipo2.jugador2
                      .winners
                  : infoSets["set" + value].datosJugadores.equipo2.jugador1
                      .winners
                : infoEquipo2.position == true
                ? infoSets["set" + value].datosJugadores.equipo2.jugador2
                    .winners
                : infoSets["set" + value].datosJugadores.equipo2.jugador1
                    .winners,
          },
          {
            name: "Smashes",
            equipo1:
              tipoJugadores == false
                ? infoEquipo1.position == false
                  ? infoSets["set" + value].datosJugadores.equipo1.jugador2
                      .smashesExito
                  : infoSets["set" + value].datosJugadores.equipo1.jugador1
                      .smashesExito
                : infoEquipo1.position == true
                ? infoSets["set" + value].datosJugadores.equipo1.jugador2
                    .smashesExito
                : infoSets["set" + value].datosJugadores.equipo1.jugador1
                    .smashesExito,

            equipo2:
              tipoJugadores == false
                ? infoEquipo2.position == false
                  ? infoSets["set" + value].datosJugadores.equipo2.jugador2
                      .smashesExito
                  : infoSets["set" + value].datosJugadores.equipo2.jugador1
                      .smashesExito
                : infoEquipo2.position == true
                ? infoSets["set" + value].datosJugadores.equipo2.jugador2
                    .smashesExito
                : infoSets["set" + value].datosJugadores.equipo2.jugador1
                    .smashesExito,
          },
          {
            name: "Unforced Errors",
            equipo1:
              tipoJugadores == false
                ? infoEquipo1.position == false
                  ? infoSets["set" + value].datosJugadores.equipo1.jugador2
                      .unfError
                  : infoSets["set" + value].datosJugadores.equipo1.jugador1
                      .unfError
                : infoEquipo1.position == true
                ? infoSets["set" + value].datosJugadores.equipo1.jugador2
                    .unfError
                : infoSets["set" + value].datosJugadores.equipo1.jugador1
                    .unfError,

            equipo2:
              tipoJugadores == false
                ? infoEquipo2.position == false
                  ? infoSets["set" + value].datosJugadores.equipo2.jugador2
                      .unfError
                  : infoSets["set" + value].datosJugadores.equipo2.jugador1
                      .unfError
                : infoEquipo2.position == true
                ? infoSets["set" + value].datosJugadores.equipo2.jugador2
                    .unfError
                : infoSets["set" + value].datosJugadores.equipo2.jugador1
                    .unfError,
          },
        ]);
      }
    // }
  }, [value, tipoJugadores, dataType]);

  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animation.setValue(0);
    Animated.timing(animation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
      easing: Easing.bezierFn(0.32, -0.01, 0.27, 1),
    }).start();
  }, [value]);

  return (
    <View style={styles.graficosContainer}>
      <FlatList
        data={match}
        renderItem={({ item }) =>
          item.name == "Break Points" ? (
            <View style={styles.Graficos}>
              <View style={styles.grafico}>
                <View style={styles.graficoInfo}>
                  <Text style={{ marginLeft: 13 }}>
                    {item.equipo1[0]}/{item.equipo1[1]}
                  </Text>

                  <Text>{item.name}</Text>
                  <Text style={{ marginRight: 13 }}>
                    {item.equipo2[0]}/{item.equipo2[1]}
                  </Text>
                </View>
                <View style={styles.grafico1}>
                  <Animated.View
                    style={{
                      marginLeft: 1,
                      borderTopEndRadius: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          0,
                          item.equipo1[1] == 0
                            ? 0
                            : (item.equipo1[1] * 100) /
                              (item.equipo1[1] + item.equipo2[1]) /
                              5.5,
                        ],
                      }),
                      borderBottomEndRadius: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          0,
                          item.equipo1[1] == 0
                            ? 0
                            : (item.equipo1[1] * 100) /
                              (item.equipo1[1] + item.equipo2[1]) /
                              5.5,
                        ],
                      }),
                      width: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          "0%",
                          item.equipo1[1] == 0
                            ? "0%"
                            : (item.equipo1[1] * 100) /
                                (item.equipo1[1] + item.equipo2[1]) +
                              "%",
                        ],
                      }),
                      height: "100%",
                      backgroundColor: "#569D56",
                    }}
                  >
                    <Animated.View
                      style={{
                        height: "100%",
                        borderTopEndRadius: animation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [
                            0,
                            item.equipo1[1] == 0
                              ? 0
                              : (100 * item.equipo1[0]) / item.equipo1[1] / 6,
                          ],
                        }),
                        borderBottomEndRadius: animation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [
                            0,
                            item.equipo1[1] == 0
                              ? 0
                              : (100 * item.equipo1[0]) / item.equipo1[1] / 6,
                          ],
                        }),
                        width: animation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [
                            "0%",
                            item.equipo1[0] == 0
                              ? "0%"
                              : (item.equipo1[1] * 100) /
                                  (item.equipo1[1] + item.equipo2[1]) -
                                ((item.equipo1[1] * 100) /
                                  (item.equipo1[1] + item.equipo2[1]) -
                                  (100 * item.equipo1[0]) / item.equipo1[1]) +
                                "%",
                          ],
                        }),
                        backgroundColor: "green",
                        zIndex: 2,
                      }}
                    ></Animated.View>
                  </Animated.View>
                </View>
                <View style={styles.grafico2}>
                  <Animated.View
                    style={{
                      marginLeft: 1,
                      borderTopEndRadius: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          0,
                          item.equipo2[1] == 0
                            ? 0
                            : (item.equipo2[1] * 100) /
                              (item.equipo1[1] + item.equipo2[1]) /
                              5.5,
                        ],
                      }),
                      borderBottomEndRadius: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          0,
                          item.equipo2[1] == 0
                            ? 0
                            : (item.equipo2[1] * 100) /
                              (item.equipo1[1] + item.equipo2[1]) /
                              5.5,
                        ],
                      }),
                      height: "100%",
                      width: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          "0%",
                          item.equipo2[1] == 0
                            ? "0%"
                            : (item.equipo2[1] * 100) /
                                (item.equipo1[1] + item.equipo2[1]) +
                              "%",
                        ],
                      }),
                      backgroundColor: "#FFD079",
                    }}
                  >
                    <Animated.View
                      style={{
                        height: "100%",
                        borderTopEndRadius: animation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [
                            0,
                            item.equipo2[1] == 0
                              ? 0
                              : (100 * item.equipo2[0]) / item.equipo2[1] / 6,
                          ],
                        }),
                        borderBottomEndRadius: animation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [
                            0,
                            item.equipo2[1] == 0
                              ? 0
                              : (100 * item.equipo2[0]) / item.equipo2[1] / 6,
                          ],
                        }),
                        width: animation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [
                            "0%",
                            item.equipo2[0] == 0
                              ? "0%"
                              : (item.equipo2[1] * 100) /
                                  (item.equipo2[1] + item.equipo1[1]) -
                                ((item.equipo2[1] * 100) /
                                  (item.equipo2[1] + item.equipo1[1]) -
                                  (100 * item.equipo2[0]) / item.equipo2[1]) +
                                "%",
                          ],
                        }),
                        backgroundColor: "orange",
                        zIndex: 2,
                      }}
                    ></Animated.View>
                  </Animated.View>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.Graficos}>
              <View style={styles.grafico}>
                <View style={styles.graficoInfo}>
                  <View style={{ marginLeft: 13 }}>
                    <Text>{item.equipo1}</Text>
                    {/*<AnimatedNumber
                      easing={EasingNode.bezier(0.32, -0.01, 0.27, 1)}
                      animationDuration={800} 
                      animateToNumber={item.equipo1}
                      />*/}
                  </View>
                  <Text>{item.name}</Text>
                  <View style={{ marginRight: 13 }}>
                    <Text>{item.equipo2}</Text>
                    {/*<AnimatedNumber
                      easing={EasingNode.bezier(0.32, -0.01, 0.27, 1)}
                      animationDuration={800}
                      animateToNumber={item.equipo2}
                      />*/}
                  </View>
                </View>
                <View style={styles.grafico1}>
                  <Animated.View
                    style={{
                      marginLeft: 1,
                      borderTopEndRadius: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          0,
                          item.equipo1 == 0
                            ? 0
                            : (item.equipo1 * 100) /
                              (item.equipo1 + item.equipo2) /
                              5.5,
                        ],
                      }),
                      borderBottomEndRadius: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          0,
                          item.equipo1 == 0
                            ? 0
                            : (item.equipo1 * 100) /
                              (item.equipo1 + item.equipo2) /
                              5.5,
                        ],
                      }),
                      width: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          "0%",
                          item.equipo1 == 0
                            ? "0%"
                            : (item.equipo1 * 100) /
                                (item.equipo1 + item.equipo2) +
                              "%",
                        ],
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
                        outputRange: [
                          0,
                          item.equipo2 == 0
                            ? 0
                            : (item.equipo2 * 100) /
                              (item.equipo1 + item.equipo2) /
                              5.5,
                        ],
                      }),
                      borderBottomEndRadius: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          0,
                          item.equipo2 == 0
                            ? 0
                            : (item.equipo2 * 100) /
                              (item.equipo1 + item.equipo2) /
                              5.5,
                        ],
                      }),
                      height: "100%",
                      width: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          "0%",
                          item.equipo2 == 0
                            ? "0%"
                            : (item.equipo2 * 100) /
                                (item.equipo1 + item.equipo2) +
                              "%",
                        ],
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

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    height: "10%",
  },

  setsInfo: {
    justifyContent: "space-around",
    flexDirection: "column",
  },

  chipJugadores: {
    marginHorizontal: 5,
    borderRadius: 30,
    height: "80%",
  },

  container: {
    paddingHorizontal: 20,
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
});
export default GraficoInfo;

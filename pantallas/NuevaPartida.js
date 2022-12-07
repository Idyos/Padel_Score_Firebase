import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Button,
  View,
  Dimensions,
  Pressable,
  TextInput,
  TouchableOpacity,
  DatePickerIOS,
} from "react-native";
import { database } from "../src/config/fb";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const NuevaPartida = ({ navigation, route }) => {
  const [equipoObj, setEquipoObj] = useState({
    equipo1: {
      nombre: "Equipo A",
      position: false,
      jugadores: {
        jugador1: {
          nombre: "",
          winners: 0,
          smashes: 0,
          unfError: 0,
          smashesExito: 0,
        },
        jugador2: {
          nombre: "",
          winners: 0,
          smashes: 0,
          unfError: 0,
          smashesExito: 0,
        },
      },
    },
    equipo2: {
      nombre: "Equipo B",
      position: false,
      jugadores: {
        jugador1: {
          nombre: "",
          winners: 0,
          smashes: 0,
          unfError: 0,
          smashesExito: 0,
        },
        jugador2: {
          nombre: "",
          winners: 0,
          smashes: 0,
          unfError: 0,
          smashesExito: 0,
        },
      },
    },
  });
  const [equipo, setEquipo] = useState(0);

  const CreacionEquipo = async () => {
      const crearPartida = await addDoc(collection(database, "Partidas"), {
        usuario: route.params.user,
      });
      navigation.navigate("partida", { partidaid: crearPartida.id,infoequipos: equipoObj });
    
  };

  switch (equipo) {
    case 0:
      return (
        <View style={styles.pantalla}>
          <Text style={styles.title}>
            Introduce la información del primer equipo
          </Text>
          <TextInput
            style={styles.inputTeam}
            onChangeText={(text) =>
              setEquipoObj({
                ...equipoObj,
                equipo1: { ...equipoObj.equipo1, nombre: text },
              })
            }
            value={equipoObj.equipo1.nombre}
            maxLength={20}
            placeholder="Equipo A"
          />

          <View style={styles.playerSection}>
            <TextInput
              style={styles.inputPlayer}
              placeholder="Jugador 1"
              value={equipoObj.equipo1.jugadores.jugador1.nombre}
              onChangeText={(text) =>
                setEquipoObj({
                  ...equipoObj,
                  equipo1: {
                    ...equipoObj.equipo1,
                    jugadores: {
                      ...equipoObj.equipo1.jugadores,
                      jugador1: {
                        nombre: text,
                        winners: 0,
                        smashes: 0,
                        unfError: 0,
                        smashesExito: 0,
                      },
                    },
                  },
                })
              }
            />
            <Pressable
              onPress={() =>
                setEquipoObj({
                  ...equipoObj,
                  equipo1: {
                    ...equipoObj.equipo1,
                    position: !equipoObj.equipo1.position,
                  },
                })
              }
            >
              <Text style={styles.playerPosition}>
                {equipoObj.equipo1.position == true ? "D" : "R"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.playerSection}>
            <TextInput
              style={styles.inputPlayer}
              placeholder="Jugador 2"
              value={equipoObj.equipo1.jugadores.jugador2.nombre}
              onChangeText={(text) => {
                setEquipoObj({
                  ...equipoObj,
                  equipo1: {
                    ...equipoObj.equipo1,
                    jugadores: {
                      ...equipoObj.equipo1.jugadores,
                      jugador2: {
                        nombre: text,
                        winners: 0,
                        smashes: 0,
                        unfError: 0,
                        smashesExito: 0,
                      },
                    },
                  },
                });
              }}
            />
            <Pressable
              onPress={() =>
                setEquipoObj({
                  ...equipoObj,
                  equipo1: {
                    ...equipoObj.equipo1,
                    position: !equipoObj.equipo1.position,
                  },
                })
              }
            >
              <Text style={styles.playerPosition}>
                {equipoObj.equipo1.position == true ? "R" : "D"}
              </Text>
            </Pressable>
          </View>
          <TouchableOpacity
            style={styles.siguiente}
            onPress={() => {
              setEquipo(equipo + 1);
            }}
          >
            <Text style={styles.siguienteTexto}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      );
    case 1:
      return (
        <View style={styles.pantalla}>
          <Text style={styles.title}>
            Introduce la información del segundo equipo
          </Text>
          <TextInput
            style={styles.inputTeam}
            onChangeText={(text) =>
              setEquipoObj({
                ...equipoObj,
                equipo2: { ...equipoObj.equipo2, nombre: text },
              })
            }
            value={equipoObj.equipo2.nombre}
            maxLength={20}
            placeholder="Equipo B"
          />

          <View style={styles.playerSection}>
            <TextInput
              style={styles.inputPlayer}
              placeholder="Jugador 1"
              value={equipoObj.equipo2.jugadores.jugador1.nombre}
              onChangeText={(text) =>
                setEquipoObj({
                  ...equipoObj,
                  equipo2: {
                    ...equipoObj.equipo2,
                    jugadores: {
                      ...equipoObj.equipo2.jugadores,
                      jugador1: {
                        nombre: text,
                        winners: 0,
                        smashes: 0,
                        unfError: 0,
                        smashesExito: 0,
                      },
                    },
                  },
                })
              }
            />
            <Pressable
              onPress={() =>
                setEquipoObj({
                  ...equipoObj,
                  equipo2: {
                    ...equipoObj.equipo2,
                    position: !equipoObj.equipo2.position,
                  },
                })
              }
            >
              <Text style={styles.playerPosition}>
                {equipoObj.equipo2.position == true ? "D" : "R"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.playerSection}>
            <TextInput
              style={styles.inputPlayer}
              placeholder="Jugador 2"
              value={equipoObj.equipo2.jugadores.jugador2.nombre}
              onChangeText={(text) => {
                setEquipoObj({
                  ...equipoObj,
                  equipo2: {
                    ...equipoObj.equipo2,
                    jugadores: {
                      ...equipoObj.equipo2.jugadores,
                      jugador2: {
                        nombre: text,
                        winners: 0,
                        smashes: 0,
                        unfError: 0,
                        smashesExito: 0,
                      },
                    },
                  },
                });
              }}
            />
            <Pressable
              onPress={() =>
                setEquipoObj({
                  ...equipoObj,
                  equipo2: {
                    ...equipoObj.equipo2,
                    position: !equipoObj.equipo2.position,
                  },
                })
              }
            >
              <Text style={styles.playerPosition}>
                {equipoObj.equipo2.position == true ? "R" : "D"}
              </Text>
            </Pressable>
          </View>
          <TouchableOpacity
            style={styles.siguiente}
            onPress={() => {
              CreacionEquipo();
            }}
          >
            <Text style={styles.siguienteTexto}>Crear Partida</Text>
          </TouchableOpacity>
        </View>
      );
  }
};

const styles = StyleSheet.create({
  pantalla: {
    height: "100%",
    //flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    //justifyContent: "center",
  },

  playerSection: {
    width: "80%",
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  playerPosition: {
    fontSize: 25,
    fontWeight: "bold",
    margin: 15,
    //marginHorizontal:
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    marginVertical: 30,
  },
  inputTeam: {
    width: "85%",
    fontSize: 30,
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
  },
  inputPlayer: {
    flex: 1,
    fontSize: 20,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
  },
  siguiente: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    bottom: "-12%",
    width: windowWidth / 1.5,
    height: windowHeight / 7,
  },
  siguienteTexto: {
    fontSize: windowWidth / 12,
    fontWeight: "bold",
    color: "white",
  },
});

export default NuevaPartida;

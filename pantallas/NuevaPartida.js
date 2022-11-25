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
import { collection, addDoc,setDoc, doc } from "firebase/firestore";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const NuevaPartida = ({ navigation }) => {
  const [equipo, setEquipo] = useState(1);
  const [newTeam, setNewTeam] = useState({
    nombre: "Equipo A",
    position: false,
    jugadores: {
      jugador1: "",
      jugador2: "",
    },
  });
  const [newTeam2, setNewTeam2] = useState({
    nombre: "Equipo B",
    position: false,
    jugadores: {
      jugador1: "",
      jugador2: "",
    },
  });

  const CreacionEquipo = async () => {
    switch (equipo) {
      case 1:
        try {
          await setDoc(doc(database, "Partida", "Equipo1"), newTeam);
          setEquipo(2);
        } catch (error) {
          console.log(error);
        }
        break;
      case 2:
        try {
          await setDoc(doc(database, "Partida", "Equipo2"), newTeam2);
          //await addDoc(collection(database, "Partida", "Equipo2"), newTeam2);
          setEquipo(3);
          navigation.navigate("partida");
        } catch (error) {
          console.log(error);
        }
        break;
      default:
        break;
    }
  };

  switch (equipo) {
    case 1:
      return (
        <View style={styles.pantalla}>
          <Text style={styles.title}>
            Introduce la información del primer equipo
          </Text>
          <TextInput
            style={styles.inputTeam}
            onChangeText={(text) => setNewTeam({ ...newTeam, nombre: text })}
            value={newTeam.nombre}
            maxLength={20}
            placeholder="Equipo A"
          />

          <View style={styles.playerSection}>
            <TextInput
              style={styles.inputPlayer}
              //placeholder="User Nickname"
              onChangeText={(text) =>
                setNewTeam({
                  ...newTeam,
                  jugadores: { ...newTeam.jugadores, jugador1: text },
                })
              }
              placeholder="Jugador 1"
            />
            <Pressable
              onPress={() =>
                setNewTeam({ ...newTeam, position: !newTeam.position })
              }
            >
              <Text style={styles.playerPosition}>
                {newTeam.position == true ? "D" : "R"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.playerSection}>
            <TextInput
              style={styles.inputPlayer}
              //placeholder="User Nickname"
              onChangeText={(text) =>
                setNewTeam({
                  ...newTeam,
                  jugadores: { ...newTeam.jugadores, jugador2: text },
                })
              }
              placeholder="Jugador 2"
            />
            <Pressable
              onPress={() =>
                setNewTeam({ ...newTeam, position: !newTeam.position })
              }
            >
              <Text style={styles.playerPosition}>
                {newTeam.position == true ? "R" : "D"}
              </Text>
            </Pressable>
          </View>
          <TouchableOpacity
            style={styles.siguiente}
            onPress={() => {
              CreacionEquipo();
            }}
          >
            <Text style={styles.siguienteTexto}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      );
    case 2:
      return (
        <View style={styles.pantalla}>
          <Text style={styles.title}>
            Introduce la información del segundo equipo
          </Text>
          <TextInput
            style={styles.inputTeam}
            onChangeText={(text) => setNewTeam2({ ...newTeam2, nombre: text })}
            value={newTeam2.nombre}
            maxLength={20}
            placeholder="Equipo B"
          />

          <View style={styles.playerSection}>
            <TextInput
              style={styles.inputPlayer}
              //placeholder="User Nickname"
              onChangeText={(text) =>
                setNewTeam2({
                  ...newTeam2,
                  jugadores: { ...newTeam2.jugadores, jugador1: text },
                })
              }
              value={newTeam2.jugadores.jugador1}
              placeholder="Jugador 1"
            />
            <Pressable
              onPress={() =>
                setNewTeam2({ ...newTeam2, position: !newTeam2.position })
              }
            >
              <Text style={styles.playerPosition}>
                {newTeam2.position == true ? "D" : "R"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.playerSection}>
            <TextInput
              style={styles.inputPlayer}
              //placeholder="User Nickname"
              onChangeText={(text) =>
                setNewTeam2({
                  ...newTeam2,
                  jugadores: { ...newTeam2.jugadores, jugador2: text },
                })
              }
              value={newTeam2.jugadores.jugador2}
              placeholder="Jugador 2"
            />
            <Pressable
              onPress={() =>
                setNewTeam2({ ...newTeam2, position: !newTeam2.position })
              }
            >
              <Text style={styles.playerPosition}>
                {newTeam2.position == true ? "R" : "D"}
              </Text>
            </Pressable>
          </View>
          <TouchableOpacity
            style={styles.siguiente}
            onPress={() => {
              CreacionEquipo();
            }}
          >
            <Text style={styles.siguienteTexto}>Siguiente</Text>
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

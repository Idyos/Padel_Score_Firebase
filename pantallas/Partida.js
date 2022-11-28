import { Pressable, StyleSheet, Text, View } from "react-native";
import Contador from "../components/Partida/Contador";
import { database } from "../src/config/fb";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import PointDetail from "../components/Partida/Popup";

async function crearPartida() {
  try {
    await setDoc(
      doc(database, "Partida/Matchdetails"),
      { sets: 3, juegos: 6 }
    );
    await setDoc(
      doc(database, "Partida/Matchdetails/Set 1/juego1"),
      { puntuacion: 0, goldpoint: false, breakpoint: false, matchpoint: false }
    );
    const juegosRef = collection(database, "Partida/Matchdetails/Set1");
    const juegosInfo = await getDocs(juegosRef);
  } catch (e) {
    console.log(e);
  }
}

function actualizarPartida() {
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 6; j++) {
      for (k = 0; k < 3; k++) {

      }
    }
  }


}

const Partida = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [infopartida, setInfoPartida] = useState([
    {
      equipo1: {
        nombre: "",
        juegos1: 0,
        sets: 0,
      },
      equipo2: {
        nombre: "",
        juegos1: 0,
        sets: 0,
      },
    },
  ]);

  const [datos, setDatos] = useState([
    {
      jugadores: {
        jugador1: "",
        jugador2: "",
      },
      nombre: "",
      position: false,
    },
    {
      jugadores: {
        jugador1: "",
        jugador2: "",
      },
      nombre: "",
      position: false,
    },
  ]);

  useEffect(() => {
    const retrieveDocs = async () => {
      try {
        const matchCol = collection(database, "Partida");
        const data = await getDocs(matchCol);
        const result = data.docs.map((doc) => doc.data());
        setDatos(result);
        return result;
      } catch (e) {
        console.log(e);
      }
    };
    retrieveDocs();
  }, []);

  crearPartida();

  return (

    <View style={styles.pantalla}>
      <PointDetail visible={modalVisible} visibleFunc={setModalVisible}/>
      <Text>{datos[0].nombre}</Text>
      <Text>{datos[0].jugadores.jugador1}</Text>
      <Text>{datos[0].jugadores.jugador2}</Text>
        <Contador visible={modalVisible} visibleFunc={setModalVisible} />
      <Text>{datos[1].nombre}</Text>
      <Text>{datos[1].jugadores.jugador1}</Text>
      <Text>{datos[1].jugadores.jugador2}</Text>
        <Contador visible={modalVisible} visibleFunc={setModalVisible}/>
    </View>
  );
};

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Partida;

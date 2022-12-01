import { Pressable, StyleSheet, Text, View } from "react-native";
import Contador from "../components/Partida/Contador";
import { database } from "../src/config/fb";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import PointDetail from "../components/Partida/Popup";

async function crearPartida() {
  try {
    await setDoc(
      doc(database, "Partida/Matchdetails"),
      { sets: 3, juegos: 6 }
    );
  } catch (e) {
    console.log(e);
  }
}



const Partida = () => {
  const [marcadorE1, setMarcadorE1] = useState(0);
  const [marcadorE2, setMarcadorE2] = useState(0);
  const [puntoEquipo, setPuntoEquipo] = useState();
  const [modalVisible, setModalVisible] = useState(false);
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

  if(marcadorE1 === 4 || marcadorE2 === 4) {
    setMarcadorE1(0);
    setMarcadorE2(0);
    updateJuego();
  }

  const updateJuego = async () => {
   /* try {
      await setDoc(doc(database, `/Partida/Matchdetails/Set1/Juego1/Puntos/Punto1`), newTeam);
    } catch (error) {
      console.log(error);
    }*/
  }


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
      <PointDetail visible={modalVisible} visibleFunc={setModalVisible} datos={datos} puntoEquipo={puntoEquipo} />
      <Text>{datos[0].nombre}</Text>
      <Text>{datos[0].jugadores.jugador1}</Text>
      <Text>{datos[0].jugadores.jugador2}</Text>
      <Contador visible={modalVisible} visibleFunc={setModalVisible} punto={1} puntoequipo={setPuntoEquipo} setMarcadorE1={setMarcadorE1} marcadorE1={marcadorE1}/>
      <Text>{datos[1].nombre}</Text>
      <Text>{datos[1].jugadores.jugador1}</Text>
      <Text>{datos[1].jugadores.jugador2}</Text>
      <Contador visible={modalVisible} visibleFunc={setModalVisible} punto={2} puntoequipo={setPuntoEquipo} setMarcadorE2={setMarcadorE2} marcadorE2={marcadorE2}/>
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

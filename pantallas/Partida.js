import { Pressable, StyleSheet, Text, View } from "react-native";
import { database } from "../src/config/fb";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import Contador from "../components/Partida/Contador";
import PointDetail from "../components/Partida/Popup";

async function crearPartida(partidaid, infoequipos) {
  try {
    await setDoc(
      doc(database, `Partidas/${partidaid}/PartidoCompleto/Matchdetails`),
      {infoequipos}
    );
  } catch (e) {
    console.log(e);
  }
}

const Partida = ({ route }) => {
  const partidaid = route.params.partidaid;
  const infoequipos = route.params.infoequipos;

  const [isTiebreak, setTiebreak] = useState(false);
  const [goldenPoint, setGoldenPoint] = useState(false);

  //JUEGOS DE CADA EQUIPO SET 1
  const [juegosE1Set1, setJuegosE1Set1] = useState();
  const [juegosE2Set1, setJuegosE2Set1] = useState();

  //JUEGOS DE CADA EQUIPO SET 2
  const [juegosE1Set2, setJuegosE1Set2] = useState();
  const [juegosE2Set2, setJuegosE2Set2] = useState();

  //AÑADIR PUNTOS EN EL JUEGO
  const [punto, setPunto] = useState({});
  const [puntosJuego, setPuntosJuego] = useState([]);

  //MARCADOR DEL JUEGO
  const [marcadorE1, setMarcadorE1] = useState(0);
  const [marcadorE2, setMarcadorE2] = useState(0);

  //JUEGOS DE CADA EQUIPO
  const [juegosE1, setJuegosE1] = useState(5);
  const [juegosE2, setJuegosE2] = useState(4);

  //SETS DE CADA EQUIPO
  const [setsE1, setSetsE1] = useState(0);
  const [setsE2, setSetsE2] = useState(0);

  const [puntoEquipo, setPuntoEquipo] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [datos, setDatos] = useState([
    {
      jugadores: {
        jugador1: infoequipos.equipo1.jugadores.jugador1.nombre,
        jugador2: infoequipos.equipo1.jugadores.jugador2.nombre,
      },
      nombre: infoequipos.equipo1.nombre,
      position: infoequipos.equipo1.position,
    },
    {
      jugadores: {
        jugador1: infoequipos.equipo2.jugadores.jugador1.nombre,
        jugador2: infoequipos.equipo2.jugadores.jugador2.nombre,
      },
      nombre: infoequipos.equipo2.nombre,
      position: infoequipos.equipo2.position,
    },
  ]);

  const updateJuego = async () => {
    puntosJuego.map(async (puntos, index) => {
      try {
        await setDoc(
          doc(
            database,
            `/Partidas/${partidaid}/PartidoCompleto/Matchdetails/Set${
              setsE1 + setsE2 + 1
            }/Juego${juegosE1 + juegosE2 + 1}/Puntos/Punto${index}`
          ),
          puntos
        );
      } catch (error) {
        console.log(error);
      }
    });
    setPuntosJuego([]);
  };

  const addSetInfo = async (set) => {
    console.log(partidaid);
    console.log(set);
    try {
      await setDoc(
        doc(database, `/Partidas/${partidaid}/PartidoCompleto/Matchdetails`),
        { set1: set }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let contador1 = 0;
    let contador2 = 0;
    for (let i = 0; i < puntosJuego.length; i++) {
      if (puntosJuego[i].team == 0) {
        contador1 += 1;
      }
      if (puntosJuego[i].team == 1) {
        contador2 += 1;
      }
    }
    if (isTiebreak == true) {
      if(contador1>=7 && contador1-contador2>=2){
        setJuegosE1(juegosE1 + 1);
        setMarcadorE1(0);
        setMarcadorE2(0);
        updateJuego();
      }
      if(contador2>=7 && contador2-contador1>=2){
        setJuegosE2(juegosE2 + 1);
        setMarcadorE1(0);
        setMarcadorE2(0);
        updateJuego();
      }
    } else {
      if (contador1 === 3 && contador2 === 3) {
        setGoldenPoint(true);
      } else {
        setGoldenPoint(false);
      }
      if (contador1 === 4) {
        setJuegosE1(juegosE1 + 1);
        setMarcadorE1(0);
        setMarcadorE2(0);
        updateJuego();
      }
      if (contador2 === 4) {
        setJuegosE2(juegosE2 + 1);
        setMarcadorE1(0);
        setMarcadorE2(0);
        updateJuego();
      }
    }
  }, [puntosJuego]);

  useEffect(() => {
    if (juegosE1 === 6 && juegosE2 === 6) {
      alert("TIEBREAK");
      setTiebreak(true);
      return;
    }

    //EQUIPO 1
    if ((juegosE1 >= 6 && juegosE1 - juegosE2 >= 2) || (juegosE1===7)) {
      console.log("HE ENTRADO AL IF DE 6 JUEGOS");
      setSetsE1(setsE1 + 1);
      if (setsE1 === 1) {
        alert("SE HA TERMINADO EL PARTIDO, GANADOR: " + datos[0].nombre);
      }
      if (setsE1 + setsE2 === 0) {
        let set1 = {
          juegosEquipo1: juegosE1,
          juegosEquipo2: juegosE2,
        };
        addSetInfo(set1);
        setJuegosE1Set1(juegosE1);
        setJuegosE2Set1(juegosE2);
      }
      if (setsE1 + setsE2 === 1) {
        setJuegosE1Set2(juegosE1);
        setJuegosE2Set2(juegosE2);
      }
      updateJuego();
      setJuegosE1(0);
      setJuegosE2(0);
    } else {
      updateJuego();
    }

    //EQUIPO 2
    if ((juegosE2 >= 6 && juegosE2 - juegosE1 >= 2) || (juegosE2===7)) {
      setSetsE2(setsE2 + 1);
      if (setsE2 === 1) {
        alert("SE HA TERMINADO EL PARTIDO, GANADOR: " + datos[1].nombre);
      }
      if (setsE1 + setsE2 === 0) {
        let set1 = {
          juegosEquipo1: juegosE1,
          juegosEquipo2: juegosE2,
        };
        addSetInfo(set1);
        setJuegosE2Set1(juegosE2);
        setJuegosE1Set1(juegosE1);
      }
      if (setsE1 + setsE2 === 1) {
        let set2 = {
          juegosEquipo1: juegosE1,
          juegosEquipo2: juegosE2,
        };
        addSetInfo(set2);
        setJuegosE2Set2(juegosE2);
        setJuegosE1Set2(juegosE1);
      }
      updateJuego();
      setJuegosE1(0);
      setJuegosE2(0);
    } else {
      updateJuego();
    }
  }, [juegosE1 === 6, juegosE2 === 6]);

  crearPartida(partidaid, infoequipos);

  useEffect(() => {
    const retrieveDocs = async () => {
      try {
        const matchCol = collection(
          database,
          `Partidas/${partidaid}/PartidoCompleto`
        );
      } catch (e) {
        console.log(e);
      }
    };
    retrieveDocs();
  }, []);



  return (
    <View style={styles.pantalla}>
      <PointDetail
        visible={modalVisible}
        visibleFunc={setModalVisible}
        datos={datos}
        puntoEquipo={puntoEquipo}
        punto={punto}
        puntosJuego={puntosJuego}
        setPunto={setPunto}
        setPuntosJuego={setPuntosJuego}
        tiebreak={isTiebreak}
      />

      <View style={styles.datosJugadores}>
        <Text>{datos[0].nombre}</Text>
        <View style={styles.nombresJugadores}>
          <Text>{datos[0].jugadores.jugador1} / </Text>
          <Text>{datos[0].jugadores.jugador2}</Text>
        </View>
      </View>
      <Contador
        visible={modalVisible}
        visibleFunc={setModalVisible}
        punto={1}
        puntoequipo={setPuntoEquipo}
        setMarcadorE1={setMarcadorE1}
        marcadorE1={marcadorE1}
        goldenPoint={goldenPoint}
        tiebreak={isTiebreak}
      />
      <View style={styles.marcadorSets}>
        <View style={styles.set}>
          <Text style={styles.marcador}>
            {juegosE1Set1 == undefined ? juegosE1 : juegosE1Set1}
          </Text>
          <Text style={styles.marcador}>
            {juegosE2Set1 == undefined ? juegosE2 : juegosE2Set1}
          </Text>
        </View>
        <View style={styles.set}>
          <Text style={styles.marcador}>
            {juegosE1Set1
              ? juegosE1Set2 == undefined
                ? juegosE1
                : juegosE1Set2
              : ""}
          </Text>
          <Text style={styles.marcador}>
            {juegosE1Set1
              ? juegosE2Set2 == undefined
                ? juegosE2
                : juegosE2Set2
              : ""}
          </Text>
        </View>
        <View style={styles.set}>
          <Text style={styles.marcador}>{juegosE1Set2 ? juegosE1 : ""}</Text>
          <Text style={styles.marcador}>{juegosE1Set2 ? juegosE2 : ""}</Text>
        </View>
      </View>

      <View style={styles.datosJugadores}>
        <Text>{datos[1].nombre}</Text>
        <View style={styles.nombresJugadores}>
          <Text>{datos[1].jugadores.jugador1} / </Text>
          <Text>{datos[1].jugadores.jugador2}</Text>
        </View>
      </View>
      <Contador
        visible={modalVisible}
        visibleFunc={setModalVisible}
        punto={2}
        puntoequipo={setPuntoEquipo}
        setMarcadorE2={setMarcadorE2}
        marcadorE2={marcadorE2}
        goldenPoint={goldenPoint}
        tiebreak={isTiebreak}
      />
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

  datosJugadores: {
    justifyContent: "space-between",
    alignItems: "stretch",
    width: "80%",
    flexDirection: "row",
  },

  nombresJugadores: {
    flexDirection: "row",
  },

  marcadorSets: {
    flexDirection: "row",
  },

  set: {
    marginHorizontal: 5,
  },

  marcador: {
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default Partida;

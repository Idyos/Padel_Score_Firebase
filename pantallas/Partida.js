import { Pressable, StyleSheet, Text, View } from "react-native";
import { database } from "../src/config/fb";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
  increment,
  getDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import Contador from "../components/Partida/Contador";
import PointDetail from "../components/Partida/Popup";
import { combineTransition } from "react-native-reanimated";

async function crearPartida(partidaid, infoequipos) {
  try {
    const matchRef = doc(
      database,
      `Partidas/${partidaid}/PartidoCompleto/Matchdetails`
    );
    const refSnap = await getDoc(matchRef);
    if (refSnap.exists()) {
      console.log("Partida ya creada!");
    } else {
      console.log("Voy a crear la partida!");
      await setDoc(
        doc(database, `Partidas/${partidaid}/PartidoCompleto/Matchdetails`),
        { infoequipos }
      );
    }
  } catch (e) {
    console.log(e);
  }
}

const Partida = ({ route }) => {
  const partidaid = route.params.partidaid;
  const infoequipos = route.params.infoequipos;

  const [isTiebreak, setTiebreak] = useState(false);
  const [goldenPoint, setGoldenPoint] = useState(false);

  const [infoSets, setInfoSets] = useState([]);
  //AÑADIR PUNTOS EN EL JUEGO
  const [punto, setPunto] = useState({});
  const [puntosJuego, setPuntosJuego] = useState([]);

  //MARCADOR DEL JUEGO
  const [marcadorE1, setMarcadorE1] = useState(0);
  const [marcadorE2, setMarcadorE2] = useState(0);

  //JUEGOS DE CADA EQUIPO
  const [juegosE1, setJuegosE1] = useState(5);
  const [juegosE2, setJuegosE2] = useState(6);

  //SETS DE CADA EQUIPO
  const [setsE1, setSetsE1] = useState(0);
  const [setsE2, setSetsE2] = useState(0);

  const [puntoEquipo, setPuntoEquipo] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const datos = [
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
  ];

  const infoPlayers = doc(
    database,
    `/Partidas/${partidaid}/PartidoCompleto/Matchdetails`
  );

  const updateJuego = async (team) => {
    puntosJuego.map(async (puntos, index) => {
      try {
        await setDoc(
          doc(
            database,
            `/Partidas/${partidaid}/PartidoCompleto/Matchdetails/Set${
              setsE1 + setsE2 + 1
            }/Juego${juegosE1 + juegosE2 + 1}`
          ),
          { winner: team }
        );
        await setDoc(
          doc(
            database,
            `/Partidas/${partidaid}/PartidoCompleto/Matchdetails/Set${
              setsE1 + setsE2 + 1
            }/Juego${juegosE1 + juegosE2 + 1}/Puntos/Punto${index}`
          ),
          puntos
        );

        await setDoc(
          doc(database, `/Partidas/${partidaid}/PartidoCompleto/Matchdetails`),
          {
            infoequipos: {
              ["equipo" + (puntos.team + 1)]: {
                jugadores: {
                  ["jugador" + puntos.player]: { [puntos.point]: increment(1) },
                },
              },
            },
          },
          { merge: true }
        );
      } catch (error) {
        console.log(error);
      }
      setPuntosJuego([]);
    });
  };

  const updateSets = async () => {
    const setsDoc = doc(
      database,
      `/Partidas/${partidaid}/PartidoCompleto/SetsResults`
    );


    setTimeout(async () => {
      const matchInfo = await getDoc(
        doc(database, `/Partidas/${partidaid}/PartidoCompleto/Matchdetails`)
      );  
      const equipo1info = matchInfo.data().infoequipos.equipo1.jugadores;
      const equipo2info = matchInfo.data().infoequipos.equipo2.jugadores;
      console.log(equipo1info);
        try {
          await setDoc(
            setsDoc,
            {
              set: {
                ["set" + (setsE1 + setsE2)]: {
                  equipo1: {
                    games: juegosE1,
                    jugador1: {
                      winners: equipo1info.jugador1.winners,
                      smashes: equipo1info.jugador1.smashes,
                      smashesExito: equipo1info.jugador1.smashesExito,
                      unfError: equipo1info.jugador1.unfError,
                    },
                    jugador2: {
                      winners: equipo1info.jugador2.winners,
                      smashes: equipo1info.jugador2.smashes,
                      smashesExito: equipo1info.jugador2.smashesExito,
                      unfError: equipo1info.jugador2.unfError,
                    },
                  },
                  equipo2: {
                    games: juegosE2,
                    jugador1: {
                      winners: equipo2info.jugador1.winners,
                      smashes: equipo2info.jugador1.smashes,
                      smashesExito: equipo2info.jugador1.smashesExito,
                      unfError: equipo2info.jugador1.unfError,
                    },
                    jugador2: {
                      winners: equipo2info.jugador2.winners,
                      smashes: equipo2info.jugador2.smashes,
                      smashesExito: equipo2info.jugador2.smashesExito,
                      unfError: equipo2info.jugador2.unfError,
                    },
                  },
                },
              },
            },
            { merge: true }
          );
        } catch (error) {
          console.log(error);
        }
    }, 1500);    
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
      if (contador1 >= 7 && contador1 - contador2 >= 2) {
        setJuegosE1(juegosE1 + 1);
        setMarcadorE1(0);
        setMarcadorE2(0);
        updateJuego("equipo1");
        setTiebreak(false);
      }
      if (contador2 >= 7 && contador2 - contador1 >= 2) {
        setJuegosE2(juegosE2 + 1);
        setMarcadorE1(0);
        setMarcadorE2(0);
        updateJuego("equipo2");
        setTiebreak(false);
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
        updateJuego("equipo1");
      }
      if (contador2 === 4) {
        setJuegosE2(juegosE2 + 1);
        setMarcadorE1(0);
        setMarcadorE2(0);
        updateJuego("equipo2");
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
    if ((juegosE1 >= 6 && juegosE1 - juegosE2 >= 2) || juegosE1 === 7) {
      setSetsE1(setsE1 + 1);
    }
    if ((juegosE2 >= 6 && juegosE2 - juegosE1 >= 2) || juegosE2 === 7) {
      setSetsE2(setsE2 + 1);
    }
  }, [juegosE1 === 6, juegosE2 === 6]);

  useEffect(() => {
    for (let i = 1; i <= 3; i++) {
      if (setsE1 + setsE2 === i) {
      }
    }
    ///EQUIPO 1
    if (setsE1 === 2) {
      alert("SE HA TERMINADO EL PARTIDO, GANADOR: " + datos[0].nombre);
    }
    if (setsE2 === 2) {
      alert("SE HA TERMINADO EL PARTIDO, GANADOR: " + datos[1].nombre);
    }
    if (setsE1 + setsE2 === 1) {
      setInfoSets((current) => [
        ...current,
        { equipo1: juegosE1, equipo2: juegosE2 },
      ]);
      setJuegosE1(0);
      setJuegosE2(0);
      updateSets();
    }
    if (setsE1 + setsE2 === 2) {
      setInfoSets((current) => [
        ...current,
        { equipo1: juegosE1, equipo2: juegosE2 },
      ]);
      setJuegosE1(0);
      setJuegosE2(0);
      updateSets();
    }
  }, [setsE1, setsE2]);

  useEffect(() => {
    crearPartida(partidaid, infoequipos);
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
            {infoSets[0] === undefined ? juegosE1 : infoSets[0].equipo1}
          </Text>
          <Text style={styles.marcador}>
            {infoSets[0] === undefined ? juegosE2 : infoSets[0].equipo2}
          </Text>
        </View>
        <View style={styles.set}>
          <Text style={styles.marcador}>
            {infoSets[0] === undefined
              ? ""
              : infoSets[1] === undefined
              ? juegosE1
              : infoSets[1].equipo1}
          </Text>
          <Text style={styles.marcador}>
            {infoSets[0] === undefined
              ? ""
              : infoSets[1] === undefined
              ? juegosE2
              : infoSets[1].equipo2}
          </Text>
        </View>
        <View style={styles.set}>
          <Text style={styles.marcador}>
            {infoSets[1] === undefined
              ? ""
              : infoSets[2] === undefined
              ? juegosE1
              : infoSets[2].equipo1}
          </Text>
          <Text style={styles.marcador}>
            {infoSets[1] === undefined
              ? ""
              : infoSets[2] === undefined
              ? juegosE2
              : infoSets[2].equipo2}
          </Text>
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

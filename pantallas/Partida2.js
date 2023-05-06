import {
  StyleSheet,
  View,
  BackHandler,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { database } from "../src/config/fb";
import {
  setDoc,
  doc,
  increment,
  getDoc,
  arrayUnion,
  getDocs,
  collection,
} from "firebase/firestore";
import { Text, IconButton } from "react-native-paper";
import { useEffect, useRef, useState } from "react";
import Contador from "../components/Partida/Contador";
import PointDetail from "../components/Partida/Popup";
import { SafeAreaView } from "react-native-safe-area-context";
import SalirPartida from "../components/Partida/SalirPartida";
import PartidaConfig from "../components/Partida/PartidaConfig";
import StopwatchTimer from 'react-native-animated-stopwatch-timer';

const getMatchDetails = async (id) => {
    let partida;
      try {
          const q = collection(
            database,
            `Partidas/${id}/PartidoCompleto`
          );

          const querySnapshot = await getDocs(q);
          let equipos = {};
          let sets = {};
          let normas = {};
          let setsData = [];

          querySnapshot.forEach(async (match) => {
            match.data().infoequipos === undefined
              ? ""
              : (equipos = match.data().infoequipos);
            match.data().normas === undefined
              ? ""
              : (normas = match.data().normas);
            match.data().set === undefined ? "" : (sets = match.data().set);
            match.data().infoSets === undefined
              ? ""
              : (setsData = match.data().infoSets);

            match.data().set === undefined
              ? null
              :  partida = [equipos, id, sets, setsData, normas];
               
            match.data().sets === undefined
              ? null
              : partida = [equipos, id, sets, setsData, normas];
          });
          return partida;
      } catch (error) {
        console.log(error);
      }
  };

async function crearPartida(
  partidaid,
  infoequipos,
  sets,
  pOro,
  aTiempo,
  datosJugadores,
  juegosE1,
  juegosE2
) {
  const normas = { sets: sets, pOro: pOro, aTiempo: aTiempo };
  const matchRef = doc(
    database,
    `Partidas/${partidaid}/PartidoCompleto/Matchdetails`
  );
  const setsRef = doc(
    database,
    `Partidas/${partidaid}/PartidoCompleto/SetsResults`
  );
  try {
    const refSnap = await getDoc(matchRef);
    if (!refSnap.exists()) {
      await setDoc(
        doc(database, `Partidas/${partidaid}/PartidoCompleto/Matchdetails`),
        { infoequipos, normas }
      );
      await setDoc(
        doc(database, `Partidas/${partidaid}/PartidoCompleto/SetsResults`),
        {
          infoSets: [{ equipo1: juegosE1, equipo2: juegosE2 }],
          set: {
            set1: {
              datosJugadores,
            },
          },
        }
      );
    }
  } catch (e) {
    console.log(e);
  }
}

const Partida2 = ({ route, navigation }) => {
  const [atrasPartida, setAtrasPartida] = useState(false);
  // const hasUnsavedChanges = Boolean(text);

  BackHandler.addEventListener("hardwareBackPress", () => {
    navigation.addListener("beforeRemove", (e) => {
      // Prevent default behavior of leaving the screen
      e.preventDefault();

      // Prompt the user before leaving the screen
      setAtrasPartida(true);
    });
  });

  const terminarPartida = async () => {
    finish.current = true;
    partidaTerminadaForzadamente.current = true;

    updateJuego("null");
    updateSets(true);
    setAtrasPartida(false);

    getMatchDetails(partidaid).then((response) => {
      navigation.navigate("info-partida", response);
    });
  };

  const partidaid = route.params.partidaid;
  const infoequipos = route.params.infoequipos;
  const sets = route.params.sets;
  const pOro = route.params.pOro;
  const aTiempo = route.params.aTiempo;

  const stopwatchTimerRef = useRef(null);
  const [isTiebreak, setTiebreak] = useState(false);
  const [goldenPoint, setGoldenPoint] = useState(false);
  const finish = useRef(false);
  const updateSet = useRef(false);
  const partidaTerminadaForzadamente = useRef(false);
  const equipoPunto = useRef();
  const ordenJuegos = useRef(0);
  const breakChance = useRef(false);
  const [playPause, setPlayPause] = useState(false);
  const datosJugadores = {
    equipo1: {
      puntosOro: 0,
      breakPoints: 0,
      breakPointsExito: 0,
      jugador1: {
        winners: 0,
        smashes: 0,
        smashesExito: 0,
        unfError: 0,
      },
      jugador2: {
        winners: 0,
        smashes: 0,
        smashesExito: 0,
        unfError: 0,
      },
    },
    equipo2: {
      puntosOro: 0,
      breakPoints: 0,
      breakPointsExito: 0,
      jugador1: {
        winners: 0,
        smashes: 0,
        smashesExito: 0,
        unfError: 0,
      },
      jugador2: {
        winners: 0,
        smashes: 0,
        smashesExito: 0,
        unfError: 0,
      },
    },
  };

  //DEL SERVICIO
  const [serve, setServe] = useState(undefined);
  const [infoSets, setInfoSets] = useState([]);

  //AÑADIR PUNTOS EN EL JUEGO
  const [punto, setPunto] = useState({});
  const [puntosJuego, setPuntosJuego] = useState([]);

  //MARCADOR DEL JUEGO
  const [marcadorE1, setMarcadorE1] = useState(0);
  const [marcadorE2, setMarcadorE2] = useState(0);

  //JUEGOS DE CADA EQUIPO
  const [juegosE1, setJuegosE1] = useState(5);
  const [juegosE2, setJuegosE2] = useState(0);

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

  const playOrPauseStopWatch = () => {
    if(playPause) stopwatchTimerRef.current?.pause();
    else stopwatchTimerRef.current?.play();
    setPlayPause(!playPause);
  }

  function play() {
    stopwatchTimerRef.current?.play();
  }

  const updateJuego = async (team) => {
    setGoldenPoint(false);
    ordenJuegos.current++;
    const serving = serve ? "equipo2" : "equipo1";
    try {
      await setDoc(
        doc(
          database,
          `/Partidas/${partidaid}/PartidoCompleto/Matchdetails/Set${
            setsE1 + setsE2 + 1
          }/Juego${juegosE1 + juegosE2 + 1}`
        ),
        { winner: team, serve: serving, order: ordenJuegos.current }
      );
      await setDoc();
    } catch (error) {
      console.log(error);
    }

    puntosJuego.map(async (puntos, index) => {
      if (puntos.point == "unfError") {
        await setDoc(
          doc(database, `/Partidas/${partidaid}/PartidoCompleto/SetsResults`),
          {
            set: {
              ["set" + (setsE1 + setsE2 + 1)]: {
                datosJugadores: {
                  [puntos.team == 0 ? "equipo2" : "equipo1"]: {
                    ["jugador" + puntos.player]: {
                      [puntos.point]: increment(1),
                    },
                  },
                },
              },
            },
          },
          { merge: true }
        );
      }

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
        //TODO: Reparar orden de aparición de los datos de los breaks
        if (puntos.breakChance == true) {
          await setDoc(
            doc(database, `/Partidas/${partidaid}/PartidoCompleto/SetsResults`),
            {
              set: {
                ["set" + (setsE1 + setsE2 + 1)]: {
                  datosJugadores: {
                    equipo1: {
                      breakPoints:
                        isTiebreak == false && +puntos.serving == 1
                          ? increment(1)
                          : increment(0),
                    },
                    equipo2: {
                      breakPoints:
                        isTiebreak == false && +puntos.serving == 0
                          ? increment(1)
                          : increment(0),
                    },
                  },
                },
              },
            },
            { merge: true }
          );
        }
        await setDoc(
          doc(database, `/Partidas/${partidaid}/PartidoCompleto/SetsResults`),
          {
            set: {
              ["set" + (setsE1 + setsE2 + 1)]: {
                datosJugadores: {
                  ["equipo" + (puntos.team + 1)]: {
                    puntosOro:
                      index == puntosJuego.length - 1 && goldenPoint === true
                        ? increment(1)
                        : increment(0),
                    breakPointsExito:
                      isTiebreak == false &&
                      index == puntosJuego.length - 1 &&
                      +puntos.serving !== puntos.team &&
                      partidaTerminadaForzadamente.current == false
                        ? increment(1)
                        : increment(0),
                    ["jugador" + puntos.player]: {
                      [puntos.point]:
                        puntos.point == "unfError"
                          ? increment(0)
                          : increment(1),
                    },
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

      setPuntosJuego([]);
    });
    setServe(!serve);
    breakChance.current = false;
  };

  const updateSets = async (finish = false) => {
    const setsDoc = doc(
      database,
      `/Partidas/${partidaid}/PartidoCompleto/SetsResults`
    );
      if (!finish) {
        try {
          await setDoc(
            setsDoc,
            {
              set: {
                ["set" + (setsE1 +setsE2)]: {
                  duration : stopwatchTimerRef.current?.getSnapshot(),
                },
                ["set" + (setsE1 + setsE2 + 1)]: {
                  datosJugadores,
                },
              },
            },
            { merge: true }
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        await setDoc(
          doc(database, `Partidas/${partidaid}`),
          { partidaTerminada: true },
          { merge: true }
        );
        await setDoc( setsDoc,
          {
            set: {
              ["set" + (setsE1 + setsE2)]: {
                duration : stopwatchTimerRef.current?.getSnapshot(),
              },
            },
          },
          { merge: true }
        );
      }
  };

  //RETROCEDER / CANCELAR PUNTOS
  const atrasPuntos = () => {
    if (puntosJuego.length != 0) {
      if (puntosJuego[puntosJuego.length - 1].team == 0) {
        if (serve == true && marcadorE1 == 3 && breakChance.current == true) {
          breakChance.current = false;
        }
        setMarcadorE1(marcadorE1 - 1);
      }
      if (puntosJuego[puntosJuego.length - 1].team == 1) {
        if (serve == false && marcadorE2 == 3 && breakChance.current == true) {
          breakChance.current = false;
        }
        setMarcadorE2(marcadorE2 - 1);
      }
      if (goldenPoint == true) setGoldenPoint(false);
      puntosJuego.pop();
    }
  };

  const cancelPunto = () => {
    equipoPunto.current == 1
      ? setMarcadorE1(marcadorE1 - 1)
      : setMarcadorE2(marcadorE2 - 1);
  };

  //CONTADOR DE PUNTOS POR JUEGOS
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
      if ((contador1 + contador2) % 2 == 1) {
        setServe(!serve);
      }
    } else {
      if (contador1 === 3 && contador2 === 3) {
        setGoldenPoint(true);
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
  //CONTADOR DE JUEGOS POR SET

  const updateInfoSets = () => {
    console.log(infoSets);
    if (finish.current==false) {
      let nuevosPartidos = [...infoSets];
    nuevosPartidos[setsE1 + setsE2] = {
      ...nuevosPartidos[setsE1 + setsE2],
      equipo1: juegosE1,
      equipo2: juegosE2,
    };
    console.log(nuevosPartidos);
    setInfoSets(nuevosPartidos);
    } else {
      setInfoSets(infoSets.pop());
    }
  }

  useEffect(() => {
    updateInfoSets();
    if (aTiempo == false) {
      if (juegosE1 === 6 && juegosE2 === 6) {
        setTiebreak(true);
        return;
      }
      //EQUIPO 1
      if (finish.current == false) {
        if ((juegosE1 >= 6 && juegosE1 - juegosE2 >= 2) || juegosE1 === 7) {
          setSetsE1(setsE1 + 1);
          setJuegosE1(0);
          setJuegosE2(0);
          updateSet.current = true;
        }
        if ((juegosE2 >= 6 && juegosE2 - juegosE1 >= 2) || juegosE2 === 7) {
          setSetsE2(setsE2 + 1);
          setJuegosE1(0);
          setJuegosE2(0);
          updateSet.current = true;
        }
      }
    }
  }, [juegosE1, juegosE2]);

  useEffect(() => {
    const updateSetsCount = async () => {
      await setDoc(
        doc(database, `/Partidas/${partidaid}/PartidoCompleto/SetsResults`),
        { infoSets },
        { merge: true }
      );
    };
    updateSetsCount();
  }, [infoSets]);

  //CONTADOR DE SETS POR PARTIDA
  useEffect(() => {
    if (finish.current == false) {
      if (setsE1 > sets / 2 && updateSet.current==true) {
        Alert.alert(
          'SE HA TERMINADO EL PARTIDO',
          'Ganador: '+datos[0].nombre,
          [
            {
              text: 'OK',
              onPress: () => {
                getMatchDetails(partidaid).then((response) => {
                  navigation.navigate("info-partida", response);
                });
              },
            },
          ],
        );
        updateSet.current = false;
        finish.current = true;
        setInfoSets(infoSets.splice(infoSets.length-1, 1));
        updateSets(true);
        return;
      }
      if (setsE2 > sets / 2 && updateSet.current==true) {
        Alert.alert(
          'SE HA TERMINADO EL PARTIDO',
          'Ganador: '+datos[1].nombre,
          [
            {
              text: 'OK',
              onPress: () => {
                getMatchDetails(partidaid).then((response) => {
                  navigation.navigate("info-partida", response);
                });
              },
            }
          ],
        );
        updateSet.current = false;
        finish.current = true;
        setInfoSets(infoSets.splice(infoSets.length-1, 1));
        updateSets(true);
        return;
      }
    }
    if (updateSet.current == true) {
      console.log("AÑADIR SIMPLEMENTE UN SET");
      updateSets();
      updateSet.current = false;
    }
  }, [updateSet.current]);

  //CREAR LA PARTIDA LA PRIMERA VEZ QUE SE INICIA EL ARCHIVO
  useEffect(() => {
    crearPartida(
      partidaid,
      infoequipos,
      sets,
      pOro,
      aTiempo,
      datosJugadores,
      juegosE1,
      juegosE2
    );
  }, []);

  return (
    <SafeAreaView style={styles.pantalla}>
      <View style={{ width: "90%", flexDirection:'row', alignItems: 'center'}}>
        <IconButton
          disabled={puntosJuego.length == 0 ? true : false}
          style={styles.goBackButton}
          icon="keyboard-backspace"
          iconColor="black"
          size={40}
          onPress={atrasPuntos}
        />
        <View>
        <Text>Partida: </Text><StopwatchTimer digitStyle={{fontSize: 20}} trailingZeros={0} animationDistance={30} ref={stopwatchTimerRef} />
        </View>
        <IconButton 
        icon={playPause ? "pause" : "play"}
        onPress={playOrPauseStopWatch}
        />
      </View>

      <PartidaConfig
        serve={serve}
        setServe={setServe}
        infoequipos={infoequipos}
        play = {play}
        setPlay = {setPlayPause}
      />
      <SalirPartida
        visible={atrasPartida}
        setVisible={setAtrasPartida}
        terminarPartida={terminarPartida}
      />
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
        serve={serve}
        breakChance={breakChance}
        marcadorE2={marcadorE2}
        marcadorE1={marcadorE1}
        cancelarPunto={cancelPunto}
      />
      <View style={styles.equipo}>
        <View style={styles.datosJugadores}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>{datos[0].nombre}</Text>
            {serve ? (
              ""
            ) : (
              <IconButton
                style={styles.servicio}
                iconColor="lawngreen"
                icon="tennis-ball"
              />
            )}
          </View>

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
          equipoPunto={equipoPunto}
        />
      </View>
      <View style={styles.marcadorSets}>
        <View style={styles.sets}>
          <View style={styles.set}>
            <FlatList
              contentContainerStyle={{ flexDirection: "row" }}
              data={infoSets}
              renderItem={({ item, index }) => (
                <View style={{ flexDirection: "row" }}>
                  <View style={styles.set}>
                    <Text style={styles.marcador}>{item.equipo1}</Text>
                    <Text style={styles.marcador}>{item.equipo2}</Text>
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => "key" + index}
            />
          </View>
        </View>
      </View>
      <View style={styles.equipo}>
        <View style={styles.datosJugadores}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>{datos[1].nombre}</Text>
            {serve ? (
              <IconButton
                style={styles.servicio}
                iconColor="lawngreen"
                icon="tennis-ball"
              />
            ) : (
              ""
            )}
          </View>
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
          equipoPunto={equipoPunto}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  goBackButton: {},
  pantalla: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  equipo: {
    alignItems: "center",
    width: "100%",
  },

  datosJugadores: {
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    flexDirection: "row",
  },

  nombresJugadores: {
    flexDirection: "row",
  },

  servicio: {
    margin: 0,
  },

  marcadorSets: {
    height: "10%",
    //backgroundColor: 'red',
    width: "90%",
    position: "relative",
    flexDirection: "row",
  },

  sets: {
    left: 0,
    right: 0,
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "row",
    position: "absolute",
    //backgroundColor: 'blue',
  },

  set: {
    marginHorizontal: 5,
  },

  marcador: {
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default Partida2;

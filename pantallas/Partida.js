import {
  StyleSheet,
  View,
  BackHandler,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { database } from "../src/config/fb";
import { setDoc, doc, increment, getDoc } from "firebase/firestore";
import { Text, IconButton } from "react-native-paper";
import { useEffect, useRef, useState } from "react";
import Contador from "../components/Partida/Contador";
import PointDetail from "../components/Partida/Popup";
import { SafeAreaView } from "react-native-safe-area-context";
import SalirPartida from "../components/Partida/SalirPartida";
import PartidaConfig from "../components/Partida/PartidaConfig";

async function crearPartida(partidaid, infoequipos, sets, pOro, aTiempo) {
  const normas = { sets: sets, pOro: pOro, aTiempo: aTiempo };
  const matchRef = doc(
    database,
    `Partidas/${partidaid}/PartidoCompleto/Matchdetails`
  );
  try {
    const refSnap = await getDoc(matchRef);
    if (!refSnap.exists()) {
      await setDoc(
        doc(database, `Partidas/${partidaid}/PartidoCompleto/Matchdetails`),
        { infoequipos, normas }
      );
    }
  } catch (e) {
    console.log(e);
  }
}

const Partida = ({ route, navigation }) => {
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
    updateSet.current = true;
    try {
      await setDoc(
        doc(database, `Partidas/${partidaid}`),
        { partidaTerminada: true },
        { merge: true }
      );
    } catch (error) {
      console.log(error);
    }
    navigation.navigate("tabbar");
    updateJuego("null");
    if (aTiempo == false) {
      updateSets(1);
    }
  };

  const partidaid = route.params.partidaid;
  const infoequipos = route.params.infoequipos;
  const sets = route.params.sets;
  const pOro = route.params.pOro;
  const aTiempo = route.params.aTiempo;

  const [isTiebreak, setTiebreak] = useState(false);
  const [goldenPoint, setGoldenPoint] = useState(false);
  const finish = useRef(false);
  const partidaTerminadaForzadamente = useRef(false);
  const equipoPunto = useRef(); 
  const ordenJuegos =useRef(0);
  const breakChance=useRef(false);

  const [datosJugadores, setDatosJugadores] = useState({
    equipo1: {
      games: 0,
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
      games: 0,
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
  });

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
  const [juegosE1, setJuegosE1] = useState(0);
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
  const updateSet = useRef(false);

  const updateJuego = async (team) => {
    setGoldenPoint(false);
    breakChance.current=false;
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
        { winner: team, serve: serving, order:  ordenJuegos.current}
      );
    } catch (error) {
      console.log(error);
    }

    puntosJuego.map(async (puntos, index) => {
      if (puntos.point == "unfError") {
        let equipoError = puntos.team == 0 ? "equipo2" : "equipo1";
        setDatosJugadores({
          ...datosJugadores,
          [equipoError]: {
            ...datosJugadores[equipoError],
            ["jugador" + puntos.player]: {
              ...datosJugadores[equipoError]["jugador" + puntos.player],
              [puntos.point]: (datosJugadores[equipoError][
                "jugador" + puntos.player
              ][puntos.point] =
                datosJugadores[equipoError]["jugador" + puntos.player][
                  puntos.point
                ] + 1),
            },
          },
        });

        await setDoc(
          doc(database, `/Partidas/${partidaid}/PartidoCompleto/Matchdetails`),
          {
            infoequipos: {
              [puntos.team == 0 ? "equipo2" : "equipo1"]: {
                jugadores: {
                  ["jugador" + puntos.player]: {
                    [puntos.point]: increment(1),
                  },
                },
              },
            },
          },
          { merge: true }
        );
      }
      setDatosJugadores({
        ...datosJugadores,
        ["equipo" + (puntos.team + 1)]: {
          ...datosJugadores["equipo" + (puntos.team + 1)],
          puntosOro:
            index == puntosJuego.length - 1 && goldenPoint === true
              ? (datosJugadores["equipo" + (puntos.team + 1)].puntosOro =
                  datosJugadores["equipo" + (puntos.team + 1)].puntosOro + 1)
              : datosJugadores["equipo" + (puntos.team + 1)].puntosOro,
          breakPointsExito:
            isTiebreak == false &&
            index == puntosJuego.length - 1 &&
            +puntos.serving !== puntos.team &&
            partidaTerminadaForzadamente.current == false
              ? (datosJugadores["equipo" + (puntos.team + 1)].breakPointsExito =
                  datosJugadores["equipo" + (puntos.team + 1)]
                    .breakPointsExito + 1)
              : datosJugadores["equipo" + (puntos.team + 1)].breakPointsExito,
          ["jugador" + puntos.player]: {
            ...datosJugadores["equipo" + (puntos.team + 1)][
              "jugador" + puntos.player
            ],
            [puntos.point]:
              puntos.point == "unfError"
                ? (datosJugadores["equipo" + (puntos.team + 1)][
                    "jugador" + puntos.player
                  ][puntos.point] =
                    datosJugadores["equipo" + (puntos.team + 1)][
                      "jugador" + puntos.player
                    ][puntos.point])
                : (datosJugadores["equipo" + (puntos.team + 1)][
                    "jugador" + puntos.player
                  ][puntos.point] =
                    datosJugadores["equipo" + (puntos.team + 1)][
                      "jugador" + puntos.player
                    ][puntos.point] + 1),
          },
        },
      });

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
          setDatosJugadores({
            ...datosJugadores,
            equipo1: {
              ...datosJugadores.equipo1,
              breakPoints:
                isTiebreak == false && +puntos.serving == 1
                  ? (datosJugadores.equipo1.breakPoints =
                      datosJugadores.equipo1.breakPoints + 1)
                  : datosJugadores.equipo1.breakPoints,
            },
            equipo2: {
              ...datosJugadores.equipo2,
              breakPoints:
                isTiebreak == false && +puntos.serving == 0
                  ? (datosJugadores.equipo2.breakPoints =
                      datosJugadores.equipo2.breakPoints + 1)
                  : datosJugadores.equipo2.breakPoints,
            },
          });

          await setDoc(
            doc(
              database,
              `/Partidas/${partidaid}/PartidoCompleto/Matchdetails`
            ),
            {
              infoequipos: {
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
            { merge: true }
          );
        }

        await setDoc(
          doc(database, `/Partidas/${partidaid}/PartidoCompleto/Matchdetails`),
          {
            infoequipos: {
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
                jugadores: {
                  ["jugador" + puntos.player]: {
                    [puntos.point]:
                      puntos.point == "unfError" ? increment(0) : increment(1),
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
  };

  const updateSets = async (value = 0) => {
    const setsDoc = doc(
      database,
      `/Partidas/${partidaid}/PartidoCompleto/SetsResults`
    );
    //TODO: No hacer que se añada la info del set con un timeout, sino que se añada cuando se termine de añadir en el sets results
    setTimeout(async () => {
      try {
        await setDoc(
          setsDoc,
          {
            set: {
              ["set" + (setsE1 + setsE2 + value)]: {
                datosJugadores: {
                  ...datosJugadores,
                  equipo1: { ...datosJugadores.equipo1, games: juegosE1 },
                  equipo2: { ...datosJugadores.equipo2, games: juegosE2 },
                },
              },
            },
          },
          { merge: true }
        );
      } catch (error) {
        console.log(error);
      } finally {
        setDatosJugadores({
          equipo1: {
            games: 0,
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
            games: 0,
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
        });
      }
    }, 1500);
  };

  //RETROCEDER / CANCELAR PUNTOS
  const atrasPuntos = () => {
    if (puntosJuego.length != 0) {
      if (puntosJuego[puntosJuego.length - 1].team == 0){
        if(serve==true && marcadorE1==3 && breakChance.current==true){
          breakChance.current=false;
        }
        setMarcadorE1(marcadorE1 - 1);
      } 
      if (puntosJuego[puntosJuego.length - 1].team == 1){
        if(serve==false && marcadorE2==3 && breakChance.current==true){
          breakChance.current=false;
        }
        setMarcadorE2(marcadorE2 - 1);
      } 
      if(goldenPoint==true) setGoldenPoint(false);
      puntosJuego.pop();
    }
  };

  const cancelPunto = () => {
    equipoPunto.current==1 ? setMarcadorE1(marcadorE1-1) : setMarcadorE2(marcadorE2-1);
  }

  //PROCESOS AL TERMINAR LA PARTIDA
  useEffect(() => {
    const setsDoc = doc(
      database,
      `/Partidas/${partidaid}/PartidoCompleto/SetsResults`
    );
    const finishMatch = async () => {
      if (finish.current == true) {
        console.log("SE ACABÓ");
        await setDoc(setsDoc, { infoSets }, { merge: true });
        await setDoc(
          doc(database, `Partidas/${partidaid}`),
          { partidaTerminada: true },
          { merge: true }
        );
      }
    };
    finishMatch();
  }, [infoSets]);

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
      if(serve == false && contador2 == 3){
        breakChance.current=true;
      }
      if(serve==true && contador1==3){
        breakChance.current=true;
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
  useEffect(() => {
    if (aTiempo == false) {
      if (juegosE1 === 6 && juegosE2 === 6) {
        setTiebreak(true);
        return;
      }
      //EQUIPO 1
      if (finish.current == false) {
        if ((juegosE1 >= 6 && juegosE1 - juegosE2 >= 2) || juegosE1 === 7) {
          setSetsE1(setsE1 + 1);
          updateSet.current = true;
        }
        if ((juegosE2 >= 6 && juegosE2 - juegosE1 >= 2) || juegosE2 === 7) {
          setSetsE2(setsE2 + 1);
          updateSet.current = true;
        }
      }
    }
  }, [juegosE1 === 6, juegosE2 === 6]);

  //CONTADOR DE SETS POR PARTIDA
  useEffect(() => {
    if (finish.current == false) {
      if (setsE1 > sets / 2) {
        alert("SE HA TERMINADO EL PARTIDO, GANADOR: " + datos[0].nombre);
        if (updateSet.current == true) {
          setInfoSets((current) => [
            ...current,
            { equipo1: juegosE1, equipo2: juegosE2 },
          ]);
        }
        updateSets();
        updateSet.current = false;
        finish.current = true;
        return;
      }
      if (setsE2 > sets / 2) {
        alert("SE HA TERMINADO EL PARTIDO, GANADOR: " + datos[1].nombre);
        if (updateSet.current == true) {
          setInfoSets((current) => [
            ...current,
            { equipo1: juegosE1, equipo2: juegosE2 },
          ]);
        }
        updateSets();
        updateSet.current = false;
        finish.current = true;
        return;
      }
    }
    if (updateSet.current == true) {
      console.log("AÑADIR SIMPLEMENTE UN SET");
      setInfoSets((current) => [
        ...current,
        { equipo1: juegosE1, equipo2: juegosE2 },
      ]);
      if (partidaTerminadaForzadamente.current == false) {
        setJuegosE1(0);
        setJuegosE2(0);
        ordenJuegos.current=0;
        updateSets();
      }
      updateSet.current = false;
    }
  }, [updateSet.current]);

  //CREAR LA PARTIDA LA PRIMERA VEZ QUE SE INICIA EL ARCHIVO
  useEffect(() => {
    crearPartida(partidaid, infoequipos, sets, pOro, aTiempo);
  }, []);

  return (
    <SafeAreaView style={styles.pantalla}>
      <View style={{ width: "90%" }}>
        <IconButton
          disabled={puntosJuego.length==0 ? true : false}
          style={styles.goBackButton}
          icon="keyboard-backspace"
          iconColor="black"
          size={40}
          onPress={atrasPuntos}
        />
      </View>

      <PartidaConfig
        serve={serve}
        setServe={setServe}
        infoequipos={infoequipos}
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
            <Text style={styles.marcador}>
              {infoSets[0] === undefined ? juegosE1 : ""}
            </Text>
            <Text style={styles.marcador}>
              {infoSets[0] === undefined ? juegosE2 : ""}
            </Text>
          </View>
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
                  <View style={styles.set}>
                    <Text style={styles.marcador}>
                      {finish.current == true
                        ? ""
                        : infoSets[index + 1] === undefined
                        ? juegosE1
                        : ""}
                    </Text>
                    <Text style={styles.marcador}>
                      {finish.current == true
                        ? ""
                        : infoSets[index + 1] === undefined
                        ? juegosE2
                        : ""}
                    </Text>
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

export default Partida;

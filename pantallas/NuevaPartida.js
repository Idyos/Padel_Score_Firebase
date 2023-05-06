import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Button,
  View,
  BackHandler,
  Dimensions,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { database } from "../src/config/fb";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  now,
  serverTimestamp,
} from "firebase/firestore";
import firebase from "firebase/app";
import * as ImagePicker from "expo-image-picker";
import {
  ActivityIndicator,
  HelperText,
  IconButton,
  Menu,
  Surface,
  Switch,
  TextInput,
  useTheme,
} from "react-native-paper";
import { Camera, CameraType } from "expo-camera";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "@firebase/storage";
import SearchScreen from "../components/NuevaPartida/SearchUsers";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const storage = getStorage();

const NuevaPartida = ({ navigation, route }) => {
  const theme = useTheme();
  const [equipoObj, setEquipoObj] = useState({
    equipo1: {
      nombre: "Equipo A",
      position: false,
      jugadores: {
        jugador1: {
          nombre: "",
          playerId: "",
        },
        jugador2: {
          nombre: "",
          playerId: "",
        },
      },
    },
    equipo2: {
      nombre: "Equipo B",
      position: false,
      jugadores: {
        jugador1: {
          nombre: "",
          playerId: "",
        },
        jugador2: {
          nombre: "",
          playerId: "",
        },
      },
    },
  });
  const [creatingMatch, setCreatingMatch] = useState(false);
  const [normas, setNormas] = useState({});
  const [equipo, setEquipo] = useState(0);
  const [setAmmount, setSetAmmount] = useState(3);
  const [puntoDeOro, setPuntoDeOro] = useState(true);
  const [aTiempo, setATiempo] = useState(false);
  const [tipo, setTipo] = useState(false);
  const [image, setImage] = useState();

  const addPlayer = (name, id, player, team) => {
    const userRef = doc(database, `Usuarios/${id}`);
    setEquipoObj({
      ...equipoObj,
      ["equipo" + team]: {
        ...equipoObj["equipo" + team],
        jugadores: {
          ...equipoObj["equipo" + team].jugadores,
          ["jugador" + player]: {
            nombre: name,
            playerId: id,
            playerReference: userRef,
          },
        },
      },
    });
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        aspect: [16, 9],
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        console.log(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error occurred while launching the camera: ", error);
    }
  };

  const imageBlob = (uri) => {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          resolve(xhr.response);
        }
      };
      xhr.open("GET", uri);
      xhr.responseType = "blob";
      xhr.send();
    });
  };

  const CreacionEquipo = async () => {
    let crearPartidaId;
    try {
      setCreatingMatch(true);
      const crearPartida = await addDoc(collection(database, "Partidas"), {
        usuario: route.params.user,
        partidaTerminada: false,
        creadoEn: serverTimestamp(),
        imagenPartida: null,
      });
      crearPartidaId=crearPartida.id;
      const imagesRef = ref(storage, `matches/${crearPartida.id}`);
      if (image !== undefined) {
        imageBlob(image)
          .then((resolve) => {
            uploadBytes(imagesRef, resolve).then(() => {
              getDownloadURL(imagesRef).then(async (link) => {
                await setDoc(
                  doc(database, `Partidas/${crearPartida.id}`),
                  { imagenPartida: link },
                  { merge: true }
                );
              });
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }

      for(let i = 1; i<=Object.keys(equipoObj).length; i++){
        for(let j = 1;  j<=Object.keys(equipoObj["equipo"+i].jugadores).length; j++){
          if(equipoObj["equipo"+i].jugadores["jugador"+j].playerId!==null && equipoObj["equipo"+i].jugadores["jugador"+j].playerId!== undefined && equipoObj["equipo"+i].jugadores["jugador"+j].playerId!== ""){
            //const userId = doc(database, `Usuarios/${equipoObj["equipo"+i].jugadores["jugador"+j].playerId}`);
            const matchRef = doc(database, `Partidas/${crearPartida.id}`);
            await setDoc(doc(database, `Usuarios/${equipoObj["equipo"+i].jugadores["jugador"+j].playerId}/Partidas/${crearPartida.id}`), {
              match: matchRef,
            })
          }
        }
      }

    } catch (error) {
      setCreatingMatch(false);
      console.log(error);
    } finally {
      setCreatingMatch(false);
      navigation.navigate("partida2", {
        partidaid: crearPartidaId,
        infoequipos: equipoObj,
        sets: setAmmount,
        pOro: puntoDeOro,
        aTiempo: aTiempo,
      });
    }
  };

  switch (equipo) {
    case 0:
      return (
        <View style={styles.pantalla}>
          <Text style={styles.title}>
            Introduce la información del primer equipo
          </Text>
          <TextInput
            outlineStyle={{ borderRadius: 25 }}
            mode="outlined"
            label={<Text>Equipo 1</Text>}
            right={
              <TextInput.Affix
                textStyle={{ fontSize: 15 }}
                text={equipoObj.equipo1.nombre.length + "/20"}
              />
            }
            style={styles.inputTeam}
            onChangeText={(text) =>
              setEquipoObj({
                ...equipoObj,
                equipo1: { ...equipoObj.equipo1, nombre: text },
              })
            }
            value={equipoObj.equipo1.nombre}
            maxLength={20}
          />
          <View style={[styles.playerSection, { zIndex: 2 }]}>
            <TextInput
              autoComplete="off"
              mode="flat"
              label="Jugador 1"
              style={styles.inputPlayer}
              value={equipoObj.equipo1.jugadores.jugador1.nombre}
              right={
                <TextInput.Icon
                  onPress={() =>
                    setEquipoObj({
                      ...equipoObj,
                      equipo1: {
                        ...equipoObj.equipo1,
                        position: !equipoObj.equipo1.position,
                      },
                    })
                  }
                  icon={({ size, color, direction }) => (
                    <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                      {equipoObj.equipo1.position == true ? "D" : "R"}
                    </Text>
                  )}
                />
              }
              onChangeText={(text) =>
                setEquipoObj({
                  ...equipoObj,
                  equipo1: {
                    ...equipoObj.equipo1,
                    jugadores: {
                      ...equipoObj.equipo1.jugadores,
                      jugador1: {
                        nombre: text,
                        playerId: "",
                      },
                    },
                  },
                })
              }
            />
            <SearchScreen
              addPlayer={addPlayer}
              searchText={equipoObj.equipo1.jugadores.jugador1.nombre}
              player={1}
              team={1}
            />
          </View>

          <View style={[styles.playerSection, { zIndex: 1 }]}>
            <TextInput
              autoComplete="off"
              mode="flat"
              label="Jugador 2"
              style={styles.inputPlayer}
              value={equipoObj.equipo1.jugadores.jugador2.nombre}
              right={
                <TextInput.Icon
                  onPress={() =>
                    setEquipoObj({
                      ...equipoObj,
                      equipo1: {
                        ...equipoObj.equipo1,
                        position: !equipoObj.equipo1.position,
                      },
                    })
                  }
                  icon={({ size, color, direction }) => (
                    <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                      {equipoObj.equipo1.position == true ? "R" : "D"}
                    </Text>
                  )}
                />
              }
              onChangeText={(text) => {
                setEquipoObj({
                  ...equipoObj,
                  equipo1: {
                    ...equipoObj.equipo1,
                    jugadores: {
                      ...equipoObj.equipo1.jugadores,
                      jugador2: {
                        nombre: text,
                        playerId: "",
                      },
                    },
                  },
                });
              }}
            />
            <SearchScreen
              addPlayer={addPlayer}
              searchText={equipoObj.equipo1.jugadores.jugador2.nombre}
              player={2}
              team={1}
            />
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
            outlineStyle={{ borderRadius: 25 }}
            mode="outlined"
            label={<Text>Equipo 2</Text>}
            right={
              <TextInput.Affix
                textStyle={{ fontSize: 15 }}
                text={equipoObj.equipo2.nombre.length + "/20"}
              />
            }
            style={styles.inputTeam}
            onChangeText={(text) =>
              setEquipoObj({
                ...equipoObj,
                equipo2: { ...equipoObj.equipo2, nombre: text },
              })
            }
            value={equipoObj.equipo2.nombre}
            maxLength={20}
          />

          <View style={styles.playerSection}>
            <TextInput
              autoComplete="off"
              mode="flat"
              label="Jugador 1"
              value={equipoObj.equipo2.jugadores.jugador1.nombre}
              right={
                <TextInput.Icon
                  onPress={() =>
                    setEquipoObj({
                      ...equipoObj,
                      equipo2: {
                        ...equipoObj.equipo2,
                        position: !equipoObj.equipo2.position,
                      },
                    })
                  }
                  icon={({ size, color, direction }) => (
                    <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                      {equipoObj.equipo2.position == true ? "D" : "R"}
                    </Text>
                  )}
                />
              }
              style={styles.inputPlayer}
              onChangeText={(text) =>
                setEquipoObj({
                  ...equipoObj,
                  equipo2: {
                    ...equipoObj.equipo2,
                    jugadores: {
                      ...equipoObj.equipo2.jugadores,
                      jugador1: {
                        nombre: text,
                        playerId: "",
                      },
                    },
                  },
                })
              }
            />
            <SearchScreen
              addPlayer={addPlayer}
              searchText={equipoObj.equipo2.jugadores.jugador1.nombre}
              player={1}
              team={2}
            />
          </View>
          <View style={styles.playerSection}>
            <TextInput
              autoComplete="off"
              mode="flat"
              label="Jugador 2"
              style={styles.inputPlayer}
              value={equipoObj.equipo2.jugadores.jugador2.nombre}
              right={
                <TextInput.Icon
                  onPress={() =>
                    setEquipoObj({
                      ...equipoObj,
                      equipo2: {
                        ...equipoObj.equipo2,
                        position: !equipoObj.equipo2.position,
                      },
                    })
                  }
                  icon={({ size, color, direction }) => (
                    <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                      {equipoObj.equipo2.position == true ? "R" : "D"}
                    </Text>
                  )}
                />
              }
              onChangeText={(text) => {
                setEquipoObj({
                  ...equipoObj,
                  equipo2: {
                    ...equipoObj.equipo2,
                    jugadores: {
                      ...equipoObj.equipo2.jugadores,
                      jugador2: {
                        nombre: text,
                        playerId: "",
                      },
                    },
                  },
                });
              }}
            />
            <SearchScreen
              addPlayer={addPlayer}
              searchText={equipoObj.equipo2.jugadores.jugador2.nombre}
              player={2}
              team={2}
            />
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
    case 2:
      return creatingMatch ? (
        <View style={styles.loading}>
          <ActivityIndicator style={{ opacity: 1 }} size={70} />
        </View>
      ) : (
        <View style={styles.pantalla}>
          <Text style={styles.title}>Configuración de la partida</Text>
          {image === undefined ? (
            <Surface
              style={[
                styles.configureSection,
                { justifyContent: "space-between" },
              ]}
            >
              <Text style={{ fontSize: 20 }}>Añadir Imagen: </Text>
              <IconButton icon="camera" onPress={() => openCamera()} />
            </Surface>
          ) : (
            <TouchableOpacity
              style={[
                styles.configureSection,
                {
                  paddingHorizontal: 0,
                  paddingVertical: 0,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.34,
                  shadowRadius: 6.27,

                  elevation: 10,
                },
              ]}
              activeOpacity={0.8}
              onLongPress={() => setImage()}
              delayLongPress={1000}
            >
              <Image style={styles.matchImage} source={{ uri: image }} />
              <IconButton
                style={styles.editMatchImage}
                icon="camera-retake"
                onPress={() => openCamera()}
              />
            </TouchableOpacity>
          )}

          <Surface
            style={[
              styles.configureSection,
              { justifyContent: "space-between" },
            ]}
          >
            <Text style={{ fontSize: 20 }}>Partido jugado a:</Text>
            <Menu
              visible={tipo}
              onDismiss={() => setTipo(false)}
              anchor={
                <TouchableOpacity
                  onPress={() => setTipo(true)}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Text style={{ fontSize: 20 }}>
                    {aTiempo == false ? "Sets" : "Tiempo"}
                  </Text>
                  <IconButton icon="menu-down" />
                </TouchableOpacity>
              }
            >
              <Menu.Item
                onPress={() => {
                  setATiempo(false),
                    setTipo(false),
                    setNormas({ ...normas, aTiempo: aTiempo });
                }}
                title="Sets"
              />
              <Menu.Item
                onPress={() => {
                  setATiempo(true),
                    setTipo(false),
                    setNormas({ ...normas, aTiempo: aTiempo });
                }}
                title="Tiempo"
              />
            </Menu>
          </Surface>
          {aTiempo == false ? (
            <Surface style={styles.configureSection}>
              <Text style={{ fontSize: 20 }}>Al mejor de </Text>
              <View style={{ flexDirection: "row" }}>
                <IconButton
                  icon="minus"
                  disabled={setAmmount == 1 ? true : false}
                  onPress={() => {
                    setSetAmmount(setAmmount - 2),
                      setNormas({ ...normas, sets: setAmmount });
                  }}
                />
                <TextInput
                  style={{
                    backgroundColor: "rgba(0,0,0,0)",
                    textAlign: "center",
                    fontSize: 20,
                  }}
                  mode="flat"
                  editable={false}
                  value={setAmmount.toString()}
                ></TextInput>
                <IconButton
                  icon="plus"
                  disabled={setAmmount == 9 ? true : false}
                  onPress={() => {
                    setSetAmmount(setAmmount + 2),
                      setNormas({ ...normas, sets: setAmmount });
                  }}
                />
              </View>
              <Text style={{ fontSize: 20 }}>
                {setAmmount == 1 ? "set" : "sets"}
              </Text>
            </Surface>
          ) : (
            ""
          )}

          <Surface style={styles.configureSection}>
            <TouchableOpacity
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                overflow: "visible",
              }}
              activeOpacity={0.5}
            >
              <Text style={{ fontSize: 20 }}>Punto de oro: </Text>
              <Switch
                disabled={true}
                value={puntoDeOro}
                onValueChange={() => {
                  setPuntoDeOro(!puntoDeOro),
                    setNormas({ ...normas, puntoDeOro: puntoDeOro });
                }}
              />
            </TouchableOpacity>
          </Surface>
          <TouchableOpacity
            style={styles.siguiente}
            onPress={() => {
              setNormas({
                ...normas,
                sets: setAmmount,
                puntoDeOro: puntoDeOro,
                aTiempo: aTiempo,
              });
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
    position: "relative",
    height: "100%",
    //flex: 1,
    backgroundColor: 'white',
    alignItems: "center",
    justifyContent: "center",
  },

  loading: {
    width: "100%",
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    height: "100%",
    top: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent:'center',
    zIndex: 3,
  },

  configureSection: {
    width: "90%",
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  matchImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
  },

  editMatchImage: {
    backgroundColor: "white",
    right: 5,
    top: 5,
    position: "absolute",
  },

  playerSection: {
    width: "80%",
    position: "relative",
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    marginHorizontal: 10,
    textAlign: "center",
    fontSize: 30,
    marginVertical: 30,
  },
  inputTeam: {
    justifyContent: "center",
    width: "85%",
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 30,
  },
  inputPlayer: {
    flex: 1,
    fontSize: 20,
    height: 70,
    //paddingTop: 10,
    //paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "rgba(255, 0, 255, 0.0)",
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

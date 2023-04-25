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
  TouchableOpacity,
  DatePickerIOS,
  TouchableHighlight,
  ImagePickerIOS,
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
import { MediaTypeOptions, getCameraPermissionsAsync, launchCameraAsync } from "expo-image-picker";
import {
  HelperText,
  IconButton,
  Menu,
  Surface,
  Switch,
  TextInput,
  useTheme,
} from "react-native-paper";
import { Camera, CameraType } from "expo-camera";
import { getStorage, ref, uploadBytes } from "@firebase/storage";
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
  const [normas, setNormas] = useState({});
  const [equipo, setEquipo] = useState(0);
  const [setAmmount, setSetAmmount] = useState(3);
  const [puntoDeOro, setPuntoDeOro] = useState(true);
  const [aTiempo, setATiempo] = useState(false);
  const [tipo, setTipo] = useState(false);
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  const imagesRef = ref(storage, `matches/test`);



const addPlayer = (name, id, type) => { 
  switch(type){
    case 0:
      setEquipoObj({
        ...equipoObj,
        equipo1: {
          ...equipoObj.equipo1,
          jugadores: {
            ...equipoObj.equipo1.jugadores,
            jugador1: {
              nombre: name,
              playerId: id,
            },
          },
        },
      })
      break;
    case 1: 
    setEquipoObj({
      ...equipoObj,
      equipo1: {
        ...equipoObj.equipo1,
        jugadores: {
          ...equipoObj.equipo1.jugadores,
          jugador2: {
            nombre: name,
            playerId: id,
          },
        },
      },
    })
  }
}

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  console.log(equipoObj);

  const takePicture = async () => {
    if (cameraRef) {
      const data = await cameraRef.takePictureAsync();

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
      console.log(data.uri);
      imageBlob(data.uri)
      .then((resolve) => {
        uploadBytes(imagesRef, resolve).then(() => {
          console.log("imagen subida exitosamente");
        });
      })
      .catch((error) => {
        console.log(error);
      });
    }
  };

  const openCamera = async () => {
    const {permission} = getCameraPermissionsAsync();
    console.log(permission);
    launchCameraAsync({mediaTypes: MediaTypeOptions.Images, quality: 1, aspect: [4, 3]}, response => {
      console.log(response.assets[0].uri);
    });
  };

  const CreacionEquipo = async () => {
    const crearPartida = await addDoc(collection(database, "Partidas"), {
      usuario: route.params.user,
      partidaTerminada: false,
      creadoEn: serverTimestamp(),
    });
    navigation.navigate("partida2", {
      partidaid: crearPartida.id,
      infoequipos: equipoObj,
      sets: setAmmount,
      pOro: puntoDeOro,
      aTiempo: aTiempo,
    });
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
          <View style={[styles.playerSection, {zIndex: 2}]}>
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
              addPlayer = {addPlayer}
              searchText = {equipoObj.equipo1.jugadores.jugador1.nombre}
              type={0}
            />
          </View>

          <View style={[styles.playerSection, {zIndex: 1}]}>
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
              addPlayer = {addPlayer}
              searchText = {equipoObj.equipo1.jugadores.jugador2.nombre}
              type={1}
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
                        playerId: ""
                      },
                    },
                  },
                })
              }
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
      return (
        <View style={styles.pantalla}>
          {/* <Camera style={{zIndex: 3, width: "100%", height: "100%", aspectRatio: }} useCamera2Api={true} type={type}  ref={ref => {
          setCameraRef(ref);
        }}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraType}
              >
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  alignContent: 'flex-end',
                  alignItems: "center",
                  backgroundColor: 'red',
                }}
                onPress={takePicture}
              >
                <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
                  Take Picture
                </Text>
              </TouchableOpacity>
            </View>
          </Camera> */}
          <Text style={styles.title}>Configuración de la partida</Text>
          <Surface
            style={[
              styles.configureSection,
              { justifyContent: "space-between" },
            ]}
          >
            <Text style={{ fontSize: 20 }}>Añadir Imagen: </Text>
            <IconButton icon="camera" onPress={() => openCamera()} />
          </Surface>

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
    backgroundColor: "white",
    alignItems: "center",
    //justifyContent: "center",
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

  playerSection: {
    width: "80%",
    position: 'relative',
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

import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {
  Portal,
  Provider,
  RadioButton,
  Dialog,
  Button,
} from "react-native-paper";
import { database } from "../../src/config/fb";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const PointDetail = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [equipo, setEquipo] = useState([]);
  const [equipoRival, setEquipoRival] = useState([]);
  const dialog = false;

  useEffect(() => {
    if (props.punto.player) {
      props.setPuntosJuego([...props.puntosJuego, props.punto]);
      props.setPunto({});
    }
  }, [props.punto]);

  useEffect(() => {}, [props.puntosJuego]);

  useEffect(() => {
    if (props.visible) {
      setEquipo(Object.values(props.datos[props.puntoEquipo].jugadores));
      props.puntoEquipo === 0
        ? setEquipoRival(Object.values(props.datos[1].jugadores))
        : setEquipoRival(Object.values(props.datos[0].jugadores));
    }
  }, [props.visible]);

  function applyPoint(item) {
    if ((props.serve == false && props.marcadorE2 == 3 && props.breakChance.current==true) || (props.serve == true && props.marcadorE1 == 3 && props.breakChance.current==true)) {
      props.setPunto({
        ...props.punto,
        player: item,
        team: props.puntoEquipo,
        breakChance: true,
        serving: props.serve,
      });
      return;
    }
    props.setPunto({
      ...props.punto,
      player: item,
      team: props.puntoEquipo,
      breakChance: false,
      serving: props.serve,
    });
  }

  console.log(props.punto);

  return (
    <Portal>
      <Dialog visible={props.visible} style={{ alignItems: "center" }}>
        {isOpen === false ? (
          <>
            <Dialog.Title style={{ fontSize: 21, fontWeight: "bold" }}>
              ¿Qué ha causado el punto?
            </Dialog.Title>

            <FlatList
              style={styles.pointOptions}
              data={[
                { original: "Winner", data: "winners" },
                { original: "Smash", data: "smashesExito" },
                { original: "Unforced Error", data: "unfError" },
              ]}
              renderItem={({ item, index }) => (
                <Dialog.Content>
                  <TouchableOpacity
                    style={styles.pointOptionsItem}
                    onPress={() => {
                      props.setPunto({ ...props.punto, point: item.data }),
                        setTimeout(() => {
                          setIsOpen(true);
                        }, 100);
                    }}
                  >
                    <RadioButton
                    //value={point}
                    //status={puntos === point ? 'checked' : 'unchecked'}
                    // onPress={() => { setPuntos }}
                    />
                    <Text>{item.original}</Text>
                  </TouchableOpacity>
                </Dialog.Content>
              )}
              keyExtractor={(item, index) => "key" + index}
            />
            <Dialog.Actions style={{ alignSelf: "flex-end" }}>
              <Button onPress={() => (props.visibleFunc(false), props.cancelarPunto())}>Cancelar</Button>
            </Dialog.Actions>
          </>
        ) : (
          <>
            <Dialog.Title style={{ fontSize: 20, fontWeight: "bold" }}>
              ¿Quién ha causado el punto?
            </Dialog.Title>
            <FlatList
              style={styles.pointOptions}
              data={props.punto.point == "unfError" ? equipoRival : equipo}
              renderItem={({ item, index }) => (
                <Dialog.Content>
                  <TouchableOpacity
                    style={styles.pointOptionsItem}
                    onPress={() => {
                      //console.log(index);
                      applyPoint(index + 1);
                      setTimeout(() => {
                        props.visibleFunc(false);
                        setIsOpen(false);
                      }, 100);
                    }}
                  >
                    <RadioButton
                      value={item}
                      status={
                        props.nuevoPunto === item ? "checked" : "unchecked"
                      }
                      onPress={() => {}}
                    />
                    <Text>{item}</Text>
                  </TouchableOpacity>
                </Dialog.Content>
              )}
              keyExtractor={(item, index) => "key" + index}
            />
            <Dialog.Actions style={{ alignSelf: "flex-end" }}>
              <Button onPress={() => setIsOpen(false)}>Atrás</Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    position: "absolute",
    left: 0,
    //top: 0,
    right: 0,
    bottom: "23%",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pointOptions: {
    flexDirection: "row",
    margin: 20,
  },
  pointOptionsItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    marginTop: 20,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default PointDetail;

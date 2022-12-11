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
import { Portal, Provider, RadioButton } from "react-native-paper";
import { database } from "../../src/config/fb";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

const PointDetail = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [equipo, setEquipo] = useState([]);
  const [equipoRival, setEquipoRival] = useState([]);
  //const [props.punto, props.setPunto] = useState({});
  //const [props.puntosJuego, props.setPuntosJuego] = useState([]);

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
    props.setPunto({ ...props.punto, player: item, team: props.puntoEquipo });
  }

  return (
    <View style={styles.centeredView}>
      <Provider>
        <Portal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              props.visibleFunc(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {isOpen === false ? (
                  <>
                    <Text style={styles.modalText}>
                      ¿Qué ha causado el punto?
                    </Text>
                    <FlatList
                      style={styles.pointOptions}
                      data={["Winner", "Smash", "Unforced Error"]}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity
                          style={styles.pointOptionsItem}
                          onPress={() => {
                            props.setPunto({ ...props.punto, point: item }),
                              setTimeout(() => {
                                setIsOpen(true);
                              }, 500);
                          }}
                        >
                          <RadioButton
                          //value={point}
                          //status={puntos === point ? 'checked' : 'unchecked'}
                          // onPress={() => { setPuntos }}
                          />
                          <Text>{item}</Text>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item, index) => "key" + index}
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.modalText}>
                      ¿Quién ha causado el punto?
                    </Text>
                    <FlatList
                      style={styles.pointOptions}
                      data={
                        props.punto.point == "Unforced Error"
                          ? equipoRival
                          : equipo
                      }
                      renderItem={({ item, index }) => (
                        <TouchableOpacity
                          style={styles.pointOptionsItem}
                          onPress={() => {
                            //console.log(index);
                            applyPoint(index+1);
                            setTimeout(() => {
                              props.visibleFunc(false);
                              setIsOpen(false);
                            }, 500);
                          }}
                        >
                          <RadioButton
                            value={item}
                            status={
                              props.nuevoPunto === item
                                ? "checked"
                                : "unchecked"
                            }
                            onPress={() => {}}
                          />
                          <Text>{item}</Text>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item, index) => "key" + index}
                    />
                  </>
                )}

                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => props.visibleFunc(false)}
                >
                  <Text style={styles.textStyle}>Hide Modal</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </Portal>
      </Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    marginTop: 22,
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
    margin: 10,
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

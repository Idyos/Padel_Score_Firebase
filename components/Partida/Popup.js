import React, { useEffect, useRef, useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, FlatList, TouchableOpacity } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { RadioButton } from 'react-native-paper';
import { database } from "../../src/config/fb";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";




const PointDetail = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [equipo, setEquipo] = useState([]);
  const [equipoRival, setEquipoRival] = useState([]);
  const [punto, setPunto] = useState({});
  const [puntosJuego, setPuntosJuego] = useState([]);


  useEffect(() => {
    if (punto.player) {
      setPuntosJuego([...puntosJuego, punto]);
      setPunto({});
    }
  }, [punto]);

  useEffect(() => {
    console.log(puntosJuego);
  }, [puntosJuego]);

  useEffect(() => {
    if (props.visible) {
      setEquipo(Object.values(props.datos[props.puntoEquipo].jugadores));
      props.puntoEquipo === 0 ? setEquipoRival(Object.values(props.datos[1].jugadores)) : setEquipoRival(Object.values(props.datos[0].jugadores))
    }
  }, [props.visible]);

  function applyPoint(item) {
    setPunto({ ...punto, player: item, team: props.puntoEquipo });
    console.log(equipo);
  }

  return (
    <View style={styles.centeredView}>
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
            {isOpen === false ?
              <>
                <Text style={styles.modalText}>¿Qué ha causado el punto?</Text>
                <FlatList
                  style={styles.pointOptions}
                  data={['Winner', 'Smash', 'Unforced Error']}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity style={styles.pointOptionsItem} onPress={() => {
                      setPunto({ ...punto, point: item }), setTimeout(() => {
                        setIsOpen(true);
                      }, 500);
                    }}>
                      <RadioButton
                      //value={point}
                      //status={puntos === point ? 'checked' : 'unchecked'}
                      // onPress={() => { setPuntos }}
                      /><Text>{item}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => 'key' + index}
                />
              </> : <>
                <Text style={styles.modalText}>¿Quién ha causado el punto?</Text>
                <FlatList
                  style={styles.pointOptions}
                  data={punto.point=="Unforced Error" ? equipoRival : equipo}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity style={styles.pointOptionsItem} onPress={() => {
                      applyPoint(item);
                      setTimeout(() => {
                        props.visibleFunc(false);
                        setIsOpen(false);
                      }, 500);
                    }}>
                      <RadioButton
                        value={item}
                        status={props.nuevoPunto === item ? 'checked' : 'unchecked'}
                        onPress={() => {
                        }}
                      /><Text>{item}</Text >
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => 'key' + index}
                />
              </>}


            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => props.visibleFunc(false)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: 22
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  pointOptions: {
    flexDirection: 'row',
    margin: 20,
  },
  pointOptionsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  button: {
    marginTop: 20,
    borderRadius: 20,
    padding: 10,
    elevation: 2
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
    textAlign: "center"
  },
  modalText: {
    fontSize: 18,
    textAlign: "center"
  }
});

export default PointDetail;
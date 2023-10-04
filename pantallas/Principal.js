import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { Component, useEffect, useMemo, useRef, useState } from "react";
import {
  confirmPasswordReset,
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import AnadirPartida from "../components/Principal/AnadirPartida";
import {
  ActivityIndicator,
  useTheme,
  withTheme,
  Menu,
  Button,
} from "react-native-paper";
import { database } from "../src/config/fb";
import {
  collection,
  query,
  where,
  getDocs,
  listcoll,
  orderBy,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import CartaPartida from "../components/Principal/CartaPartida";
import BorrarPartida from "../components/Principal/BorrarPartida";
const Principal = ({ navigation }) => {
  const [partidas, setPartidas] = useState([]);
  const [isExtended, setIsExtended] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ visible: false, id: 5 });
  const longPress = useRef(false);
  const cancelarBorrar = useRef(false);
  const matchCount = useRef(0);
  const theme = useTheme();
  const auth = getAuth();
  let user;

  BackHandler.addEventListener("hardwareBackPress", () => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();

      BackHandler.exitApp();
    });
  });
  onAuthStateChanged(auth, (usuario) => {
    if (usuario) {
      const uid = usuario.uid;
      user = usuario.uid;
    } else {
      navigation.navigate("login");
    }
  });
  if(auth.currentUser.uid!==null) user = auth.currentUser.uid;

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    if (currentScrollPosition > 30) {
      setIsExtended(false);
    } else {
      setIsExtended(true);
    }
  };

  useEffect(() => {
    const getMatches = async () => {
      const q = query(
        collection(database, "Partidas"),
        where("usuario", "==", user),
        orderBy("creadoEn", 'asc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        matchCount.current=snapshot.size;
        if(snapshot.size==0) setHasLoaded(true);
        snapshot.docChanges().forEach(async (change) => {
          const docId = change.doc.id;
          if (change.type === 'added') {
            let image = change.doc.data().imagenPartida;
            let finished = change.doc.data().partidaTerminada;
            let equipos = change.doc.data().infoequipos;
            let infoSets = change.doc.data().infoSets;
            setPartidas((current) => [
              ...current,
              {infoequipos: equipos, matchId: docId, matchImage: image, isFinished: finished, infoSets: infoSets},
            ]);
          }
           else if (change.type === 'modified') {
            setPartidas((current) => {
              return current.map((partida) => {
                if (partida.matchId === docId) {
                  return {
                    ...partida,
                    isFinished: change.doc.data().partidaTerminada,
                    infoSets: change.doc.data().infoSets,
                  };
                } else {
                  return partida;
                }
              });
            });
          }
           else if (change.type === 'removed') {
            setPartidas((prevDocs) => prevDocs.filter((doc) => doc.matchId !== docId));
          }
        });
      });
      return () => {
        unsubscribe();
      };
    };
    getMatches();
  }, []);

  useEffect(() => {
      if (partidas.length > 0 && partidas.length === matchCount.current) setHasLoaded(true);
  }, [partidas]);

  const deleteMatch = async (id) => {
    console.log(id);
    await deleteDoc(doc(database, `Partidas/${id}`));
  };

  const [finishedAnimation, setFinishedAnimation] = useState(false);

  return (
    <>
      <BorrarPartida
        visible={deleteDialog}
        setVisible={setDeleteDialog}
        borrar={deleteMatch}
        cancelarBorrar={cancelarBorrar}
      />
      <SafeAreaView
        style={[styles.principal, { backgroundColor: theme.colors.background }]}
      >
        {hasLoaded == false ? (
          <ActivityIndicator
            style={{ flex: 1 }}
            size="large"
            animating={true}
          />
        ) : partidas.length === 0 ? (
          <Text style={styles.noMatches}>No hay partidas... Por ahora.</Text>
        ) : (
          <Animated.FlatList
            onScroll={onScroll}
            style={styles.listaPartidas}
            contentContainerStyle={styles.listaPartidasContainer}
            data={partidas}
            renderItem={({ item, index }) => {
              const fadeAnim = new Animated.Value(-400);
              if(!finishedAnimation){
                Animated.timing(fadeAnim, {
                  toValue: 0,
                  delay: index * 500,
                  duration: 600,
                  useNativeDriver: true,
                }).start(() => {
                  if(partidas.length-1 == index) setFinishedAnimation(true);
                });
              }

              return (
              <TouchableOpacity>
                <Animated.View style={{ transform: [{ translateX: fadeAnim }] }}>
                  <CartaPartida
                    partida = {item}
                    infoequipos={item.infoequipos}
                    finished={item.isFinished}
                    image={item.matchImage}
                    infoSets={item.infoSets}
                    matchId = {item.matchId}
                    setDeleteDialog={setDeleteDialog}
                    longPress={longPress}
                    navigation={navigation}
                    cancelarBorrar={cancelarBorrar}
                  />
                </Animated.View>
              </TouchableOpacity>
              )
            }}
            keyExtractor={(item, index) => "key" + index}
          />
        )}
      </SafeAreaView>
      <AnadirPartida
        navigation={navigation}
        user={user}
        isExtended={isExtended}
      />
    </>
  );
};

const styles = StyleSheet.create({
  listaPartidasContainer: {
    overflow: "hidden",
  },

  principal: {
    height: "100%",
    flex: 1,
    alignItems: "center",
  },

  partidaNueva: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    justifyContent: "center",
    margin: 10,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "orange",
    width: "50%",
    height: "25%",
    padding: 10,
    borderRadius: 10,
  },

  partidaNuevaTexto: {
    color: "white",
    fontSize: 20,
  },

  cerrarSesiontext: {
    position: "absolute",
  },

  cerrarSesion: {
    color: "red",
    fontSize: 15,
  },
  partidaAnterior: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    justifyContent: "center",
    margin: 10,
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    width: "80%",
    height: "40%",
    justifyContent: "space-evenly",
    padding: 10,
    borderRadius: 10,
  },

  partidaAnteriorTexto: {
    fontSize: 25,
  },

  noMatches: {
    flex: 1,
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: 20,
    marginTop: 20,
  },

  listaPartidas: {
    width: "100%",
    overflow: "hidden",
  },
});

export default withTheme(Principal);

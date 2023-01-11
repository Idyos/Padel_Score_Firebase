import {
  Text,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
  DatePickerIOS,
  Animated,
  Button
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { Component, useEffect, useRef, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import AnadirPartida from "../components/Principal/AnadirPartida";
import {
  ActivityIndicator,
  useTheme,
  withTheme,
  Menu,
} from "react-native-paper";
import { database } from "../src/config/fb";
import {
  collection,
  query,
  where,
  getDocs,
  listcoll,
  orderBy,
} from "firebase/firestore";
import CartaPartida from "../components/Principal/CartaPartida";
import { Easing } from "react-native-reanimated";
import BorrarPartida from "../components/Principal/BorrarPartida";
import { useClock } from 'react-native-timer-hooks';

const Principal = ({ navigation }) => {
  const [partidas, setPartidas] = useState([]);
  const [isExtended, setIsExtended] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [options, setOptions] = useState(false);
  const [optionsPosition, setOptionsPosition] = useState({ x: 0, y: 0 });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const longPress = useRef(false);

  const theme = useTheme();
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      // ...
    } else {
      navigation.navigate("login");
    }
  });
  const user = auth.currentUser.uid;

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    if (currentScrollPosition > 30) {
      setIsExtended(false);
    } else {
      setIsExtended(true);
    }
  };

  const fadeAnim = useRef(new Animated.Value(-400)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      delay: 500,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    setPartidas([]);
    const getMatches = async () => {
      const q = query(
        collection(database, "Partidas"),
        where("usuario", "==", user),
        orderBy("creadoEn")
      );
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          const q = collection(database, `Partidas/${doc.id}/PartidoCompleto`);
          const querySnapshot = await getDocs(q);
          let equipos = {};
          let sets = {};
          let setsData = [];
          querySnapshot.forEach(async (match) => {
            match.data().infoequipos === undefined
              ? ""
              : (equipos = match.data().infoequipos);
            match.data().set === undefined ? "" : (sets = match.data().set);
            match.data().infoSets === undefined
              ? ""
              : (setsData = match.data().infoSets);
            match.data().set === undefined
              ? ""
              : setPartidas((current) => [
                  ...current,
                  [equipos, doc.id, sets, setsData],
                ]);
          });
          setHasLoaded(true);
        });
      } catch (error) {
        console.log(error);
      } finally {
      }
    };
    getMatches();
  }, []);

  const progress = useRef(new Animated.Value(0)).current;

  const LogOutAnimation = (type) => {
    if (type == true) {
      
        Animated.timing(progress, {
          toValue: 1,
          duration: 900,
          useNativeDriver: false,
          easing: Easing.bezierFn(0.32, -0.01, 0.27, 1),
        }).start();
  
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: false,
        easing: Easing.bezierFn(0.1,  0.2, 0.27, 1),
      }).start();
    }
  };

  const handleLongPress = (e) => {
   console.log("LARGO PRESS");
  };

  const deleteMatch = () => {
    console.log("LA BORRO");
  };
  return (
    <>
     
      <BorrarPartida
        visible={deleteDialog}
        setVisible={setDeleteDialog}
        borrar={deleteMatch}
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
          <FlatList
            onScrollEndDrag={onScroll}
            onScrollBeginDrag={onScroll}
            style={styles.listaPartidas}
            contentContainerStyle={styles.listaPartidasContainer}
            data={partidas}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                delayLongPress={800}
                delayPressIn={150}
                onPressIn={() => {LogOutAnimation(true), setTimeout(() => {
                  longPress.current=true;
                  console.log(longPress);
                }, 100)}}

                onPressOut={() => {LogOutAnimation(false), setTimeout(() => {
                  longPress.current=false;
                  console.log(longPress);
                }, 100)}}
                onLongPress={(e) => {
                  setDeleteDialog(true), handleLongPress(e);
                }}
                onPress={() => longPress.current==false ? navigation.navigate("info-partida", item) : ""}
              >
                <Animated.View style={{ transform: [{ translateX: fadeAnim }]}}>
                  <CartaPartida item={item} animation={progress}/>
                </Animated.View>
              </TouchableOpacity>
            )}
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
    overflow: 'hidden'
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

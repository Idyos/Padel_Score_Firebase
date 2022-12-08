import {
  Text,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  DatePickerIOS,
  SafeAreaView,
} from "react-native";
import React, { Component, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import AnadirPartida from "../components/Principal/AnadirPartida";
import { useTheme } from "react-native-paper";
import { database } from "../src/config/fb";
import {
  collection,
  query,
  where,
  getDocs,
  listcoll,
} from "firebase/firestore";
import CartaPartida from "../components/Principal/CartaPartida";
import Cajillero from "../components/Principal/Cajillero";

const Principal = ({ navigation }) => {
  const [partidas, setPartidas] = useState([]);
  const [isExtended, setIsExtended] = useState(true);


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
  const SalirSesion = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("CHAU");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    if(currentScrollPosition>30){
      setIsExtended(false);
    }
    else{
      setIsExtended(true);
    }
  };



  useEffect(() => {
    setPartidas([]);
    const getMatches = async () => {
      const q = query(
        collection(database, "Partidas"),
        where("usuario", "==", user)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const q = collection(database, `Partidas/${doc.id}/PartidoCompleto`);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((match) => {
          setPartidas((current) => [...current, match.data()]);
        });
      });
    };
    getMatches();
  }, []);

  return (
    <>
    <Cajillero />
      <View
        style={[styles.principal, { backgroundColor: theme.colors.background }]}
      >
        {/*<CartaPartida />*/}
        {partidas.length===0 ? (
          <Text style={styles.noMatches}>No hay partidas... Por ahora.</Text>
        ) : (
          <FlatList
          onScrollEndDrag={onScroll}
          onScrollBeginDrag={onScroll}
            style={styles.listaPartidas}
            contentContainerStyle={styles.listaPartidasContainer}
            data={partidas}
            renderItem={({ item }) => <CartaPartida item={item} />}
            keyExtractor={(item, index) => "key" + index}
          />
        )}

        <Pressable onPress={SalirSesion} style={styles.cerrarSesiontext}>
          <Text style={styles.cerrarSesion}>Cerrar Sesión</Text>
        </Pressable>
      </View>
      <AnadirPartida navigation={navigation} user={user} isExtended={isExtended}/>
    </>
  );
};

const styles = StyleSheet.create({
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
    position: 'absolute',
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
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
  },

  listaPartidas: {
    width: "100%",
  },

  listaPartidasContainer: {
  },
});

export default Principal;
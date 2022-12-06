import { Text, View, StyleSheet, Pressable } from "react-native";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import AnadirPartida from "../components/Principal/AnadirPartida";
import { useTheme } from 'react-native-paper';


const Principal = ({ navigation }) => {
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
  return (
    <>
      <View style={[styles.principal, {backgroundColor: theme.colors.background}]}>
        <Pressable style={styles.partidaAnterior}>
          <FontAwesomeIcon icon={faFloppyDisk} size={80} />
          <Text style={styles.partidaAnteriorTexto}>Partidas Anteriores</Text>
        </Pressable>
        <Pressable onPress={SalirSesion}>
          <Text style={styles.cerrarSesion}>Cerrar Sesión</Text>
        </Pressable>
      </View>
      <AnadirPartida navigation={navigation} user={user} />
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
});

export default Principal;

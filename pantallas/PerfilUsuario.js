import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { database } from "../src/config/fb";
import CartaPartida from "../components/PerfilUsuario/CartaPartida";
import { ActivityIndicator } from "react-native-paper";

const PerfilUsuario = ({ navigation, route, theme }) => {
  const [partidas, setPartidas] = useState([]);
  const matchCount = useRef(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setPartidas([]);
    const getMatches = async () => {
      const q = collection(database, `Usuarios/${route.params.id}/Partidas`);
      try {
        const querySnapshot = await getDocs(q);
        matchCount.current = querySnapshot.size;
        if (querySnapshot.size === 0) setHasLoaded(true);
        if (querySnapshot.size > 0) {
          try {
            querySnapshot.forEach(async (doc) => {
              const docInfo = await getDoc(doc.data().match);
              let image = docInfo.data().imagenPartida;
              let finished = docInfo.data().partidaTerminada;
              const q = collection(
                database,
                `Partidas/${docInfo.id}/PartidoCompleto`
              );
              const query = await getDocs(q);
              let equipos = {};
              let sets = {};
              let normas = {};
              let setsData = [];
              query.forEach(async (match) => {
                match.data().infoequipos === undefined
                  ? ""
                  : (equipos = match.data().infoequipos);
                match.data().normas === undefined
                  ? ""
                  : (normas = match.data().normas);
                match.data().set === undefined ? "" : (sets = match.data().set);
                match.data().infoSets === undefined
                  ? ""
                  : (setsData = match.data().infoSets);

                match.data().set === undefined
                  ? null
                  : setPartidas((current) => [
                      ...current,
                      [
                        equipos,
                        doc.id,
                        sets,
                        setsData,
                        normas,
                        image,
                        finished,
                      ],
                    ]);
                match.data().sets === undefined
                  ? null
                  : setPartidas((current) => [
                      ...current,
                      [
                        equipos,
                        doc.id,
                        sets,
                        setsData,
                        normas,
                        image,
                        finished,
                      ],
                    ]);
              });
            });
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
      }
    };
    getMatches();
  }, []);

  //IMPORTANTE ACTUALIZAR CLOUD FUNCTIONS PARA QUE SE BORRE TAMBIÉN DEL USUARIO UNA PARTIDA CUANDO ESTA SE BORRE
  useEffect(() => {
    setTimeout(() => {
      if (partidas.length === matchCount.current) setHasLoaded(true);
    }, 500);
  }, [partidas]);

  const fadeAnim = useRef(new Animated.Value(-400)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      delay: 500,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <SafeAreaView style={styles.pantalla}>
      {route.params.photoURL === null ? null : route.params.photoURL.startsWith(
          "http"
        ) ? (
        <Image
          style={styles.profilePicture}
          source={{ uri: route.params.photoURL }}
        />
      ) : null}
      <Text style={styles.userName}>{route.params.displayName}</Text>
      {hasLoaded == false ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" animating={true} />
      ) : partidas.length === 0 ? (
        <View style={styles.noMatches}>
          <Text style={{ fontSize: 23, textAlign: "center", paddingHorizontal: 10 }}>
            Este usuario aún no ha jugado ninguna partida.
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.listaPartidas}
          contentContainerStyle={styles.listaPartidasContainer}
          data={partidas}
          renderItem={({ item, index }) => (
            <TouchableOpacity>
              <Animated.View style={{ transform: [{ translateX: fadeAnim }] }}>
                <CartaPartida item={item} navigation={navigation} />
              </Animated.View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => "key" + index}
        />
      )}
    </SafeAreaView>
  );
};

export default PerfilUsuario;

const styles = StyleSheet.create({
  pantalla: {
    position: "relative",
    height: "100%",
    //alignItems: "center",
  },

  profilePicture: {
    width: "100%",
    height: "50%",
    resizeMode: "cover",
  },

  userName: {
    fontWeight: "900",
    fontSize: 40,
    textAlign: "left",
  },

  noMatches: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  listaPartidas: {
    width: "100%",
    overflow: "hidden",
  },

  listaPartidasContainer: {
    overflow: "hidden",
  },
});

import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  FlatList,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Surface } from "react-native-paper";
import { Chip, Text } from "react-native-paper";
import { withTheme } from "react-native-paper"; 
import { Easing } from "react-native-reanimated";
import { LinearGradient } from 'expo-linear-gradient';



const windowHeight = Dimensions.get("window").height;

const CartaPartida = ({partida, infoequipos, finished, imagePartida, infoSets, matchId, theme, setDeleteDialog, longPress, navigation, cancelarBorrar }) => {

  const [logout, setLogout] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    
    if (logout == true && cancelarBorrar.current==false) {

      Animated.timing(progress, {
        toValue: 1,
        duration: 900,
        useNativeDriver: false,
        easing: Easing.bezierFn(0.32, -0.01, 0.27, 1),
      }).start(({ finished }) => {
        console.log(finished);
        if(finished==false){
          Animated.timing(progress, {
            toValue: 0,
            duration: 900,
            useNativeDriver: false,
            easing: Easing.bezierFn(0.32, -0.01, 0.27, 1),
          }).start();
               
        }
      });
    } else {
      Animated.timing(progress).stop();
    }
    if(cancelarBorrar.current==true){
      cancelarBorrar.current=false;
      console.log("hola");
      Animated.timing(progress, {
        toValue: 0,
        duration: 900,
        useNativeDriver: false,
        easing: Easing.bezierFn(0.32, -0.01, 0.27, 1),
      }).start();
     
    }

  }, [logout, cancelarBorrar.current])

  return (
    <TouchableOpacity
      delayLongPress={800}
      delayPressIn={150}
      onPressIn={() => {
        setLogout(true), setTimeout(() => {
          longPress.current = true;
        }, 100)
      }}

      onPressOut={() => {
        setLogout(false), setTimeout(() => {
          longPress.current = false;
        }, 100)
      }}
      onLongPress={() => {setDeleteDialog({visible: true, id: matchId})}}
      onPress={() => longPress.current == false ? navigation.navigate("info-partida", partida) : ""}
    >
      <Surface
        style={[
          styles.partidaInfo,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
        elevation={1}
      >
        <View style={imagePartida!==undefined ? {backgroundColor: theme.colors.primaryContainer, borderRadius: 1000, paddingHorizontal: 10, paddingVertical: 4, opacity: 0.8} : null}>
          <Text style={[styles.title, { color: theme.colors.primary}]}>
            {infoequipos === undefined ? "" : infoequipos.equipo1.nombre} /{" "}
            {infoequipos === undefined ? "" : infoequipos.equipo2.nombre}
          </Text>
        </View>
        
        <View style={styles.partidaDetalles}>
          <View style={styles.setContainer}>
            <FlatList
              style={{ flexDirection: "row" }}
              data={infoSets}
              renderItem={({ item }) => (
                <View style={styles.set}>
                  <Text style={{ color: theme.colors.primary }}>
                    {item.equipo1}
                  </Text>
                  <Text style={{ color: theme.colors.primary }}>
                    {item.equipo2}
                  </Text>
                </View>
              )}
            />
          </View>
          <FlatList
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
            data={Object.getOwnPropertyNames(infoequipos)}
            renderItem={({ item, index }) => (
              <View>
                <Text
                  style={
                    index == 1
                      ? { textAlign: "right", color: theme.colors.primary }
                      : { textAlign: "auto", color: theme.colors.primary }
                  }
                >
                  {infoequipos[item].jugadores.jugador1.nombre}
                </Text>
                <Text
                  style={
                    index == 1
                      ? { textAlign: "right", color: theme.colors.primary }
                      : { textAlign: "auto", color: theme.colors.primary }
                  }
                >
                  {infoequipos[item].jugadores.jugador2.nombre}
                </Text>
              </View>
            )}
            listKey={(item, index) => index.toString()}
          />
          
        </View>
        {finished ? (
          ""
        ) : (
          <Chip
            elevated={true}
            elevation={1}
            style={styles.partidoNoTerminado}
            textStyle={{ color: theme.colors.onErrorContainer }}
            icon="alert-circle-outline"
          >
            Este partido no se ha terminado.
          </Chip>
        )}
        <Animated.View
          style={[
            styles.barraDeCarga,
            {
              backgroundColor: theme.colors.error,
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "117%"],
              }),
            },
          ]}
        ></Animated.View>
        <LinearGradient locations={[0, 0.7]} colors={['transparent', theme.colors.primaryContainer]} style={{bottom: -1, width: "200%", height: "60%", position: 'absolute', zIndex: -1}}></LinearGradient>
         {imagePartida!==undefined ? <Image source={{uri: imagePartida}} style={styles.image}/> : null}
      </Surface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  barraDeCarga: {
    padding: 0,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "10%",
    height: "138.5%",
    zIndex: -1,
    left: 0,
    bottom: 0,
    top: 0,
    borderRadius: 15,
  },

  image: {
    position: 'absolute',
    width: "120%",
    height: "140%",
    left: 0,
    top: 0,
    zIndex: -2,
  },

  partidaInfo: {
    position: 'relative',
    overflow: "hidden",
    justifyContent: "space-between",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    borderRadius: 15,
    alignItems: "center",
    transform: [{ translateX: 8 }],
    padding: 25,
    width: "95%",
    height: windowHeight / 4,
  },
  title: {
    fontSize: 20,
  },
  partidaDetalles: {
    position: "relative",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  partidoNoTerminado: {
    alignSelf: "flex-end",
    marginBottom: -15,
    marginRight: -15,
    marginTop: -15,
    height: "30%",
  },

  setContainer: {
    flexDirection: "row",
    position: "absolute",
    left: 0,
    right: 0,
    justifyContent: "center",
  },

  set: {
    marginHorizontal: 3,
  },
});

export default withTheme(CartaPartida);

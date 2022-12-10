import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { database } from "../src/config/fb";
import {
  collection,
  query,
  where,
  doc,
  getDocs,
  listcoll,
} from "firebase/firestore";
import { Divider, SegmentedButtons } from "react-native-paper";


const GraficoInfo = () => {
  return (
    <View style={styles.Graficos}>
    <View style={styles.grafico}>
      <View style={styles.graficoInfo}>
        <Text>5</Text>
        <Text>Winners</Text>
        <Text>15</Text>
      </View>
      <View style={styles.grafico1}>
        <View style={styles.grafico11}></View>
      </View>
      <View style={styles.grafico2}></View>
    </View>
  </View>
  )
}


const InfoPartida = ({ route }) => {
  console.log(route.params);
  const [matchInfoGeneral, setMatchInfoGeneral] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    const getMatches = async () => {
      const q = collection(
        database,
        `Partidas/${route.params}/PartidoCompleto`
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((match) => {
        setMatchInfoGeneral(match.data());
      });
    };
    getMatches();
  }, []);

  console.log(matchInfoGeneral.infoequipos);

  return (
    <View style={styles.pantalla}>
      <View style={styles.setsInfo}>
        <View style={[styles.team, { justifyContent: "space-around" }]}>
          <Text>Players:</Text>
          <Text>Score</Text>
        </View>
        <Divider bold={true} />
        <View style={styles.team}>
          <View>
            <Text>
              {matchInfoGeneral === ""
                ? ""
                : matchInfoGeneral.infoequipos.equipo1.jugadores.jugador1
                    .nombre}
            </Text>
            <Text>
              {matchInfoGeneral === ""
                ? ""
                : matchInfoGeneral.infoequipos.equipo1.jugadores.jugador2
                    .nombre}
            </Text>
          </View>
          <View style={styles.setsPerTeam}>
            <Text>HOLAAA</Text>
          </View>
        </View>
        <View style={styles.team}>
          <View>
            <Text>
              {matchInfoGeneral === ""
                ? ""
                : matchInfoGeneral.infoequipos.equipo2.jugadores.jugador1
                    .nombre}
            </Text>
            <Text>
              {matchInfoGeneral === ""
                ? ""
                : matchInfoGeneral.infoequipos.equipo2.jugadores.jugador2
                    .nombre}
            </Text>
          </View>
          <View style={styles.setsPerTeam}>
            <Text>HOLAAA</Text>
          </View>
        </View>
      </View>
      <SafeAreaView style={styles.container}>
        <SegmentedButtons
          showSelectedCheck={false}
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: "partida",
              label: "Partida",
            },
            {
              value: "set1",
              label: "Set 1",
            },
            { value: "set2", label: "Set 2" },
            { value: "set3", label: "Set 3" },
          ]}
        />
      </SafeAreaView>
      <View style={styles.infoPorSets}>
        <View style={styles.team}>
          <View>
          <Text>
            {matchInfoGeneral === ""
              ? ""
              : matchInfoGeneral.infoequipos.equipo1.jugadores.jugador1.nombre}
          </Text>
          <Text>
            {matchInfoGeneral === ""
              ? ""
              : matchInfoGeneral.infoequipos.equipo1.jugadores.jugador2.nombre}
          </Text>
        </View>
        </View>
        <View style={styles.setsPerTeam}>
          <Text>HOLAAA</Text>
        </View>

        <View style={styles.team}>
          <View>
          <Text style={{textAlign: 'right'}}>
            {matchInfoGeneral === ""
              ? ""
              : matchInfoGeneral.infoequipos.equipo2.jugadores.jugador1.nombre}
          </Text>
          <Text style={{textAlign: 'right'}}>
            {matchInfoGeneral === ""
              ? ""
              : matchInfoGeneral.infoequipos.equipo2.jugadores.jugador2.nombre}
          </Text>
          </View>
        </View>
      </View>
   <GraficoInfo />
   <GraficoInfo />
   <GraficoInfo />
   <GraficoInfo />
   <GraficoInfo />
    </View>
  );
};

export default InfoPartida;

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    height: "100%",
  },

  setsInfo: {
    flexDirection: "column",
  },

  container: {
    padding: 20,
    alignItems: "center",
  },
  team: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  infoPorSets: {
    alignSelf: 'center',
    width: "85%",
    alignItems: 'center',
    flexDirection: "row",
    justifyContent: "space-between",
  },
  Graficos: {
    marginVertical: 5,
    alignSelf: "center",
    justifyContent: "space-between",
    width: "80%",
    flexDirection: "column",
  },

  graficoInfo: {
    zIndex: 1,
    width: "100%",
    alignSelf: "center",
    justifyContent: "space-between",
    flexDirection: 'row',
  },
  grafico: {
    alignItems: "center",
    height: 30,
    width: "100%",
    position: "relative",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  grafico1: {
    transform: [{ rotateY: "180deg" }],
    position: "absolute",
    height: "100%",
    width: "50%",
  },
  grafico11: {
    marginLeft: 2,
    borderTopEndRadius: 7,
    borderBottomEndRadius: 7,
    width: "50%",
    height: "100%",
    backgroundColor: "green",
  },
  grafico2: {
    marginLeft: 2,
    borderTopEndRadius: 7,
    borderBottomEndRadius: 7,
    left: "50%",
    position: "absolute",
    height: "100%",
    width: "20%",
    backgroundColor: "orange",
  },
});

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  BackHandler,
} from "react-native";
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

const GraficoInfo = ({ matchData, matchFunc, match, value, setsLength }) => {
  const infoMatchEquipo1 = matchData.params[0].equipo1.jugadores;
  const infoMatchEquipo2 = matchData.params[0].equipo2.jugadores;
  const infoSets = matchData.params[2];

  useEffect(() => {
    console.log(value);
    if (value == 0) {
      matchFunc([
        {
          name: "Winners",
          equipo1:
            infoMatchEquipo1.jugador1.winners +
            infoMatchEquipo1.jugador2.winners,

          equipo2:
            infoMatchEquipo2.jugador1.winners +
            infoMatchEquipo2.jugador2.winners,
        },
        {
          name: "Smashes",
          equipo1:
            infoMatchEquipo1.jugador1.smashesExito +
            infoMatchEquipo1.jugador2.smashesExito,

          equipo2:
            infoMatchEquipo2.jugador1.smashesExito +
            infoMatchEquipo2.jugador2.smashesExito,
        },
        {
          name: "Unforced Errors",
          equipo1:
            infoMatchEquipo1.jugador1.unfError +
            infoMatchEquipo1.jugador2.unfError,

          equipo2:
            infoMatchEquipo2.jugador1.unfError +
            infoMatchEquipo2.jugador2.unfError,
        },
      ]);
    }
    if (value == 1) {
      matchFunc([
        {
          name: "Winners",
          equipo1:
            infoSets.set1.equipo1.jugador1.winners +
            infoSets.set1.equipo1.jugador2.winners,

          equipo2:
            infoSets.set1.equipo2.jugador1.winners +
            infoSets.set1.equipo2.jugador2.winners,
        },
        {
          name: "Smashes",
          equipo1:
            infoSets.set1.equipo1.jugador1.smashesExito +
            infoSets.set1.equipo1.jugador2.smashesExito,

          equipo2:
            infoSets.set1.equipo2.jugador1.smashesExito +
            infoSets.set1.equipo2.jugador2.smashesExito,
        },
        {
          name: "Unforced Errors",
          equipo1:
            infoSets.set1.equipo1.jugador1.unfError +
            infoSets.set1.equipo1.jugador2.unfError,

          equipo2:
            infoSets.set1.equipo2.jugador1.unfError +
            infoSets.set1.equipo2.jugador2.unfError,
        },
      ]);
    }
    if (value == 2) {
      matchFunc([
        {
          name: "Winners",
          equipo1:
            (infoSets.set2.equipo1.jugador1.winners +
            infoSets.set2.equipo1.jugador2.winners) -
            (infoSets.set1.equipo1.jugador1.winners +
              infoSets.set1.equipo1.jugador2.winners),

          equipo2:
          (infoSets.set2.equipo2.jugador1.winners +
            infoSets.set2.equipo2.jugador2.winners) -
            (infoSets.set1.equipo2.jugador1.winners +
              infoSets.set1.equipo2.jugador2.winners),
        },
        {
          name: "Smashes",
          equipo1:
          (infoSets.set2.equipo1.jugador1.smashesExito +
            infoSets.set2.equipo1.jugador2.smashesExito) -
            (infoSets.set1.equipo1.jugador1.smashesExito +
              infoSets.set1.equipo1.jugador2.smashesExito),

          equipo2:
          (infoSets.set2.equipo2.jugador1.smashesExito +
            infoSets.set2.equipo2.jugador2.smashesExito) -
            (infoSets.set1.equipo2.jugador1.smashesExito +
              infoSets.set1.equipo2.jugador2.smashesExito),
        },
        {
          name: "Unforced Errors",
          equipo1:
          (infoSets.set2.equipo1.jugador1.unfError +
            infoSets.set2.equipo1.jugador2.unfError) -
            (infoSets.set1.equipo1.jugador1.unfError +
              infoSets.set1.equipo1.jugador2.unfError),

          equipo2:
          (infoSets.set2.equipo2.jugador1.unfError +
            infoSets.set2.equipo2.jugador2.unfError) -
            (infoSets.set1.equipo2.jugador1.unfError +
              infoSets.set1.equipo2.jugador2.unfError),
        },
      ]);
    }
  }, [value]);
  return (
    <FlatList
      data={match}
      renderItem={({ item }) => (
        <View style={styles.Graficos}>
          <View style={styles.grafico}>
            <View style={styles.graficoInfo}>
              <Text style={{ marginLeft: 6 }}>{item.equipo1}</Text>
              <Text>{item.name}</Text>
              <Text style={{ marginRight: 6 }}>{item.equipo2}</Text>
            </View>
            <View style={styles.grafico1}>
              <View
                style={{
                  marginLeft: 1,
                  borderTopEndRadius: 7,
                  borderBottomEndRadius: 7,
                  width: `${
                    (item.equipo1 * 100) / (item.equipo1 + item.equipo2)
                  }%`,
                  height: "100%",
                  backgroundColor: "green",
                }}
              ></View>
            </View>
            <View style={styles.grafico2}>
              <View
                style={{
                  marginLeft: 1,
                  borderTopEndRadius: 7,
                  borderBottomEndRadius: 7,
                  height: "100%",
                  width: `${
                    (item.equipo2 * 100) / (item.equipo1 + item.equipo2)
                  }%`,
                  backgroundColor: "orange",
                }}
              ></View>
            </View>
          </View>
        </View>
      )}
      keyExtractor={(item, index) => "key" + index}
    />
  );
};

const InfoPartida = ({ route }) => {
  const infoTeam = route.params[0];
  const infoSets = route.params[2];
  const [setsResults, setSetsResults] = useState([
    { value: "0", label: "Partida" },
  ]);

  useEffect(() => {
    if (setsResults.length === 1) {
      Object.keys(infoSets).map((item, index) => {
        setSetsResults((current) => [
          ...current,
          {
            value: `${index + 1}`,
            label: `Set ${index + 1}`,
          },
        ]);
      });
    }
  }, []);

  const [infoMatch, setInfoMatch] = useState([]);
  const [value, setValue] = useState("0");

console.log(Object.keys(infoSets));

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
            <Text>{infoTeam.equipo1.jugadores.jugador1.nombre}</Text>
            <Text>{infoTeam.equipo1.jugadores.jugador2.nombre}</Text>
          </View>
          <View style={styles.setsPerTeam}>
          <View>
            <FlatList 
            contentContainerStyle={styles.setsPerTeam}
            data={Object.keys(infoSets)}
            renderItem={({ item }) => <Text style={styles.setResult}>{infoSets[item].equipo1.games}</Text>}
            />
          </View>
          </View>
        </View>
        <View style={styles.team}>
          <View>
            <Text>{infoTeam.equipo2.jugadores.jugador1.nombre}</Text>
            <Text>{infoTeam.equipo2.jugadores.jugador2.nombre}</Text>
          </View>
          <View>
            <FlatList 
            contentContainerStyle={styles.setsPerTeam}
            data={Object.keys(infoSets)}
            renderItem={({ item }) => <Text style={styles.setResult}>{infoSets[item].equipo2.games}</Text>}
            />
          </View>
        </View>
      </View>
      <SafeAreaView style={styles.container}>
        <SegmentedButtons
          showSelectedCheck={false}
          value={value}
          onValueChange={setValue}
          buttons={setsResults}
        />
      </SafeAreaView>
      <View style={styles.infoPorSets}>
        <View style={styles.team}>
          <View>
            <Text>{infoTeam.equipo1.jugadores.jugador1.nombre}</Text>
            <Text>{infoTeam.equipo1.jugadores.jugador2.nombre}</Text>
          </View>
        </View>
        <View style={styles.setsPerTeam}>
          <Text> 
          <FlatList 
            contentContainerStyle={styles.setsPerTeam}
            data={Object.keys(infoSets)}
            renderItem={({ item }) => <Text style={styles.setResult}>{infoSets[item].equipo1.games}-{infoSets[item].equipo2.games}</Text>}
            />
          </Text>
        </View>

        <View style={styles.team}>
          <View>
            <Text style={{ textAlign: "right" }}>
              {infoTeam.equipo2.jugadores.jugador1.nombre}
            </Text>
            <Text style={{ textAlign: "right" }}>
              {infoTeam.equipo2.jugadores.jugador2.nombre}
            </Text>
          </View>
        </View>
      </View>
      <GraficoInfo
        matchData={route}
        matchFunc={setInfoMatch}
        match={infoMatch}
        value={value}
        setsLength={setsResults.length}
      />
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
    alignSelf: "center",
    width: "85%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  setsPerTeam: {
    flexDirection: "row",
  },

  setResult: {
    marginHorizontal: 3,
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
    flexDirection: "row",
  },
  grafico: {
    alignSelf: "center",

    alignItems: "center",
    height: 30,
    width: "110%",
    position: "relative",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  grafico1: {
    borderEndWidth: 1,
    borderRadius: 7,
    transform: [{ rotateY: "180deg" }],
    position: "absolute",
    height: "100%",
    width: "50%",
  },

  grafico2: {
    borderEndWidth: 1,
    borderRadius: 7,
    left: "50%",
    position: "absolute",
    height: "100%",
    width: "50%",
  },
});

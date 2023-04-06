import {
  StyleSheet,
  View,
  FlatList,
  BackHandler,
  Animated,
  ScrollView,
  Share
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Chip,
  DataTable,
  Divider,
  IconButton,
  Menu,
  SegmentedButtons,
  Text,
  withTheme,
} from "react-native-paper";
import { Easing } from "react-native-reanimated";
import GraficoInfo from "../components/InfoPartida/GraficosDatos";
import SetsDetalles from "../components/InfoPartida/SetsDetalles";
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
} from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';

const shareMatch = async (id) => {
  try {
    const result = await Share.share({
      message:
        `https://contadorpadel.online/?matchId=${id}`,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    Alert.alert(error.message);
  }
}
const InfoPartida = ({ route, theme }) => {
  const navigation = useNavigation();
  const infoTeam = route.params[0];
  const id = route.params[1];
  const infoSets = route.params[2];
  const sets = route.params[3];
  const normas = route.params[4];
  const [setsResults, setSetsResults] = useState([{ value: "0", label: "Partida" },]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [setData, setSetData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [dataType, setDataType] = useState(false);
  const [tipoJugadores, setTipoJugadores] = useState(false);
  const [visibleShare, setVisibleShare] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu
        visible={visibleShare}
        onDismiss={() => setVisibleShare(false)}
        anchor={
          <IconButton
            icon="share"
            size={30}
            onPress={() => {shareMatch(id), setVisibleShare(!visibleShare)}}
          />
        }
      >
        <Menu.Item
          trailingIcon="share"
          onPress={() => {
            shareMatch(id); setVisibleShare(false);
          }}
          title="Compartir"
        />
      </Menu>
      ),
    });
  }, []);

  console.log(visibleShare);

  useEffect(() => {
    if (setsResults.length === 1 && normas.aTiempo === false) {
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

  //OBTENER INFORMACIÓN DE LOS SETS EN DETALLE

  const [gamesOnSet, setGamesOnSet] = useState([]);

  const getSetsData = async () => {
    for(let i = 1; i<= sets.length; i++){
      console.log(i);
      const gamesOnSetRef = collection(
        database,
        `/Partidas/${id}/PartidoCompleto/Matchdetails/Set${i}`
      );
      const q = query(gamesOnSetRef, orderBy("order"));
      const gamesOnSet = await getDocs(q);
      let gamesOnSetArray = [];
    //console.log(gamesOnSet.length);
    gamesOnSet.forEach((doc) => {
      gamesOnSetArray.push(doc.data());
    });
    setGamesOnSet((prevVer) => [...prevVer, gamesOnSetArray]);
    }
    setIsLoaded(true);
  };


  useEffect(() => {
    getSetsData();
  }, []);

  return !isLoaded ? (
    <ActivityIndicator />

  ) : (
    <ScrollView
      style={[styles.pantalla, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.setsInfo}>
        <View style={[styles.team, { justifyContent: "space-between" }]}>
          <Text>Players:</Text>
          <Text>Score</Text>
        </View>
        <Divider bold={true} />
        <View style={[styles.team, { width: "76%" }]}>
          <View>
            <Text>{infoTeam.equipo1.jugadores.jugador1.nombre}</Text>
            <Text>{infoTeam.equipo1.jugadores.jugador2.nombre}</Text>
          </View>
          <View style={styles.setsPerTeam}>
            <View>
              <FlatList
                contentContainerStyle={styles.setsPerTeam}
                data={sets}
                renderItem={({ item }) => (
                  <Text style={styles.setResult}>{item.equipo1}</Text>
                )}
              />
            </View>
          </View>
        </View>
        <View style={[styles.team, { width: "76%" }]}>
          <View>
            <Text>{infoTeam.equipo2.jugadores.jugador1.nombre}</Text>
            <Text>{infoTeam.equipo2.jugadores.jugador2.nombre}</Text>
          </View>
          <View>
            <FlatList
              contentContainerStyle={styles.setsPerTeam}
              data={sets}
              renderItem={({ item }) => (
                <Text style={styles.setResult}>{item.equipo2}</Text>
              )}
            />
          </View>
        </View>
      </View>
      <SafeAreaView style={styles.container}>
        {normas.aTiempo === false ? (
          <SegmentedButtons
            style={{}}
            showSelectedCheck={false}
            value={value}
            onValueChange={setValue}
            buttons={setsResults}
          />
        ) : (
          <View
            style={{
              width: "100%",
              borderWidth: 1,
              alignItems: "center",
              paddingVertical: 10,
              borderRadius: 100,
              backgroundColor: theme.colors.primaryContainer,
              borderColor: theme.colors.outline,
            }}
          >
            <Text style={{ fontWeight: "700" }}>Partida</Text>
          </View>
        )}
      </SafeAreaView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          marginHorizontal: 15,
        }}
      >
        {dataType == false ? (
          ""
        ) : (
          <View style={{ flexDirection: "row" }}>
            <Chip
              style={styles.chipJugadores}
              showSelectedOverlay={true}
              selected={tipoJugadores == true ? true : false}
              compact={true}
              onPress={() => setTipoJugadores(true)}
            >
              De Revés
            </Chip>
            <Chip
              style={styles.chipJugadores}
              showSelectedOverlay={true}
              selected={tipoJugadores == false ? true : false}
              compact={true}
              onPress={() => setTipoJugadores(false)}
            >
              De Drive
            </Chip>
          </View>
        )}

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>Ordenar Por: </Text>
          <Menu
            visible={visible}
            onDismiss={() => setVisible(false)}
            anchor={
              <IconButton
                icon="order-bool-descending"
                size={20}
                onPress={() => setVisible(true)}
              />
            }
          >
            <Menu.Item
              trailingIcon="account-group"
              onPress={() => {
                setDataType(false), setVisible(false);
              }}
              title="Equipos"
            />
            <Menu.Item
              trailingIcon="account"
              onPress={() => {
                setDataType(true), setVisible(false);
              }}
              title="Jugadores"
            />
          </Menu>
        </View>
      </View>
      <View
        style={[
          styles.infoPorSets,
          dataType == true
            ? { marginTop: 15, marginBottom: 20 }
            : { marginTop: 7, marginBottom: 20 },
        ]}
      >
        <View style={styles.teamUnder}>
          {dataType == false ? (
            <View>
              <Text>{infoTeam.equipo1.jugadores.jugador1.nombre}</Text>
              <Text>{infoTeam.equipo1.jugadores.jugador2.nombre}</Text>
            </View>
          ) : tipoJugadores == false ? (
            infoTeam.equipo1.position == false ? (
              <Text>{infoTeam.equipo1.jugadores.jugador2.nombre}</Text>
            ) : (
              <Text>{infoTeam.equipo1.jugadores.jugador1.nombre}</Text>
            )
          ) : infoTeam.equipo1.position == true ? (
            <Text>{infoTeam.equipo1.jugadores.jugador2.nombre}</Text>
          ) : (
            <Text>{infoTeam.equipo1.jugadores.jugador1.nombre}</Text>
          )}
        </View>
        <View style={styles.setsPerTeam}>
          <Text>
            <FlatList
              contentContainerStyle={styles.setsPerTeam}
              data={sets}
              renderItem={({ item }) => (
                <Text style={styles.setResult}>
                  {item.equipo1}-{item.equipo2}
                </Text>
              )}
            />
          </Text>
        </View>

        <View style={styles.teamUnder}>
          {dataType == false ? (
            <View>
              <Text>{infoTeam.equipo2.jugadores.jugador1.nombre}</Text>
              <Text>{infoTeam.equipo2.jugadores.jugador2.nombre}</Text>
            </View>
          ) : tipoJugadores == false ? (
            infoTeam.equipo2.position == false ? (
              <Text>{infoTeam.equipo2.jugadores.jugador2.nombre}</Text>
            ) : (
              <Text>{infoTeam.equipo2.jugadores.jugador1.nombre}</Text>
            )
          ) : infoTeam.equipo2.position == true ? (
            <Text>{infoTeam.equipo2.jugadores.jugador2.nombre}</Text>
          ) : (
            <Text>{infoTeam.equipo2.jugadores.jugador1.nombre}</Text>
          )}
        </View>
      </View>
      <GraficoInfo
        matchData={route}
        matchFunc={setInfoMatch}
        match={infoMatch}
        value={value}
        sets={setsResults}
        setSetData={setSetData}
        setData={setData}
        tipoJugadores={tipoJugadores}
        dataType={dataType}
      />
    <SetsDetalles
        value={value}
        gamesOnSet={gamesOnSet}
        sets={setsResults}
        match={infoMatch}
        id={route.params[1]}
        setsLength={infoSets}
        infoTeam={infoTeam}
      />
    </ScrollView>
  );
};

export default withTheme(InfoPartida);

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    height: "10%",
  },

  setsInfo: {
    justifyContent: "space-around",
    flexDirection: "column",
  },

  chipJugadores: {
    marginHorizontal: 5,
    borderRadius: 30,
    height: "80%",
  },

  container: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  team: {
    alignSelf: "center",
    width: "80%",
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  teamUnder: {
    //marginBottom: 15,
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoPorSets: {
    alignSelf: "center",
    width: "90%",
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
    height: 35,
    width: "110%",
    position: "relative",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  grafico1: {
    borderEndWidth: 2,
    borderRadius: 30,
    transform: [{ rotateY: "180deg" }],
    position: "absolute",
    height: "100%",
    width: "50%",
  },

  grafico2: {
    borderEndWidth: 2,
    borderRadius: 30,
    left: "50%",
    position: "absolute",
    height: "100%",
    width: "50%",
  },
});

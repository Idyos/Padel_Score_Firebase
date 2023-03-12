import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useRef } from "react";
import { ActivityIndicator, DataTable } from "react-native-paper";
import { useEffect, useState } from "react";
import JuegoDetalles from "./JuegoDetalles";
import { database } from "../../src/config/fb";
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

const optionsPerPage = [2, 3, 4];

const SetsDetalles = (props) => {
  const set = props.value;
  const matchId = props.id;
  const juegoNum = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
  const [pointsOnGame, setPointsOnGame] = useState([]);

  const gamesOnSetTeam1 = useRef(0);
  const gamesOnSetTeam2 = useRef(0);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  useEffect(() => {
    if(set==0) setIsVisible(false);
  }, [set])

  const getPuntosJuego = async (juego) => {
    juegoNum.current=juego;
    if(!isVisible) setIsVisible(true); 
    setIsLoaded(false);
    setPointsOnGame([]);
      const pointsOnGameRef = collection(
        database,
        `/Partidas/${matchId}/PartidoCompleto/Matchdetails/Set${set}/Juego${juego}/Puntos`
      );
      // const q = query(pointsOnGameRef, orderBy("order"));
      const pointsOnGameDoc = await getDocs(pointsOnGameRef);
      let pointsOnGameArray = [];
    pointsOnGameDoc.forEach((doc) => {
      pointsOnGameArray.push(doc.data());
      
    });
    
    setPointsOnGame((prevVer) => [...prevVer, pointsOnGameArray]);
    setIsLoaded(true);
  }

  gamesOnSetTeam1.current = 0;
  gamesOnSetTeam2.current = 0;

  return props.value == "0" ? (
    ""
  ) : (
    <>
    <DataTable style={{ alignSelf: "center", width: "100%" }}>
      <DataTable.Header>
        <DataTable.Title>{props.infoTeam.equipo1.nombre}</DataTable.Title>
      </DataTable.Header>

      <DataTable.Row>
        {props.gamesOnSet[props.value - 1].map((element, index) => {
          if (element.winner == "equipo1") gamesOnSetTeam1.current++;
          return (
            <DataTable.Cell
              disabled={element.winner == "equipo1" ? false : true}
              style={{ justifyContent: "center" }}
              key={index}
              numeric
              onPress={() => getPuntosJuego(index+1)}
              textStyle={
                element.winner == "equipo1" ? styles.wonGame : styles.lostGame
              }
            >
              {gamesOnSetTeam1.current}
            </DataTable.Cell>
          );
        })}
      </DataTable.Row>
      <DataTable.Header>
        <DataTable.Title>{props.infoTeam.equipo2.nombre}</DataTable.Title>
      </DataTable.Header>
      <DataTable.Row style={{ justifyContent: "flex-start" }}>
        {props.gamesOnSet[props.value - 1].map((element, index) => {
          if (element.winner == "equipo2") gamesOnSetTeam2.current++;
          return (
            <DataTable.Cell
              disabled={element.winner == "equipo2" ? false : true}
              style={{ justifyContent: "center" }}
              key={index}
              numeric
              onPress={() => getPuntosJuego(index+1)}
              textStyle={
                element.winner == "equipo2" ? styles.wonGame : styles.lostGame
              }
            >
              {gamesOnSetTeam2.current}
            </DataTable.Cell>
          );
        })}
      </DataTable.Row>
    </DataTable>
    <JuegoDetalles 
    E1={props.infoTeam.equipo1.nombre}
    E2={props.infoTeam.equipo2.nombre}
    juego={juegoNum.current}
    isVisible={isVisible}
    isLoaded={isLoaded}
    pointsOnGame={pointsOnGame}
    />
    </>
  );
};

export default SetsDetalles;

const styles = StyleSheet.create({
  wonGame: {
    color: "black",
  },
  lostGame: {
    opacity: 0.2,
  },
});

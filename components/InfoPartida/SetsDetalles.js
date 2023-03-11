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
import { ScrollView } from "react-native";
import JuegoDetalles from "./JuegoDetalles";

const optionsPerPage = [2, 3, 4];

const SetsDetalles = (props) => {
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
  const gamesOnSetTeam1 = useRef(0);
  const gamesOnSetTeam2 = useRef(0);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

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
              onPress={() => console.log("UGUUUUU")}
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
              onPress={() => console.log("Aaaaaa")}
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
    <JuegoDetalles />
    </>
  );
};

export default SetsDetalles;

const styles = StyleSheet.create({
  wonGame: {
    color: "black",
  },
  lostGame: {
    display: "none",
    opacity: 0,
  },
});

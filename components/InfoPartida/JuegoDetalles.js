import { StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import { ActivityIndicator, DataTable } from "react-native-paper";
import PuntoDetalles from "./PuntoDetalles";
import { UserInterfaceIdiom } from "expo-constants";

const JuegoDetalles = ({
  teams,
  juego,
  isVisible,
  isLoaded,
  pointsOnGame,
}) => {
  const [SelectedPoint, setSelectedPoint] = useState(undefined);
  const pointsOnGameTeam1 = useRef(0);
  const pointsOnGameTeam2 = useRef(0);
  const isPointDetailVisible = useRef(false);
  pointsOnGameTeam1.current = 0;
  pointsOnGameTeam2.current = 0;

  const ScoreCorrecto = (team) => {
    
    if(team==0){
      switch (pointsOnGameTeam1.current) {
        case 0:
          pointsOnGameTeam1.current = 15;
          break;
          case 15:
          pointsOnGameTeam1.current = 30;
          break;
          case 30:
          pointsOnGameTeam1.current = 40;
          break;
          case 40:
          pointsOnGameTeam1.current = "Win";
          break;
        }
       
    }
   
    if(team==1){
     
      switch (pointsOnGameTeam2.current) {
        case 0:
          pointsOnGameTeam2.current = 15;
          break;
        case 15:
          pointsOnGameTeam2.current = 30;
          break;
        case 30:
          pointsOnGameTeam2.current = 40;
          break; 
        case 40:
          pointsOnGameTeam1.current="";  
        pointsOnGameTeam2.current = "Win";
          
          break;
      }
    }
    
  };

  return !isVisible ? (
    ""
  ) : !isLoaded ? (
    <ActivityIndicator />
  ) : (
    <>
      <Text>Juego {juego}</Text>
      <DataTable style={{ alignSelf: "center", width: "100%" }}>
        <DataTable.Header>
          <DataTable.Title>{teams.equipo1.nombre}</DataTable.Title>
        </DataTable.Header>
        <DataTable.Row>
          {pointsOnGame[0].map((element, index) => {
            if (element.team == "0") ScoreCorrecto(element.team);
            return (
              <DataTable.Cell
                disabled={element.team == "0" ? false : true}
                style={{ justifyContent: "center" }}
                key={index}
                numeric
                onPress={() => {setSelectedPoint(pointsOnGame[0][index]), isPointDetailVisible.current=true}}
                textStyle={
                  element.team == "0" ? styles.wonGame : styles.lostGame
                }
              >
                {pointsOnGameTeam1.current}
              </DataTable.Cell>
            );
          })}
        </DataTable.Row>
        <DataTable.Header>
          <DataTable.Title>{teams.equipo2.nombre}</DataTable.Title>
        </DataTable.Header>
        <DataTable.Row>
          {pointsOnGame[0].map((element, index) => {
            if (element.team == "1") ScoreCorrecto(element.team);
            return (
              <DataTable.Cell
                disabled={element.team == "1" ? false : true}
                style={{ justifyContent: "center" }}
                key={index}
                numeric
                onPress={() => {setSelectedPoint(pointsOnGame[0][index]),isPointDetailVisible.current=true}}
                textStyle={
                  element.team == "1" ? styles.wonGame : styles.lostGame
                }
              >
                {pointsOnGameTeam2.current}
              </DataTable.Cell>
            );
          })}
        </DataTable.Row>
      </DataTable>
      <PuntoDetalles
        teams={teams}
        SelectedPoint={SelectedPoint}
        isPointDetailVisible={isPointDetailVisible.current}
      />
    </>
  );
};

export default JuegoDetalles;

const styles = StyleSheet.create({
  wonGame: {
    color: "black",
  },
  lostGame: {
    opacity: 0.2,
  },
});

import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Dimensions, Pressable } from "react-native";
import { useEffect, useState } from "react";
import PointDetail from "./Popup";
import { Surface, Text } from "react-native-paper";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Contador = (props) => {
  const [score, setScore] = useState(0);
  const [realScore, setRealScore] = useState(1);
  useEffect(() => {
    switch (props.tiebreak) {
      case false:
        switch (props.punto == 1 ? props.marcadorE1 : props.marcadorE2) {
          case 0:
            setRealScore(0);
            break;
          case 1:
            setRealScore(15);
            break;
          case 2:
            setRealScore(30);
            break;
          case 3:
            setRealScore(40);
            break;
          
        }
        break;
      case true:
        {props.punto==1 ? setRealScore(props.marcadorE1) : setRealScore(props.marcadorE2)}
        break;
       
    }
  }, [props.marcadorE1, props.marcadorE2]);

  return (
    <Pressable
    style={{width: "75%"}}
    onPress={() => {
      props.punto == 1
        ? props.setMarcadorE1(props.marcadorE1 + 1)
        : props.setMarcadorE2(props.marcadorE2 + 1);
      setScore(score == 3 ? 0 : score + 1);
      props.visibleFunc(!props.visible);
      props.puntoequipo(props.punto === 1 ? 0 : 1);
    }}
  >
    <Surface elevation={1}
      style={
        props.goldenPoint == true
          ? [styles.contador, styles.contadorGoldenPoint]
          : styles.contador
      }>
    
        <Text style={styles.marcador}>{realScore}</Text>
        
      </Surface>
      </Pressable>
  );
};

var scoreColor = "#f0f8ff";

const styles = StyleSheet.create({
  contadorGoldenPoint: {
    backgroundColor: "#F6DF4B",
  },
  contador: {
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
    padding: 40,
    borderRadius: 10,
  },
  marcador: {
    textAlign: "justify",
    textAlignVertical: "center",
    fontSize: windowWidth / 3,
  },
});

export default Contador;

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import { useEffect, useState } from "react";
import PointDetail from "./Popup";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Contador = (props) => {
  const [score, setScore] = useState(0);
  const [realScore, setRealScore] = useState(1);

  useEffect(() => {
    switch (score) {
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
  }, [score]);

  return (
    <>

      <Pressable style={styles.contador} onPress={() => { setScore(score == 3 ? 0 : score + 1); props.visibleFunc(!props.visible); props.puntoequipo(props.punto === 1 ? 0 : 1) }}>
        <Text style={styles.marcador}>{realScore}</Text>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "#f0f8ff",
    width: "80%",
    height: "40%",
    padding: 10,
    borderRadius: 10,
  },
  marcador: {
    textAlign: "justify",
    textAlignVertical: "center",
    fontSize: windowWidth / 3,
  },
});

export default Contador;

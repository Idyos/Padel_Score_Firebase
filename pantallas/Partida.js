import { StyleSheet, Text, View } from "react-native";
import Contador from "../components/Partida/Contador";
import { database } from "../src/config/fb";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
const Partida = () => {
  const [datos, setDatos] = useState([]);

  const retrieveDocs = async () => {
    try {
      const matchCol = collection(database, "Partida");
      const data = await getDocs(matchCol);
      const result = data.docs.map(doc => doc.data());
      setDatos(result);
      console.log(datos);
    } catch (e) {
        console.log(e);
    }
    
  };

  useEffect(() => {
    retrieveDocs();
  }, []);
  return (
    <View style={styles.pantalla}>
      <Text></Text>
      <Contador />
      <Contador />
    </View>
  );
};

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Partida;

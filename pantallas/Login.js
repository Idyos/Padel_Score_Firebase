import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  return (
    <View style={styles.login}>
      <Text style={styles.title}>Contador Pádel</Text>
      <View style={styles.inputs}>
        <TextInput
          selectionColor="orange"
          activeOutlineColor="orange"
          mode="outlined"
          style={styles.inputGeneral}
          label="Email"
          value={correo}
          onChangeText={(text) => setCorreo(text)}
        />
        <TextInput
          selectionColor="orange"
          activeOutlineColor="orange"
          mode="outlined"
          style={styles.inputGeneral}
          value={pass}
          onChangeText={(text) => setPass(text)}
          label="Contraseña"
        />
        <View style={styles.registrarInfo}>
          <Text style={styles.registrarTexto}>No estas registrado? </Text>
          <Text style={styles.registrar}>Regístrate.</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.siguiente}>
        <Text style={styles.siguienteTexto}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  login: {
    height: "100%",
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  title: {
    textAlign: "center",
    fontSize: 40,
    marginBottom: 30,
    fontWeight: "bold",
  },

  inputs: {
    color: "red",
    width: "100%",
    alignItems: "center",
  },

  inputGeneral: {
    width: "80%",
    marginVertical: 10,
  },

  registrarInfo: {
    width: "85%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  registrarTexto: {
    fontSize: 17,
  },

  registrar: {
    color: "#6CD0F9",
    fontSize: 17,
  },

  siguiente: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    width: windowWidth / 1.5,
    height: windowHeight / 7,
  },
  siguienteTexto: {
    fontSize: windowWidth / 12,
    fontWeight: "bold",
    color: "white",
  },
});

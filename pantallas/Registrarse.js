import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Registrarse = ({navigation}) => {
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");

  const handleRegister = () => {
    if (pass != pass2) {
      alert("Las contraseñas no coinciden.");
    } else {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, correo, pass)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // ...
          navigation.navigate("principal");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    }
  };

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
          secureTextEntry={true}
        />
        <TextInput
          selectionColor="orange"
          activeOutlineColor="orange"
          mode="outlined"
          style={styles.inputGeneral}
          value={pass2}
          onChangeText={(text) => setPass2(text)}
          label="Confirmar contraseña"
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity style={styles.registrarBoton} onPress={handleRegister}>
        <Text style={styles.siguienteTexto}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Registrarse;

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

  registrarBoton: {
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

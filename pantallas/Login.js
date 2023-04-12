import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput, HelperText, useTheme, ActivityIndicator } from "react-native-paper";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Login = ({ navigation }) => {
  const [emailError, setEmailError] = useState("");
  const [emailErrorVisible, setEmailErrorVisible] = useState(false);
  const [passErrorVisible, setPassErrorVisible] = useState(false);
  const [passError, setPassError] = useState("");
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [loginTry, setLoginTry] = useState(false);
  const theme = useTheme();

useEffect(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("HAY USER");
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      navigation.navigate("tabbar", { screen: "principal" });
      // ...
    }
    else {
      console.log("NO HAY USER");
    }
  });

}, [])

  

  const hasEmailErrors = (errorCode, type) => {
    if (errorCode === true){setEmailError(type); setEmailErrorVisible(true)}
  };
  const hasPassErrors = (errorCode, type) => {
    if (errorCode === true) {setPassError(type); setPassErrorVisible(true) }
  };

  const handleLogin = () => {
    console.log("HANDLE LOGIN ENTRO");
    setLoginTry(true);
    const auth = getAuth();

    signInWithEmailAndPassword(auth, correo, pass)
      .then((userCredential) => {
        console.log("login EXITOSO");
        setLoginTry(false);
        navigation.navigate("tabbar", { screen: "principal" });
      })
      .catch((error) => {
        const errorCode = error.code;
        setLoginTry(false);
        console.log(errorCode);
        if (errorCode === "auth/invalid-email") hasEmailErrors(true, "Correo incorrecto");
        if (errorCode === "auth/user-not-found") hasEmailErrors(true, "Este usuario no existe");
        if (errorCode === "auth/wrong-password") hasPassErrors(true, "Contraseña incorrecta");
        if (errorCode === "auth/internal-error") hasPassErrors(true, "Error interno");
        if (errorCode === "auth/too-many-requests") hasPassErrors(true, "Demasiados intentos, espera unos minutos");
      });
  };

  return (
    <View style={styles.login}>
      {loginTry ? 
      <View style={styles.loading}>
        <ActivityIndicator style={{opacity: 1}} size={70}  />
      </View> : null}
      <Text style={styles.title}>Contador Pádel</Text>
      <View style={styles.inputs}>
        <TextInput
          selectionColor={emailErrorVisible ? theme.colors.error : "orange"}
          activeOutlineColor={emailErrorVisible ? theme.colors.error : "orange"}
          mode="outlined"
          style={styles.inputGeneral}
          label="Email"
          value={correo}
          onChangeText={(text) => {setCorreo(text), setEmailErrorVisible(false)}}
        />
        <HelperText type="error" padding="none" visible={emailErrorVisible}>
          {emailError}
        </HelperText>
        <TextInput
          selectionColor={passErrorVisible ? theme.colors.error : "orange"}
          activeOutlineColor={passErrorVisible ? theme.colors.error : "orange"}
          mode="outlined"
          style={styles.inputGeneral}
          value={pass}
          onChangeText={(text) => {setPass(text), setPassErrorVisible(false)}}
          label="Contraseña"
          secureTextEntry={true}
        />
        <HelperText type="error" padding="none" visible={passErrorVisible}>
          {passError}
        </HelperText>
      </View>
      <TouchableOpacity style={styles.siguiente} onPress={() => handleLogin()}>
        <Text style={styles.siguienteTexto}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.registrarBoton}
        onPress={() => navigation.navigate("registrarse")}
      >
        <Text style={styles.registrarTexto}>Registrarse</Text>
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

  loading: {
    width: "100%",
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    height: "100%",
    top: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent:'center',
    zIndex: 3,
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
    marginTop: 10,
  },

  helperText: {
    padding: 30,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    textAlign: "right",
  },

  registrarBoton: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    backgroundColor: "white",
    borderColor: "orange",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    width: windowWidth / 1.5,
    height: windowHeight / 7,
  },

  registrarTexto: {
    color: "black",
    fontSize: 25,
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

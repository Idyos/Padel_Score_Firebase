import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { ActivityIndicator, HelperText, TextInput, useTheme } from "react-native-paper";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { database } from "../src/config/fb";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Registrarse = ({navigation}) => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [nameError, setNameError] = useState(["", false]);
  const [emailError, setEmailError] = useState(["", false]);
  const [passError, setPassError] = useState(["", false]);
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [registerTry, setRegisterTry] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const theme = useTheme();


  const hasNameErrors = (errorCode, type) => {
    if (errorCode === true) setNameError([type, true]);
  };
  const hasEmailErrors = (errorCode, type) => {
    if (errorCode === true)setEmailError([type, true]);
  };
  const hasPassErrors = (errorCode, type) => {
    if (errorCode === true) setPassError([type, true]);
  };


  const handleRegister = () => {
    if(nombre===""){
      hasNameErrors(true, "Completa el campo del nombre");
      setTimeout(() => {
        setRegisterTry(false);  
      }, 0);
      
    }
    else if (pass != pass2) {
      hasPassErrors(true, "Las contraseñas no coinciden");
      setTimeout(() => {
        setRegisterTry(false);  
      }, 0);
    }
    else {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, correo, pass)
        .then(async (userCredential) => {
          // Signed in
          setRegisterTry(false);
          const user = userCredential.user;
          user.displayName=nombre;
          await setDoc(doc(database, `Usuarios/${user.uid}`), {displayName: nombre}, {merge: true});
          navigation.navigate("principal");
        })
        .catch((error) => {
          setRegisterTry(false);
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === "auth/invalid-email") hasEmailErrors(true, "Correo incorrecto");
        if (errorCode === "auth/user-not-found") hasEmailErrors(true, "Este usuario no existe");
        if (errorCode === "auth/wrong-password") hasPassErrors(true, "Contraseña incorrecta");
        if (errorCode === "auth/internal-error") hasPassErrors(true, "Error interno");
        if (errorCode === "auth/too-many-requests") hasPassErrors(true, "Demasiados intentos, espera unos minutos");
        if (errorCode === "auth/weak-password") hasPassErrors(true, "Contraseña demasiado débil");
          console.log(errorCode);
        });
    }
  };

  return (
    <View style={styles.login}>
      {registerTry ? 
      <View style={styles.loading}>
        <ActivityIndicator style={{opacity: 1}} size={70}  />
      </View> : null}
      <Text style={styles.title}>Contador Pádel</Text>
      <View style={styles.inputs}>
      <TextInput
          selectionColor={nameError[1] ? theme.colors.error : "orange"}
          activeOutlineColor={nameError[1] ? theme.colors.error : "orange"}
          mode="outlined"
          style={styles.inputGeneral}
          label="Nombre"
          value={nombre}
          onChangeText={(text) => {setNombre(text), setNameError(["", false])}}
        />
               <HelperText type="error" padding="none" visible={nameError[1]}>
          {nameError[0]}
        </HelperText>
        <TextInput
          selectionColor={emailError[1] ? theme.colors.error : "orange"}
          activeOutlineColor={emailError[1] ? theme.colors.error : "orange"}
          mode="outlined"
          style={styles.inputGeneral}
          label="Email"
          value={correo}
          onChangeText={(text) => {setCorreo(text), setEmailError(["", false])}}
        />
        <HelperText type="error" padding="none" visible={emailError[1]}>
          {emailError[0]}
        </HelperText>
        <TextInput
          selectionColor="orange"
          activeOutlineColor="orange"
          mode="outlined"
          style={styles.inputGeneral}
          value={pass}
          onChangeText={(text) => setPass(text)}
          label="Contraseña"
          secureTextEntry={secureTextEntry}
          right={<TextInput.Icon icon={secureTextEntry ? "eye" : "eye-off"} onPress={() => setSecureTextEntry(!secureTextEntry)}/>}
        />
        <TextInput
           selectionColor={passError[1] ? theme.colors.error : "orange"}
           activeOutlineColor={passError[1] ? theme.colors.error : "orange"}
          mode="outlined"
          style={styles.inputGeneral}
          value={pass2}
          onChangeText={(text) => {setPass2(text), setPassError(["", false])}}
          label="Confirmar contraseña"
          secureTextEntry={true}
        />
         <HelperText type="error" padding="none" visible={passError[1]}>
          {passError[0]}
        </HelperText>
      </View>
      <TouchableOpacity style={styles.registrarBoton} onPress={() => {handleRegister(), setRegisterTry(true)}}>
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

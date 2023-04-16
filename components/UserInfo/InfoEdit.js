import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  TextInput,
  Image,
  PermissionsAndroid,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  ActivityIndicator,
  Avatar,
  Chip,
  IconButton,
  useTheme,
} from "react-native-paper";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { database } from "../../src/config/fb";
import { doc, setDoc } from "firebase/firestore";
import {
  getBlob,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";

const storage = getStorage();

const windowHeight = Dimensions.get("window").height;

const InfoEdit = ({ setEditProfile }) => {
  const theme = useTheme();
  const auth = getAuth();
  const imagesRef = ref(storage, `profilePics/${auth.currentUser.uid}`);
  const [email, setEmail] = useState(auth.currentUser.email);
  const [name, setName] = useState(auth.currentUser.displayName);
  const [photo, setPhoto] = useState(auth.currentUser.photoURL);
  const [guardarAsync, setGuardarAsync] = useState(false);
  const [guardar, setGuardar] = useState(true);

  useEffect(() => {
    if (name === "") setName(null);
    if (
      name !== auth.currentUser.displayName ||
      email !== auth.currentUser.email ||
      photo !== auth.currentUser.photoURL
    )
      setGuardar(false);
    else setGuardar(true);
  }, [name, email, photo]);

  const openImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    setPhoto(result.assets[0].uri);
  };

  const imageBlob = (uri) => {
    console.log(uri);
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          resolve(xhr.response);
        }
      };
      xhr.open("GET", uri);
      xhr.responseType = "blob";
      xhr.send();
    });
  };

  const guardarPerfil = async () => {
    const metadata = {
      contentType: "image/jpeg",
    };
    setGuardarAsync(true);
    if (email !== auth.currentUser.email) {
      alert("EMAIL DIFERENTE");
      setGuardarAsync(false);
    } else {
      let photoLink = photo;

      if (photo !== auth.currentUser.photoURL) {
        imageBlob(photo)
          .then((resolve) => {
            uploadBytes(imagesRef, resolve);
          })
          .catch((error) => {
            console.log(error);
          });
        photoLink = await getDownloadURL(imagesRef);
      }

      await setDoc(
        doc(database, `Usuarios/${auth.currentUser.uid}`),
        {
          displayName:
            name !== auth.currentUser.displayName
              ? name
              : auth.currentUser.displayName,
          photoURL:
            photoLink !== auth.currentUser.photoURL
              ? photoLink === null
                ? null
                : photoLink
              : auth.currentUser.photoURL,
        },
        { merge: true }
      );
      updateProfile(auth.currentUser, {
        displayName:
          name !== auth.currentUser.displayName
            ? name
            : auth.currentUser.displayName,
        photoURL:
          photoLink !== auth.currentUser.photoURL
            ? photoLink === null
              ? null
              : photoLink
            : auth.currentUser.photoURL,
      })
        .then(() => {
          setGuardarAsync(false);
          setEditProfile(false);
          // ...
        })
        .catch((error) => {
          // An error occurred
          // ...
        });
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.partidaInfo,
        {
          backgroundColor: theme.colors.primaryContainer,
          height: windowHeight / 4,
          flexDirection: "column",
        },
      ]}
    >
      {guardarAsync ? (
        <View style={styles.cargando}>
          <ActivityIndicator size="large" />
        </View>
      ) : null}

      <View
        style={{
          flexDirection: "row",
          marginTop: 26.5,
          alignItems: "flex-start",
          justifyContent: "flex-start",
          height: "100%",
          width: "100%",
        }}
      >
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {photo === null ? (
            <Avatar.Text
              style={styles.imagen}
              size={100}
              label={primerasLetras}
            />
          ) : (
            <Avatar.Image
              style={styles.imagen}
              size={100}
              source={{ uri: photo }}
            />
          )}

          <IconButton
            style={styles.editarFoto}
            icon="account-circle-outline"
            iconColor="white"
            size={50}
            onPress={openImagePicker}
            onLongPress={() => setPhoto(null)}
          />
        </View>
        <View
          style={{
            flexDirection: "column",
            height: "50%",
            justifyContent: "space-evenly",
          }}
        >
          <TextInput
            autoComplete="off"
            label="Nombre"
            style={styles.inputPlayer}
            value={name === undefined ? "" : name}
            placeholder={name === undefined ? "undefined" : "Nombre"}
            onChangeText={(text) => setName(text)}
            maxLength={20}
          />
          <TextInput
            autoComplete="off"
            label="Correo"
            style={styles.inputPlayer}
            value={email === undefined ? "" : email}
            placeholder={email === undefined ? "undefined" : "Email"}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
      </View>
      <View style={styles.opciones}>
        <Chip
          disabled={guardar}
          style={styles.opcion}
          onPress={() => guardarPerfil()}
        >
          Guardar
        </Chip>
        <Chip
          style={[styles.opcion, { marginRight: 10 }]}
          onPress={() => setEditProfile(false)}
        >
          Cancelar
        </Chip>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  partidaInfo: {
    overflow: "hidden",
    elevation: 3,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 15,
    padding: 0,
    width: "95%",
  },

  cargando: {
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "rgba(128, 128, 128, 0.8)",
    width: "100%",
    height: "100%",
    zIndex: 3,
  },

  editarPerfil: {
    right: 0,
    top: 0,
    position: "absolute",
  },

  imagen: {
    marginLeft: "5%",
    marginRight: "5%",
  },

  editarFoto: {
    width: "75%",
    height: "55%",
    borderRadius: 1000,
    position: "absolute",
    zIndex: 3,
    backgroundColor: "rgba(128, 128, 128, 0.8)",
  },

  inputPlayer: {
    minWidth: "30%",
    flex: 1,
    fontSize: 15,
    borderBottomWidth: 1,
    backgroundColor: "rgba(255, 0, 255, 0)",
  },

  barraDeCarga: {
    position: "absolute",
    width: "10%",
    height: "100%",
    zIndex: -1,
    borderRadius: 15,
  },

  opciones: {
    bottom: 10,
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },

  opcion: {
    marginLeft: 5,
  },
});

export default InfoEdit;

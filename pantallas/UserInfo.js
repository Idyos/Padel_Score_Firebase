import {
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  FlatList,
  Animated,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  IconButton,
  useTheme,
  Text,
  Avatar,
  Switch,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { Easing } from "react-native-reanimated";
import { DarkLightContext } from "../components/DarkLightTheme";
import InfoEdit from "../components/UserInfo/InfoEdit";
import * as ImagePicker from 'expo-image-picker';
import SearchScreen from "../components/SearchUsers";
import UserAvatar from "../components/UserAvatar";

const windowHeight = Dimensions.get("window").height;

const auth = getAuth();
const SalirSesion = () => {
  signOut(auth)
    .catch((error) => {
      console.log(error);
    });
};

const Profile = () => {
  const {darkMode, setDarkMode} = useContext(DarkLightContext);
  //const [ darkMode, setDarkMode ] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const theme = useTheme();
  const progress = useRef(new Animated.Value(0)).current;  

  if(auth.currentUser.displayName!==null){
  const palabras = auth.currentUser.displayName.split(' ');
  var primerasLetras = '';
   for (let i = 0; i < Math.min(palabras.length, 2); i++) {
     primerasLetras += palabras[i].charAt(0).toUpperCase();
   }
  }

  const LogOutAnimation = (type) => {
    if (type == true) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
        easing: Easing.bezierFn(0.32, -0.01, 0.27, 1),
      }).start()
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
        easing: Easing.bezierFn(0.32, -0.01, 0.27, 1),
      }).start()
    }
  };

  return (
    <SafeAreaView>
      {editProfile ? <InfoEdit setEditProfile={setEditProfile} /> :      
      <TouchableOpacity
        style={[
          styles.partidaInfo,
          {
            backgroundColor: theme.colors.primaryContainer,
            height: windowHeight / 5,
          },
        ]}
        onPress={() => setEditProfile(true)}
      >
        <UserAvatar foto={auth.currentUser.photoURL} nombre={auth.currentUser.displayName} size={100}/>
        <IconButton
          style={styles.editarPerfil}
          icon="clipboard-edit"
          iconColor={theme.colors.primary}
          size={30}
        />
        <View
          style={{
            flexDirection: "column",
            height: "50%",
            justifyContent: "space-evenly",
          }}
        >
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
            {auth.currentUser.displayName == undefined
              ? "Undefined"
              : auth.currentUser.displayName}
          </Text>
          <Text style={{ fontSize: 15 }}>{auth.currentUser.email}</Text>
        </View>
      </TouchableOpacity>}
 
      <TouchableOpacity
        onPress={()=>setDarkMode(!darkMode)}
        style={[
          styles.partidaInfo,
          {
            backgroundColor: theme.colors.primaryContainer,
            justifyContent: "space-between",
          },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <IconButton
            icon="moon-waning-crescent"
            iconColor={theme.colors.primary}
            size={30}
          />
          <Text style={{ fontSize: 15 }}>Modo Oscuro</Text>
        </View>
        <Switch value={darkMode} onValueChange={() => setDarkMode(!darkMode)}/>
      </TouchableOpacity>
      <TouchableOpacity
      activeOpacity={.8}
        onPressIn={() => LogOutAnimation(true)}
        onPressOut={() => LogOutAnimation(false)}
        style={[
          styles.partidaInfo,
          {
            backgroundColor: theme.colors.primaryContainer,
            position: "relative",
          },
        ]}
        onLongPress={SalirSesion}
        delayLongPress={850}
      >
        <IconButton icon="logout" iconColor={theme.colors.primary} size={30} />
        <Text style={{ fontSize: 15 }}>Cerrar Sesión</Text>
        <Animated.View
          style={[
            styles.barraDeCarga,
            {
              backgroundColor: theme.colors.error,
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        ></Animated.View>
      </TouchableOpacity>
      <SearchScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  partidaInfo: {
    overflow: 'hidden',
    elevation: 3,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 15,
    padding: 0,
    width: "95%",
  },

  imagen: {
    marginLeft: "5%",
    marginRight: "5%",
  },

  editarPerfil: {
    right: 0,
    top: 0,
    position: "absolute",
  },

  barraDeCarga: {
    position: "absolute",
    width: "10%",
    height: "100%",
    zIndex: -1,
    borderRadius: 15,
  },
});

export default Profile;

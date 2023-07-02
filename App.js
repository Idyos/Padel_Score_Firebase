import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Partida from "./pantallas/Partida";
import NuevaPartida from "./pantallas/NuevaPartida";
import Principal from "./pantallas/Principal";
import Login from "./pantallas/Login";
import Registrarse from "./pantallas/Registrarse";
import {
  DefaultTheme,
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
  useTheme,
} from "react-native-paper";
import InfoPartida from "./pantallas/InfoPartida";
import { useContext, useReducer, useRef, useState } from "react";
import { DarkLightContext, DarkLightTheme } from "./components/DarkLightTheme";
import { combineTransition } from "react-native-reanimated";
import { IconButton, Menu } from "react-native-paper";
import {Alert, Share, View, Button} from 'react-native';
import Partida2 from "./pantallas/Partida2";
import BuscarUsuarios from "./pantallas/BuscarUsuarios";
import PerfilUsuario from "./pantallas/PerfilUsuario";
import Profile from "./pantallas/UserInfo";
import { DebugInstructions } from "react-native/Libraries/NewAppScreen";
import { getAuth, onAuthStateChanged } from "firebase/auth";


const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const auth = getAuth();
function Home() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      shifting={true}
      initialRouteName="principal"
      activeColor={theme.colors.primary}
      barStyle={{ backgroundColor: theme.colors.tertiaryContainer }}
      
    >
      <Tab.Screen
        name="principal"
        component={Principal}
        options={{
          tabBarLabel: "Partidas",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="clipboard-list"
              color={color}
              size={26}
            />
          ),
        }}
        
      />
      <Tab.Screen
        name="buscar"
        component={BuscarUsuarios}
        options={{
          tabBarLabel: "Buscar",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="perfilUsuarioLocal"
        component={PerfilUsuario}
        initialParams={{id: auth.currentUser.uid, photoURL: auth.currentUser.photoURL, displayName: auth.currentUser.displayName, isLocal: true}}
        options={{
          headerShown: true,
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  //  <StatusBar style="auto" />
  const darkMode = useContext(DarkLightContext);
  console.log(darkMode);
  const theme = {
    ...MD3LightTheme,
    version: 3,
    dark: true,
  };

  return (
    <DarkLightTheme>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="tabbar"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="registrarse"
              component={Registrarse}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="partida"
              component={Partida}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="perfilUsuario"
              component={PerfilUsuario}
              options={{ headerShown: false }}
            />
             <Stack.Screen
              name="partida2"
              component={Partida2}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="info-partida"
              component={InfoPartida}
            />
            <Stack.Screen
              name="configUser"
              component={Profile}
              options={{headerShown: false}}
            >
            </Stack.Screen>
            <Stack.Screen name="Nueva Partida" component={NuevaPartida}/>
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </DarkLightTheme>
  );
}

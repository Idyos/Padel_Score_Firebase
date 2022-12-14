import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Partida from "./pantallas/Partida";
import NuevaPartida from "./pantallas/NuevaPartida";
import Principal from "./pantallas/Principal";
import Login from "./pantallas/Login";
import Registrarse from "./pantallas/Registrarse";
import Profile from "./pantallas/UserInfo";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import InfoPartida from "./pantallas/InfoPartida";

const Stack = createNativeStackNavigator();
const Tab=createMaterialBottomTabNavigator();

import {
  MD3LightTheme,
  MD3DarkTheme,
} from 'react-native-paper';
import { ToastAndroid } from "react-native";

function Home() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      activeColor="blue"
      barStyle={{ backgroundColor: 'tomato'}}
    >
      <Tab.Screen
        name="principal"
        component={Principal}
        options={{
          tabBarLabel: 'Partidas',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="nueva-partida"
        component={NuevaPartida}
        options={{
          tabBarLabel: 'Nueva Partida',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="perfil"
        component={Profile}
        options={{
          tabBarLabel: 'Perfil',
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




  const theme = {
    ...DefaultTheme,
    version: 3,
    dark: true,
  };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="tabbar" component={Home} options={{headerShown: false}}/>
          <Stack.Screen name="registrarse" component={Registrarse} />
          <Stack.Screen name="partida" component={Partida} options={{headerShown: false}} />
          <Stack.Screen name="info-partida" component={InfoPartida} />
          <Stack.Screen name="nueva-partida" component={NuevaPartida} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

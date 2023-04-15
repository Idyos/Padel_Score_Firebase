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
import Profile from "./pantallas/UserInfo";
import {
  DefaultTheme,
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import InfoPartida from "./pantallas/InfoPartida";
import { useContext, useReducer, useRef, useState } from "react";
import { DarkLightContext, DarkLightTheme } from "./components/DarkLightTheme";
import { combineTransition } from "react-native-reanimated";
import { IconButton, Menu } from "react-native-paper";
import {Alert, Share, View, Button} from 'react-native';
import Partida2 from "./pantallas/Partida2";


const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();


  const shareMatch = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
          if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

function Home() {
  return (
    <Tab.Navigator
      shifting={true}
      initialRouteName="Feed"
      activeColor="blue"
      barStyle={{ backgroundColor: "tomato" }}
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
        name="perfil"
        component={Profile}
        options={{
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

  const [visible, setVisible] = useState(false);

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
              name="partida2"
              component={Partida2}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="info-partida"
              component={InfoPartida}
            >
            </Stack.Screen>
            <Stack.Screen name="Nueva Partida" component={NuevaPartida} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </DarkLightTheme>
  );
}

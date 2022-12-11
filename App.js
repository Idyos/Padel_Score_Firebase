import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Partida from "./pantallas/Partida";
import NuevaPartida from "./pantallas/NuevaPartida";
import Principal from "./pantallas/Principal";
import Login from "./pantallas/Login";
import Registrarse from "./pantallas/Registrarse";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import InfoPartida from "./pantallas/InfoPartida";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function Cajillero() {
  return (
    <Drawer.Navigator options={{ headerShown: true }}>
      <Drawer.Screen name="principal" component={Principal} />
      <Drawer.Screen name="nueva-partida" component={NuevaPartida} />
      <Drawer.Item
        style={{ backgroundColor: "#64ffda" }}
        icon="star"
        label="First Item"
      />
    </Drawer.Navigator>
  );
}

import {
  MD3LightTheme,
  MD3DarkTheme,
} from 'react-native-paper';



export default function App() {
  //  <StatusBar style="auto" />

  const theme = {
    ...DefaultTheme,
    version: 3,
    dark: false,
  };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator options={{ headerShown: false }}>
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="registrarse" component={Registrarse} />
          <Stack.Screen name="partida" component={Partida} />
          <Stack.Screen name="principal" component={Principal} />
          <Stack.Screen name="info-partida" component={InfoPartida} />
          <Stack.Screen name="nueva-partida" component={NuevaPartida} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

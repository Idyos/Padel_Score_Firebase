import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Partida from "./pantallas/Partida";
import NuevaPartida from "./pantallas/NuevaPartida";

const Stack = createNativeStackNavigator();

export default function App() {
  //  <StatusBar style="auto" />

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="partida" component={Partida} />
        <Stack.Screen name="nueva-partida" component={NuevaPartida} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
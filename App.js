import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Partida from "./pantallas/Partida";
import NuevaPartida from "./pantallas/NuevaPartida";
import Principal from "./pantallas/Principal";
import Login from "./pantallas/Login";

const Stack = createNativeStackNavigator();

export default function App() {
  //  <StatusBar style="auto" />

  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="partida" component={Partida} />
      <Stack.Screen name="principal" component={Principal} />
        <Stack.Screen name="nueva-partida" component={NuevaPartida} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

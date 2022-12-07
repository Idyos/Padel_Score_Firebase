import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Partida from "./pantallas/Partida";
import NuevaPartida from "./pantallas/NuevaPartida";
import Principal from "./pantallas/Principal";
import Login from "./pantallas/Login";
import Registrarse from "./pantallas/Registrarse";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

const Stack = createNativeStackNavigator();

export default function App() {
  //  <StatusBar style="auto" />

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      primary: '#30579a',
      accent: 'orange',
      accent_alt: '#547f2f',
      text: '#090707',
      comment: '#ececec',
    }
  };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="login" component={Login}  />
          <Stack.Screen name="registrarse" component={Registrarse} />
          <Stack.Screen name="partida" component={Partida} />
          <Stack.Screen name="principal" component={Principal} />
          <Stack.Screen name="nueva-partida" component={NuevaPartida} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

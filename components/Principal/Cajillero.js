import * as React from "react";
import { Button, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import NuevaPartida from "../../pantallas/NuevaPartida";
import Principal from "../../pantallas/Principal";

const Drawer = createDrawerNavigator();

function Cajillero() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={NuevaPartida} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default Cajillero;

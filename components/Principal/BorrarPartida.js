import { StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { withTheme, Portal, Dialog, Button, Text } from "react-native-paper";

const windowHeight = Dimensions.get("window").height;

const BorrarPartida = (props) => {

  //console.log(props);

  return (
    <Portal>
    <Dialog visible={props.visible.visible} style={{alignItems: 'center'}}>
      <Dialog.Title style={{ fontSize: 25, fontWeight: "bold", textAlign: 'center' }}>
        Quieres borrar la partida?
      </Dialog.Title>

      <Dialog.Content><Text style={{fontSize: 20}}>Esta acción no se puede deshacer.</Text></Dialog.Content>
      <Dialog.Actions style={{ alignSelf: 'flex-start' }}>
      <Button onPress={() => {props.borrar(props.visible.id), props.setVisible(false)}}>Sí</Button>
      <Button onPress={() => {props.setVisible(false), props.cancelarBorrar.current=true}}>No</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
  );
}

export default withTheme(BorrarPartida);
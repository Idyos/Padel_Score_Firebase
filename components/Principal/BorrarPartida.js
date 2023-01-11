import { StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { withTheme, Portal, Dialog, Button, Text } from "react-native-paper";

const windowHeight = Dimensions.get("window").height;

const BorrarPartida = (props) => {

  return (
    <Portal>
    <Dialog visible={props.visible} style={{alignItems: 'center'}}>
      <Dialog.Title style={{ fontSize: 25, fontWeight: "bold", textAlign: 'center' }}>
        Quieres borrar la partida?
      </Dialog.Title>

      <Dialog.Content><Text style={{fontSize: 20}}>Esta acción no se puede deshacer.</Text></Dialog.Content>
      <Dialog.Actions style={{ alignSelf: 'flex-start' }}>
      <Button onPress={() => {props.borrar(), props.setVisible(false)}}>Sí</Button>
      <Button onPress={() => props.setVisible(false)}>No</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
  );
}

const styles = StyleSheet.create({
});

export default withTheme(BorrarPartida);
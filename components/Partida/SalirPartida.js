import { StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { withTheme, Portal, Dialog, Button, Text } from "react-native-paper";

const windowHeight = Dimensions.get("window").height;

const SalirPartida = (props) => {

  return (
    <Portal>
    <Dialog visible={props.visible} style={{alignItems: 'center'}} dismissable={false}>
    <Dialog.Icon icon="alert" size={60} />
      <Dialog.Title style={{ fontSize: 25, fontWeight: "bold", textAlign: 'center' }}>
        La partida aún no ha terminado.
      </Dialog.Title>
      <Dialog.Content><Text style={{fontSize: 20}}>¿Qué quieres hacer?</Text></Dialog.Content>
      <Dialog.Actions style={{ alignSelf: 'flex-end' }}>
      <Button onPress={() => props.setVisible(false)}>Cancelar</Button>
      <Button onPress={() => props.terminarPartida()}>Terminar Partida</Button>
      <Button textColor="red">Salir</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
  );
}

const styles = StyleSheet.create({
});

export default withTheme(SalirPartida);

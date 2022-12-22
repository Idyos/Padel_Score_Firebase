import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Portal, Dialog, Button, Text, RadioButton, IconButton, useTheme } from "react-native-paper";
import { Marker } from "react-native-svg";


const PartidaConfig = ({ serve, setServe, infoequipos }) => {
    const [popupOrder, setPopupOrder] = useState(true);
    const [servePantalla, setServePantalla] = useState(true);

    const theme = useTheme();


    return (
        <>
            {popupOrder ? <Portal>
                <Dialog visible={servePantalla} onDismiss={() => setServePantalla(false)} style={{ alignItems: 'center' }}>
                    <Dialog.Title>¿Qué equipo empezará el servicio?</Dialog.Title>
                    <Dialog.Content>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { setServe(false), setPopupOrder(false) }}>
                            <RadioButton
                                value="first"
                                status={serve === false ? 'checked' : 'unchecked'}
                                onPress={() => { setServe(false), setPopupOrder(false) }}
                            />
                            <Text>{infoequipos.equipo1.nombre}</Text>
                        </TouchableOpacity>
                    </Dialog.Content>
                    <Dialog.Content>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { setServe(true), setPopupOrder(false) }}>
                            <RadioButton
                                value="second"
                                status={serve === true ? 'checked' : 'unchecked'}
                                onPress={() => { setServe(true), setPopupOrder(false) }}
                            />
                            <Text>{infoequipos.equipo2.nombre}</Text>
                        </TouchableOpacity>
                    </Dialog.Content>
                </Dialog>
            </Portal>
                : <Portal>

                    <Dialog visible={servePantalla} onDismiss={() => setServePantalla(false)} style={{ alignItems: 'center'}}>
                        <Dialog.Title>
                            <IconButton
                                icon="keyboard-backspace"
                                iconColor={theme.colors.primary}
                                size={30}
                                onPress={() => setPopupOrder(true)}
                            />
                            <Text style={{}}>La partida va a empezar</Text>
                        </Dialog.Title>
                        <Dialog.Content>
                            <Text>Una vez pulses a empezar, se activará el temporizador. Pulsalo cuando estés preparado. </Text>
                        </Dialog.Content>
                        <Dialog.Actions style={{alignSelf: 'stretch'}}>
                        <Button onPress={() => setPopupOrder(true)}>Atrás</Button>
                            <Button onPress={() => setServePantalla(false)}>Empezar</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>}
        </>
    );
}

const styles = StyleSheet.create({
});

export default PartidaConfig;



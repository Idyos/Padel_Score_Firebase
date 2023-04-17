import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PuntoDetalles = ({teams, SelectedPoint, isPointDetailVisible}) => {
  return (
    !isPointDetailVisible ? "" : 
    <View style={styles.puntoDetalles}>
    <View style={styles.puntoDetalle}>
        <Text style={{fontWeight: 'bold'}}>Punto:</Text>
      <Text>{SelectedPoint.point=="winners" ? "Winner" : SelectedPoint.point=="unfError" ? "Unforced Error" : "Smash"}</Text>
    </View>
    <View style={styles.puntoDetalle}>
        <Text style={{fontWeight: 'bold'}}>Equipo:</Text>
      <Text>{SelectedPoint.team == 0 ? teams.equipo1.nombre : teams.equipo2.nombre}</Text>
    </View>
    <View style={styles.puntoDetalle}>
        <Text style={{fontWeight: 'bold'}}>Jugador:</Text>
      <Text>{SelectedPoint.team == 0 ? SelectedPoint.player==1 ? teams.equipo1.jugadores.jugador1.nombre : teams.equipo1.jugadores.jugador2.nombre : SelectedPoint.player==1 ? teams.equipo2.jugadores.jugador1.nombre : teams.equipo2.jugadores.jugador2.nombre}</Text>
    </View>
    </View>
  )
}

export default PuntoDetalles

const styles = StyleSheet.create({
    puntoDetalles: {
        paddingHorizontal: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 100,
    },
    puntoDetalle:{
        display: 'flex',
        flexDirection:'column',
        alignItems: 'center',
        justifyContent:'center',
        alignContent: 'space-around',
    }

})
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PuntoDetalles = ({SelectedPoint, isPointDetailVisible}) => {
  return (
    !isPointDetailVisible ? "" : 
    <View style={styles.puntoDetalles}>
    <View style={styles.puntoDetalle}>
        <Text>Punto:</Text>
      <Text>{SelectedPoint.point}</Text>
    </View>
    <View style={styles.puntoDetalle}>
        <Text>Equipo:</Text>
      <Text>{SelectedPoint.team}</Text>
    </View>
    <View style={styles.puntoDetalle}>
        <Text>Jugador:</Text>
      <Text>{SelectedPoint.player}</Text>
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
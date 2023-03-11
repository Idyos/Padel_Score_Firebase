import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { DataTable } from 'react-native-paper';

const JuegoDetalles = () => {
  return (
    <DataTable style={{ alignSelf: "center", width: "100%" }}>
    <DataTable.Header>
      <DataTable.Title>E1</DataTable.Title>
    </DataTable.Header>

    <DataTable.Row>
        <DataTable.Cell><Text>HOLAAA</Text></DataTable.Cell>
    </DataTable.Row>

    <DataTable.Row style={{ justifyContent: "flex-start" }}>
     <DataTable.Cell>Que tal o klk</DataTable.Cell>
    </DataTable.Row>
  </DataTable>
  )
}

export default JuegoDetalles

const styles = StyleSheet.create({ 

})
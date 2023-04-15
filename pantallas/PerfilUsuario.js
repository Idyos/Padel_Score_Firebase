import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const PerfilUsuario = ({ route, theme }) => {
    return (
    <SafeAreaView>
        <Text>{route.params.id}</Text>
      <Text>{route.params.displayName}</Text>
    </SafeAreaView>
  )
}

export default PerfilUsuario

const styles = StyleSheet.create({})
import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import SearchScreen from '../components/SearchUsers'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-paper'

const BuscarUsuarios = ({navigation}) => {
    const [searchText, setSearchText] = useState("");
  return (
    <SafeAreaView style={{flex: 1}}>
        <TextInput
              autoComplete="off"
              mode="flat"
              style={styles.inputPlayer}
              placeholder="Buscar usuarios"
               value={searchText}
              onChangeText={(text) => setSearchText(text)}
            />
      <SearchScreen searchText={searchText} navigation={navigation}/>
    </SafeAreaView>
  )
}

export default BuscarUsuarios

const styles = StyleSheet.create({})
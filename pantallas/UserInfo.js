import { StyleSheet, View, Dimensions, Pressable, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, IconButton, useTheme, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { getAuth, signOut } from "firebase/auth";


const windowHeight = Dimensions.get("window").height;

const SalirSesion = () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      console.log("CHAU");
    })
    .catch((error) => {
      // An error happened.
    });
};

const Profile = () => {
const theme= useTheme();

  return (
    <SafeAreaView>
      <TouchableOpacity style={[styles.partidaInfo, {backgroundColor: theme.colors.primaryContainer}]} onPress={SalirSesion}>
        <IconButton 
        icon="logout"
        iconColor={theme.colors.primary}
        size={30}
        />
        <Text style={{fontSize: 15}}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  partidaInfo: {
    elevation: 3,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 15,
    padding: 0,
    width: "95%",
  },
});

export default Profile;

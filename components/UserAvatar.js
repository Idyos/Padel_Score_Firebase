import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Avatar } from "react-native-paper";

const UserAvatar = ({foto, nombre, size}) => {
    console.log(size);
    if(nombre!==null){
        const palabras = nombre.split(' ');
        var primerasLetras = '';
         for (let i = 0; i < Math.min(palabras.length, 2); i++) {
           primerasLetras += palabras[i].charAt(0).toUpperCase();
         }
        }


  return (
    <TouchableOpacity onPress={() => console.log("hola")}>
      {foto === null ? (
        <Avatar.Text style={styles.imagen} label={primerasLetras} size={size ? size : 60}/>
      ) : (
        <Avatar.Image
          style={styles.imagen}
          source={{ uri: foto }}
          size={size ? size : 60}
        />
      )}
    </TouchableOpacity>
  );
};

export default UserAvatar;

const styles = StyleSheet.create({
    imagen: {
        marginLeft: "10%",
      },
});

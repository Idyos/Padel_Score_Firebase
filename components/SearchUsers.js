import React, { useEffect, useState } from "react";
import { TextInput, FlatList, Text, View, StyleSheet, TouchableOpacity, TouchableHighlight, TouchableNativeFeedback } from "react-native";
import firebase from "firebase/app";
import "firebase/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "../src/config/fb";
import UserAvatar from "./UserAvatar";

const SearchScreen = ({searchText, navigation}) => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchText !== "" && searchText!==undefined && searchText!==null) searchUsers();
      else setUsers([]);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchText]);

  // Función para buscar usuarios
  const searchUsers = async () => {
    console.log("SEARCHUSERS FUNCTION");
    const q = query(
      collection(database, "Usuarios"),
      where("displayName", ">=", searchText),
      where("displayName", "<=", searchText + "\uf8ff")
    );
    const querySnapshot = await getDocs(q);

    const filteredUsers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setUsers(filteredUsers);
  };

  return (
    <View style={styles.searchResults}>
      <FlatList
        data={users}
        renderItem={({ item, index }) => (
          <TouchableNativeFeedback onPress={() => navigation.navigate("perfilUsuario", item)}>
            <View style={[styles.user, index===0 ? {borderTopWidth: 1} : null]}>
            <UserAvatar foto={item.photoURL} nombre={item.displayName} />
            <Text style={{fontSize: 20}}>{item.displayName}</Text>
            </View>
          </TouchableNativeFeedback>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
user:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
},

searchResults: {
  flexGrow: 1,
},

});

export default SearchScreen;

import React, { useEffect, useState } from "react";
import { TextInput, FlatList, Text, View, StyleSheet, TouchableOpacity, TouchableHighlight, TouchableNativeFeedback } from "react-native";
import firebase from "firebase/app";
import "firebase/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "../src/config/fb";
import UserAvatar from "./UserAvatar";

const SearchScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchText !== "") searchUsers();
      else setUsers([]);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchText]);

  // Función para buscar usuarios
  const searchUsers = async () => {
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
    <View>
      <TextInput
        placeholder="Buscar usuarios"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <FlatList
        data={users}
        renderItem={({ item, index }) => (
          <TouchableNativeFeedback>
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
}
});

export default SearchScreen;

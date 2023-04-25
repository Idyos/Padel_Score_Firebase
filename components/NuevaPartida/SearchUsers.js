import React, { useEffect, useState } from "react";
import { TextInput, FlatList, Text, View, StyleSheet, TouchableOpacity, TouchableHighlight, TouchableNativeFeedback, ScrollView } from "react-native";
import firebase from "firebase/app";
import "firebase/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "../../src/config/fb";
import UserAvatar from "../UserAvatar";
import { getAuth } from "firebase/auth";

const SearchScreen = ({addPlayer, searchText, type}) => { 
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [player, setPlayer] = useState();

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchText !== "" && searchText!==undefined && searchText!==null && searchText!==player) {searchUsers(); setVisible(true)}
      else {setUsers([]); setVisible(false)}
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
    visible ? 

    <View style={styles.searchResults}>
      <FlatList
      style={{maxHeight: 100}}
        data={users}
        //contentContainerStyle={{maxHeight: 50}}
        renderItem={({ item, index }) => (
          <TouchableNativeFeedback style={{flexGrow: 0}} onPress={() => {addPlayer(item.displayName, item.id, type), setPlayer(item.displayName), setVisible(false)}}>
            <View style={[styles.user, index===users.length-1 ? {borderBottomWidth: 0} : null]}>
            <UserAvatar foto={item.photoURL} nombre={item.displayName} />
            <Text style={{fontSize: 20}}>{item.displayName}</Text>
            </View>
          </TouchableNativeFeedback>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>: ""
  )
};

const styles = StyleSheet.create({
user:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    zIndex: 1000,
},

searchResults: {
    backgroundColor: 'white',
    left: "4%",
    position: 'absolute',
    top: "105%",
    zIndex: 100000,
    width: "100%",
    borderWidth: 1,
    borderRadius: 15,
},

});

export default SearchScreen;

import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { CheckBox, RadioButton, RadioGroup } from "react-native-radio-check"



const PointDetail = (props) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.visible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          props.visibleFunc(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>¿Qué ha causado el punto?</Text>
            <RadioGroup
              style={{ flexDirection: 'row', marginTop: 10 }}
              //checkedId={this.state.index}
              icon={{
                normal: require('./icon/ic_normal.png'),
                checked: require("./icon/ic_radio_check.png")
              }}  
              textStyle={{ marginLeft: 5 }}
              onChecked={(id, value) => {
                console.info("Group===", id)
                console.info("Value===", value)
              }}>
              <RadioButton
                text="AAA"
                value={1} />
              <RadioButton
                style={{ marginLeft: 20 }}
                text="BBB"
                value={2} />
            </RadioGroup>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => props.visibleFunc(false)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default PointDetail;
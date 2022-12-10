import React, { useState } from 'react';
import {
  StyleProp,
  ViewStyle,
  Animated,
  StyleSheet,
  Platform,
  ScrollView,
  Text,
  SafeAreaView,
  I18nManager,
} from 'react-native';
import { AnimatedFAB } from 'react-native-paper';
import { useTheme } from 'react-native-paper';


const AnadirPartida = ({
  animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode,
  navigation,
  user,
  isExtended
}) => {
  
  const isIOS = Platform.OS === 'ios';
  const theme = useTheme();

  const fabStyle = { [animateFrom]: 16 };

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedFAB
        icon={'plus'}
        label={'Nueva Partida'}
        extended={isExtended}
        onPress={() => navigation.navigate('nueva-partida', {user: user})}
        visible={visible}
        animateFrom={'right'}
        iconMode={'static'}
        style={[styles.fabStyle, style, fabStyle]}
      />
    </SafeAreaView>
  );
};

export default AnadirPartida;

const styles = StyleSheet.create({
  container: {
    //flexGrow: 1,
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: 'absolute',
  },
});
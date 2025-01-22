import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from "react"
import { StyleSheet, Text, View,  KeyboardAvoidingView, Platform } from 'react-native';
import { Provider } from "react-redux"
import { store } from "./store"
import Navigator from './main';

export default function App() {
  
  return (
    <Provider store={store} style={styles.container}>
      <Navigator />
    </Provider>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

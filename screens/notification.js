import { View, Text, Alert, StyleSheet, Button, Image, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import BottomNavigation from '../components/bottom-navigation';
import tw from "twrnc"

const { width, height } = Dimensions.get("window")

export default function NotificationScreen(){

    const navigation = useNavigation()

    const [ token, setToken ] = useState("")
    
        useEffect(() => {
            const checkAuth = async () => {
              const storedToken = await SecureStore.getItemAsync('token');
        
              if (storedToken) {
                setToken(storedToken)
                console.log(storedToken)
              } else {
                navigation.replace("Signup")
              }
            };
        
            checkAuth();
          }, []);
    
  return (
    <BottomNavigation >
        <View style={styles.container}>
            
        </View>
    </BottomNavigation>
  )
}

const styles = StyleSheet.create({
    container: {
   flex: 1,
   backgroundColor: '#1f1f1f',
   height: height,
   width: width,
   paddingTop: 40,
 },

})
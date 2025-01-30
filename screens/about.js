import { View, Text, Alert, StyleSheet, Button,Dimensions, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import { Ionicons, Feather, FontAwesome, AntDesign, FontAwesome5, Entypo, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import {  base_url as url } from "../slices/authSlice";
import tw from "twrnc"
import { formatDistanceToNowStrict } from "date-fns";
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get("window")

export default function AboutScreen(){

    const navigation = useNavigation()
    const route = useRoute()
    const { id, photo, username, timestamp } = route.params
    const [ token, setToken ] = useState("")

    useLayoutEffect(()=>{
        navigation.setOptions({
          title: "About this account",
          headerTitleAlign: 'center',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: "#000",
          },
          headerTitleStyle: {
            textAlign: 'center',
            color: 'white',
            fontWeight: "bold"
          },
          headerLeft: ()=> <TouchableOpacity onPress={()=> navigation.goBack()}><Ionicons name="arrow-back" size={24} color="white" /></TouchableOpacity>
    
        })
      },[])
      
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
        <View style={styles.container}>
            <Image style={tw`h-20 w-20 rounded-full border-4 border-gray-700`} source={{ uri: photo }} />
            <Text style={tw`font-bold text-base mt-2 text-white text-center`}>{username}</Text>
            <Text style={tw`self-start text-center text-xs text-gray-400 mt-2 ml-4 mb-4`}>To help keep our community authentic, we are showing information about accounts on Instagram <Text style={tw`text-blue-400 font-bold`}>See why this information is important</Text></Text>
            <TouchableOpacity style={tw`flex flex-col justify-center mt-4 mb-4`}>
              <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row justify-between w-4/5`}>
                <View style={tw`flex flex-row`}>
                    <FontAwesome name="calendar-o" size={24} color="white" />
                    <View style={tw`flex flex-col`}>
                        <Text style={tw`text-white text-lg ml-2`}>Date joined</Text>
                        <Text style={tw`text-neutral-400 ml-2`}>{formatDistanceToNowStrict(new Date(timestamp))}</Text>
                    </View>
                </View>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={18} color="gray" /> 
              </View>
            </TouchableOpacity>

        </View>
  )
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   alignItems: "center",
   backgroundColor: '#000',
   height: height,
   width: width,
   paddingTop: 10,
   paddingHorizontal: 10
 },

})
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import tw from "twrnc"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import { base_url as url } from '../slices/authSlice'
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get("window")

export default function BottomNavigation({ children }) {

    const navigation = useNavigation()
    const base_url = useSelector(url)
    const [ id, setId ] = useState("")
    const [ user, setUser ] = useState({})
    
    useEffect(()=>{

      async function getUserID() {
        const uid = await SecureStore.getItemAsync("id")
        setId(uid)   
      }

      getUserID()

    }, [])

    const fetchProfile = async()=>{
      const userId = await SecureStore.getItemAsync("id")
      const token = await SecureStore.getItemAsync("token")
      try{
        const link = `${base_url}/user/${userId}`
        const response = await fetch(link, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })
  
        const result = await response.json()
        setUser(result)
      } catch(error){
        console.error("Error: ", error)
      } finally {
          //  setLoading(false)
      }
    }
      

  return (

    <View style={{ height: height, width: width }}>
        {children}
    <View style={[tw`z-2 fixed bottom-0 left-0 w-full h-20 pt-2 bg-black text-white flex flex-row justify-evenly `]}>
      <TouchableOpacity onPress={()=> navigation.navigate("Home")}><Octicons name="home" size={30} color="white" /></TouchableOpacity>
      <TouchableOpacity onPress={()=> navigation.navigate("Search")}><AntDesign name="search1" size={30} color="white" /></TouchableOpacity>
      <TouchableOpacity onPress={()=> navigation.navigate("Create")}><FontAwesome name="plus-square-o" size={30} color="white" /></TouchableOpacity>
      <TouchableOpacity onPress={()=> navigation.navigate("Notification")}><AntDesign name="hearto" size={30} color="white" /></TouchableOpacity>
      <TouchableOpacity onPress={()=>{ navigation.navigate("Profile", { id: id })}}><Image style={tw`h-8 w-8 rounded-full`} source={{ uri: user.photo }} /></TouchableOpacity>
    </View>
    </View>
  )
}




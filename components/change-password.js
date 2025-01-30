import { View, Text, Dimensions, StyleSheet, TouchableOpacity, TextInput, ToastAndroid } from "react-native"
import React, { useState, useEffect } from 'react'
import RNModal from 'react-native-modal';
import { useSelector } from 'react-redux';
import Entypo from '@expo/vector-icons/Entypo';
import * as SecureStore from 'expo-secure-store';
import { base_url as url } from "../slices/authSlice";

import tw from 'twrnc'
const { width, height } = Dimensions.get("window")

function ChangePasswordModal({ open, close, message, email, showLoading, proceed }){

    useEffect(()=>{
        
    }, [])

    const [ password, setPassword ] = useState("")
    const base_url = useSelector(url)

    const forgotPass = async()=>{
          showLoading()
          const response = await fetch(`${base_url}/forgot-password`, {
            method: "POST",
            body: JSON.stringify({ password: password, email: email }),
            headers: {
              "Content-Type": "application/json",
            }
          })
      
          const result = await response.json()

          if(result.message === "success"){
            ToastAndroid.show("Changed password successfully!", ToastAndroid.SHORT)
            await SecureStore.setItemAsync("token", result.token)
            await SecureStore.setItemAsync("id", result.id)
            proceed()
          } 
          
          if(result.message=== "user not found"){
            console.log(result.message)
            ToastAndroid.show("User Not Found",ToastAndroid.SHORT)
            close()
          }
        }

  return (
    <View>
        {!open ? (<Text></Text>) : (
            <View>
              <RNModal isVisible={open} animationIn="zoomIn" animationOut="zoomOut">
                <View style={styles.forgotpassModal}>
                <View style={tw`flex flex-row justify-between`}>
                  <Text style={tw`text-white text-lg font-bold ml-2`}>
                    {message}
                  </Text>
                  <TouchableOpacity style={tw`ml-2`} onPress={()=>{ setEmail(""); close()}}>
                    <Entypo name="cross" size={24} color="white" />
                  </TouchableOpacity>
                  </View>
                  
                  <View style={tw`mt-2`}>
                    <View style={tw`flex flex-row justify-center items-center bg-neutral-800 `}>
                        <TextInput style={tw` w-4/5 h-14 bg-neutral-800 text-white`} placeholderTextColor="#AAA" placeholder="password" value={password} onChangeText={(text)=> setPassword(text)} />
                    </View>
                  </View>
                  <TouchableOpacity onPress={forgotPass} style={tw`text-red-600 mt-2`}>
                    <Text style={tw`text-center font-bold text-white text-lg`}>
                        submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </RNModal>
            </View>
          )}
    </View>
  )
}

export default ChangePasswordModal

const styles = StyleSheet.create({
    container: {
   flex: 1,
   backgroundColor: '#000',
   height: height,
   width: width,
 },

  forgotpassModal: {
    backgroundColor: '#1f1f1f',
    paddingHorizontal: 10,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.85,
    elevation: 5,
  },

  


})


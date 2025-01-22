
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import RNModal from 'react-native-modal';
import tw from 'twrnc'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AntDesign, FontAwesome6, FontAwesome, FontAwesome5, Entypo, Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { BottomSheet,  Button, ListItem } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { base_url as url } from '../slices/authSlice'
const { width, height } = Dimensions.get("window")

function PostBottomSheet({ open, close, proceedEdit, post }){

    const base_url = useSelector(url)
    const navigation = useNavigation()

    const deletePost = async()=>{
            try{
              ToastAndroid.show("Post deleted successfully!", ToastAndroid.SHORT)
              const token = await SecureStore.getItemAsync('token');
              const link = `${base_url}/post/${post._id}`
              const response = await fetch(link, {
                method: "DELETE",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
              })
    
              const result = await response.json()

              if(result.message === "undefined"){
                ToastAndroid.show("Post ID undefined", ToastAndroid.SHORT)
              }
    
              if(result.message === "success"){
                ToastAndroid.show("Post Deleted!", ToastAndroid.SHORT)
                navigation.replace('Profile', { id: post.admin._id }); 
              }
    
            } catch(error){
              console.error("Error: ", error)
            } 
          }
    

  return (
    <BottomSheet modalProps={{}} isVisible={open}>
        <View style={tw`h-80 bg-neutral-900`}>
        <TouchableOpacity onPress={proceedEdit} style={tw`flex flex-col justify-center mt-4 mb-4`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                    <Feather name="edit" size={30} color="white" />
                    <Text style={tw`text-white text-lg ml-2`}>Edit Post</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={24} color="gray" /> 
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex flex-col justify-center mt-4 mb-4`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                    <MaterialCommunityIcons name="star-circle-outline" size={30} color="white" />
                    <Text style={tw`text-white text-lg ml-2`}>Close Friends</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={24} color="gray" /> 
            </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={tw`flex flex-col justify-center mt-4 mb-4`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                    <FontAwesome6 name="bookmark" size={30} color="white" />
                    <Text style={tw`text-white text-lg ml-2`}>Save</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={24} color="gray" /> 
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex flex-col justify-center mt-4 mb-4`} onPress={deletePost}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                    <MaterialCommunityIcons name="delete-outline" size={30} color="white" />
                    <Text style={tw`text-white text-lg ml-2`}>Delete Post</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={24} color="gray" /> 
            </View>
        </TouchableOpacity>
        <Button title={"Close"} onPress={close} />
        </View>
    </BottomSheet>
  )
}

export default PostBottomSheet

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


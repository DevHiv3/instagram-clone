import { View, Text, Alert, StyleSheet, Button,Dimensions, Image, TextInput, TouchableOpacity, ToastAndroid } from 'react-native'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons, Feather, FontAwesome, AntDesign, FontAwesome5, Entypo, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import {  base_url as url } from "../slices/authSlice";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import PostProgressBar from "../components/post-progress-bar"
import tw from "twrnc"

const { width, height } = Dimensions.get("window")

export default function EditProfileScreen(){

    const navigation = useNavigation()
    const base_url = useSelector(url)
    const route = useRoute()
    const { user } = route.params

    const [ token, setToken ] = useState("")
    const [ hasPickedImage, setHasPickedImage ] = useState(false)
    const [ loading, setLoading ] = useState(0)
    const [ image, setImage ] = useState(user.photo)
    const [ username, setUsername ] = useState(user.username)
    const [ bio, setBio ] = useState("")
    const [ open, setOpen ] = useState(false)

    useLayoutEffect(()=>{
        navigation.setOptions({
          title: "Edit Profile",
          headerTitleAlign: 'center',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: "#0f0f0f",
          },
          headerTitleStyle: {
            textAlign: 'center',
            color: 'white',
            fontWeight: "bold"
          },
          headerLeft: ()=> <TouchableOpacity onPress={()=> navigation.goBack()}><Ionicons name="arrow-back" size={24} color="white" /></TouchableOpacity>
    
        })
      },[])

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images', 'videos'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
        ToastAndroid.show("image selected!", ToastAndroid.SHORT);
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
          setHasPickedImage(true)
          console.log(result.assets[0].uri)
        } else {
          setHasPickedImage(false)
        }
      };

    const editProfile = async ()=> {
      try {
        if(!username){
         ToastAndroid.show("username cannot be empty!", ToastAndroid.SHORT)
        } else {
          
          if(!hasPickedImage){
            const userId = await SecureStore.getItemAsync("id")
            const storedToken = await SecureStore.getItemAsync('token');
            const link = `${base_url}/user/edit/${userId}`
            const response = await fetch(link, {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
              },
              body: JSON.stringify({ username: username })
            })
            
            const result = await response.json()
            
            if(result.message === "success"){
              ToastAndroid.show(`Post Updated!`, ToastAndroid.SHORT)
              navigation.navigate("Profile", { id: userId })
            }
          } else {

          const userId = await SecureStore.getItemAsync("id")
          
          const uploadTask = FileSystem.createUploadTask(`${base_url}/user/edit/${userId}`, image, {
            headers: {
              'Content-Type': 'multipart/form-data', // Important for Multer to parse
              'Authorization': `bearer ${token}`
            },
            fieldName: 'photo', // Name of the file field in the request
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            parameters: {
              username: username,
          }
        },
        (progress) => {
          setOpen(true)
          const progressBar = (progress.totalBytesSent / progress.totalBytesExpectedToSend) * 100;
          setLoading(progressBar)
        })
        
        const result = await uploadTask.uploadAsync();
        
        if(result.status === 200){
          ToastAndroid.show("Profile Updated!", ToastAndroid.SHORT)
          navigation.navigate("Profile", { id: user.id })
         }
        }
      }
      } catch(error){
        ToastAndroid.show("Error uploading profile!", ToastAndroid.SHORT)
        console.error("Error uploading profile!", error)
      }
    }
    
    
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
          <PostProgressBar open={open} close={()=> setOpen(false)} message={" updating profile..."} progress={loading} />
        <View style={tw`flex flex-row justify-center align-center w-full h-76`}>
                <Image style={tw`w-full h-76`} source={{ uri: image }} />
            </View>
            <Button title={"Pick an Image"} style={tw`m-2`} onPress={pickImage} />
            <View style={tw`flex flex-row justify-center items-center bg-neutral-800 `}>
                <TouchableOpacity style={tw`mr-2`}><Image style={tw`h-8 w-8 rounded-full`} source={{ uri: user.photo }} /></TouchableOpacity>
                <TextInput style={tw` w-4/5 h-14 bg-neutral-800 text-white`} placeholderTextColor="#AAA" placeholder="your username" value={username} onChangeText={(text)=> setUsername(text)} />
            </View>
            <View style={tw`flex flex-row justify-center items-center bg-neutral-800 `}>
                <TouchableOpacity style={tw`mr-2`}><Image style={tw`h-8 w-8 rounded-full`} source={{ uri: user.photo }} /></TouchableOpacity>
                <TextInput style={tw` w-4/5 h-14 bg-neutral-800 text-white`} placeholderTextColor="#AAA" placeholder="your bio" value={bio} onChangeText={(text)=> setBio(text)} />
            </View>
            <TouchableOpacity style={tw`flex flex-col justify-center mt-4 mb-4`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                    <Feather name="user-plus" size={24} color="white" />
                    <Text style={tw`text-white text-md ml-2`}>Tag Friends</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={24} color="gray" /> 
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex flex-col justify-center mt-4 mb-4`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                <Feather name="music" size={24} color="white" />
                    <Text style={tw`text-white text-md ml-2`}>add music</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={24} color="gray" /> 
            </View>
        </TouchableOpacity>
       

        <View style={tw`flex flex-row w-full h-14 justify-center align-center mt-4`}>
            <TouchableOpacity onPress={editProfile} style={tw`flex justify-center bg-blue-600 w-4/5 h-14 rounded-xl`}>
              <Text style={tw`text-white uppercase text-center font-bold`}>update</Text>
            </TouchableOpacity>
        </View>

      
        </View>
  )
}

const styles = StyleSheet.create({
    container: {
   flex: 1,
   backgroundColor: '#1f1f1f',
   height: height,
   width: width,
 },

})
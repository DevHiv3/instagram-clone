import { View, Text, Alert, StyleSheet, RefreshControl, TextInput, Button,Dimensions, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import { useSelector } from "react-redux";
import { Ionicons, Feather, FontAwesome, AntDesign, FontAwesome5, Entypo, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import {  base_url as url } from "../slices/authSlice";
import * as FileSystem from 'expo-file-system';
import tw from "twrnc"
import PostProgressBar from "../components/post-progress-bar"

const { width, height } = Dimensions.get("window")

export default function FinalizePostScreen(){

    const navigation = useNavigation()
    const route = useRoute()
    const base_url = useSelector(url)

    const { photo } = route.params
    const id = SecureStore.getItemAsync('id');

    const [ token, setToken ] = useState("")
    const [ userId, setUserId ] = useState("")
    const [ caption, setCaption ] = useState("")

    useLayoutEffect(()=>{
        navigation.setOptions({
          title: "New Post",
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
          headerLeft: ()=> <TouchableOpacity onPress={()=> navigation.goBack()}><Ionicons name="arrow-back" size={24} color="white" /></TouchableOpacity>,
          headerRight: ()=> <TouchableOpacity onPress={post}><Text style={tw`font-bold text-blue-400 text-sm`}>Post</Text></TouchableOpacity>,
    
        })
      },[])

      const [refreshing, setRefreshing] = useState(false)
      const [open, setOpen] = useState(false);
      const [ loading, setLoading ] = useState(0)
      const [ uid, setUid ] = useState('')

      const onRefresh = ()=>{
        setRefreshing(true);
        fetch('https://randomuser.me/api/?results=5')
        .then(res => {
           return res.json()
        })
        .then((res) => {
          setRefreshing(false);
        })
      };

      useEffect(()=>{
        async function getUserID() {
          const id = await SecureStore.getItemAsync("id")
          setUid(id)   
        }
        getUserID()
      }, [])
    
        useEffect(() => {
            const checkAuth = async () => {
              const storedToken = await SecureStore.getItemAsync('token');
              const id = await SecureStore.getItemAsync("id")

              if (storedToken) {
                setToken(storedToken)
                setUserId(id)
                console.log(storedToken)
              } else {
                navigation.replace("Signup")
              }
            };
        
            checkAuth();
          }, []);

          const post = async ()=> {

            try {
              if(!caption){
                 ToastAndroid.show("Caption cannot be empty!", ToastAndroid.SHORT)
              } else {

                const uploadTask = await FileSystem.createUploadTask(`${base_url}/post`, photo, {
                  headers: {
                    'Content-Type': 'multipart/form-data', // Important for Multer to parse
                    'Authorization': `bearer ${token}`
                  },
                  fieldName: 'photo', // Name of the file field in the request
                  uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                  parameters: {
                    caption: caption,
                    type: "photo",
                    admin: userId
                  }
                },
                (progress) => {
                  setOpen(true)
                  const progressBar = (progress.totalBytesSent / progress.totalBytesExpectedToSend) * 100
                  setLoading(progressBar)
                }
              )

                const result = await uploadTask.uploadAsync();

                if(result.status === 200){
                  ToastAndroid.show("Post uploaded!", ToastAndroid.SHORT)
                   navigation.navigate("Profile", { id: uid })
              }
              }
            } catch(error){
              console.error("Error uploading post!", error)
            } 
          }

          

    
  return (
            <View style={styles.container}>
             <PostProgressBar open={open} close={()=> setOpen(false)} message={" uploading post..."} progress={loading} />
            <View style={tw`flex flex-row justify-center align-center w-full h-80`}>
                <Image style={tw`w-full h-76`} source={{ uri: photo }} />
            </View>
            <View style={tw`flex flex-row justify-center items-center bg-neutral-800 `}>
                <TouchableOpacity style={tw`mr-2`}><Image style={tw`h-8 w-8 rounded-full`} source={{ uri: 'https://randomuser.me/api/portraits/men/73.jpg' }} /></TouchableOpacity>
                <TextInput style={tw` w-4/5 h-14 bg-neutral-800 text-white`} placeholderTextColor="#AAA" placeholder="write something..." value={caption} onChangeText={(text)=> setCaption(text)} />
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
        <TouchableOpacity style={tw`flex flex-col justify-center mt-4 mb-4`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                <Entypo name="location-pin" size={24} color="white" />
                    <Text style={tw`text-white text-md ml-2`}>add location</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={24} color="gray" /> 
            </View>
        </TouchableOpacity>

        <View style={tw`flex flex-row w-full h-14 justify-center align-center mt-4`}>
            <TouchableOpacity onPress={post} style={tw`flex justify-center bg-blue-600 w-4/5 h-14 rounded-xl`}>
              <Text style={tw`text-white uppercase text-center font-bold`}>Post</Text>
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
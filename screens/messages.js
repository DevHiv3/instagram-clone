import React, { useState, useEffect, useRef, useLayoutEffect }
 from "react"
import { StyleSheet, Text, View, SafeAreaView, Image, RefreshControl, ScrollView, TouchableOpacity, Dimensions, TouchableWithoutFeedback,Keyboard, Platform, KeyboardAvoidingView, TextInput, FlatList, ToastAndroid, } from 'react-native';
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from "@react-navigation/native";
import { base_url as url } from '../slices/authSlice'
import Modal from '../components/modal';
import { useSelector } from 'react-redux';
import UserSkeletonScreen from "../components/user-placeholder"
import { formatDistanceToNowStrict, formatDistanceToNow } from "date-fns";
import { useFonts, Inter_900Black, Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold } from '@expo-google-fonts/inter';
  import tw from "twrnc"

const { width, height } = Dimensions.get("window")

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)} ...` : text;
};

const maxLength = 10;

export default function MessagesScreen(){

    const navigation = useNavigation()
    const base_url = useSelector(url)
    const [ loading, setLoading ] = useState(true)
    const [ token, setToken ] = useState("")
    const [ selectedRoomId, setSelectedRoomId ] = useState("")
    const [ selectedReceiver, setReceiver ] = useState("")
    const [ open, setOpen ] = useState(false);
    const [ userId, setUserId ] = useState("")
    const [ rooms, setRooms ] = useState([])
    
        useEffect(() => {
            const checkAuth = async () => {
              const storedToken = await SecureStore.getItemAsync('token');
        
              if (storedToken) {
                setToken(storedToken)
                fetchRooms()
              } else {
                navigation.replace("Signup")
              }
            };
        
            checkAuth();
          }, []);

  useLayoutEffect(()=>{
    navigation.setOptions({
      title: "Messages",
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
      headerRight: ()=> <TouchableOpacity onPress={()=> navigation.goBack()}><FontAwesome name="pencil-square-o" size={24} color="white" /></TouchableOpacity>,

    })
  },[])

  const fetchRooms = async()=>{
      const storedToken = await SecureStore.getItemAsync('token');
      try{
        const link = `${base_url}/rooms`
        const response = await fetch(link, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          }
        })

        const result = await response.json()
        setRooms(result.rooms)
        setUserId(result.userId)

      } catch(error){
        console.error("Error: ", error)
      } finally {
        setLoading(false)
      }
    }
  
  const deleteChat = async()=>{
        const storedToken = await SecureStore.getItemAsync('token');
        const userId = await SecureStore.getItemAsync("id")
        try{
          const link = `${base_url}/room/${selectedRoomId}`
          const response = await fetch(link, {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedToken}`
            },
            body: JSON.stringify({ sender: userId, receiver: selectedReceiver })
          })
          
          const result = await response.json()
          if(result.message == "success"){
            ToastAndroid.show("Chat deleted!", ToastAndroid.SHORT)
            setReceiver("");
            setSelectedRoomId("");
            setOpen(false)
            onRefresh()
          } else {
            setOpen(false)
            ToastAndroid.show("Internal server error, try again later!", ToastAndroid.SHORT)
          }
          
        } catch(error){
          console.error("Error: ", error)
        } 
    }
    

  const [refreshing, setRefreshing] = useState(false);

      const onRefresh = async()=>{
        setLoading(true)
        await fetchRooms()
        setLoading(false)
      };
    
      const RoomList = ({ room })=> (
        <TouchableOpacity delayLongPress={500} onLongPress={()=> { setOpen(true); setSelectedRoomId(room._id); setReceiver(room.users[0]._id); }} onPress={()=> navigation.navigate("Chat", { roomId: room._id, currentUserId: userId, id: room.users[0]._id, userProfilePhoto: room.users[0].photo, userUsername: room.users[0].username  })} style={tw`flex flex-row w-full h-22 justify-between align-center border-white`}>

          <View style={tw`flex flex-row justify-center align-center h-20`}>
          <View style={tw`flex flex-col align-center justify-center ml-4`}>
            <Image style={tw`h-14 w-14 rounded-full border-4 border-gray-700`} source={{ uri: room.users[0].photo }} />
          </View>
            <View style={tw`flex flex-col align-center justify-center ml-4 `}>
              <Text style={tw`text-white text-lg font-semibold`}>{room.users[0].username}</Text>
              <Text style={tw`text-gray-300`}>{truncateText(room.message, maxLength)}<Text style={tw``}></Text> {formatDistanceToNowStrict(new Date(room.latestMessageTimestamp))}</Text>
            </View>
          </View>

          <View style={tw`flex flex-col align-center justify-center mr-2`}>
          <TouchableOpacity style={tw``} onPress={()=> navigation.goBack()}><Feather name="camera" size={24} color="gray" /></TouchableOpacity>
          </View>
        </TouchableOpacity>
         )

  return (
    <SafeAreaView style={styles.mainTheme}>
      
      <Modal open={open} close={()=> setOpen(false)} message={" Do you want to delete the chat ?"} proceed={deleteChat} optionOne={"delete"} />

      <View style={tw`flex flex-row justify-between w-full m-2`}>
        <TouchableOpacity style={tw``}>
          <Text style={tw`text-white font-bold text-sm p-6`}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity style={tw``}>
          <Text style={tw`font-bold text-blue-400 text-sm p-6`}>Requests</Text>
        </TouchableOpacity>

      </View>

      {/* Chats */}
      <ScrollView style={tw`w-full h-full`} showsHorizontalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

      {loading ? <UserSkeletonScreen refreshing={refreshing} onRefresh={onRefresh} /> : <View>{rooms.map((data, index)=> <RoomList key={index} room={data} />)}</View>}
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

    mainTheme: {
      display: "flex", 
      flexDirection: "column", 
      alignItems: 'center',
      width: width, 
      height: height, 
      backgroundColor: "#000",

    },

    
})
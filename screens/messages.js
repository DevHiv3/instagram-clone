import React, { useState, useEffect, useRef, useLayoutEffect }
 from "react"
import { StyleSheet, Text, View, SafeAreaView, Image, RefreshControl, ScrollView, TouchableOpacity, Dimensions, TouchableWithoutFeedback,Keyboard, Platform, KeyboardAvoidingView, TextInput, FlatList, } from 'react-native';
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from "@react-navigation/native";
import { base_url as url } from '../slices/authSlice'
import { useSelector } from 'react-redux';
import { formatDistanceToNowStrict } from "date-fns";
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

const messages = [
  {
    username: "Hitartha Gogoi",
    photo: "https://randomuser.me/api/portraits/men/73.jpg",
    type: "text",
    message: "Happy new year!",
    timestamp: "2d"
  },
  {
    username: "Hitartha Gogoi",
    photo: "https://randomuser.me/api/portraits/men/73.jpg",
    type: "text",
    message: "Happy new year!",
    timestamp: "2d"
  },
  {
    username: "Hitartha Gogoi",
    photo: "https://randomuser.me/api/portraits/men/73.jpg",
    type: "text",
    message: "Happy new year!",
    timestamp: "2d"
  },
  {
    username: "Hitartha Gogoi",
    photo: "https://randomuser.me/api/portraits/men/73.jpg",
    type: "text",
    message: "Happy new year!",
    timestamp: "2d"
  },
  {
    username: "Hitartha Gogoi",
    photo: "https://randomuser.me/api/portraits/men/73.jpg",
    type: "text",
    message: "Happy new year!",
    timestamp: "2d"
  },
  {
    username: "Hitartha Gogoi",
    photo: "https://randomuser.me/api/portraits/men/73.jpg",
    type: "text",
    message: "Happy new year!",
    timestamp: "2d"
  },
  {
    username: "Hitartha Gogoi",
    photo: "https://randomuser.me/api/portraits/men/73.jpg",
    type: "text",
    message: "Happy new year!",
    timestamp: "2d"
  },
  {
    username: "Hitartha Gogoi",
    photo: "https://randomuser.me/api/portraits/men/73.jpg",
    type: "text",
    message: "Happy new year!",
    timestamp: "2d"
  },
  {
    username: "Hitartha Gogoi",
    photo: "https://randomuser.me/api/portraits/men/73.jpg",
    type: "text",
    message: "Happy new year!",
    timestamp: "2d"
  }
]

export default function MessagesScreen(){

    const navigation = useNavigation()
    const base_url = useSelector(url)
    const [ token, setToken ] = useState("")
    const [ userId, setUserId ] = useState("")
    const [ rooms, setRooms ] = useState([])
    
        useEffect(() => {
            const checkAuth = async () => {
              const storedToken = await SecureStore.getItemAsync('token');
        
              if (storedToken) {
                setToken(storedToken)
                console.log(storedToken)
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
      }
    }
  
    

  const [refreshing, setRefreshing] = useState(false);

      const onRefresh = ()=>{
        fetchRooms()
      };
    
      const RoomList = ({ room })=> (
        <TouchableOpacity onPress={()=> navigation.navigate("Chat", { roomId: room._id, currentUserId: userId, id: room.users[0]._id })} style={tw`flex flex-row w-full h-22 justify-between align-center border-white`}>

          <View style={tw`flex flex-row justify-center align-center h-20`}>
          <View style={tw`flex flex-col align-center justify-center ml-4`}>
            <Image style={tw`h-14 w-14 rounded-full border-4 border-gray-700`} source={{ uri: room.users[0].photo }} />
          </View>
            <View style={tw`flex flex-col align-center justify-center ml-4 `}>
              <Text style={tw`text-white text-lg font-semibold`}>{room.users[0].username}</Text>
              <Text style={tw`text-gray-300`}>{room.message}<Text style={tw``}></Text> {formatDistanceToNowStrict(new Date(room.timestamp))}</Text>
            </View>
          </View>

          <View style={tw`flex flex-col align-center justify-center mr-2`}>
          <TouchableOpacity style={tw``} onPress={()=> navigation.goBack()}><Feather name="camera" size={24} color="gray" /></TouchableOpacity>
          </View>
        </TouchableOpacity>
         )

  return (
    <SafeAreaView style={styles.mainTheme}>

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
      {rooms.map((data, index)=> <RoomList key={index} room={data} />)}
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
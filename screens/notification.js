import { View, Text, Alert, StyleSheet, ScrollView, RefreshControl, Button, Image, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import { Ionicons, Feather, FontAwesome, AntDesign, FontAwesome5, Entypo, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import {  base_url as url } from "../slices/authSlice";
import tw from "twrnc"
import { formatDistanceToNowStrict } from "date-fns";
import NotificationSkeletonScreen from '../components/notification-placeholder';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get("window")
const IMAGE_SIZE = width / 3 - 10;

export default function NotificationScreen(){

    const navigation = useNavigation()

    useLayoutEffect(()=>{
      navigation.setOptions({
        title: "Notifications",
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

    const [ token, setToken ] = useState("")
    const [ userId, setUserId ] = useState("")
    const [ notifications, setNotifications ] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const base_url = useSelector(url)
    const [ loading, setLoading ] = useState(true)

    const fetchNotifications = async()=>{
      try {
      const storedToken = await SecureStore.getItemAsync('token');
      const link = `${base_url}/receive-notifications`
      const response = await fetch(link, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        }
      })
      const result = await response.json()
      setNotifications(result.notifications)
      setRefreshing(false)
      } catch(error){
        ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
        ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
        console.error("Error: ", error)
      } finally {
        setLoading(false)
      }
    }
    
        useEffect(() => {
            const checkAuth = async () => {
              const storedToken = await SecureStore.getItemAsync('token');
        
              if (storedToken) {
                setToken(storedToken)
                fetchNotifications()
              } else {
                navigation.replace("Signup")
              }
            };
        
            checkAuth();
          }, []);

    const onRefresh = async()=>{
      setLoading(true)
      setRefreshing(true)
      fetchNotifications()
      setRefreshing(false)
      setLoading(false)
    };

  const NotificationsList = ({ notification }) =>(
  <TouchableOpacity style={tw`flex flex-row w-full h-22 justify-between items-center align-center border-white mr-2`}>

    <View style={tw`flex flex-row justify-center align-center h-20`}>
      <View style={tw`flex flex-col align-center justify-center ml-4`}>
        <Image style={tw`h-14 w-14 rounded-full border-4 border-gray-700`} source={{ uri: notification.photo }} />
      </View>
      <View style={tw`flex flex-col align-center justify-center ml-4 w-50 text-wrap`}>
        <Text style={tw`text-white text-sm font-semibold`}>{notification.message}</Text>
        <Text style={tw`text-gray-300`}>{formatDistanceToNowStrict(new Date(notification.timestamp))}</Text>
      </View>

      <View style={tw`flex flex-row justify-center items-center h-20 mr-8`}>
        <TouchableOpacity style={tw`rounded-2xl bg-blue-400 h-12 p-4`} onPress={()=> navigation.navigate(notification.type, { id: notification.id })}><Text style={tw`font-bold text-center text-white text-sm `}>See {notification.type}</Text></TouchableOpacity>
    </View>
  </View>

    <View style={tw`flex flex-col align-center justify-center mr-2`}>
     </View>
  </TouchableOpacity>
)

  return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {loading ? <NotificationSkeletonScreen refreshing={refreshing} onRefresh={onRefresh} /> :
          <View> {notifications.map((data, index)=> <NotificationsList key={index} notification={data} />)} </View>}
        </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
   flex: 1,
   backgroundColor: '#000',
   height: height,
   width: width,
 },
 grid: {
  margin: 5,
},
imageContainer: {
  margin: 5,
},
image: {
  width: IMAGE_SIZE,
  height: IMAGE_SIZE,
  borderRadius: 5,
},
  

})
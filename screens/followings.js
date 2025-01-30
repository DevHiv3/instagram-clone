import { View, Text, Alert, StyleSheet, Button, RefreshControl, ScrollView, Dimensions, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import { AntDesign, Ionicons, Feather, FontAwesome, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { Placeholder, PlaceholderMedia, PlaceholderLine, Fade }from "rn-placeholder";
import { base_url as url } from '../slices/authSlice'
import Octicons from '@expo/vector-icons/Octicons';
import tw from "twrnc"

const { width, height } = Dimensions.get("window")

export default function FollowingsScreen(){

    const navigation = useNavigation()
    const base_url = useSelector(url)
    const route = useRoute()
    const { id } = route.params

    const [ token, setToken ] = useState("")
    const [ refreshing, setRefreshing ] = useState(false)
    const [ profile, setProfile ] = useState({})
    const [ userId, setUserId ] = useState("")
    const [ user, setUser ] = useState({})
    const [ users, setUsers ] = useState([])
    const [ followings, setFollowings ] = useState([])
    const [ isAdmin, setIsAdmin ] = useState(false)

    useEffect(() => {
      const checkAuth = async () => {
        const storedToken = await SecureStore.getItemAsync('token');
        const uid = await SecureStore.getItemAsync("id")
        
        try{
          if(storedToken){
            await fetchProfile()
            await fetchUsers()
            setToken(storedToken)
            setUserId(uid)
          } else {
            navigation.replace("Signup")
          }
        } catch(error){
          console.log("An error occured", error)

        }
      };
  
      checkAuth();
    }, []);

    useLayoutEffect(()=>{
      navigation.setOptions({
        title: "Followings",
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

    const truncateText = (text, maxLength) => {
      return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };
  
    const maxLength = 16;

    const onRefresh = async()=>{
      await fetchProfile();
      await fetchUsers();
    }

    const fetchProfile = async()=>{
      const storedToken = await SecureStore.getItemAsync('token');
      const uid = await SecureStore.getItemAsync("id")
      try{
        const link = `${base_url}/user/${uid}`
        const response = await fetch(link, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          },
        })

        const result = await response.json()
        setProfile(result)
        
      } catch(error){
        console.error("Error: ", error)
      }
    }

    const fetchUsers = async()=>{
      const storedToken = await SecureStore.getItemAsync('token');
      const uid = await SecureStore.getItemAsync("id")
      try{
        const link = `${base_url}/populated-user/${id}`
        const response = await fetch(link, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          },
        })

        const result = await response.json()
        setUsers(result.followings)

        const urlLink = `${base_url}/user/${id}`
        const res = await fetch(urlLink, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          },
        })

        const resp = await res.json()
        setFollowings(resp.followings)
        setUser(resp)
        if(resp.id == uid){
          setIsAdmin(true)
        }
        
      } catch(error){
        console.error("Error: ", error)
      }
    }
    
    const follow = async(followId)=>{
      const storedToken = await SecureStore.getItemAsync('token');
      try{
        const link = `${base_url}/follow/${followId}`
        const response = await fetch(link, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          },
        })
        
        const result = await response.json()
        
        if(result.message === "success"){
          ToastAndroid.show(`You have started following`, ToastAndroid.SHORT)
          const urlLink = `${base_url}/create-notification`
          await fetch(urlLink, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
           },
           body: JSON.stringify({
             message: `${profile.username} has started following you`,
             type: "Profile",
             action: "follow",
             id: profile.id,
             photo: profile.photo,
             receiver: followId
            })
          })

          fetchUsers()
        }

      } catch(error){
        ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
        ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
        console.error("Error: ", error)
      }
    }
          
    const unfollow = async(followId)=>{
      const storedToken = await SecureStore.getItemAsync('token');
      try{
        const link = `${base_url}/unfollow/${followId}`
        const response = await fetch(link, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          },
        })
        
        const result = await response.json()
        
        if(result.message === "success"){
          ToastAndroid.show("unfollowed!", ToastAndroid.SHORT)
          fetchUsers()
        }
      } catch(error){
        ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
        ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
        console.error("Error: ", error)
      }
    }

  const UserList = ({ following }) =>(
  <TouchableOpacity onPress={()=> navigation.navigate("Profile", { id: following._id })} style={tw`flex flex-row w-full h-22 justify-between items-center align-center border-white mr-2`}>
    
    <View style={tw`flex flex-row justify-center align-center h-20`}>
      <View style={tw`flex flex-col align-center justify-center ml-4`}>
        <Image style={tw`h-14 w-14 rounded-full border-4 border-gray-700`} source={{ uri: following.photo }} />
      </View>
      <View style={tw`flex flex-col align-center justify-center ml-4 w-44 text-wrap`}>
        <Text style={tw`text-white text-sm font-semibold`}>{following.username}</Text>
        <Text style={tw`text-gray-300`}>{truncateText(following.email, maxLength)}</Text>
      </View>

      <View style={tw`flex flex-row justify-center items-center h-20 mr-8`}>
        {isAdmin ? <TouchableOpacity style={tw`rounded-2xl bg-blue-400 h-12 p-4`} onPress={()=> unfollow(following._id)}><Text style={tw`font-bold text-center text-white text-sm `}> Unfollow </Text></TouchableOpacity> : <View />}
    </View>
  </View>

    <View style={tw`flex flex-col align-center justify-center mr-2`}>
    </View>
  </TouchableOpacity>
)

    
  return (
        <View style={styles.container}>
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} style={tw`w-full h-full`}>
            {(users || []).map((data, index)=> <UserList following={data} key={index} />)}
          </ScrollView>
        </View>
  )
}

const styles = StyleSheet.create({
    container: {
   flex: 1,
   backgroundColor: '#000000',
   height: height,
   width: width,
   paddingTop: 20,
 },

})
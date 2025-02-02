import { View, Text, Alert, StyleSheet, ScrollView, RefreshControl, Button,Dimensions, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import { AntDesign, Ionicons, Feather, FontAwesome, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { Placeholder, PlaceholderMedia, PlaceholderLine, Fade }from "rn-placeholder";
import { base_url as url } from '../slices/authSlice'
import UserSkeletonScreen from "../components/user-placeholder"
import Octicons from '@expo/vector-icons/Octicons';
import tw from "twrnc"

const { width, height } = Dimensions.get("window")

export default function FollowersScreen(){

    const navigation = useNavigation()
    const base_url = useSelector(url)
    const route = useRoute()
    const { id } = route.params

    const [ token, setToken ] = useState("")
    const [ profile, setProfile ] = useState({})
    const [ refreshing, setRefreshing ] = useState(false)
    const [ user, setUser ] = useState({})
    const [ userId, setUserId ] = useState("")
    const [ users, setUsers ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ followers, setFollowers ] = useState([])
    const [ isAdmin, setIsAdmin ] = useState(false)

    useEffect(() => {
      const checkAuth = async () => {
        const storedToken = await SecureStore.getItemAsync('token');
        const uid = await SecureStore.getItemAsync("id");
  
        if (storedToken) {
          fetchProfile()
          fetchUsers()
          setToken(storedToken)
          setUserId(uid)
        } else {
          navigation.replace("Signup")
        }
      };
  
      checkAuth();
    }, []);

    useLayoutEffect(()=>{
      navigation.setOptions({
        title: "Followers",
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
      setLoading(true)
      await fetchProfile();
      await fetchUsers();
      setLoading(false)
    }

    const fetchProfile = async()=>{
      const storedToken = await SecureStore.getItemAsync('token');
      const userId = await SecureStore.getItemAsync("id")
      try{
        const link = `${base_url}/user/${userId}`
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
      const uid = await SecureStore.getItemAsync("id");
      const storedToken = await SecureStore.getItemAsync('token');
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
        setUsers(result.followers)

        const urlLink = `${base_url}/user/${id}`
        const res = await fetch(urlLink, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          },
        })

        const resp = await res.json()
        setFollowers(resp.followers)
        setUser(resp)
        setLoading(false)
        if(resp.id === uid){
          setIsAdmin(true)
        }
        
      } catch(error){
        console.error("Error: ", error)
      }
    }
              
    const removeFollower = async(followId)=>{
      const storedToken = await SecureStore.getItemAsync('token');
      try{
        const link = `${base_url}/remove-follower/${followId}`
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

    const UserList = ({ follower }) =>(
  <TouchableOpacity onPress={()=>{ navigation.navigate("Profile", { id: follower._id }); console.log(user.followers.includes(userId)) }} style={tw`flex flex-row w-full h-22 justify-between items-center align-center border-white mr-2`}>
    
    <View style={tw`flex flex-row justify-center align-center h-20`}>
      <View style={tw`flex flex-col align-center justify-center ml-4`}>
        <Image style={tw`h-14 w-14 rounded-full border-4 border-gray-700`} source={{ uri: follower.photo }} />
      </View>
      <View style={tw`flex flex-col align-center justify-center ml-4 w-44 text-wrap`}>
        <Text style={tw`text-white text-sm font-semibold`}>{follower.username}</Text>
        <Text style={tw`text-gray-300`}>{truncateText(follower.email, maxLength)}</Text>
      </View>

      <View style={tw`flex flex-row justify-center items-center h-20 mr-8`}>
        {isAdmin ? <TouchableOpacity style={tw`rounded-2xl bg-blue-400 h-12 p-4`} onPress={()=> removeFollower(follower._id)}><Text style={tw`font-bold text-center text-white text-sm `}> remove </Text></TouchableOpacity>: <View />}
      </View>
  </View>

    <View style={tw`flex flex-col align-center justify-center mr-2`}>
    </View>
  </TouchableOpacity>
)

    
  return (
        <View style={styles.container}>
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} style={tw`w-full h-full`}>
          {loading ? <UserSkeletonScreen refreshing={refreshing} onRefresh={onRefresh} /> : <View> {(users || []).map((data, index)=> <UserList follower={data} key={index} />)} </View>}
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
   paddingTop: 40,
 },

})
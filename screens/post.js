import { View, Text, Alert, StyleSheet, TextInput, Linking, Button, ScrollView, Platform, Image, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import tw from "twrnc"
import Post from "../components/post"
import { useSelector } from "react-redux";
import { base_url as url } from "../slices/authSlice";
import Ionicons from '@expo/vector-icons/Ionicons';
const { width, height } = Dimensions.get("window")

export default function PostScreen(){

    const navigation = useNavigation()
    const route = useRoute()
    const base_url = useSelector(url)

    const { id, profileId, content } = route.params

    const [ post, setPost ] = useState(null)
    const [ user, setUser ] = useState({})
    const [ userId, setUserId ] = useState("")
    const [ token, setToken ] = useState("")
    const [ comment, setComment ] = useState("")
    const [ likes, setLikes ] = useState(0)
    const [ comments, setComments ] = useState([])
    const [ postEditVisibility, setPostEditVisibility ] = useState(false);
    const [ loading, setLoading ] = useState(true)
    const [isVisible, setIsVisible] = useState(false);
    const [ isAdmin, setIsAdmin ] = useState(false)

    useLayoutEffect(()=>{
      navigation.setOptions({
        title: "Post",
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

    useEffect(() => {
      const checkAuth = async () => {
        const storedToken = await SecureStore.getItemAsync('token');
        const uid = await SecureStore.getItemAsync('id');
        if (storedToken) {
          fetchPosts(storedToken)
          fetchUserProfile(storedToken)
          setToken(storedToken)
          setUserId(uid)
        } else {
          navigation.replace("Signup")
        }
      };
      checkAuth();
    }, []);

    const fetchPosts = async(token)=>{
      try{
        const link = `${base_url}/post/${id}`
        const response = await fetch(link, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })

        const result = await response.json()
        setPost(result.data)
        setLikes(result.data.likes.length)
        setComments(result.data.comments)
      } catch(error){
        ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
        ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
        console.error("Error: ", error)
      } finally {
        setLoading(false)
      }
    }

       const fetchUserProfile = async(token)=>{
            const uid = await SecureStore.getItemAsync("id")
            try{
                const link = `${base_url}/user/${profileId}`
                const response = await fetch(link, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })
              
                const result = await response.json()
                setUser(result)
                if(result.id == uid){
                  setIsAdmin(true)
                }
            
            } catch(error){
              ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
              ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
                console.error("Error: ", error)
            } finally {
              setLoading(true)
            }
        }
    
        const reload = async()=>{
          const storedToken = await SecureStore.getItemAsync('token');
          try{
            fetchPosts(storedToken)
            fetchUserProfile(storedToken)
          } catch(error){
            ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
            ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
            console.error("Error: ", error)
          } 
        }

  return (
    <View style={styles.container}>
      {loading ? <Text></Text> : <Post content={post} userId={userId} isAdmin={isAdmin} token={token} />}
      
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
   flex: 1,
   backgroundColor: '#000',
   height: height,
   width: width,
   paddingTop: 40,
 },

})
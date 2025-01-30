import { View, Text, Alert, Animated,  Modal,  BackHandler, StatusBar, TouchableWithoutFeedback, StyleSheet, Button,Dimensions, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import { useSelector } from 'react-redux';
import { base_url as url } from "../slices/authSlice";
import tw from "twrnc"

import Story from '../components/story-component';

const { width, height } = Dimensions.get("window")

export default function StoryScreen(){

  const route = useRoute()
  const base_url = useSelector(url)
  const { id, username, avatar } = route.params
  const [ stories, setStories ] = useState([]);
  const navigation = useNavigation()
  const  [ loading, setLoading ] = useState(true)
  const [ token, setToken ] = useState("")

  const fetchStories = async()=>{
    const storedToken = await SecureStore.getItemAsync('token');
    try{
      const link = `${base_url}/story/${id}`
      const response = await fetch(link, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        }
      })

      const result = await response.json()
      setStories(result.stories)
      if(result.stories.length == 0){
        ToastAndroid.show("No stories found!", ToastAndroid.SHORT)
        navigation.goBack()
      } else {
        setLoading(false)
      }
       
    } catch(error){
      console.error(error)
    } finally {

    }
  }
    
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = await SecureStore.getItemAsync('token');
      
      if (storedToken) {
        setToken(storedToken)
        fetchStories()
      } else {
        navigation.replace("Signup")
      }
    };
    
    checkAuth();
  }, []);


  return (
    <View style={styles.container}>
      {loading ? <Text style={tw`text-white text-center font-bold`}>Loading...</Text> : <Story contents={stories} username={username} avatar={avatar} goBack={()=> navigation.navigate("Home")} id={id} />}
    </View>)
    
}

const styles = StyleSheet.create({
    container: {
   flex: 1,
   backgroundColor: '#1f1f1f',
   height: height,
   width: width,
 },
})
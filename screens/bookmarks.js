import { View, Text, Alert, StyleSheet, ScrollView, RefreshControl, FlatList, Button, Dimensions, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import {  base_url as url } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons, Feather, FontAwesome, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import tw from "twrnc"

const { width, height } = Dimensions.get("window")
const IMAGE_SIZE = width / 3 - 10;

export default function BookmarkScreen(){

  const navigation = useNavigation()
  const base_url = useSelector(url)
  const [ token, setToken ] = useState("")
  const [ bookmarks, setBookmarks ] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(()=>{
    navigation.setOptions({
      title: "Bookmarks",
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
      if (storedToken) {
        setToken(storedToken)
        getBookmarks(storedToken)
      } else {
        navigation.replace("Signup")
      }
    };
        
    checkAuth();
  }, []);

  const getBookmarks = async(storedToken)=>{
    try{
      const link = `${base_url}/bookmarks`
      const response = await fetch(link, {
        method: "GET",
        headers: {
          'Content-Type': "application/json",
          'Authorization': `Bearer ${storedToken}`
        }
      })

      const result = await response.json()
      setBookmarks(result.bookmarks)
      setLoading(false)
    } catch(error){
      ToastAndroid.show("An error occured", ToastAndroid.SHORT)
      console.log("An error occured: ", error)
    }
  }

  const onRefresh = async()=>{
    const storedToken = await SecureStore.getItemAsync('token');
    setRefreshing(true)
    getBookmarks(storedToken)
    setRefreshing(false)
  };

  const renderItem = ({ item }) => (
              <TouchableOpacity onPress={()=> navigation.navigate("Post", { id: item.post })} style={styles.imageContainer}>
                <Image source={{ uri: item.photo }} style={styles.image} />
              </TouchableOpacity>
              );
    
  return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {loading ? <Text style={tw`text-white text-center font-bold`}>Loading....</Text> : <FlatList data={bookmarks} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} numColumns={3} contentContainerStyle={styles.grid} />}
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
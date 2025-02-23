import { View, Text, Alert, StyleSheet, FlatList, Button, Dimensions, Image, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import tw from "twrnc"
import { useDispatch, useSelector } from "react-redux";
import { Ionicons, Feather, FontAwesome, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import {  base_url as url } from "../slices/authSlice";
import * as MediaLibrary from 'expo-media-library';
import { Video } from "expo-av";
const { width, height } = Dimensions.get("window")
const IMAGE_SIZE = width / 3 - 10;

export default function CreateReelScreen(){

    const navigation = useNavigation()
    const base_url = useSelector(url)
    const [ token, setToken ] = useState("")
    const [ videos, setVideos ] = useState([]);
    const [loading, setLoading] = useState(true);
    
        useEffect(() => {
            const checkAuth = async () => {
              const storedToken = await SecureStore.getItemAsync('token');
        
              if (storedToken) {
                setToken(storedToken)
                
              } else {
                navigation.replace("Signup")
              }
            };
        
            checkAuth();
          }, []);

          useEffect(() => {
            const fetchVideos = async () => {
              try {
                const { status } = await MediaLibrary.requestPermissionsAsync();
                if (status !== 'granted') {
                  alert('Permission to access media library is required!');
                  return;
                }

                const prevAssets = await MediaLibrary.getAssetsAsync({
                  mediaType: 'video',
                  first: 100, // Adjust to load more or fewer Videos
             //     sortBy: [[MediaLibrary.SortBy.creationTime, false]],
                })

                setVideos(prevAssets.assets.map((asset)=> asset.uri))

              } catch (error) {
                console.error('Error reading Videos:', error);
              } finally {
                setLoading(false)
                remainingVideos()
              }
            };
        
            fetchVideos();
          }, []);

          const remainingVideos = async()=>{
            try{

              const totalAssets = await MediaLibrary.getAssetsAsync({
                mediaType: 'video',
            //    sortBy: [[MediaLibrary.SortBy.creationTime, false]],
              });

              const totalCount = totalAssets.totalCount; 

              const assets = await MediaLibrary.getAssetsAsync({
                mediaType: 'video',
                first: totalCount, // Adjust to load more or fewer Videos
            //    sortBy: [[MediaLibrary.SortBy.creationTime, false]],
              })
             // console.log(Videos)
              setVideos((prevVideos)=> [...prevVideos, ...assets.assets.map((asset) => asset.uri)])

            } catch(error){
              console.error('Error reading Videos:', error);
            }
          }

         

          useLayoutEffect(()=>{
            navigation.setOptions({
              title: "Reel",
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
              headerRight: ()=> <TouchableOpacity><Text style={tw`font-bold text-blue-400 text-sm`}>Next</Text></TouchableOpacity>,
        
            })
          },[])

          const renderItem = ({ item }) => (
            <TouchableOpacity onPress={()=> navigation.navigate("Finalize-Reel", { reelUrl: item })} style={styles.imageContainer}>
              <Video source={{ uri: item }} style={styles.image} shouldPlay={false} isMuted={true} />
            </TouchableOpacity>
          );
    
  return (
        <View style={styles.container}>
          {loading ? <Text style={tw`text-white text-center font-bold`}>Loading....</Text> : <FlatList data={videos} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} numColumns={3} contentContainerStyle={styles.grid} />}
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
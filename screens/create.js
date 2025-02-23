import { View, Text, Alert, StyleSheet, FlatList, Button, Dimensions, Image, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import tw from "twrnc"
import { useDispatch, useSelector } from "react-redux";
import { Ionicons, Feather, FontAwesome, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import {  base_url as url } from "../slices/authSlice";
import * as MediaLibrary from 'expo-media-library';

const { width, height } = Dimensions.get("window")
const IMAGE_SIZE = width / 3 - 10;

export default function CreateScreen(){

    const navigation = useNavigation()
    const base_url = useSelector(url)
    const [ token, setToken ] = useState("")
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ selectedMedia, setSelectedMedia ] = useState("")
    
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
            const fetchImages = async () => {
              try {
                const { status } = await MediaLibrary.requestPermissionsAsync();
                if (status !== 'granted') {
                  alert('Permission to access media library is required!');
                  return;
                }

                const prevAssets = await MediaLibrary.getAssetsAsync({
                  mediaType: 'photo',
                  first: 100 // Adjust to load more or fewer images
                })

                setImages(prevAssets.assets.map((asset)=> asset.uri))

              } catch (error) {
                console.error('Error reading images:', error);
              } finally {
                setLoading(false)
                remainingImages()
              }
            };
        
            fetchImages();
          }, []);

          const remainingImages = async()=>{
            try{

              const totalAssets = await MediaLibrary.getAssetsAsync({
                mediaType: 'photo',
              });

              const totalCount = totalAssets.totalCount; 

              const assets = await MediaLibrary.getAssetsAsync({
                mediaType: 'photo',
                first: totalCount, // Adjust to load more or fewer images
              })
             // console.log(images)
              setImages((prevImages)=> [...prevImages, ...assets.assets.map((asset) => asset.uri)])

            } catch(error){
              console.error('Error reading images:', error);
            }
          }

          useLayoutEffect(()=>{
            navigation.setOptions({
              title: "Post",
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
            <TouchableOpacity onPress={()=> navigation.navigate("Finalize-Post", { photo: item })} style={styles.imageContainer}>
              <Image source={{ uri: item }} style={styles.image} />
            </TouchableOpacity>
          );
    
  return (
        <View style={styles.container}>
          {loading ? <Text style={tw`text-white text-center font-bold`}>Loading....</Text> : <FlatList data={images} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} numColumns={3} contentContainerStyle={styles.grid} />}
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
import { View, Text, Alert, StyleSheet, Button, ScrollView, FlatList, Dimensions, Image, TextInput, TouchableOpacity, ToastAndroid } from 'react-native'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons, Feather, FontAwesome, AntDesign, FontAwesome5, Entypo, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import {  base_url as url } from "../slices/authSlice";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import * as MediaLibrary from 'expo-media-library';
import PostProgressBar from "../components/post-progress-bar"
import tw from "twrnc"

const { width, height } = Dimensions.get("window")

const IMAGE_SIZE = width / 3 - 10;

export default function CreateStory(){

    const navigation = useNavigation()
    const base_url = useSelector(url)

    const [ user, setUser ] = useState({})
    const [ token, setToken ] = useState("")
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ hasPickedImage, setHasPickedImage ] = useState(false)
    const [ image, setImage ] = useState(user.photo)
    const [ username, setUsername ] = useState("")
    const [ open, setOpen] = useState(false);
    const [ progressIndicator, setProgressIndicator ] = useState(0)

    useLayoutEffect(()=>{
        navigation.setOptions({
          title: "New Story",
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
          headerLeft: ()=> <TouchableOpacity onPress={()=> navigation.goBack()}><Ionicons name="arrow-back" size={24} color="white" /></TouchableOpacity>
    
        })
      },[])

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images', 'videos'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
        ToastAndroid.show("image selected!", ToastAndroid.SHORT);
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
          setHasPickedImage(true)
          console.log(result.assets[0].uri)
        } else {
          setHasPickedImage(false)
        }
      };

    const createStory = async ()=> {
      try {
        if(!image){
            ToastAndroid.show("Pick an image!", ToastAndroid.SHORT)
        }
          const userId = await SecureStore.getItemAsync("id")
          
          const uploadTask = FileSystem.createUploadTask(`${base_url}/story`, image, {
            headers: {
              'Content-Type': 'multipart/form-data', // Important for Multer to parse
              'Authorization': `bearer ${token}`
            },
            fieldName: 'photo', // Name of the file field in the request
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            parameters: {
                type: "image",
                user: userId
            }
        },
        (progress) => {
            setOpen(true)
          const progressBar = (progress.totalBytesSent / progress.totalBytesExpectedToSend) * 100;
          setProgressIndicator(progressBar)
        })
        
        const result = await uploadTask.uploadAsync();
        
        if(result.status === 200){
          ToastAndroid.show("Story added!", ToastAndroid.SHORT)
          navigation.navigate("Home")
         }
      
      } catch(error){
        ToastAndroid.show("Error uploading profile!", ToastAndroid.SHORT)
        console.error("Error uploading profile!", error)
      }
    }


    const fetchProfile = async()=>{
        const userId = await SecureStore.getItemAsync("id")
        try{
            const link = `${base_url}/user/${userId}`
            const response = await fetch(link, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            
            const result = await response.json()
            setUser(result)
        
        } catch(error){
            console.error("Error: ", error)
        } finally {
          //  setLoading(false)
        }
    }

    const remainingImages = async()=>{
        try{
            const totalAssets = await MediaLibrary.getAssetsAsync({
                mediaType: 'photo',
            });
            const totalCount = totalAssets.totalCount;
            const assets = await MediaLibrary.getAssetsAsync({
                mediaType: 'photo',
                first: totalCount,
            })

            setImages((prevImages)=> [...prevImages, ...assets.assets.map((asset) => asset.uri)])

        } catch(error){
            console.error('Error reading images:', error);
        }
    }
    
    
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = await SecureStore.getItemAsync('token');
            if (storedToken) {
                setToken(storedToken)
                console.log(storedToken)
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
                    first: 100 
                })

                setImages(prevAssets.assets.map((asset)=> asset.uri))
                const pics = prevAssets.assets.map((asset)=> asset.uri)
                setImage(pics[0])
            } catch (error) {
                console.error('Error reading images:', error);
            } finally {
                setLoading(false)
                remainingImages()
            }
        }

        fetchImages()
    }, []);

    const renderItem = ({ photo }) => (
    <TouchableOpacity onPress={()=> setImage(photo)} style={styles.imageContainer}>
        <Image source={{ uri: photo }} style={styles.image} />
        </TouchableOpacity>
    );
    
  return (
        <View style={styles.container}>
            <PostProgressBar open={open} close={()=> setOpen(false)} message={"adding your story..."} progress={progressIndicator} />
        <View style={tw`flex flex-row justify-center align-center w-full h-76`}>
            {!loading ? <Image style={tw`w-full h-76`} source={{ uri: image }} />: <Text style={tw`text-white text-center font-bold`}>Loading....</Text>} 
        </View>
        {!loading ? <Button title={"Pick an Image"} style={tw`m-2`} onPress={pickImage} /> : <Text style={tw`text-white text-center font-bold`}>Loading....</Text>} 

        <ScrollView style={styles.container}>
        {loading ?
         <Text style={tw`text-white text-center font-bold`}>Loading....</Text> : 
         <FlatList data={images} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} numColumns={3} contentContainerStyle={styles.grid} />}
         </ScrollView>

        <View style={tw`flex flex-row w-full h-14 justify-center align-center mt-4`}>
            <TouchableOpacity onPress={createStory} style={tw`flex justify-center bg-blue-600 w-4/5 h-14 rounded-xl`}>
              <Text style={tw`text-white uppercase text-center font-bold`}>add to story</Text>
            </TouchableOpacity>
        </View>
      
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
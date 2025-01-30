import { View, Text, Alert, StyleSheet, Button, TextInput, ScrollView, Image,Dimensions, TouchableOpacity, ToastAndroid } from 'react-native'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import { Ionicons, FontAwesome, Feather, AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import tw from "twrnc"
import { base_url as url } from '../slices/authSlice'
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import * as ImagePicker from 'expo-image-picker';
import Modal from '../components/modal';
import { useFonts, Inter_900Black, Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold } from '@expo-google-fonts/inter';

const { width, height } = Dimensions.get("window")

export default function ChatScreen(){

    const navigation = useNavigation()
    const route = useRoute()
    const base_url = useSelector(url)
    const MessagesRef = useRef(null);

    const { id, roomId, currentUserId, userProfilePhoto, userUsername } = route.params
    const socket = io(base_url);
    const messageInputRef = useRef(null)

    const [ token, setToken ] = useState("")
    const [ image, setImage ] = useState("")
    const [ baseEncoding, setBaseEncoding ] = useState("")
    const [ currentUser, setCurrentUser ] = useState({})
    const [ user, setUser ] = useState({})
    const [ userPhoto, setUserPhoto ] = useState("")
    const [ username, setUsername ] = useState("loading...")
    const [ message, setMessage ] = useState("") 
    const [ messageId, setMessageId ] = useState("")
    const [ messages, setMessages ] = useState([])
    const [ fileType, setFileType ] = useState("")
    const  [open, setOpen] = useState(false);
    const [ gifVisibility, setGifVisibility ] = useState(false)
    const [ hasPickedImage, setHasPickedImage ] = useState(false)

    useEffect(() => {
      if (MessagesRef.current) {
        MessagesRef.current.scrollToEnd({ animated: true });
      }
    }, [messages]);

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
        setCurrentUser(result)
      
      } catch(error){
        console.error("Error: ", error)
      } finally {
      //  setLoading(false)
      }
    }

    const deleteMessage = async()=>{
      socket.emit("delete-message", roomId, messageId, currentUserId, id);
      setOpen(false)
    }

    const pickImage = async () => {
      
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        base64: true, 
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled) {
        const type = result.assets[0].uri.split(".").pop();
        setFileType(type)
        setImage(result.assets[0].uri);
        setHasPickedImage(true);
        setBaseEncoding(`data:image/${fileType};base64,${result.assets[0].base64}`)
        console.log(`data:image/${fileType};base64,${result.assets[0].base64}`)
        messageInputRef.current.setNativeProps({ text: "IMAGE SELECTED" });
        ToastAndroid.show(`Image selected!`, ToastAndroid.SHORT);
      } else {
        setHasPickedImage(false)
      }
    };

    const dropSelectedImage = async()=>{
      setImage("")
      setHasPickedImage(false);
      setBaseEncoding("")
      messageInputRef.current.setNativeProps({ text: "" });
    }


    const getMessages = async()=>{
      const storedToken = await SecureStore.getItemAsync('token');
      const userId = await SecureStore.getItemAsync("id")
      try{
        const link = `${base_url}/messages`
        const response = await fetch(link, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          },
          body: JSON.stringify({ sender: userId, receiver: id })
        })
        
        const result = await response.json()
        setMessages(result.messages)
    
      } catch(error){
        console.error("Error: ", error)
      } finally {
      //  setLoading(false)
      }
    }

    const fetchUserProfile = async()=>{
      const storedToken = await SecureStore.getItemAsync('token');
      try{
        const link = `${base_url}/user/${id}`
        const response = await fetch(link, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          },
        })
        
        const result = await response.json()
        setUser(result)
        setUsername(result.username)
        setUserPhoto(result.photo)
        console.log("The result and username: ", result.username)
      } catch(error){
        console.error("Error: ", error)
      } finally {
        socket.emit('join-room', roomId, currentUserId, id);
      //  setLoading(false)
      }
    }

    useEffect(()=>{

      getMessages()
      fetchUserProfile()

      socket.on("receive-messages", (msgs) => {
        setMessage("")
        setMessages(msgs);
      });

      return () => {
        socket.disconnect();
      };
    }, [])

    const sendMessage = async ()=> {

      if(hasPickedImage){
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await wait(3000)
        socket.emit("send-message-media", image, fileType, baseEncoding, roomId, currentUserId, id)
        setHasPickedImage(false)
        messageInputRef.current.setNativeProps({ text: "" });
        setBaseEncoding("")
      } else {
        socket.emit("send-message", message, roomId, currentUserId, id)
        setMessage("")
      }
    }
  
  useLayoutEffect(()=>{
    navigation.setOptions({
      headerTitle: ()=>(
      <TouchableOpacity onPress={()=> navigation.navigate("Profile", { id: id })} style={tw`flex flex-row justify-center align-center`}>
        <View style={tw`flex flex-col align-center justify-center`}>
          <Image style={tw`h-10 w-10 rounded-full border-4 border-gray-700`} source={{ uri: userProfilePhoto }} />
        </View>
        
        <View style={tw`flex flex-col align-center justify-center ml-2`}>
          <Text style={tw`text-white font-bold text-xl`}>{userUsername}</Text>
        </View>
        </TouchableOpacity>
        ),
        
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
        
        headerRight: ()=> (
        <View style={tw`flex flex-row`}>
          <TouchableOpacity onPress={()=> navigation.goBack()}>
            <Ionicons name="call-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={tw`ml-6`} onPress={()=> navigation.goBack()}>
            <Feather name="video" size={24} color="white" />
          </TouchableOpacity>
        </View>),
    })
  },[])

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = await SecureStore.getItemAsync('token');
      const userId = await SecureStore.getItemAsync('id');
      if (storedToken) {
        setToken(storedToken)
        fetchProfile()
        fetchUserProfile()
        getMessages()
        
      } else {
        navigation.replace("Signup")
      }
    };
      checkAuth();
    }, []);

    let [fontsLoaded, fontError] = useFonts({
        Inter_900Black,
        Inter_100Thin,
        Inter_200ExtraLight,
        Inter_300Light,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_800ExtraBold,
    });
    
    if (!fontsLoaded && !fontError) {
      return null;
    }

  return (
    <View style={styles.container}>
      
    <ScrollView ref={MessagesRef} style={styles.container}>

    {messages.map((message, index) => (
      <View key={index}>
        {!(message.sender._id === currentUserId) == true ? 
        /* LEFT HAND TEXT */
        <View style={tw`flex-row justify-start mb-2`}>
          <TouchableOpacity onPress={()=>{ if(message.type !== "text"){ navigation.navigate("Photo", { photo: message.message })}}} style={tw`flex ${message.type == "text" ? "p-6": "" } rounded-3xl bg-neutral-800 w-40 self-start`}>
          {message.type == "text" ? <Text selectable={true} style={tw`text-white font-semibold`}>{message.message} </Text>: <Image style={tw`rounded-2xl h-40 w-full`} source={{ uri: message.message }} />}
          </TouchableOpacity>
        </View>
      :
       /* RIGHT HAND TEXT */
      <View style={tw`flex-row justify-end mb-2`}>
        <TouchableOpacity onPress={()=>{ if(message.type !== "text"){ navigation.navigate("Photo", { photo: message.message })}}} onLongPress={()=>{ setOpen(true); setMessageId(message._id)}} delayLongPress={500} style={tw`${message.type == "text" ? "p-6": "" } rounded-3xl bg-fuchsia-800 w-40 m-2 self-end`}>
          {message.type == "text" ? <Text selectable={false} style={tw`text-white font-semibold`}>{message.message} </Text>: <Image style={tw`rounded-2xl h-40 w-full`} source={{ uri: message.message }} />}
        </TouchableOpacity>
      </View>
      }
    </View>
    ))}

    </ScrollView>

    {/* Fixed bottom view */}
    <View style={[tw`bg-neutral-800`, styles.bottomBar]}>
      <View style={tw`flex flex-row justify-center items-center bg-neutral-800 `}>
        <TouchableOpacity style={tw`mr-2`}><MaterialIcons name="gif-box" size={24} color="white" /></TouchableOpacity>

        <View style={tw`flex flex-row align-center justify-center`}>
          <TextInput ref={messageInputRef} editable={!hasPickedImage} selectTextOnFocus={!hasPickedImage} value={message} onChangeText={(text)=> setMessage(text)} style={tw` w-4/5 w-3/5 h-14 bg-neutral-800 text-white`} placeholderTextColor="#AAA" placeholder="write something..." />
          {hasPickedImage ? <TouchableOpacity style={tw`mt-4`} onPress={dropSelectedImage}><MaterialIcons name="cancel" size={24} color="white" /></TouchableOpacity>: <View />}
        </View>

        <View style={tw`flex flex-row`}>
          <TouchableOpacity onPress={pickImage}><Entypo name="camera" size={24} color="white" /></TouchableOpacity>
          <TouchableOpacity style={tw`mx-4`} onPress={sendMessage}><Ionicons name="send" size={24} color="white" /></TouchableOpacity>
        </View>
        
      </View>
    </View>

    <Modal open={open} close={()=> setOpen(false)} message={" Do you want to delete the message ?"} proceed={deleteMessage} optionOne={"delete"} />

  </View>


  )
}


const styles = StyleSheet.create({
  container: {
   flex: 1,
   backgroundColor: "#000",
   paddingBottom: 60,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 5,
    alignItems: "center",
  },
  bottomText: {
    color: "white",
    fontSize: 16,
  },
})
import { View, Text, Alert, StyleSheet, Button, RefreshControl, FlatList, ScrollView, Image, TextInput, Animated, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import { useSelector, useDispatch } from 'react-redux';
import tw from "twrnc"
import Octicons from '@expo/vector-icons/Octicons';
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { base_url as url } from '../slices/authSlice'

const { width, height } = Dimensions.get("window")
const IMAGE_SIZE = width / 3 - 10;

export default function SearchScreen(){

    const navigation = useNavigation()
    const base_url = useSelector(url)

    const [ query, setQuery ] = useState("")
    const [ profile, setProfile ] = useState({})
    const [ userId, setUserId ] = useState("")
    const [ token, setToken ] = useState("")
    const [ users, setUsers ] = useState([])


    const fetchProfile = async(token)=>{
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
            setProfile(result)
            
          } catch(error){
            console.error("Error: ", error)
          }
        }

    const follow = async(id)=>{
          const storedToken = await SecureStore.getItemAsync('token');
          try{
            const link = `${base_url}/follow/${id}`
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
                 receiver: id
                })
              })
              search()
            }
    
          } catch(error){
            ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
            ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
            console.error("Error: ", error)
          }
        }
      
        const unfollow = async(id)=>{
          const storedToken = await SecureStore.getItemAsync('token');
          try{
            const link = `${base_url}/unfollow/${id}`
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
              search()
            }
          } catch(error){
            ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
            ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
            console.error("Error: ", error)
          }
        }
    
        useEffect(() => {
            const checkAuth = async () => {
              const storedToken = await SecureStore.getItemAsync('token');
              const uid = await SecureStore.getItemAsync("id")

              if (storedToken) {
                setToken(storedToken)
                setUserId(uid)
                fetchProfile()
                search()
              } else {
                navigation.replace("Signup")
              }
            };
        
            checkAuth();
          }, [search]);

      const search = async(token)=>{  
        const storedToken = await SecureStore.getItemAsync('token');
              try{
                const link = `${base_url}/search?username=${query}`
                const response = await fetch(link, {
                  method: "GET",
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`
                  },
                })
      
                const result = await response.json()
                setUsers(result.data)
      
              } catch(error){
                ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
                ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
                console.error("Error: ", error)
              } finally {
                 setLoading(false)
              }
            }
      

    useLayoutEffect(()=>{
        navigation.setOptions({
          title: "",
          headerTitleAlign: 'center',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: "#222",
          },
          headerTitleStyle: {
            textAlign: 'center',
            color: 'white',
            fontWeight: "bold"
          },
          headerLeft: ()=> <TouchableOpacity onPress={()=> navigation.navigate("Home")}><Ionicons name="arrow-back" size={24} color="white" /></TouchableOpacity>,
          headerRight: ()=> <View></View>,
    
        })
      },[])

  const [inputWidth] = useState(new Animated.Value(280));

  const expandInput = () => {
    Animated.timing(inputWidth, {
      toValue: 320,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const shrinkInput = () => {
    Animated.timing(inputWidth, {
      toValue: 280,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const ProfilePosts = ({ item , index}) => (
            <TouchableOpacity key={index} style={styles.imageContainer}>
              <Image source={{ uri: "https://randomuser.me/api/portraits/men/73.jpg" }} style={styles.image} />
           </TouchableOpacity>
           );

const UserList = ({ user }) =>(
        <TouchableOpacity onPress={()=> navigation.navigate("Profile", { id: user._id })} style={tw`flex flex-row w-full h-22 justify-between align-center border-white`}>

          <View style={tw`flex flex-row justify-center align-center h-20`}>
          <View style={tw`flex flex-col align-center justify-center ml-4`}>
            <Image style={tw`h-14 w-14 rounded-full border-4 border-gray-700`} source={{ uri: user.photo }} />
          </View>
            <View style={tw`flex flex-col align-center justify-center ml-4 `}>
              <Text style={tw`text-white text-lg font-semibold`}>{user.username}</Text>
              <Text style={tw`text-gray-300`}>{user.email}</Text>
            </View>
          </View>

          <View style={tw`flex flex-col align-center justify-center mr-2`}>
            {!user.followers.includes(userId) ? 
          <TouchableOpacity style={tw``} onPress={()=> follow(user._id)}><Text style={tw`font-bold text-blue-400 text-sm p-6`}>Follow</Text></TouchableOpacity> :
          <TouchableOpacity style={tw``} onPress={()=> unfollow(user._id)}><Text style={tw`font-bold text-blue-400 text-sm p-6`}>Unfollow</Text></TouchableOpacity>}
          </View>
        </TouchableOpacity>
)
    
  return (
    <View style={styles.container}>

        <TouchableOpacity
        onPress={expandInput}
        activeOpacity={0.7}
        style={styles.inputContainer}>
       <Animated.View  style={[styles.mainTextBar, { width: inputWidth }]}>
       <AntDesign name="search1" size={40} color="#F4F4F4" />
      <TextInput value={query} onChangeText={(text)=>{ setQuery(text); search()}} style={styles.mainTextInput}  placeholderTextColor="#AAA" placeholder="Search" onFocus={expandInput} onBlur={shrinkInput}>
      </TextInput>
      </Animated.View>

      </TouchableOpacity>
    
    
     {!query ? 
      <FlatList contentContainerStyle={styles.grid} keyExtractor={(item, index) => index.toString()} data={[1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0]} renderItem={()=> <View />} key={3} numColumns={3} /> :   
    <ScrollView style={tw`w-full h-full`}>
      {users.map((data, index)=> <UserList user={data} key={index} />)}
    </ScrollView>
    }

    <View style={[tw`z-2 fixed bottom-0 left-0 w-full h-20 pt-2 bg-black text-white flex flex-row justify-evenly `]}>
      <TouchableOpacity onPress={()=> navigation.navigate("Home")}><Octicons name="home" size={30} color="white" /></TouchableOpacity>
      <TouchableOpacity onPress={()=> navigation.navigate("Search")}><AntDesign name="search1" size={30} color="white" /></TouchableOpacity>
      <TouchableOpacity onPress={()=> navigation.navigate("Create")}><FontAwesome name="plus-square-o" size={30} color="white" /></TouchableOpacity>
      <TouchableOpacity onPress={()=> navigation.navigate("Notification")}><AntDesign name="hearto" size={30} color="white" /></TouchableOpacity>
      <TouchableOpacity onPress={()=>{ navigation.navigate("Profile", { id: userId })}}><Image style={tw`h-8 w-8 rounded-full`} source={{ uri: profile.photo }} /></TouchableOpacity>
    </View>

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
 bottomBar: {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
  backgroundColor: "#000",
  paddingVertical: 15,
  position: "absolute",
  bottom: 0,
  width: "100%",
  padding: 5,
  alignItems: "center",
},
 
 inputContainer: {
    width: '100%',
    alignItems: 'center',
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },

  mainTextBar: {
    display: "flex",
    flexDirection: "row",
    borderRadius : 10,
    marginHorizontal: 20,
    marginVertical: 30,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#1f1f1f',
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 10,
  },

  mainTextInput: {
    height: '100%',
    width: "90%",
    fontSize: 18,
    fontWeight: '600',
    color: "#FFF",
    marginLeft: 10,
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
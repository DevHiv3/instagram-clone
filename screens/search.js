import { View, Text, Alert, StyleSheet, Button, RefreshControl, FlatList, ScrollView, Image, TextInput, Animated, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import { useSelector, useDispatch } from 'react-redux';
import tw from "twrnc"
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import BottomNavigation from "../components/bottom-navigation";
import AntDesign from '@expo/vector-icons/AntDesign';
import { base_url as url } from '../slices/authSlice'

const { width, height } = Dimensions.get("window")
const IMAGE_SIZE = width / 3 - 10;

export default function SearchScreen(){

    const navigation = useNavigation()
    const base_url = useSelector(url)

    const [ query, setQuery ] = useState("")
    const [ userId, setUserId ] = useState("")
    const [ token, setToken ] = useState("")
    const [ users, setUsers ] = useState([])

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
              search()
            }
    
          } catch(error){
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
                console.log(storedToken)
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
                console.log("all the searched users: ",result.data)
      
              } catch(error){
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
              <Text style={tw`text-gray-300`}>{user.email} <Text style={tw``}></Text>2d</Text>
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

    <BottomNavigation>

    <View style={styles.container}>

      <ScrollView>

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
    
     {!query ? <FlatList contentContainerStyle={styles.grid} keyExtractor={(item, index) => index.toString()} data={[1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0]} renderItem={()=> <View />} key={3} numColumns={3} /> :   
    <View style={tw`w-full h-full`}>
      {users.map((data)=> <UserList user={data} />)}
    </View>
    }
      </ScrollView>
      
    </View>
    </BottomNavigation>
   

  )
}


const styles = StyleSheet.create({
    container: {
   flex: 1,
   backgroundColor: '#1f1f1f',
   height: height,
   width: width,
   paddingTop: 40,
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
    backgroundColor: '#2f2f2f',
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
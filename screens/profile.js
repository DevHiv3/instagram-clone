import { View, Text, Alert, StyleSheet, FlatList, Image, RefreshControl , Dimensions, TouchableOpacity, ToastAndroid, ScrollView } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import { AntDesign, Ionicons, Feather, FontAwesome, Entypo, FontAwesome5 } from '@expo/vector-icons';
import BottomNavigation from '../components/bottom-navigation';
import { useSelector, useDispatch } from 'react-redux';
import { Placeholder, PlaceholderMedia, PlaceholderLine, Fade }from "rn-placeholder";
import { base_url as url } from '../slices/authSlice'
import tw from "twrnc"

const { width, height } = Dimensions.get("window")
const IMAGE_SIZE = width / 3 - 10

export default function ProfileScreen(){

     const route = useRoute()
     const { id } = route.params
     const [ token, setToken ] = useState("")
     const [ userId, setUserId ] = useState("")
     const base_url = useSelector(url)

      const [refreshing, setRefreshing] = useState(false);
      const [ loading, setLoading ] = useState(true)

      const onRefresh = async()=>{
        const storedToken = await SecureStore.getItemAsync('token');
        fetchPosts(storedToken)
        fetchProfile(storedToken)
      };

    const navigation = useNavigation()

    const [ user, setUser ] = useState({})
    const [ posts, setPosts ] = useState([])
    const [ followers, setFollowers ] = useState([])
    const [ hasFollowed, setHasFollowed ] = useState(false)
    const [ followings, setFollowings ] = useState([])
    const [ isAdmin, setIsAdmin ] = useState(false)

    const addRoom = async()=>{
      const storedToken = await SecureStore.getItemAsync('token');
      const uid = await SecureStore.getItemAsync('id');
      try{
        const link = `${base_url}/create-room`
        const response = await fetch(link, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          },
          body: JSON.stringify({ userId: id })
        })

        const result = await response.json()
        navigation.navigate("Chat", { id: user.id, roomId: result.id, currentUserId: uid })

      } catch(error){
        console.error("Error: ", error)
      }
    }

    const follow = async()=>{
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
          ToastAndroid.show(`You have started following ${user.username}`, ToastAndroid.SHORT)
          const storedToken = await SecureStore.getItemAsync('token');
          onRefresh()
        }

      } catch(error){
        console.error("Error: ", error)
      }
    }
  
    const unfollow = async()=>{
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
          const storedToken = await SecureStore.getItemAsync('token');
          onRefresh()
        }
      } catch(error){
        console.error("Error: ", error)
      }
    }

      const fetchProfile = async(token)=>{
        const userId = await SecureStore.getItemAsync("id")
        try{
          const link = `${base_url}/user/${id}`
          const response = await fetch(link, {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          })

          const result = await response.json()
          setUser(result)
          setFollowers(result.followers)
          setFollowings(result.followings)
          console.log(followers, followers.includes(userId), id, userId)
          if(result.id === userId){
            setIsAdmin(true)
          }

        } catch(error){
          console.error("Error: ", error)
        } finally {
           setLoading(false)
        }
      }

      const fetchPosts = async(token)=>{

        try{
          const link = `${base_url}/profile-posts/${id}`
          const response = await fetch(link, {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          })

          const result = await response.json()
          setPosts(result.data)
 
        } catch(error){
          console.error("Error: ", error)
        } 
      }
    
        useEffect(() => {
            const checkAuth = async () => {
              const storedToken = await SecureStore.getItemAsync('token');
              const uid = await SecureStore.getItemAsync('id');
              if (storedToken) {
                setToken(storedToken)
                setUserId(uid)
                fetchProfile(storedToken)
                fetchPosts(storedToken)
              } else {
                navigation.replace("Signup")
              } 
            };
        
            checkAuth();
          }, []);

          const ProfilePosts = ({ item , index}) => (
          <TouchableOpacity onPress={()=> navigation.navigate("Post", { id: item._id })} key={index} style={styles.imageContainer}>
            <Image source={{ uri: item.photo }} style={styles.image} />
         </TouchableOpacity>
         );
  

  return (
    <BottomNavigation>
        <View style={styles.container}>
        
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={tw`flex flex-row justify-between items-center`}>
            <Text style={tw`font-extrabold text-2xl text-white pl-4`}><Ionicons name="lock-closed-outline" size={24} color="white" />{loading ? "" : user.username}</Text>
            <TouchableOpacity onPress={()=> navigation.replace("Create-Story")}><FontAwesome name="plus-square-o" size={30} color="white" /></TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate("Settings")} style={tw`pr-6`}><Feather name="menu" size={24} color="white" /></TouchableOpacity>
        </View>

        <View style={tw`flex flex-row justify-evenly items-center`}>
        
            <View style={tw`flex flex-col justify-center items-center h-28 w-28`}>
                <TouchableOpacity onPress={()=> navigation.navigate("Story", { id: user.id, username: user.username, avatar: user.photo })}><Image style={tw`h-20 w-20 rounded-full border-4 border-gray-700`} source={{ uri: loading ? "https://res.cloudinary.com/dhpyflgu6/image/upload/v1735353839/profile-pics/photo-1735353839194.jpg" : user.photo }} /></TouchableOpacity>
                <Text style={tw`font-bold text-lg text-white`}>{loading ? "" : user.username}</Text>
            </View> 

            <View style={tw`flex flex-col justify-center items-center`}>
                <Text style={tw`font-bold text-lg uppercase text-white`}>0</Text>
                <Text style={tw`text-white`}>posts</Text>
            </View>

            <View style={tw`flex flex-col justify-center items-center`}>
                <Text style={tw`font-bold text-lg uppercase text-white`}>{loading ? 0 : followers.length }</Text>
                <Text style={tw`text-white`}>followers</Text>
            </View>

            <View style={tw`flex flex-col justify-center items-center`}>
                <Text style={tw`font-bold text-lg uppercase text-white`}>{loading ? 0 : followings.length }</Text>
                <Text style={tw`text-white`}>followings</Text>
            </View>
            
        </View>

        <View style={tw`flex flex-row justify-evenly items-center m-2`}>

          
          {isAdmin ?
            <TouchableOpacity onPress={()=> navigation.navigate("Edit-Profile", { user: user })} style={tw`bg-[#2f2f2f] p-2 pl-12 pr-12 m-2 rounded`}>
                <Text style={tw`text-white font-bold`}>Edit Profile</Text>
            </TouchableOpacity>
            :
            <View> 
              {!followers.includes(userId) ? 
              <TouchableOpacity onPress={follow} style={tw`bg-[#2f2f2f] p-2 pl-12 pr-12 m-2 rounded`}>
              <Text style={tw`text-white font-bold`}>   follow   </Text>
            </TouchableOpacity>
              :
              <TouchableOpacity onPress={unfollow} style={tw`bg-[#2f2f2f] p-2 pl-12 pr-12 m-2 rounded`}>
              <Text style={tw`text-white font-bold`}>unfollow </Text>
            </TouchableOpacity>
            } 
            
            </View>
          }
          {isAdmin ?
          <TouchableOpacity style={tw`bg-[#2f2f2f] p-2 pl-12 pr-12 m-2 rounded`}>
            <Text style={tw`text-white font-bold`}>Share Profile </Text>
          </TouchableOpacity>
           : 
           <TouchableOpacity onPress={addRoom} style={tw`bg-[#2f2f2f] p-2 pl-12 pr-12 m-2 rounded`}>
              <Text style={tw`text-white font-bold`}>Message </Text>
           </TouchableOpacity>}
  
        </View>

        <View style={tw`flex flex-row justify-between items-center ml-4 mr-4`}>

            <View style={tw`flex flex-col justify-center items-center`}>
            <TouchableOpacity style={tw`flex flex-row justify-center p-2 items-center w-16 h-16 border-2 border-white rounded-full`}>
                <Ionicons name="add" size={34} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-white`}>New</Text>
            </View>

        </View>

        {/* ALL POSTS */}
        <FlatList contentContainerStyle={styles.grid} keyExtractor={(item, index) => index.toString()} data={posts} renderItem={ProfilePosts} key={3} numColumns={3} />
  
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
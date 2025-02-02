import { View, Text, Alert, Share, StyleSheet, FlatList, Image, RefreshControl , Dimensions, TouchableOpacity, ToastAndroid, ScrollView } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import { AntDesign, Ionicons, Feather, FontAwesome, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { Placeholder, PlaceholderMedia, PlaceholderLine, Fade }from "rn-placeholder";
import { base_url as url } from '../slices/authSlice'
import ProfileSkeletonScreen from "../components/profile-placeholder"
import Octicons from '@expo/vector-icons/Octicons';
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
        setRefreshing(true)
        setLoading(true)
        const storedToken = await SecureStore.getItemAsync('token');
        fetchPosts(storedToken)
        fetchUserProfile(storedToken)
        fetchProfile(storedToken)
        setLoading(false)
        setRefreshing(false)
      };

    const navigation = useNavigation()

    const [ user, setUser ] = useState({})
    const [ profile, setProfile ] = useState({})
    const [ posts, setPosts ] = useState([])
    const [ followers, setFollowers ] = useState([])
    const [ hasFollowed, setHasFollowed ] = useState(false)
    const [ followings, setFollowings ] = useState([])
    const [ isAdmin, setIsAdmin ] = useState(false)

    const shareProfile = async () => {
      try {
        const fileUri = FileSystem.cacheDirectory + `shared-image.jpg`;
        const { uri } = await FileSystem.downloadAsync(user.photo, fileUri);
        const textToShare = "Check out my Profile!"
        const urlToShare = "https://instagram-clone.expo.app/"

        if (!(await Sharing.isAvailableAsync())) {
          Alert.alert("Sharing is not available on this device.");
          return;
        }

        await Share.share({
          message: `${textToShare}\n\n${urlToShare}`, // Text and URL combined
          url: uri,
        })

        await Sharing.shareAsync(uri);
        
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Something went wrong while sharing.");
      }
    };

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
        navigation.navigate("Chat", { id: user.id, roomId: result.id, currentUserId: uid, userProfilePhoto: user.photo, userUsername: user.username })

      } catch(error){
        ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
        ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
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
          onRefresh()
          ToastAndroid.show(`You have started following ${user.username}`, ToastAndroid.SHORT)
          const storedToken = await SecureStore.getItemAsync('token');
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
              receiver: user.id
            })
          })
          
        }

      } catch(error){
        ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
        ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
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
        ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
        ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
        console.error("Error: ", error)
      }
    }

    const fetchProfile = async(token)=>{
      const userId = await SecureStore.getItemAsync("id")
      const uid = await SecureStore.getItemAsync('id');
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
        ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
        ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
        console.error("Error: ", error)
      }
    }

      const fetchUserProfile = async()=>{
        const storedToken = await SecureStore.getItemAsync('token');
        const uid = await SecureStore.getItemAsync('id');
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
          setFollowers(result.followers)
          setFollowings(result.followings)
          if(result.id == uid){
            setIsAdmin(true)
          }
        } catch(error){
          ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
          ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
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
          ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
          ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
          console.error("Error: ", error)
        } 
      }
    
        useEffect(() => {
            const checkAuth = async () => {
              const storedToken = await SecureStore.getItemAsync('token');
              const uid = await SecureStore.getItemAsync('id');
              if (storedToken) {
                fetchUserProfile(storedToken)
                fetchProfile(storedToken)
                fetchPosts(storedToken)
                setToken(storedToken)
                setUserId(uid)
              } else {
                navigation.replace("Signup")
              } 
            };
        
            checkAuth();
          }, []);

          const ProfilePosts = ({ item , index}) => (
          <TouchableOpacity onPress={()=> navigation.navigate("Post", { id: item._id, profileId: item.admin._id, content: item })} key={index} style={styles.imageContainer}>
            <Image source={{ uri: item.photo }} style={styles.image} />
         </TouchableOpacity>
         );
  

  return (
        <View style={styles.container}>

          {loading ? <ProfileSkeletonScreen refreshing={refreshing} onRefresh={onRefresh} /> :
        
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={tw`flex flex-row justify-between items-center`}>
            <Text style={tw`font-extrabold text-2xl text-white pl-4`}><Ionicons name="lock-closed-outline" size={24} color="white" />{loading ? "" : user.username}</Text>
            {isAdmin ? <TouchableOpacity onPress={()=> navigation.replace("Create-Story")}><FontAwesome name="plus-square-o" size={30} color="white" /></TouchableOpacity> : <TouchableOpacity><Feather name="bell" size={30} color="white" /></TouchableOpacity>}
            {isAdmin ? <TouchableOpacity onPress={()=> navigation.navigate("Settings")} style={tw`pr-6`}><Feather name="menu" size={24} color="white" /></TouchableOpacity> : <TouchableOpacity onPress={()=> navigation.navigate("About", { id: user.id, photo: user.photo, username: user.username, timestamp: user.timestamp})} style={tw`pr-6`}><Feather name="more-vertical" size={24} color="white" /></TouchableOpacity>} 
        </View>

        <View style={tw`flex flex-row justify-evenly items-center`}>
            <View style={tw`flex flex-col justify-center items-center h-28 w-28`}>
                <TouchableOpacity onLongPress={()=> navigation.navigate("Photo", { photo: user.photo })} delayLongPress={500} onPress={()=> navigation.navigate("Story", { id: user.id, username: user.username, avatar: user.photo })}>
                  <Image style={tw`h-20 w-20 rounded-full border-4 border-gray-700`} source={{ uri: loading ? "" : user.photo }} />
                </TouchableOpacity>
                <Text style={tw`font-bold text-lg text-white`}>{loading ? "" : user.username}</Text>
            </View> 

            <View style={tw`flex flex-col justify-center items-center`}>
                <Text style={tw`font-bold text-lg uppercase text-white`}>{posts.length}</Text>
                <Text style={tw`text-white`}>posts</Text>
            </View>

            <View style={tw`flex flex-col justify-center items-center`}>
                <TouchableOpacity style={tw`flex flex-col justify-center items-center`} onPress={()=> navigation.navigate("Followers", { id: user.id })}>
                  <Text style={tw`font-bold text-lg uppercase text-white`}>{loading ? 0 : followers.length }</Text>
                  <Text style={tw`text-white`}>followers</Text>
                </TouchableOpacity>
            </View>

            <View style={tw`flex flex-col justify-center items-center`}>
              <TouchableOpacity style={tw`flex flex-col justify-center items-center`} onPress={()=> navigation.navigate("Followings", { id: user.id })}>
                <Text style={tw`font-bold text-lg uppercase text-white`}>{loading ? 0 : followings.length }</Text>
                <Text style={tw`text-white`}>followings</Text>
              </TouchableOpacity>
            </View>
            
        </View>

        <View style={tw`flex flex-row justify-evenly items-center m-2`}>

          
          {isAdmin ?
            <TouchableOpacity onPress={()=> navigation.navigate("Edit-Profile", { user: user })} style={tw`bg-[#1f1f1f] p-2 pl-12 pr-12 m-2 rounded`}>
                <Text style={tw`text-white font-bold`}>Edit Profile</Text>
            </TouchableOpacity>
            :
            <View> 
              {!followers.includes(userId) ? 
              <TouchableOpacity onPress={follow} style={tw`bg-blue-400 p-2 pl-12 pr-12 m-2 rounded`}>
              <Text style={tw`text-white font-bold`}>   follow   </Text>
            </TouchableOpacity>
              :
              <TouchableOpacity onPress={unfollow} style={tw`bg-[#1f1f1f] p-2 pl-12 pr-12 m-2 rounded`}>
              <Text style={tw`text-white font-bold`}>unfollow </Text>
            </TouchableOpacity>
            } 
            
            </View>
          }
          {isAdmin ?
          <TouchableOpacity onPress={shareProfile} style={tw`bg-[#1f1f1f] p-2 pl-12 pr-12 m-2 rounded`}>
            <Text style={tw`text-white font-bold`}>Share Profile </Text>
          </TouchableOpacity>
           : 
           <TouchableOpacity onPress={addRoom} style={tw`bg-[#1f1f1f] p-2 pl-12 pr-12 m-2 rounded`}>
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
        <View>
          <FlatList contentContainerStyle={styles.grid} keyExtractor={(item, index) => index.toString()} data={posts} renderItem={ProfilePosts} key={3} numColumns={3} />
        </View>
        
        </ScrollView>}


    <View style={[tw`z-2 fixed bottom-0 left-0 w-full h-20 pt-2 bg-black text-white flex flex-row justify-evenly `]}>
      <TouchableOpacity onPress={()=> navigation.navigate("Home")}><Octicons name="home" size={30} color="white" /></TouchableOpacity>
      <TouchableOpacity onPress={()=> navigation.navigate("Search")}><AntDesign name="search1" size={30} color="white" /></TouchableOpacity>
      <TouchableOpacity onPress={()=> navigation.navigate("Create")}><FontAwesome name="plus-square-o" size={30} color="white" /></TouchableOpacity>
      <TouchableOpacity onPress={()=> navigation.navigate("Notification")}><AntDesign name="hearto" size={30} color="white" /></TouchableOpacity>
      <TouchableOpacity onPress={()=>{ navigation.navigate("Profile", { id: profile.id })}}><Image style={tw`h-8 w-8 rounded-full`} source={{ uri: profile.photo }} /></TouchableOpacity>
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

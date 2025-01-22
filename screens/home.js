import React, { useState, useEffect,useRef, useLayoutEffect } from "react"
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, TouchableWithoutFeedback,Keyboard, Platform, KeyboardAvoidingView, ActivityIndicator, Image, TextInput, FlatList,  RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import BottomNavigation from "../components/bottom-navigation";
import { useSelector } from "react-redux";
import Post from "../components/post";
import { base_url as url } from "../slices/authSlice";

import tw from "twrnc"

const { width, height } = Dimensions.get("window")

export default function HomeScreen() {

    const navigation = useNavigation()
    const route = useRoute()
    const base_url = useSelector(url)

   const [currentUser] = useState({
    profile_image: 'https://randomuser.me/api/portraits/men/73.jpg',
  });
  
   const [refreshing, setRefreshing] = useState(false);
   const [ posts, setPosts ] = useState([]);
   const [ stories, setStories ] = useState([]);
   const [ userId, setUserId ] = useState("")

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const maxLength = 8;

  function getRandomImage() {
    let max = 100;
    let min = 1;
    let n = Math.floor(Math.random() * (max - min + 1) + min);
    let url = `https://randomuser.me/api/portraits/${
      n % 2 == 0 ? 'men' : 'women'
    }/${n}.jpg`;
    return url;
  }

  const onRefresh = ()=>{
    fetchPosts()
    fetchStories()
  };

  const [ token, setToken ] = useState("")

  const reload = async()=>{
    try{
      fetchPosts()
      fetchStories()
      
    } catch(error){
      console.error("Error: ", error)
    } 
  }

  const fetchPosts = async(token)=>{

    const storedToken = await SecureStore.getItemAsync('token');
    const id = await SecureStore.getItemAsync('id');

    try{
      const link = `${base_url}/feed/${id}`
      const response = await fetch(link, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
      })

      const result = await response.json()
      setPosts(result.posts)
      console.log(result.posts)

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
        console.log(storedToken)
        
        const link = `${base_url}/verify`
        const response = await fetch(link, {
          method: "GET",
           headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          },
        })
        
        const result = await response.json()
        console.log(result)
        
        if(result.message === "Invalid Token"){
          navigation.replace("Signup")
        } else if(result.message === "Access Denied"){
          navigation.replace("Signup")
        } else if(result.message === "User not found"){
          navigation.replace("Signup")
        }
        
        if(!response.ok){
          navigation.replace("Signup")
        }
        
        fetchPosts()
        fetchStories()
      
      } else {
        navigation.replace("Signup")
      }
    
    };
    
    checkAuth();
  }, []);

  const fetchStories = async()=>{
      const userId = await SecureStore.getItemAsync('id');
      const storedToken = await SecureStore.getItemAsync('token');
      try{
        const link = `${base_url}/feed-stories/${userId}`
        const response = await fetch(link, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          }
        })
  
        const result = await response.json()
        console.log(result.stories)
        setStories(result.stories)
         
      } catch(error){
        console.error(error)
      } finally {
  
      }
    }

    const renderItem = ({ item })=>(
      <View>
        <TouchableOpacity onPress={()=> navigation.navigate("Story", { id: item._id })} style={tw`flex flex-col `}>
        <View style={{ ...styles.storyUserProfile }}>
        <Image style={styles.storyUserProfileImage} source={{ uri: item.photo }} />
        </View>
        <Text style={tw`text-white text-sm`}>{truncateText(item.username, maxLength)}</Text>
        </TouchableOpacity>
      </View>
    )

  
    return (
        <BottomNavigation>
        <View style={{ ...styles.container }}>
           
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        {/* Stories View */}
        <View style={{ ...styles.storiesView }}>
          <View style={styles.storiesViewTitleView}>
            <Image style={tw`w-36 h-10 text-white`} source={{ uri: "https://www.logo.wine/a/logo/Instagram/Instagram-Wordmark-White-Dark-Background-Logo.wine.svg" }} />
            <View style={tw`flex flex-row w-30 justify-evenly`}>
            <TouchableOpacity onPress={()=> navigation.navigate("Messages")} style={{ ...styles.showAllText }}><AntDesign name="hearto" size={28} color="white" /></TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate("Messages")} style={{ ...styles.showAllText }}><FontAwesome5 name="facebook-messenger" size={24} color="white" /></TouchableOpacity>
          </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10 }}>
             <FlatList data={stories} horizontal={true} keyExtractor={(item, index)=> index.toString()} renderItem={renderItem} />
            </View>
          </ScrollView>
        </View>

        {/* Posts View */}
        <View style={styles.postsView}>
          {!posts ? <View style={tw`h-3/5 w-full flex-1`}><Text style={tw`text-white text-lg font-bold text-center`}>Start following someone </Text></View> :
          <View>
          {posts.map((post, index) => (
            <Post key={index} content={post} token={token} reload={fetchPosts} userId={userId} />
          ))}
          </View>}
        </View> 
        <View style={{ height: 20 }}></View>
      </ScrollView>
    </View>
    </BottomNavigation>
    );
  }

  const styles = StyleSheet.create({
     container: {
    flex: 1,
    backgroundColor: '#000',
    height: height,
    width: width,
    paddingTop: 40,
  },
  searchBarView: {
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: '#3f3f3f',
    marginRight: 10,
    borderRadius: 4,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  storiesView: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  storiesViewTitleView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storiesViewTitle: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'NSExtraBold',
  },
  showAllText: {
    color: '#c1c1c1',
    fontFamily: 'NSBold',
    fontSize: 18,
  },
  storyUserProfile: {
    display: "flex",
    flexDirection: "column",
    marginTop: 10,
    marginRight: 20,
    borderColor: '#B53471',
    borderWidth: 2.5,
    borderRadius: 100,
  },
  storyUserProfileImage: { width: 60, height: 60, borderRadius: 100 },
  postsView: { paddingHorizontal: 10, marginTop: 10 },
  postView: {
    paddingVertical: 10,
    marginTop: 10,
    backgroundColor: '#333',
    borderRadius: 10,
    shadowColor: '#1e1e1e',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 8,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  postStatsOpacity: {
    backgroundColor: '#222',
    padding: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },

  
  })
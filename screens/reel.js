import { StyleSheet, Text, View, Share, SafeAreaView, Dimensions, Linking, TextInput, FlatList, ToastAndroid, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Image, Alert } from 'react-native';
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import { Video } from "expo-av";
import { BottomSheet, Button, ListItem } from '@rneui/themed';
import { Ionicons, Feather, FontAwesome, AntDesign, FontAwesome5, Octicons, Entypo, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import {  base_url as url } from "../slices/authSlice";
import tw from "twrnc"
import * as Sharing from "expo-sharing";
import { formatDistanceToNowStrict } from "date-fns";
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get("window")

export default function ReelScreen(){

    const navigation = useNavigation()
    const route = useRoute()
    const base_url = useSelector(url) 
    const { reelId } = route.params
    const [ reel, setReel ] = useState({})
    const [ reels, setReels ] = useState([])
    const [ token, setToken ] = useState("")
    const [ userId, setUserId ] = useState("")
    const [ user, setUser ] = useState({})
    const [ isVisible, setIsVisible ] = useState(false);
    const [ comment, setComment ] = useState("")
    const [ comments, setComments ] = useState([])
    const videoRef = useRef(null);

    const reload = async()=>{
        await fetchProfile();
        await fetchReel()
        
    }

      const fetchReel = async()=>{
        const storedToken = await SecureStore.getItemAsync("token")
        try{
          const link = `${base_url}/reel/${reelId}`
          const response = await fetch(link, {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedToken}`
            },
          })
    
          const result = await response.json()
          
          setReel(result.data)
          setReels([result.data])
          setComments(result.data.comments)

        } catch(error){
          ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
          ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
          console.error("Error: ", error)
        } 
      }

    const follow = async()=>{
          const storedToken = await SecureStore.getItemAsync('token');
          try{
            const link = `${base_url}/follow/${reel.admin._id}`
            const response = await fetch(link, {
              method: "PUT",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
              },
            })
            
            const result = await response.json()
            
            if(result.message === "success"){
              reload()
              ToastAndroid.show(`You have started following ${reel.admin.username}`, ToastAndroid.SHORT)
              const storedToken = await SecureStore.getItemAsync('token');
              const urlLink = `${base_url}/create-notification`
              await fetch(urlLink, {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  message: `${user.username} has started following you`,
                  type: "Profile",
                  action: "follow",
                  id: user.id,
                  photo: user.photo,
                  receiver: reel.admin._id
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
          const link = `${base_url}/unfollow/${reel.admin._id}`
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
            reload()
          }
        } catch(error){
          ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
          ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
          console.error("Error: ", error)
        }
      }

    const likeReel = async()=>{

        try{
          const link = `${base_url}/reel/like/${reel._id}`
          const response = await fetch(link, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          })
          
          const result = await response.json()
          
          if(result.message === "success"){
            reload()
          }
        } catch(error){
          ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
          ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
          console.error("Error: ", error)
        }
      }

    const unlikeReel = async()=>{
        try{
          const link = `${base_url}/reel/unlike/${reel._id}`
          const response = await fetch(link, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          })
          
          const result = await response.json()
          
          if(result.message === "success"){
            reload()
          }
        } catch(error){
          ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
          ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
          console.error("Error: ", error)
        }
      }

    
    const fetchProfile = async()=>{
            const uid = await SecureStore.getItemAsync("id")
            const storedToken = await SecureStore.getItemAsync("token")
            try{
              const link = `${base_url}/user/${uid}`
              const response = await fetch(link, {
                method: "GET",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${storedToken}`
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
      
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = await SecureStore.getItemAsync('token');
            const uid = await SecureStore.getItemAsync('id');
            if (storedToken) {
                setToken(storedToken)
                setUserId(uid)
                await fetchProfile()
                await fetchReel()
            } else {
                navigation.replace("Signup")
            }
        };
        
        checkAuth();
    }, []);

    const addComment = async()=>{
        const uid = await SecureStore.getItemAsync("id")
        try{
          if(!comment){
            ToastAndroid.show("comment cannot be empty!", ToastAndroid.SHORT)
          } else {
          const link = `${base_url}/reel/comment/${reel._id}`
          const response = await fetch(link, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ comment: comment })
          })
          
          const result = await response.json()
          
          if(result.message === "success"){
            setComment("")
            reload()
          }
        }
        } catch(error){
          ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
          ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
          console.error("Error: ", error)
        }
      }
    
      const deleteComment = async(commentId)=>{
        try{
          const link = `${base_url}/reel/comment/${reel._id}?comment=${commentId}`
          const response = await fetch(link, {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          })
          
          const result = await response.json()
          
          if(result.message === "success"){
            ToastAndroid.show("Comment Deleted!", ToastAndroid.SHORT)
            reload()
          }
        } catch(error){
          ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
          ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
          console.error("Error: ", error)
        }
      }
    
      const shareReel = async () => {
        try {
          const textToShare = "Reel"
          const urlToShare = "https://instagram-clone.expo.app/"

          if (!(await Sharing.isAvailableAsync())) {
            Alert.alert("Sharing is not available on this device.");
            return;
          }
          
          await Share.share({
            message: `${textToShare}\n\n${urlToShare}`, // Text and URL combined
          //  url: uri,
          })
          
         // await Sharing.shareAsync(uri);
         
        } catch (error) {
          console.error(error);
          Alert.alert("Error", "Something went wrong while sharing.");
           }
      };

    const CommentComponent = ({ reelComment })=>(
        <View style={tw`ml-4 flex  flex-row justify-evenly mt-4 mb-4 `}>
          <TouchableOpacity onPress={()=>{ videoRef.current.pauseAsync(); navigation.navigate("Profile", { id: reelComment.postedBy._id }) }}><Image style={tw`h-12 w-12 rounded-full`} source={{ uri: reelComment.postedBy.photo }} /></TouchableOpacity>
                <View style={tw`flex flex-col w-80 ml-2`}>
                      <View style={tw`flex flex-row justify-between w-4/5`}>
                        <Text selectable style={tw`text-white font-semibold text-md w-4/5`}>{reelComment.postedBy.username}</Text>
                        {reelComment.postedBy._id === userId ? <TouchableOpacity onPress={()=> deleteComment(reelComment._id)}><MaterialIcons name="delete-outline" size={24} color="white" /></TouchableOpacity> : <View />}
                      </View>
                    <Text selectable style={tw`text-white`}>{reelComment.text}</Text>
                  </View>
          </View>
      )
    
  return (
    <FlatList data={reels} showsVerticalScrollIndicator={false} renderItem={({ item, index })=>(
      <View style={styles.videoContainer}>

        <TouchableWithoutFeedback style={styles.video} onLongPress={()=> videoRef.current.pauseAsync()} onPressOut={()=> videoRef.current.playAsync()} delayLongPress={500}>
          <Video ref={videoRef} source={{ uri: reel.url }} style={styles.video} resizeMode="cover" shouldPlay={true} isLooping={true} />
        </TouchableWithoutFeedback>

        {/* Right-Side Action Panel */}
        <View style={styles.actionPanel}>
            {/* Like Button */}

            <TouchableOpacity style={styles.iconButton}>
              {reel.likes.includes(userId) ? <FontAwesome name={"heart"} onPress={unlikeReel} size={30} color={"white"} /> : <FontAwesome name={"heart-o"} onPress={likeReel} size={30} color={"white"} /> }
              <Text style={styles.iconText}>{item.likes.length}</Text>
            </TouchableOpacity>
           
            {/* Comment Button */}
            <TouchableOpacity style={styles.iconButton} onPress={() =>{ setIsVisible(true) }}>
              <Ionicons name="chatbubble-outline" size={30} color="white" />
              <Text style={styles.iconText}>{item.comments.length}</Text>
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity style={styles.iconButton} onPress={shareReel}>
              <Ionicons name="arrow-redo-outline" size={30} color="white" />
              
            </TouchableOpacity>
          </View>

          {/* Bottom Info Section */}
        <View style={styles.bottomInfo}>

           <View style={styles.userSection}>
            <TouchableOpacity style={tw`flex flex-row`} onPress={()=>{ videoRef.current.pauseAsync(); navigation.navigate("Profile", { id: reel.admin._id }); }}>
              <Image source={{ uri: reel.admin.photo }} style={styles.avatar} />
              <Text style={styles.username}>{reel.admin.username}</Text>
            </TouchableOpacity>

              <TouchableOpacity onPress={reel.admin.followers.includes(userId) ? unfollow : follow} style={styles.followButton}>
                <Text style={styles.followText}>{reel.admin.followers.includes(userId) ? "unfollow" : "Follow"}</Text>
              </TouchableOpacity>
            </View>
           </View> 


           {/* COMMENT SECTION */}
          <BottomSheet onBackdropPress={() => setIsVisible(false)} isVisible={isVisible}>

            {/* COMMENT CONTAINER */}
            <View style={tw`h-120 bg-neutral-900`}>
              <Text style={tw`text-white font-bold text-center mt-4 mb-6 border-b-2 border-gray-800`}>Comments</Text>

              {/* COMMENT */}
              {!reel ? 
              <View></View> : 
              <ScrollView scrollEnabled={true}>
                {comments.map((reelComment, index)=> <CommentComponent key={index} reelComment={reelComment} />)}
              </ScrollView>}
            </View>

            {/* COMMENT INPUT */} 
            <View style={tw`flex flex-row justify-center items-center bg-neutral-800 `}>
              <TouchableOpacity style={tw`mr-2`}><Image style={tw`h-8 w-8 rounded-full`} source={{ uri: 'https://randomuser.me/api/portraits/men/73.jpg' }} /></TouchableOpacity>
              <TextInput style={tw` w-4/5 h-14 bg-neutral-800 text-white`} placeholderTextColor="#AAA" placeholder="write something..." value={comment} onChangeText={(text)=> setComment(text)} />
              <TouchableOpacity onPress={addComment}><Ionicons name="send" size={24} color="white" /></TouchableOpacity>
            </View>
            <Button onPress={()=> setIsVisible(false)} title="CLOSE" />
          </BottomSheet>

        <View style={[tw`z-2 fixed bottom-0 left-0 w-full h-20 pt-2 bg-black text-white flex flex-row justify-evenly `]}>
          <TouchableOpacity onPress={()=>{ videoRef.current.pauseAsync(); navigation.navigate("Home")}}><Octicons name="home" size={30} color="white" /></TouchableOpacity>
          <TouchableOpacity onPress={()=>{ videoRef.current.pauseAsync(); navigation.navigate("Search")}}><AntDesign name="search1" size={30} color="white" /></TouchableOpacity>
          <TouchableOpacity onPress={()=>{ videoRef.current.pauseAsync(); navigation.navigate("Create")}}><FontAwesome name="plus-square-o" size={30} color="white" /></TouchableOpacity>
          <TouchableOpacity onPress={()=>{ videoRef.current.pauseAsync(); navigation.navigate("Reels")}}><Octicons name="video" size={30} color="white" /></TouchableOpacity>
          <TouchableOpacity onPress={()=>{ videoRef.current.pauseAsync(); navigation.navigate("Profile", { id: user.id })}}><Image style={tw`h-8 w-8 rounded-full`} source={{ uri: user.photo }} /></TouchableOpacity>
        </View>
    </View>
      
    )}
  />
  )
}

const styles = StyleSheet.create({
    videoContainer: {
        height,
        justifyContent: "center",
        backgroundColor: "black",
        position: "relative",
      },
      video: {
        width: "100%",
        height: "100%",
      },
      bottomInfo: {
        position: "absolute",
        bottom: 80,
        left: 20,
        width: width - 100,
      },
      userSection: {
        flexDirection: "row",
        alignItems: "center",
      },
      avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "white",
      },
      username: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
      },
      followButton: {
        marginLeft: 10,
        backgroundColor: "red",
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
      },
      followText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
      },
      actionPanel: {
        position: "absolute",
        right: 20,
        bottom: 100,
        alignItems: "center",
      },
      iconButton: {
        alignItems: "center",
        marginBottom: 20,
      },
      iconText: {
        color: "white",
        fontSize: 14,
        marginTop: 5,
      },

})
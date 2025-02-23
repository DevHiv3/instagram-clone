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

export default function ReelsScreen(){

    const navigation = useNavigation()
    const base_url = useSelector(url) 
    const [ reels, setReels ] = useState([])
    const [ token, setToken ] = useState("")
    const [ isAdmin, setIsAdmin ] = useState(false)
    const [ userId, setUserId ] = useState("")
    const [ user, setUser ] = useState({})
    const [isVisible, setIsVisible] = useState(false);
    const [ comment, setComment ] = useState("")
    const videoRefs = useRef([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const truncateText = (text, maxLength) => {
      return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };
  
    const maxLength = 80;

    const handleViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
          const index = viewableItems[0].index;
          setActiveIndex(index);
    
          videoRefs.current.forEach((video, i) => {
            if (video) {
              i === index ? video.playAsync() : video.stopAsync();
            }
          });
        }
      };

      const pauseReel = () => {
        // Pause active video when screen is tapped
        if (activeIndex !== null && videoRefs.current[activeIndex]) {
          videoRefs.current[activeIndex].pauseAsync();
        }
      };

      const playReel = () => {
        if (activeIndex !== null && videoRefs.current[activeIndex]) {
          videoRefs.current[activeIndex].playAsync();
        }
      };

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
      
      const videos = [
        {
          id: "1",
          source: "https://www.w3schools.com/html/mov_bbb.mp4",
          likes: 1200,
          comments: 300,
          shares: 50,
          username: "user_one",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
          id: "2",
          source: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
          likes: 800,
          comments: 150,
          shares: 40,
          username: "user_two",
          avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        },
        {
          id: "3",
          source: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
          likes: 500,
          comments: 100,
          shares: 20,
          username: "user_three",
          avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        },
      ];

      const reload = async()=>{
        await fetchProfile();
        await fetchReels()
        
    }

      const fetchReels = async()=>{
        const storedToken = await SecureStore.getItemAsync("token")
        try{
          const link = `${base_url}/reels`
          const response = await fetch(link, {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedToken}`
            },
          })
    
          const result = await response.json()
          
          setReels(result.data)
          console.log(result.data)

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
                setToken(storedToken)
                setUserId(uid)
                await fetchProfile()
                await fetchReels()
            } else {
                navigation.replace("Signup")
            }
        };
        
        checkAuth();
    }, []);


    const follow = async(adminId, adminUsername)=>{
          const storedToken = await SecureStore.getItemAsync('token');
          try{
            const link = `${base_url}/follow/${adminId}`
            const response = await fetch(link, {
              method: "PUT",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
              },
            })
            
            const result = await response.json()
            
            if(result.message === "success"){
              fetchProfile()
              ToastAndroid.show(`You have started following ${adminUsername}`, ToastAndroid.SHORT)
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
                  receiver: adminId
                })
              })
              
            }
    
          } catch(error){
            ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
            ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
            console.error("Error: ", error)
          }
        }
    
    const unfollow = async(adminId)=>{
        const storedToken = await SecureStore.getItemAsync('token');
        try{
          const link = `${base_url}/unfollow/${adminId}`
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
            fetchProfile()
          }
        } catch(error){
          ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
          ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
          console.error("Error: ", error)
        }
      }

    const likeReel = async(reelId)=>{

        try{
          const link = `${base_url}/reel/like/${reelId}`
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

    const unlikeReel = async(reelId)=>{
        try{
          const link = `${base_url}/reel/unlike/${reelId}`
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

    const addComment = async(reelId)=>{
        const uid = await SecureStore.getItemAsync("id")
        try{
          if(!comment){
            ToastAndroid.show("comment cannot be empty!", ToastAndroid.SHORT)
          } else {
          const link = `${base_url}/reel/comment/${reelId}`
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
    
    const deleteComment = async(commentId, reelId)=>{
        try{
          const link = `${base_url}/reel/comment/${reelId}?comment=${commentId}`
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

    const CommentComponent = ({ reelComment, reelId, index })=>(
        <View style={tw`ml-4 flex  flex-row justify-evenly mt-4 mb-4 `} key={index}>
          <TouchableOpacity onPress={()=>{ pauseReel(); navigation.navigate("Profile", { id: reelComment.postedBy._id }) }}><Image style={tw`h-12 w-12 rounded-full`} source={{ uri: reelComment.postedBy.photo }} /></TouchableOpacity>
                <View style={tw`flex flex-col w-80 ml-2`}>
                      <View style={tw`flex flex-row justify-between w-4/5`}>
                        <Text selectable style={tw`text-white font-semibold text-md w-4/5`}>{reelComment.postedBy.username}</Text>
                        {reelComment.postedBy._id === userId ? <TouchableOpacity onPress={()=> deleteComment(reelComment._id, reelId)}><MaterialIcons name="delete-outline" size={24} color="white" /></TouchableOpacity> : <View />}
                      </View>
                    <Text selectable style={tw`text-white`}>{reelComment.text}</Text>
                  </View>
          </View>
      )

      if (!reels || reels.length === 0) return <View style={styles.container} />;
    
  return (

    <View style={styles.container}>
      <FlatList data={reels} keyExtractor={(item) => item.id} pagingEnabled showsVerticalScrollIndicator={false} snapToAlignment="start" snapToInterval={height} decelerationRate="fast" onViewableItemsChanged={handleViewableItemsChanged} viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }} 
       renderItem={({ item, index }) => (
         <View style={styles.videoContainer} key={index}>

          {/* COMMENT SECTION */}
          <BottomSheet onBackdropPress={() => setIsVisible(false)} isVisible={isVisible}>

            {/* COMMENT CONTAINER */}
            <View style={tw`h-120 bg-neutral-900`}>
              <Text style={tw`text-white font-bold text-center mt-4 mb-6 border-b-2 border-gray-800`}>Comments</Text>

              {/* COMMENT */}
              {!item ? 
              <View></View> : 
              <ScrollView scrollEnabled={true}>
                {item.comments.map((postComment, index)=> <CommentComponent key={index} reelComment={postComment} reelId={item._id} />)}
              </ScrollView>}
            </View>

          {/* COMMENT INPUT */} 
          <View style={tw`flex flex-row justify-center items-center bg-neutral-800 `}>
              <TouchableOpacity style={tw`mr-2`}><Image style={tw`h-8 w-8 rounded-full`} source={{ uri: user.photo }} /></TouchableOpacity>
              <TextInput style={tw` w-4/5 h-14 bg-neutral-800 text-white`} placeholderTextColor="#AAA" placeholder="write something..." value={comment} onChangeText={(text)=> setComment(text)} />
              <TouchableOpacity onPress={()=> addComment(item._id)}><Ionicons name="send" size={24} color="white" /></TouchableOpacity>
          </View>
          <Button onPress={()=> setIsVisible(false)} title="CLOSE" />
          </BottomSheet>

        {/* REELS */}
      
          <TouchableWithoutFeedback style={[tw` bg-black/50 opacity-80 h-full w-full`, styles.video]} delayLongPress={500} onLongPress={pauseReel} onPressOut={playReel}>
           <Video ref={(ref) => (videoRefs.current[index] = ref)} source={{ uri: item.url }} style={styles.video} resizeMode="cover" shouldPlay={index === activeIndex}  isLooping />
          </TouchableWithoutFeedback>

        {/* Right-Side Action Panel */}
         <View style={styles.actionPanel}>
            {/* Like Button */}

            <TouchableOpacity style={styles.iconButton}>
              {item.likes.includes(userId) ? <FontAwesome name={"heart"} onPress={()=> unlikeReel(item._id)} size={30} color={"white"} /> : <FontAwesome name={"heart-o"} onPress={()=> likeReel(item._id)} size={30} color={"white"} /> }
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

        
           <View style={tw`flex flex-row items-center`}>
            <TouchableOpacity style={tw`flex flex-row`} onPress={()=>{ pauseReel(); navigation.navigate("Profile", { id: item.admin._id }); }}>
              <Image source={{ uri: item.admin.photo }} style={styles.avatar} />
              <Text style={styles.username}>{item.admin.username}</Text>
            </TouchableOpacity>

            {!user.followings.includes(userId) ?
            <TouchableOpacity onPress={()=> unfollow(item.admin._id)} style={styles.followButton}>
              <Text style={styles.followText}>unfollow</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={()=> follow(item.admin._id, item.admin.username)} style={styles.followButton}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
            }
            </View>
            <View style={tw`flex flex-row justify-between items-center w-full`}>
              <Text style={tw`text-white`}>{truncateText(item.caption, maxLength)}</Text>
              
            </View>


        </View> 

        </View>
      
      )}
    />
    {/* BOTTOM NAVIGATION BAR */}
    <View style={[tw`z-2 fixed bottom-0 left-0 w-full h-20 pt-2 bg-black text-white flex flex-row justify-evenly `]}>
      <TouchableOpacity onPress={()=>{ pauseReel(); navigation.navigate("Home")}}><Octicons name="home" size={30} color="white" /></TouchableOpacity>
      <TouchableOpacity onPress={()=>{ pauseReel(); navigation.navigate("Search")}}><AntDesign name="search1" size={30} color="white" /></TouchableOpacity>
      <TouchableOpacity onPress={()=>{ pauseReel(); navigation.navigate("Create")}}><FontAwesome name="plus-square-o" size={30} color="white" /></TouchableOpacity>
      <TouchableOpacity onPress={()=> navigation.navigate("Reels")}><Octicons name="video" size={30} color="white" /></TouchableOpacity>
      <TouchableOpacity onPress={()=>{ pauseReel(); navigation.navigate("Profile", { id: user.id })}}><Image style={tw`h-8 w-8 rounded-full`} source={{ uri: user.photo }} /></TouchableOpacity>
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
  },
 
    videoContainer: {
        height,
        justifyContent: "center",
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
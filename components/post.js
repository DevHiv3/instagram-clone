import React, { useState, useEffect,useRef, useLayoutEffect }
 from "react"
import { StyleSheet, Text, View, SafeAreaView, Linking, TextInput, FlatList, ToastAndroid, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Feather as Icon, FontAwesome as FAIcon } from '@expo/vector-icons';
import tw from "twrnc"
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { BottomSheet, Button, ListItem } from '@rneui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { GestureHandlerRootView, PinchGestureHandler, GestureDetector, Gesture } from "react-native-gesture-handler";
import ImageView from "react-native-image-viewing";
import PostBottomSheet from "./post-bottomsheet";
import { base_url as url } from '../slices/authSlice'
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { formatDistanceToNowStrict, formatDistanceToNow } from "date-fns";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Post({ content, token, userId, isAdmin }) {

  const [isVisible, setIsVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const scale = useSharedValue(1);
  const [ post, setPost ] = useState(content)
  const [ comment, setComment ] = useState("")
  const [ bookmarks, setBookmarks ] = useState([]);
  const [ comments, setComments ] = useState([])
  const [ postEditVisibility, setPostEditVisibility ] = useState(false);
  const navigation = useNavigation()
  const base_url = useSelector(url)

  useLayoutEffect(()=>{
    navigation.setOptions({
      title: "Post",
      headerTitleAlign: 'center',
      headerTintColor: 'black',
      headerStyle: {
        backgroundColor: "#000",
      },
      headerTitleStyle: {
        textAlign: 'center',
        color: 'white',
        fontWeight: "bold"
      },
      headerLeft: ()=> <TouchableOpacity onPress={()=> navigation.goBack()}><Ionicons name="arrow-back" size={24} color="white" /></TouchableOpacity>

    })
  },[])

  const pinchGesture = Gesture.Pinch()
      .onUpdate((event) => {
        scale.value = event.scale;
      })
      .onEnd(() => {
        scale.value = withSpring(1);
      });
  
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

  const reload = async()=>{
    try{
      const link = `${base_url}/post/${post._id}`
      const response = await fetch(link, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })

      const result = await response.json()
      setPost(result.data)
      findBookmarks()
      setComments(result.data.comments)
    } catch(error){
      ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
      ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
      console.error("Error: ", error)
    } 
  }

  const findBookmarks = async()=>{
    try{
      const link = `${base_url}/find-bookmarks`
      const response = await fetch(link, {
        method: "GET",
        headers: {
          'Content-Type': "application/json",
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()
      setBookmarks(result.bookmarks)
    } catch(error){
      ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
      ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
      console.log("An error occured: ", error)
    }
  }


  useEffect(()=>{
    reload()
    findBookmarks()
  }, [])

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)} ...more` : text;
  };

  const maxLength = 90;

  const likePost = async()=>{
    const uid = await SecureStore.getItemAsync("id")

    try{
      const link = `${base_url}/post/like/${post._id}`
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
      const userUrl = `${base_url}/user/${uid}`
      const res = await fetch(userUrl, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
      if(post.admin._id == userId){
        return;
      }
      
      const profile = await res.json()

      const urlLink = `${base_url}/create-notification`
      await fetch(urlLink, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            message: `${profile.username} has liked your post`,
            type: "Post",
            action: "like",
            id: post._id,
            photo: profile.photo,
            receiver: post.admin._id
          })
        })
      }
    } catch(error){
      ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
      ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
      console.error("Error: ", error)
    }
  }

  const unlikePost = async()=>{
    try{
      const link = `${base_url}/post/unlike/${post._id}`
      const response = await fetch(link, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
      
      const result = await response.json()
      
      if(result.message === "success"){
       // ToastAndroid.show("unlike!", ToastAndroid.SHORT)
        reload()
      }
    } catch(error){
      ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
      ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
      console.error("Error: ", error)
    }
  }

  const addComment = async()=>{
    const uid = await SecureStore.getItemAsync("id")
    try{
      if(!comment){
        ToastAndroid.show("comment cannot be empty!", ToastAndroid.SHORT)
      } else {
      const link = `${base_url}/post/comment/${post._id}`
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
        ToastAndroid.show("comment uploaded!", ToastAndroid.SHORT)
        if(post.admin._id === userId){
          return;
        }
        
        const userUrl = `${base_url}/user/${uid}`
        const res = await fetch(userUrl, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })
        
        const profile = await res.json()

        const urlLink = `${base_url}/create-notification`
        await fetch(urlLink, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            message: `${profile.username} has commented on your post: ${truncateText(comment)}`,
            type: "Post",
            action: "comment",
            id: post._id,
            photo: profile.photo,
            receiver: post.admin._id
          })
        })
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
      const link = `${base_url}/post/comment/${post._id}?comment=${commentId}`
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

  const shareToWhatsApp = async () => {
    // Encode the message and image URL to ensure proper formatting
    const message = `Check out this post:\n\nPost ID: ${post._id}\n${post.caption}\nImage: ${post.photo}`;
    const encodedMessage = encodeURIComponent(post.caption); // Encode the message
    const encodedImageUrl = encodeURIComponent(post.photo); // Encode the image URL
    const url = `whatsapp://send?text=${encodedMessage}&attachment=${encodedImageUrl}`;

    try {
      // Check if WhatsApp is installed
      const supported = await Linking.canOpenURL('whatsapp://');
      if (supported) {
        // Open WhatsApp with the constructed URL
        await Linking.openURL(url);
      } else {
        Alert.alert('WhatsApp not installed', 'Please install WhatsApp to share the post.');
      }
    } catch (error) {
      ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
      ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
      console.error("Error sharing to WhatsApp", error);
      Alert.alert('Error', 'There was an error while trying to share the post.');
    }
  };


  const addBookmark = async()=>{
    try{
      const link = `${base_url}/bookmark`
      const response = await fetch(link, {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          postId: post._id,
          photo: post.photo
        })
      })

      const result = await response.json()
      setBookmarks(result.bookmarks)
      ToastAndroid.show("Post saved!", ToastAndroid.SHORT)
    } catch(error){
      ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
      ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
      console.log("An error occured: ", error)
    }
  }

  const deleteBookmark = async()=>{
    try{
      const link = `${base_url}/bookmark/${post._id}`
      const response = await fetch(link, {
        method: "DELETE",
        headers: {
          'Content-Type': "application/json",
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()
      setBookmarks(result.bookmarks)
      ToastAndroid.show("Removed from bookmarks!", ToastAndroid.SHORT)
    } catch(error){
      ToastAndroid.show("An Error occurred!", ToastAndroid.SHORT)
      ToastAndroid.show("Check your internet connection, try again!", ToastAndroid.SHORT)
      console.log("An error occured: ", error)
    }
  }  

  const CommentComponent = ({ postComment })=>(
    <View style={tw`ml-4 flex  flex-row justify-evenly mt-4 mb-4 `}>
      <TouchableOpacity onPress={()=> navigation.navigate("Profile", { id: postComment.postedBy._id })}><Image style={tw`h-12 w-12 rounded-full`} source={{ uri: postComment.postedBy.photo }} /></TouchableOpacity>
            <View style={tw`flex flex-col w-80 ml-2`}>
                  <View style={tw`flex flex-row justify-between w-4.5/5`}>
                    <Text selectable style={tw`text-white font-semibold text-md`}>{postComment.postedBy.username}</Text>
                    {postComment.postedBy._id === userId ? <TouchableOpacity onPress={()=> deleteComment(postComment._id)}><MaterialIcons name="delete-outline" size={24} color="white" /></TouchableOpacity> : <View />}
                  </View>
                <Text selectable style={tw`text-white`}>{postComment.text}</Text>
              </View>
      </View>
  )


    return (
      <>
      {!content ? <View /> :
      <View style={styles.postView}>
        
        <PostBottomSheet open={postEditVisibility} close={()=> setPostEditVisibility(false)}  proceedEdit={()=>{ setPostEditVisibility(false); navigation.navigate("Edit-Post", { post: post })}} post={post} isAdmin={isAdmin} />
         
        {/* Post Header */}
        <TouchableOpacity onPress={()=> navigation.navigate("Profile", { id: post.admin._id })} style={styles.postHeader}>
          <View>
            <Image
              style={{ width: 50, height: 50, borderRadius: 100 }}
              source={{
                uri: post.admin.photo,
              }}
            />  
          </View>
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <Text selectable style={tw`text-white font-semibold text-lg`}>
              {post.admin.username}
            </Text>
            <Text selectable
              style={{ color: '#fff', fontFamily: 'NSRegular', fontSize: 16 }}
            >
       
            </Text>
          </View>

          {isAdmin ?
            <TouchableOpacity onPress={()=> setPostEditVisibility(true)}>
            <Feather name="more-vertical" size={28} color="white" />
            </TouchableOpacity>
            :
            <TouchableOpacity>
            <Feather name="more-vertical" size={28} color="white" />
            </TouchableOpacity>
          }
          
        </TouchableOpacity>
        {/* Post Content */}
        <TouchableOpacity style={{ marginTop: 10 }}>
          
          {post.photo ? (
            <Image
              style={{ width: '100%', height: 300, marginTop: 10 }}
              source={{ uri: post.photo }}
            />
          ) : null}
          
        </TouchableOpacity>

        {/*
        <GestureHandlerRootView>
          <GestureDetector gesture={pinchGesture}>
            <Animated.View>
              <TouchableOpacity onPress={() => setVisible(true)}>
                <Animated.Image source={{ uri: post.photo }} style={[styles.image, animatedStyle]} resizeMode="cover" />
              </TouchableOpacity>
            </Animated.View>
          </GestureDetector>
          <ImageView images={[{ uri: post.photo }]} imageIndex={0} visible={visible} onRequestClose={() => setVisible(false)} />
        </GestureHandlerRootView>
        */}
     
        {/* Post Stats */}
        <View style={tw`flex flex-row justify-between`}>
        <View
          style={{ marginTop: 10, flexDirection: 'row', paddingHorizontal: 10 }}
        >
          
          {post.likes.includes(userId) ? 
          <TouchableOpacity onPress={unlikePost} style={styles.postStatsOpacity}>
            <FontAwesome name="heart" size={24} color="white" />
            <Text style={{ marginLeft: 6,fontFamily: 'NSRegular',color: '#fff', }}>
            {post.likes.length}
            </Text>
          </TouchableOpacity>
          : 
          <TouchableOpacity onPress={likePost} style={styles.postStatsOpacity}>
            <FontAwesome name="heart-o" size={24} color="white" />
            <Text style={{ marginLeft: 6,fontFamily: 'NSRegular',color: '#fff', }}>
              {post.likes.length}
            </Text>
          </TouchableOpacity>}


          <TouchableOpacity onPress={() =>{ setIsVisible(true); reload(); }} style={{...styles.postStatsOpacity, marginLeft: 10,}}>
            <Icon name='message-circle' color='#fff' size={28} />
            <Text
              style={{
                marginLeft: 6,
                fontFamily: 'NSRegular',
                color: '#fff',
              }}
            >
            {post.comments.length}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={shareToWhatsApp} style={styles.postStatsOpacity}>
          <FontAwesome name="send-o" size={24} color="white" />
            <Text
              style={{
                marginLeft: 6,
                fontFamily: 'NSRegular',
                color: '#fff',
              }}
            >
              
            </Text>
          </TouchableOpacity>
          </View>

          {bookmarks.includes(post._id) ? 
          <TouchableOpacity onPress={deleteBookmark} style={tw`mr-2 mt-4`}>
          <FontAwesome name="bookmark" size={30} color="white" />
          </TouchableOpacity>
          : 
          <TouchableOpacity onPress={addBookmark} style={tw`mr-2 mt-4`}>
          <FontAwesome5 name="bookmark" size={30} color="white" />
          </TouchableOpacity>
          }

        </View>
        <Text
          selectable
            style={{
              color: '#fafafa',
              fontFamily: 'NSRegular',
              fontSize: 14,
              paddingHorizontal: 10,
              marginTop: 10,
              marginBottom: 10
            }}
          >
            {truncateText(post.caption, maxLength)}
          </Text>
          <Text style={tw`text-neutral-400 px-4 mb-6`}>{formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}</Text>

          {/* COMMENT SECTION */}
          <BottomSheet onBackdropPress={() => setIsVisible(false)} isVisible={isVisible}>

            {/* COMMENT CONTAINER */}
            <View style={tw`h-120 bg-neutral-900`}>
              <Text style={tw`text-white font-bold text-center mt-4 mb-6 border-b-2 border-gray-800`}>Comments</Text>

              {/* COMMENT */}
              {!post ? 
              <View></View> : 
              <ScrollView scrollEnabled={true}>
                {comments.map((postComment, index)=> <CommentComponent key={index} postComment={postComment} />)}
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
      </View>
              }
              </>
    );
  }

  const styles = StyleSheet.create({
  postsView: { paddingHorizontal: 10, marginTop: 10 },
  postView: {
  
    marginTop: 10,
    backgroundColor: '#000',
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
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
     width: '100%', 
     height: 300,
    marginTop: 10 
  }

  })
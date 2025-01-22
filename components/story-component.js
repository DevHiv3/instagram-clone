import { View, Text, Alert, Animated,  Modal,  BackHandler, StatusBar, TouchableWithoutFeedback, StyleSheet, Button,Dimensions, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import tw from "twrnc"
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome } from '@expo/vector-icons'

const { width, height } = Dimensions.get("window")
const screenRatio = height / width;

export default function Story({ goBack, username, avatar, contents, id }){

    const [current, setCurrent] = useState(0);
    const [content, setContent] = useState(contents);
    const [end, setEnd] = useState(0); // the duration
    const [load, setLoad] = useState(false); 
    const progress = useRef(new Animated.Value(0)).current; 

    const navigation = useNavigation()
    
    // handle playing the animation
    function play() {
        start(end);
    }
    
    function start(n) {
    // checking if the content type is video or not

    if (content[current].type == 'video') {
      // type video
      if (load) {
        Animated.timing(progress, {
          toValue: 1,
          duration: n,
        }).start(({ finished }) => {
          if (finished) {
            next();
          }
        });
      }
    } else {
      // type image
      Animated.timing(progress, {
        toValue: 1,
        duration: 5000, // if content type is an image set the duration to 5 seconds
      }).start(({ finished }) => {
        if (finished) {
          next();
        }
      });
    }
  }
  
  // next() is for changing the content of the current content to +1
  function next() {
    // check if the next content is not empty
    if (current !== content.length - 1) {
      let data = [...content];
      data[current].finish = 1;
      setContent(data);
      setCurrent(current + 1);
      progress.setValue(0);
      setLoad(false);
    } else {
      // the next content is empty
      close();
    }
  }
  
  // previous() is for changing the content of the current content to -1
  function previous() {
    // checking if the previous content is not empty
    if (current - 1 >= 0) {
      let data = [...content];
      data[current].finish = 0;
      setContent(data);
      setCurrent(current - 1);
      progress.setValue(0);
      setLoad(false);
    } else {
      // the previous content is empty
      close();
    }
  }
  
  // handle if the content run out
  function close() {
    progress.setValue(0);
    setLoad(false);
    goBack()
    console.log('no more content');
  }
    
  return (
        <View style={styles.container}>
            <View style={styles.containerModal}>
                <StatusBar backgroundColor="black" barStyle="light-content" />
                <View style={styles.backgroundContainer}>
                    {/* check the content type is video or an image */}
                    {content[current].type == 'video' ? (
                        <Video source={{ uri: content[current].media }} rate={1.0} volume={1.0} resizeMode="cover" shouldPlay={true} positionMillis={0} onReadyForDisplay={play()} onPlaybackStatusUpdate={AVPlaybackStatus => { console.log(AVPlaybackStatus); setLoad(AVPlaybackStatus.isLoaded); setEnd(AVPlaybackStatus.durationMillis);}} style={{ height: height, width: width }}/>
                    ) : (
                    <Image onLoadEnd={() => { progress.setValue(0); play() }} source={{ uri: content[current].media }} style={{ width: width, height: height, resizeMode: 'cover' }} />
                    )}
                </View>
                
                <View style={{  flexDirection: 'column', flex: 1, }}>
                    <LinearGradient colors={['rgba(0,0,0,1)', 'transparent']} style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 100, }} />
                    {/* ANIMATION BARS */}
                    <View style={{ flexDirection: 'row', paddingTop: 10, paddingHorizontal: 10,}}>\
                        {content.map((index, key) => {
                            return (
                                // THE BACKGROUND
                            <View key={key} style={{ height: 2, flex: 1, flexDirection: 'row', backgroundColor: 'rgba(117, 117, 117, 0.5)', marginHorizontal: 2, }}>
                                {/* THE ANIMATION OF THE BAR*/}
                                <Animated.View style={{ flex: current == key ? progress : content[key].finish, height: 2, backgroundColor: 'rgba(255, 255, 255, 1)', }} />
                            </View>
                            );
                        })}
                    </View>
                    
                    {/* END OF ANIMATION BARS */}
                    
        <View style={{ height: 50, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15,}}>
          {/* THE AVATAR AND USERNAME  */}
          <TouchableOpacity onPress={()=> navigation.navigate("Profile", { id: id })} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image style={{ height: 30, width: 30, borderRadius: 25 }} source={{ uri: avatar }}  />
            <Text style={{ fontWeight: 'bold', color: 'white', paddingLeft: 10 }}>{username}</Text>
          </TouchableOpacity>
          {/* END OF THE AVATAR AND USERNAME */}
          {/* THE CLOSE BUTTON */}
          <TouchableOpacity onPress={() => close()}>
            <View style={{ alignItems: 'center', justifyContent: 'center', height: 50, paddingHorizontal: 15 }}>
              <FontAwesome name="heart-o" size={28} color="white" />
            </View>
          </TouchableOpacity>
          {/* END OF CLOSE BUTTON */}
        </View>
        {/* HERE IS THE HANDLE FOR PREVIOUS AND NEXT PRESS */}
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableWithoutFeedback onPress={() => previous()}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => next()}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
        </View>
        {/* END OF THE HANDLE FOR PREVIOUS AND NEXT PRESS */}
      </View>
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
   paddingTop: 40,
 },

 containerModal: {
    flex: 1,
    backgroundColor: '#DD2A7B',
  },
  backgroundContainer: {
    position: 'absolute',

    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

})
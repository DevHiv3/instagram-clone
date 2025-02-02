import { View, Text, Alert, StyleSheet, Platform, TextInput, Switch, Animated, Button, Dimensions, ScrollView, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as Device from "expo-device";
import { useSelector } from 'react-redux';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { base_url as url } from '../slices/authSlice'
import Modal from '../components/modal';
import 'firebase/messaging';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import tw from "twrnc"

const { width, height } = Dimensions.get("window")

export default function SettingsScreen(){

    const navigation = useNavigation()
    const base_url = useSelector(url)

    const [ token, setToken ] = useState("")
    const [ turn, setTurn ] = useState(false)
    const [notification, setNotification] = useState(false);
    const [ pushToken, setPushToken ] = useState("")
    const [ dltUsrModal, setDltUsrModal ] = useState(false)
    const notificationListener = useRef();
    const responseListener = useRef();

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
      
      useEffect(() => {
        const checkAuth = async () => {
            const storedToken = await SecureStore.getItemAsync('token');
            const localDeviceToken = await SecureStore.getItemAsync("push-token")
            
            if (storedToken) {
                setToken(storedToken)
                if(localDeviceToken === null){
                  setTurn(false);
                  console.log("If there is no saved push token: ", localDeviceToken)
                } else {
                  console.log("My saved push token: ", localDeviceToken)
                  setTurn(true)
                  // Listener for incoming notifications
                  notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                    setNotification(notification);
                  });

                  // Listener for user interaction with the notification
                  responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                  //  console.log('User interacted with the notification:', response);
                  const route = response.notification.request.content.data.route; // Route from the notification payload
                  if (route) {
                    navigation.navigate(route);
                  }
                  });
                  return () => {
                    Notifications.removeNotificationSubscription(notificationListener.current);
                    Notifications.removeNotificationSubscription(responseListener.current);
                  };
                }
            } else {
                navigation.replace("Signup")
            }
        };
        checkAuth();
        }, []);

        const logout = async () => {
            await SecureStore.deleteItemAsync('token');
            ToastAndroid.show("Logged out!", ToastAndroid.SHORT)
            navigation.replace('Signup'); 
        };

    useLayoutEffect(()=>{
        navigation.setOptions({
          title: "SETTINGS AND ACTIVITY",
          headerTitleAlign: 'center',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: "#000",
          },
          headerTitleStyle: {
            textAlign: 'center',
            color: 'white',
            fontWeight: "bold"
          },
          headerLeft: ()=> <TouchableOpacity onPress={()=> navigation.goBack()}><Feather name="arrow-left" size={24} color="white" /></TouchableOpacity>,
          headerRight: ()=> <View></View>,
    
        })
      },[])

    const pushTokenToServer = async(deviceToken)=>{
        const storedToken = await SecureStore.getItemAsync("token")
        const link = `${base_url}/add-push-token`;
        const response = await fetch(link, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            },
            body: JSON.stringify({ pushToken: deviceToken }),
          });

          const result = await response.json()
    }

    const removeTokenFromServer = async()=>{
      const storedToken = await SecureStore.getItemAsync("token")
      const link = `${base_url}/remove-push-token`;
      const response = await fetch(link, {
          method: 'PUT',
          headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedToken}`
          },
        });

        const result = await response.json()
    }

    const registerForPushNotificationsAsync = async () => {

        if (Device.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            Alert.alert('Failed to get push token for push notification!');
            return;
          }

          const deviceToken = (await Notifications.getExpoPushTokenAsync()).data;
          setPushToken(deviceToken)
          await pushTokenToServer(deviceToken)
          await SecureStore.setItemAsync("push-token", deviceToken)
          ToastAndroid.show("Notification are turned on!", ToastAndroid.SHORT);
        } else {
          Alert.alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
              name: 'default',
              importance: Notifications.AndroidImportance.MAX,
              vibrationPattern: [0, 250, 250, 250],
              lightColor: '#FF231F7C',
            });
          }
      };
    
    const getNotification = async()=>{
        if(!turn){
            setTurn(true)
            await registerForPushNotificationsAsync()
        } else {
            setTurn(false)
            await SecureStore.deleteItemAsync("push-token")
            await removeTokenFromServer()
            setPushToken("")
            ToastAndroid.show("Notifications turned off!", ToastAndroid.SHORT)
        }
    }

      const deleteUser = async()=>{

        try{
          const link = `${base_url}/user`
          const response = await fetch(link, {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          })

          const result = await response.json()

          if(result.message === "success"){
            await SecureStore.deleteItemAsync('token');
            ToastAndroid.show("Account Deleted!", ToastAndroid.SHORT)
            navigation.replace('Signup'); 
          }

        } catch(error){
          console.error("Error: ", error)
        } 
      }

      const [ query, setQuery ] = useState("")
      const [open, setOpen] = useState(false);

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

    
  return (
      <ScrollView style={styles.container}>
        
        <TouchableOpacity
        onPress={expandInput}
        activeOpacity={0.7}
        style={styles.inputContainer}>
       <Animated.View  style={[styles.mainTextBar, { width: inputWidth }]}>
       <AntDesign name="search1" size={40} color="#F4F4F4" />
      <TextInput value={query} onChangeText={(text)=> setQuery(text)} style={styles.mainTextInput}  placeholderTextColor="#AAA" placeholder="Search" onFocus={expandInput} onBlur={shrinkInput}>
      </TextInput>
      </Animated.View>

      </TouchableOpacity>

      <Text style={tw`text-gray-400 ml-4 text-md mb-2 font-bold`}>Your account</Text>

      <TouchableOpacity style={tw`flex flex-col justify-center mt-4 mb-4`}>
            <View style={tw`flex flex-row justify-between items-center ml-2`}>
                <View style={tw`flex flex-row`}>
                <MaterialCommunityIcons name="account-circle-outline" size={30} color="white" />
                    <View style={tw`flex flex-col w-4/5`}>
                        <Text style={tw`text-white text-lg ml-2`}>Account Center</Text>
                        <Text style={tw`text-gray-400 text-md text-wrap ml-2 `}>Password, security, personal details, ad preferences</Text>
                    </View>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={18} color="gray" /> 
            </View>
        </TouchableOpacity>

        <Text style={tw`text-sm text-gray-400 mt-2 ml-4 mb-4`}>Manage your connected experiences and account settings across meta technologies. <Text style={tw`text-blue-400 font-bold`}>Learn more</Text></Text>

        <View style={tw`border-gray-900 border-t-8`}>

        <Text style={tw`text-gray-400 ml-4 mt-4 mb-2 text-md font-bold`}>How you use Instagram</Text>

        <TouchableOpacity onPress={()=> navigation.navigate("Bookmarks")} style={tw`flex flex-col justify-center mt-4 mb-4`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                    <FontAwesome5 name="bookmark" size={24} color="white" />
                    <Text style={tw`text-white text-lg ml-2`}>saved</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={18} color="gray" /> 
            </View>
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex flex-col justify-center mt-2 mb-2`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                    <Entypo name="back-in-time" size={24} color="white" />
                    <Text style={tw`text-white text-lg ml-2`}>Archieve</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={18} color="gray" /> 
            </View>

        </TouchableOpacity>
        <TouchableOpacity style={tw`flex flex-col justify-center mt-2 mb-2`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                    <Feather name="activity" size={24} color="white" /> 
                    <Text style={tw`text-white text-lg ml-2`}>Your activity</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={18} color="gray" /> 
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex flex-col justify-center mt-2 mb-2`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                    <FontAwesome5 name="bell" size={24} color="white" />
                    <Text style={tw`text-white text-lg ml-2`}>Notifications</Text>
                </View>
                <Switch rackcolor={{ false: "#767775", true: "#81b0ff" }} thumbColor={turn ? "#fff" : "#f4f3f4"} value={turn} onValueChange={getNotification} />
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex flex-col justify-center mt-2 mb-2`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                <MaterialCommunityIcons name="clock-time-seven-outline" size={24} color="white" />
                    <Text style={tw`text-white text-lg ml-2`}>Time management</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={18} color="gray" /> 
            </View>
        </TouchableOpacity>

        </View>

        <View style={tw`border-gray-900 border-t-8`}>

        <Text style={tw`text-gray-400 mt-2 ml-4 mt-4 mb-4 text-md font-bold`}>Who can see your account</Text>

        <TouchableOpacity style={tw`flex flex-col justify-center mt-2 mb-2`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                <Ionicons name="lock-closed-outline" size={24} color="white" />
                    <Text style={tw`text-white text-lg ml-2`}>Account privacy</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={18} color="gray" /> 
            </View>
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex flex-col justify-center mt-2 mb-2`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                    <MaterialCommunityIcons name="star-circle-outline" size={24} color="white" />
                    <Text style={tw`text-white text-lg ml-2`}>Close Friends</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={18} color="gray" /> 
            </View>
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex flex-col justify-center mt-2 mb-2`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                <MaterialIcons name="block" size={24} color="white" />
                    <Text style={tw`text-white text-lg ml-2`}>Blocked</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={18} color="gray" /> 
            </View>
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex flex-col justify-center mt-2 mb-6`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                <MaterialIcons name="hide-image" size={24} color="white" />
                    <Text style={tw`text-white text-lg ml-2`}>Hide story and live</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={18} color="gray" /> 
            </View>
        </TouchableOpacity>

        </View>

        <View style={tw`border-gray-900 border-t-8`}>
        
        <Text style={tw`text-gray-400 mt-2 ml-4 mt-4 mb-4 text-md font-bold`}>How others can interact with you</Text>

        <TouchableOpacity style={tw`flex flex-col justify-center mt-2 mb-2`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                <MaterialCommunityIcons name="message-text-outline" size={24} color="white" />
                    <Text style={tw`text-white text-lg ml-2`}>Messages and story replies</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={18} color="gray" /> 
            </View>
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex flex-col justify-center mt-4 mb-2`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                <Feather name="at-sign" size={24} color="white" />
                    <Text style={tw`text-white text-lg ml-2`}>Tags and mentions</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={18} color="gray" /> 
            </View>
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex flex-col justify-center mt-4 mb-2`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                <Feather name="message-circle" size={24} color="white" />
                    <Text style={tw`text-white text-lg ml-2`}>Comments</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={18} color="gray" /> 
            </View>
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex flex-col justify-center mt-4 mb-4`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                <FontAwesome5 name="user-alt-slash" size={24} color="white" />
                    <Text style={tw`text-white text-lg ml-2`}>Restricted</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={18} color="gray" /> 
            </View>
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex flex-col justify-center mt-2 mb-6`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                    <Feather name="user-plus" size={24} color="white" />
                    <Text style={tw`text-white text-lg ml-2`}>Follow and invite friends</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={18} color="gray" /> 
            </View>
        </TouchableOpacity>

        </View>

     <View style={tw`border-gray-900 border-t-8`}>
        
        <TouchableOpacity onPress={() => setOpen(true)} style={tw`flex flex-row justify-between items-center ml-4 mt-4 mb-4`}>  
                <Text style={tw`text-red-600 text-lg ml-2`}>Log out</Text>
                <MaterialIcons name="arrow-forward-ios" size={18} color="gray" /> 
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> setDltUsrModal(true)} style={tw`flex flex-row justify-between items-center ml-4 mt-4 mb-4`}>  
                <Text style={tw`text-red-600 text-lg ml-2`}>Delete your account</Text>
                <MaterialIcons name="arrow-forward-ios" size={18} color="gray" /> 
        </TouchableOpacity>
    </View>
        
    <Modal open={open} close={()=> setOpen(false)} message={" Log out of your account ?"} proceed={logout} optionOne={"Log out"} />
    <Modal open={dltUsrModal} close={()=> setDltUsrModal(false)} message={" Do you want to delete your account ?"} proceed={deleteUser} optionOne={"Delete"} />
        
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
   flex: 1,
   backgroundColor: '#000',
   height: height,
   width: width,
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
    marginVertical: 20,
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
    marginLeft: 10,
  },

  forgotpassModal: {
    backgroundColor: '#1f1f1f',
    paddingHorizontal: 10,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.85,
    elevation: 5,
  },

  


})
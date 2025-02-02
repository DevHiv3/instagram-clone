import React, { useState, useEffect,useRef, useLayoutEffect }
 from "react"
import PostProgressBar from "../components/post-progress-bar"
import * as Linking from "expo-linking";
import { StyleSheet, Text, View, SafeAreaView, Image, Alert, ToastAndroid, ScrollView, TextInput, TouchableOpacity,StatusBar, Dimensions, TouchableWithoutFeedback,Keyboard, Platform, KeyboardAvoidingView, FlatList, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from "@rneui/themed";
import tw from "twrnc"
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';
import {  base_url as url } from "../slices/authSlice";
import * as WebBrowser from 'expo-web-browser';
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import VerifyOTPModal from "../components/verify-otp"
const { width, height } = Dimensions.get("window")

export default function SignupScreen(){

   useEffect(() => {
    StatusBar.setBarStyle('light-content', true);
  }, []);

  const navigation = useNavigation()
  const dispatch = useDispatch()
  const base_url = useSelector(url)

  const [user, setUser] = useState(null);
  const [ username, setUsername ] = useState("")
  const [usernameMessage, setUsernameMessage] = useState(""); 
  const [ emailMessage, setEmailMessage] = useState(""); 
	const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ image, setImage ] = useState(null)
  const [ selectedImage, setSelectedImage ] = useState("")
  const [ open, setOpen ] = useState(false)
  const [ progressBoolean, setProgressBoolean ] = useState(false)

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    
    if (!result.canceled) {
      ToastAndroid.show("image selected!", ToastAndroid.SHORT);
      setImage(result);
      setSelectedImage(result.assets[0].uri)
      console.log(result.assets[0].uri)
    }
  };


  const handleGoogleLogin = async () => {
    const result = await WebBrowser.openAuthSessionAsync('http://192.168.29.244:8080/auth/google',"https://backend-second.vercel.app/verify");
    console.log(result.url)

    const token = result.url.split("token=")[1];
    if (token) {
      await SecureStore.setItemAsync("token", token)
      ToastAndroid.show("Signup successful", ToastAndroid.SHORT)
        navigation.replace("Home")
    }
  }

   const login = async()=>{
      const response = await fetch(`${base_url}/login`, {
        method: "POST",
        body: JSON.stringify({ email: email, password: password }),
        headers: {
          "Content-Type": "application/json",
        }
      })
  
      const result = await response.json()
  
      if(result.message === "success"){
        await SecureStore.setItemAsync("token", result.token)
        await SecureStore.setItemAsync("id", result.id)
        verification()
      } else if(result.message === "Invalid Credentials"){
        setProgressBoolean(false)
        ToastAndroid.show("Invalid credentials", ToastAndroid.SHORT)
      } else {
        setProgressBoolean(false)
        ToastAndroid.show("Internal server error, try again later!", ToastAndroid.SHORT)
      }
    }

    const verification = async()=> {

      const response = await fetch(`${base_url}/verification`, {
        method: "POST",
        body: JSON.stringify({ email: email }),
        headers: {
          "Content-Type": "application/json",
        }
      })
  
      const result = await response.json()

      console.log(result)
  
      if(result.message === "success"){
        setProgressBoolean(false)
        setOpen(true)
      } else {
        setProgressBoolean(false)
        ToastAndroid.show("Internal server error, try again later!", ToastAndroid.SHORT)
      }
    }



  const signup = async()=>{

    if(image == null){
      ToastAndroid.show("Please choose an image to continue!", ToastAndroid.SHORT)

    } else if(!username){
      ToastAndroid.show("Please fill all the necessary details to continue!", ToastAndroid.SHORT)
    }  else if(!password){
      ToastAndroid.show("Please fill all the necessary details to continue!", ToastAndroid.SHORT)
    } else if(!email){
      ToastAndroid.show("Please fill all the necessary details to continue!", ToastAndroid.SHORT)
    } else {
      setProgressBoolean(true)
      const photo = {
        uri: image.assets[0].uri,
        name: image.assets[0].filename,
        type: image.assets[0].mimeType
      }

    const response = await FileSystem.uploadAsync(`${base_url}/signup`, image.assets[0].uri, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for Multer to parse
      },
      fieldName: 'photo', // Name of the file field in the request
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      parameters: {
        username: username,
        email: email,
        password: password
      }
    });

    const result = response.body
    
    console.log(result)

    if(result === "success"){
      login()
    } else if(result.message === "Invalid Credentials"){
      setProgressBoolean(false)
      ToastAndroid.show("Invalid credentials", ToastAndroid.SHORT)
      setProgressBoolean(false)
    } else if(result.message === "User already exists"){
      setProgressBoolean(false)
      ToastAndroid.show("User already exists!", ToastAndroid.SHORT)
    } else if(result.message === "No file uploaded"){
      setProgressBoolean(false)
      ToastAndroid.show("No file uploaded", ToastAndroid.SHORT)
    } else {
      setProgressBoolean(false)
      ToastAndroid.show("Internal server error, try again later!", ToastAndroid.SHORT)
    }
  }
  }

  const searchUsername = async()=>{
    const link = `${base_url}/find-username?username=${username}`
    const response = await fetch(link, {
      method: "GET",
      headers: {
        'Content-Type': "application/json"
      }
    })
    const result = await response.json()
    if(result.data){
      console.log(result.data)
      setUsernameMessage("Username already taken!");
    } else {
      setUsernameMessage(""); 
    }
  }

  const searchEmail = async()=>{
    const link = `${base_url}/find-email?email=${email}`
    const response = await fetch(link, {
      method: "GET",
      headers: {
        'Content-Type': "application/json"
      }
    })
    const result = await response.json()
    if(result.data){
      console.log(result.data)
      setEmailMessage("Email already used!");
    } else {
      setEmailMessage(""); 
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
      headerLeft: ()=> <TouchableOpacity></TouchableOpacity>,
      headerRight: ()=> <View></View>,

    })
  },[])

  return (
  <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      
      <LinearGradient
        colors={['#222', '#222', '#111']}
        style={styles.container}
      >
        <PostProgressBar open={progressBoolean} close={()=> setProgressBoolean(false)} message={"creating your account...."} progress={100} />
        <VerifyOTPModal open={open} close={()=> setOpen(false)}  message={"Enter OTP"} email={email} proceed={()=> { setOpen(false); navigation.replace("Home") }} />
        <Text style={styles.welcomeText}>Welcome!</Text>
        <Text style={styles.loginText}>Signup</Text>

        <TouchableOpacity onPress={pickImage} style={tw`flex flex-row w-full items-center justify-center`}>
          <Image style={tw`h-20 w-20 rounded-full border-4 border-gray-700`} source={{ uri: selectedImage }} />
        </TouchableOpacity>
         
        <TextInput
          placeholder='username'
          value={username}
          onChangeText={(text) =>{ setUsername(text); searchUsername(); }}
          placeholderTextColor='#808e9b'
          style={styles.input}
        />
        {usernameMessage ? (
          <Text style={styles.usernameMessage}>{usernameMessage}</Text> // Conditionally render the message
        ) : null}
        <TextInput
          placeholder='Email Address'
          placeholderTextColor='#808e9b'
          style={styles.input}
          autoCorrect={true}
          value={email}
          onChangeText={(text) =>{ setEmail(text); searchEmail(); }}
          autoCapitalize={false}
          autoCompleteType='email'
          keyboardType='email-address'
          textContentType='emailAddress'
        />
        {emailMessage ? (
          <Text style={styles.usernameMessage}>{emailMessage}</Text> // Conditionally render the message
        ) : null}
        <TextInput
          placeholder='Password'
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholderTextColor='#808e9b'
          style={styles.input}
          secureTextEntry={true}
          textContentType='password'
        />
        
        <TouchableOpacity onPress={signup} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Signup</Text>
        </TouchableOpacity>
        <View style={styles.loginWithBar}>
          <TouchableOpacity onPress={handleGoogleLogin} style={styles.iconButton}>
            <Icon name='google' type='font-awesome' size={30} color='#808e9b' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon
              name='facebook-square'
              type='font-awesome'
              size={30}
              color='#808e9b'
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name='apple' type='font-awesome' size={30} color='#808e9b' />
          </TouchableOpacity>
        </View>
        <View style={styles.signUpTextView}>
          <Text style={styles.signUpText}>Already have an account?</Text>
          <TouchableOpacity onPress={()=> navigation.replace("Login")}>
            <Text style={[styles.signUpText, { color: '#B53471' }]}>
              {' Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({

    mainTheme: {
      display: "flex", 
      flexDirection: "column", 
      alignItems: 'center',
      width: width, 
      height: height, 
      justifyContent: 'center',
      paddingVertical: 10, 
      paddingHorizontal: 10, 
      backgroundColor: "#222"
    },
     container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
    alignSelf: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#333',
    borderRadius: 6,
    marginTop: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#808e9b',
  },
  fpText: {
    alignSelf: 'flex-end',
    color: '#B33771',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: '#833471',
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 20,
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fafafa',
    alignSelf: 'center',
  },
  loginWithBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 50,
  },
  iconButton: {
    backgroundColor: '#333',
    padding: 14,
    marginHorizontal: 10,
    borderRadius: 100,
  },
  signUpTextView: {
    marginTop: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    color: '#808e9b',
    fontSize: 20,
    fontWeight: '500',
  },
  usernameMessage: {
    color: "red",
    marginTop: 5,
  },
})
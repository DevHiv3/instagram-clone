import React, { useState, useEffect,useRef, useLayoutEffect }
 from "react"
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity,StatusBar, Dimensions, TouchableWithoutFeedback,Keyboard, Platform, KeyboardAvoidingView, TextInput, FlatList, ToastAndroid } from 'react-native';
//import { TextInput as Input, Drawer } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import PostProgressBar from "../components/post-progress-bar"
import { Avatar } from "@rneui/themed";
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';
import {  base_url as url } from "../slices/authSlice";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import VerifyOTPModal from "../components/verify-otp"

const { width, height } = Dimensions.get("window")

export default function SignupScreen(){

   const [ open, setOpen ] = useState(false)
   const [ progressBoolean, setProgressBoolean ] = useState(false)
  
      useEffect(() => {
          const checkAuth = async () => {
            const storedToken = await SecureStore.getItemAsync('token');
      
            if (storedToken) {
              navigation.replace("Home")
              console.log(storedToken)
            }
          };
      
       // checkAuth();
        }, []);
  

   useEffect(() => {
    StatusBar.setBarStyle('light-content', true);
  }, []);

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

  const base_url = useSelector(url)
  const navigation = useNavigation()

  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")

  const login = async()=>{
    setProgressBoolean(true)
    const response = await fetch(`${base_url}/login`, {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
      headers: {
        "Content-Type": "application/json",
      }
    })

    const result = await response.json()

    if(result.message === "success"){
      console.log(result.token,result.id)
      await SecureStore.setItemAsync("token", result.token)
      await SecureStore.setItemAsync("id", result.id)
      verification()
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
    }
  }


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
        <PostProgressBar open={progressBoolean} close={()=> setProgressBoolean(false)} message={" logging in..."} progress={100} />
         <VerifyOTPModal open={open} close={()=> setOpen(false)}  message={"Enter OTP"} email={email} proceed={()=> { setOpen(false); navigation.replace("Home") }} />
         <Text style={styles.welcomeText}>Welcome!</Text>

        <Text style={styles.loginText}>Login</Text>
        <TextInput
          placeholder='Email Address'
          placeholderTextColor='#808e9b'
          style={styles.input}
          autoCorrect={true}
          autoCapitalize={false}
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCompleteType='email'
          keyboardType='email-address'
          textContentType='emailAddress'
        />
        <TextInput
          placeholder='Password'
          placeholderTextColor='#808e9b'
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
          textContentType='password'
        />
        
        <TouchableOpacity onPress={login} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.loginWithBar}>
          <TouchableOpacity style={styles.iconButton}>
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
          <Text style={styles.signUpText}>Don't have an account?</Text>
          <TouchableOpacity onPress={()=> navigation.navigate("Signup")}>
            <Text style={[styles.signUpText, { color: '#B53471' }]}>
              {' Sign Up'}
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
})
import { View, Text, Alert, StyleSheet, Button, Image, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import tw from "twrnc"
import Post from "../components/post"
import { useSelector } from "react-redux";
import { base_url as url } from "../slices/authSlice";
const { width, height } = Dimensions.get("window")

export default function PostScreen(){

    const navigation = useNavigation()
    const route = useRoute()
    const base_url = useSelector(url)

    const { id } = route.params

    const [ post, setPost ] = useState({})
    const [ user, setUser ] = useState({})
    const [ userId, setUserId ] = useState("")
    const [ token, setToken ] = useState("")
    const [ loading, setLoading ] = useState(true)
    const [ isAdmin, setIsAdmin ] = useState(false)
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        const storedToken = await SecureStore.getItemAsync('token');
        const uid = await SecureStore.getItemAsync('id');
        if (storedToken) {
          fetchPosts(storedToken)
          fetchProfile(storedToken)
          setToken(storedToken)
          setUserId(uid)
        } else {
          navigation.replace("Signup")
        }
      };
      checkAuth();
    }, []);

    const fetchPosts = async(token)=>{
      try{
        const link = `${base_url}/post/${id}`
        const response = await fetch(link, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })

        const result = await response.json()
        setPost(result.data)
      } catch(error){
        console.error("Error: ", error)
      } finally {
        setLoading(false)
      }
    }

       const fetchProfile = async(token)=>{
            const uid = await SecureStore.getItemAsync("id")
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
                if(result.id == uid){
                  setIsAdmin(true)
               // ToastAndroid.show(`${result.id} and my id ${uid}`, ToastAndroid.SHORT)
                }
            
            } catch(error){
                console.error("Error: ", error)
            } finally {
              //  setLoading(false)
            }
        }
    
    
  return (
    <View style={styles.container}>
      {loading ? <Text></Text> : <Post content={post} token={token} reload={fetchPosts} userId={userId} isAdmin={isAdmin} />}
      
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

})
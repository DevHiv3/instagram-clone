import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from "react"
import { StyleSheet, Text, Alert, View, ActivityIndicator, KeyboardAvoidingView, Button, Platform, ToastAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Updates from "expo-updates";
import SignupScreen from "./screens/signup"
import LoginScreen from "./screens/login"
import HomeScreen from './screens/home';
import MessagesScreen from './screens/messages';
import ProfileScreen from './screens/profile';
import SearchScreen from './screens/search';
import ChatScreen from './screens/chat';
import CreateScreen from './screens/create';
import NotificationScreen from './screens/notification';
import SettingsScreen from './screens/settings';
import PostScreen from './screens/post';
import StoryScreen from './screens/story';
import FollowersScreen from './screens/followers'
import FollowingsScreen from './screens/followings';
import EditProfileScreen from './screens/edit-profile';
import EditPostScreen from './screens/edit-post';
import BookmarkScreen from './screens/bookmarks';
import FinalizePostScreen from './screens/finalize-post';
import CreateStory from './screens/create-story';
import PhotoScreen from './screens/photo';
import AboutScreen from './screens/about';
import ReelScreen from './screens/reel';
import ReelsScreen from './screens/reels';
import CreateReelScreen from "./screens/create-reel"
import FinalizeReelScreen from './screens/finalize-reel';

const Stack = createNativeStackNavigator()

export default function Navigator() {

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          setIsUpdating(true)
          await Updates.fetchUpdateAsync();
          Alert.alert(
            "Update Available",
            "A new version is available. The app will restart to apply updates.",
            [{ text: "OK", onPress: () => Updates.reloadAsync() }]
          );
        }
      } catch (error) {
        console.error("Error checking for updates:", error);
      } finally {
        setIsUpdating(false); // Hide the loader and show the app
      }
    }

    checkForUpdates();
  }, []);

  if (isUpdating) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  const linking = {
    prefixes: ['instagramclone://'], // Define the custom scheme
    config: {
      screens: {
        Home: 'home',  // Only deep link to the Home screen
        Notification: 'notification',
        Signup: 'signup',
        Login: 'login',
        Create: 'create',
        Chat: 'chat',
        Search: 'search',
        Profile: 'profile',
        Post: 'post',
        Settings: 'settings',
        Story: 'story',
        Messages: 'messages',
        Followers: 'followers',
        Followings: 'followings',
        Bookmarks: 'bookmarks',
        Photo: 'photo'
        // Profile screen does not have a deep link, it’s ignored here
      },
    },
  };

  return (
      <NavigationContainer linking={linking}>
        <SafeAreaProvider>
          <KeyboardAvoidingView behavior={Platform.OS === "ios"  ? "padding":"height"} style={{ flex: 1}}
          keyboardVerticalOffset={Platform.OS === "android" ? -64 : 0}>
            
              <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} /> 
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Messages" component={MessagesScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Create" component={CreateScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Post" component={PostScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Story" component={StoryScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Followings" component={FollowingsScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Followers" component={FollowersScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Edit-Profile" component={EditProfileScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Edit-Post" component={EditPostScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Bookmarks" component={BookmarkScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Finalize-Post" component={FinalizePostScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Create-Story" component={CreateStory} options={{ headerShown: true }} />
                <Stack.Screen name="Photo" component={PhotoScreen} options={{ headerShown: true }} />
                <Stack.Screen name="About" component={AboutScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Reel" component={ReelScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Reels" component={ReelsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Create-Reel" component={CreateReelScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Finalize-Reel" component={FinalizeReelScreen} options={{ headerShown: true }} />
               
          </Stack.Navigator>
        
        </KeyboardAvoidingView>
        </SafeAreaProvider>
        </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

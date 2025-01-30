import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import ImageView from "react-native-image-viewing";
import tw from "twrnc"
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { GestureHandlerRootView, PinchGestureHandler, GestureDetector, Gesture } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

export default function PhotoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { photo } = route.params;

  const [token, setToken] = useState("");
  const [visible, setVisible] = useState(false);
  const scale = useSharedValue(1);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerTitleAlign: "center",
      headerTintColor: "white",
      headerStyle: { backgroundColor: "#000" },
      headerTitleStyle: { textAlign: "center", color: "white", fontWeight: "bold" },
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = await SecureStore.getItemAsync("token");
      if (storedToken) {
        setToken(storedToken);
      } else {
        navigation.replace("Signup");
      }
    };

    checkAuth();
  }, []);

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

  return (
    <View style={tw`flex-1 justify-center bg-black items-center w-full h-full p-30`}>
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={pinchGesture}>
        <Animated.View>
          <TouchableOpacity onPress={() => setVisible(true)}>
            <Animated.Image source={{ uri: photo }} style={[styles.image, animatedStyle]} resizeMode="cover" />
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>

      <ImageView images={[{ uri: photo }]} imageIndex={0} visible={visible} onRequestClose={() => setVisible(false)} />
    </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    height: height,
    width: width,
  },
  image: {
    width: "100%",
    height: 300,
    marginTop: 10,
    borderRadius: 10,
  },
});

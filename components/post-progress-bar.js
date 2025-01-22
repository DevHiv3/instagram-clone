import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import RNModal from 'react-native-modal';
import tw from 'twrnc'
const { width, height } = Dimensions.get("window")

function PostProgressBar({ open, close, message, progress }){

    useEffect(()=>{
        if(progress === 99){
            close()
        }
    }, [progress])

  return (
    <View>
        {!open ? (<Text></Text>) : (
            <View>
              <RNModal isVisible={open} animationIn="zoomIn" animationOut="zoomOut">
                <View style={styles.forgotpassModal}>
                  <Text style={tw`text-white text-lg font-bold ml-2`}>
                    {message}
                  </Text>
                  
                  <View style={tw`mt-2`}>
                    <Text style={tw`text-center font-bold text-red-600 text-lg`}>
                        {progress}
                    </Text>
                  </View>
                  <TouchableOpacity style={tw`text-red-600 mt-2`}>
                    <Text style={tw`text-center font-bold text-white text-lg`}>
                      
                    </Text>
                  </TouchableOpacity>
                </View>
              </RNModal>
            </View>
          )}
    </View>
  )
}

export default PostProgressBar

const styles = StyleSheet.create({
    container: {
   flex: 1,
   backgroundColor: '#000',
   height: height,
   width: width,
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


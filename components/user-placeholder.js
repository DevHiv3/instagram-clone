import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { Skeleton } from '@rneui/themed';
import tw from 'twrnc';

const { width, height } = Dimensions.get("window")
const IMAGE_SIZE = width / 3 - 20
const users = new Array(10).fill(null);

const renderItem = () => (
    <TouchableOpacity style={tw`flex flex-row w-full h-22 justify-between items-center align-center border-white mr-2`}>
      {/* Notification Content */}
      <View style={tw`flex flex-row justify-center align-center h-20`}>
        {/* Profile Image */}
        <View style={tw`flex flex-col align-center justify-center ml-4`}>
          <Skeleton circle width={56} height={56} />
        </View>

        {/* Notification Text */}
        <View style={tw`flex flex-col align-center justify-center ml-4 w-50 text-wrap`}>
          <Skeleton width="70%" height={16} />
          <Skeleton width="50%" height={14} style={{ marginTop: 6 }} />
        </View>

        {/* Action Button */}
        <View style={tw`flex flex-row justify-center items-center h-20 mr-8`}>
          <Skeleton width={80} height={40} borderRadius={20} />
        </View>
      </View>

      {/* Spacer */}
      <View style={tw`flex flex-col align-center justify-center mr-2`} />
    </TouchableOpacity>
  );


const UserSkeletonScreen = ({ refreshing, onRefresh }) => {
  return (
    <FlatList
      data={users}  // Using the simulated notifications array for the skeleton
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default UserSkeletonScreen;


const styles = StyleSheet.create({
    container: {
   flex: 1,
   backgroundColor: '#000',
   height: height,
   width: width,
   paddingTop: 40,
 },
 
})


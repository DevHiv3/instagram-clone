import React from 'react';
import { View, FlatList, StyleSheet, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { Skeleton } from '@rneui/themed';
import tw from 'twrnc';

const { width, height } = Dimensions.get("window")
const IMAGE_SIZE = width / 3 - 20

const ProfileSkeletonScreen = ({ refreshing, onRefresh }) => {
  return (
    <View style={tw`flex-1 bg-black`}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        
        {/* Header */}
        <View style={tw`flex flex-row justify-between items-center p-4`}>
          
        </View>

        {/* Avatar and Stats Section */}
        <View style={tw`flex flex-row justify-evenly items-center p-4`}>
          <View style={tw`flex flex-col justify-center items-center`}>
            <Skeleton circle width={80} height={80} />
            <Skeleton width={80} height={15} style={tw`mt-2`} />
          </View>

          <View style={tw`flex flex-col justify-center items-center`}>
            <Skeleton width={60} height={20} />
            <Skeleton width={50} height={20} style={tw`mt-2`} />
          </View>

          <View style={tw`flex flex-col justify-center items-center`}>
            <Skeleton width={60} height={20} />
            <Skeleton width={50} height={20} style={tw`mt-2`} />
          </View>

          <View style={tw`flex flex-col justify-center items-center`}>
            <Skeleton width={60} height={20} />
            <Skeleton width={50} height={20} style={tw`mt-2`} />
          </View>
        </View>

        {/* Buttons Section */}
        <View style={tw`flex flex-row justify-evenly items-center m-4`}>
          <Skeleton width={120} height={40} borderRadius={20} />
          <Skeleton width={120} height={40} borderRadius={20} />
        </View>

        {/* Posts Section */}
        <View style={tw`p-4`}>
          <FlatList
          contentContainerStyle={styles.grid}
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} // Mock data for skeleton loading
            renderItem={() => (
              <View sstyle={styles.imageContainer}>
                <Skeleton style={styles.image} borderRadius={10} />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            ListEmptyComponent={<Skeleton containerStyle={{ paddingTop: 20 }} />}
          />
        </View>

      </ScrollView>

    </View>
  );
};

export default ProfileSkeletonScreen;


const styles = StyleSheet.create({
    container: {
   flex: 1,
   backgroundColor: '#000',
   height: height,
   width: width,
   paddingTop: 40,
 },
 bottomBar: {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
  backgroundColor: "#000",
  paddingVertical: 15,
  position: "absolute",
  bottom: 0,
  width: "100%",
  padding: 5,
  alignItems: "center",
},
 grid: {
  margin: 5,
},
imageContainer: {
  margin: 5,
},
image: {
  width: IMAGE_SIZE,
  height: IMAGE_SIZE,
  borderRadius: 5,
  marginRight: 10,
  marginBottom: 10,
},

})


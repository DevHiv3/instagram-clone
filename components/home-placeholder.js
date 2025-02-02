import React from 'react';
import { View, FlatList, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { Skeleton } from '@rneui/themed';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, } from "@react-navigation/native";
import tw from 'twrnc';

const { width, height } = Dimensions.get("window")
const IMAGE_SIZE = 50;
const POST_IMAGE_HEIGHT = 300; 

const PostSkeleton = () => {
    return (
      <View style={styles.postView}>
        {/* Post Header (Profile Info) */}
        <View style={styles.postHeader}>
          <View>
            <Skeleton circle width={IMAGE_SIZE} height={IMAGE_SIZE} />
          </View>
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <Skeleton width="60%" height={20} />
            <Skeleton width="40%" height={16} style={{ marginTop: 5 }} />
          </View>
          <TouchableOpacity>
            <Skeleton width={28} height={28} circle />
          </TouchableOpacity>
        </View>
  
        {/* Post Content (Image) */}
        <TouchableOpacity style={{ marginTop: 10 }}>
          <Skeleton width="100%" height={POST_IMAGE_HEIGHT} />
        </TouchableOpacity>
  
        {/* Post Stats (Like, Comment, Share) */}
        <View style={tw`flex flex-row justify-between`}>
          <View style={{ marginTop: 10, flexDirection: 'row', paddingHorizontal: 10 }}>
            <TouchableOpacity style={styles.postStatsOpacity}>
              <Skeleton width={24} height={24} circle />
              <Skeleton width={40} height={16} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles.postStatsOpacity, marginLeft: 10 }}>
              <Skeleton width={24} height={24} circle />
              <Skeleton width={40} height={16} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.postStatsOpacity}>
              <Skeleton width={24} height={24} circle />
              <Skeleton width={40} height={16} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
  
          <TouchableOpacity style={tw`mr-2 mt-4`}>
            <Skeleton width={30} height={30} circle />
          </TouchableOpacity>
        </View>
  
        {/* Post Caption */}
        <Skeleton width="90%" height={14} style={{ marginTop: 10 }} />
        <Skeleton width="60%" height={14} style={{ marginTop: 5 }} />
  
        {/* Post Timestamp */}
        <Skeleton width="40%" height={16} style={{ marginTop: 10, marginBottom: 10 }} />
      </View>
    );
  };

const HomeSkeletonScreen = ({ refreshing, onRefresh }) => {

    const navigation = useNavigation()
    
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

    {/* Stories View */}
    <View style={{ ...styles.storiesView }}>
      <View style={styles.storiesViewTitleView}>
        <Skeleton width={140} height={40} />
        <View style={tw`flex flex-row justify-between`}>
            <View />
            <View style={tw`flex flex-row w-20 space-evenly`}>
            <TouchableOpacity onPress={()=> navigation.navigate("Notification")} style={tw`mr-2`}><AntDesign name="hearto" size={28} color="white" /></TouchableOpacity>
                <TouchableOpacity onPress={()=> navigation.navigate("Messages")} style={tw`mx-2`}><FontAwesome5 name="facebook-messenger" size={24} color="white" /></TouchableOpacity>
            </View>    
        </View>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10 }}>
        <FlatList
          data={[1, 2, 3, 4, 5]} // Mock data for skeleton loading
          keyExtractor={(item, index) => index.toString()}
          renderItem={() => (
            <View style={tw`p-2`}>
              <Skeleton circle width={IMAGE_SIZE} height={IMAGE_SIZE} />
            </View>
          )}
          horizontal={true}
          contentContainerStyle={{ paddingVertical: 5 }}
        />
      </View>
    </View>

    {/* Posts View */}
    <View style={styles.postsView}>
      {/* Replace conditional rendering with skeleton loader for posts */}
      <FlatList
        data={[1, 2, 3, 4, 5]} // Mock data for skeleton loading
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => (
          <PostSkeleton />
        )}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </View>

    <View style={{ height: 20 }}></View>
  </ScrollView>
  );
};

export default HomeSkeletonScreen;


const styles = StyleSheet.create({
    container: {
   flex: 1,
   backgroundColor: '#000',
   height: height,
   width: width,
   paddingTop: 40,
 },

 grid: {
  margin: 5,
},


storiesView: {
    marginBottom: 20,
    backgroundColor: '#000',
    paddingBottom: 15,
  },
  storiesViewTitleView: {
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  postView: {
    marginTop: 10,
    backgroundColor: '#000',
    borderRadius: 10,
    shadowColor: '#1e1e1e',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 8,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  postStatsOpacity: {
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    marginTop: 10,
  },
  showAllText: {
    color: '#c1c1c1',
    fontFamily: 'NSBold',
    fontSize: 18,
  },
})


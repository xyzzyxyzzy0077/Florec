'use strict';
import React, { Component } from 'react';

import {
  StyleSheet,
  AsyncStorage,
  Image,
  Dimensions
} from 'react-native';

import PhotoUpload from 'react-native-photo-upload'


export default class ImageUpload extends Component {

  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {}

  render() {
    return (
      <PhotoUpload
        onPhotoSelect={avatar => {
         if (avatar) {
           console.log('Image base64 string: ', avatar)
         }
       }}>

         <Image
           style={styles.avatar}
           resizeMode='cover'
           source={require('../src/defaultAvatar.png')}/>

       </PhotoUpload>
    )
  }
}

const styles = StyleSheet.create({
  avatar: {
    width: Dimensions.get("window").width * 0.3,
    height: Dimensions.get("window").width * 0.3,
    borderRadius: Dimensions.get("window").width * 0.3/2
  }
})

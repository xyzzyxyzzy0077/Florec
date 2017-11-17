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

  passImage = (avatar) => {
    this.props.getImage(avatar)
  }

  render() {
    return (
      <PhotoUpload
        onPhotoSelect={avatar => {
         if (avatar) {
           this.passImage(avatar)
         }
       }}>

         <Image
           style={styles.avatar}
           resizeMode='cover'
           defaultSource={require('../src/defaultAvatar.png')}/>

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

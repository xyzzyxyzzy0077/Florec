'use strict';
import React, { Component } from 'react';

import {
  StyleSheet,
  AsyncStorage,
  Image,
  Dimensions
} from 'react-native';

import PhotoUpload from 'react-native-photo-upload'


export default class PicUpload extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  passImage = (pic) => {
    this.props.getImage(pic)
  }

  render() {
    return (
      <PhotoUpload
        onPhotoSelect={pic => {
         if (pic) {
           this.passImage(pic)
         }
       }}>

         <Image
           style={styles.pic}
           resizeMode='cover'
           source={require('../src/imagePlaceholder.png')}/>

       </PhotoUpload>
    )
  }
}

const styles = StyleSheet.create({
  pic: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width,
  }
})

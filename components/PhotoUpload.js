'use strict';
import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  AsyncStorage,
  Image
} from 'react-native';

import {
  Container,
  Header,
  Content,
  Icon,
  Form,
  Item,
  Input,
  Label,
  Button,
  Text,
  Picker,
  ActionSheet
} from 'native-base';

import { Col, Row, Grid } from "react-native-easy-grid";
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
   }}
 >
   <Image
     style={{
       paddingVertical: 30,
       width: 150,
       height: 150,
       borderRadius: 75
     }}
     resizeMode='cover'
     source={{
       uri: 'https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg'
     }}
   />
 </PhotoUpload>
    )
  }
}

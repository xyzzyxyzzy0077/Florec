import React, { Component } from 'react';

import {
  StyleSheet,
  AsyncStorage,
  Image,
  Dimensions
} from 'react-native';

import PhotoUpload from 'react-native-photo-upload'

export default class AvatarChange extends Component {

  constructor(props) {
    super(props)
    this.state = {
      photoURL: ''
    }
  }

  componentWillMount() {
    this.setState({
      photoURL: this.props.avatarSource
    })
    console.log(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.avatarSource != nextProps.avatarSource){
      this.setState({
        photoURL: nextProps.avatarSource
      })
    }
  }

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
           source={{uri: this.props.avatarSource}}
           defaultSource={require('../src/defaultAvatar.png')}/>

       </PhotoUpload>
    )
  }
}

const styles = StyleSheet.create({
  avatar: {
    width: Dimensions.get("window").width * 0.2,
    height: Dimensions.get("window").width * 0.2,
    borderRadius: Dimensions.get("window").width * 0.2/2,
  }
})

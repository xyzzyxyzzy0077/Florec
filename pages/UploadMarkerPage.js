'use strict';
import React, {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  Image,
  AsyncStorage,
  Dimensions
} from 'react-native';

import {
  Container,
  Header,
  Content,
  Icon,
  Button,
  Text,
  List,
  ListItem,
  Thumbnail,
  Input,
  Spinner,
  Toast
} from 'native-base';

import { uploadMarker } from '../components/HandlingPins.js'
import firebaseApp from '../components/Firebase.js'
import PicUpload from '../components/PicUpload.js'
import RNFetchBlob from 'react-native-fetch-blob'

const storage = firebaseApp.storage()
const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

export default class UploadMarker extends Component {

  static navigationOptions = {
    title: 'Upload',
    headerBackTitleStyle: {color: 'black'},
    headerTintColor: 'black'
  }

  constructor(props){
    super(props)
    this.state = {
      loading: false,
      UID: '',
      username: '',
      title: '',
      description: '',
      base64Image:'',
      imageURL:'',
      marker: {}
    }
    this.submit = this.submit.bind(this)
  }

  componentWillMount() {

    firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          UID: user.uid,
          username: user.displayName
        })
      } else {
        alert('No user signed in')
      }
    })
  }

  componentDidMount() {
    const { params } = this.props.navigation.state
    this.setState({
      marker: params.tempMarker
    }, () => console.log(this.state.marker))
  }

  isLoading(bool) {
    this.setState({
        loading: bool
    })
  }

  upload = async (marker) => {
    console.log('upload: ' + marker)
    return await uploadMarker({
          UID: this.state.UID,
          username: this.state.username,
          marker,
          title: this.state.title,
          description: this.state.description,
          photo: this.state.imageURL})
  }

  showToast(content, showType){
    Toast.show({
                text: content,
                position: 'bottom',
                buttonText: 'OK',
                duration: 5000,
                type: `${showType}`
              })
  }

  submit = () => {
    if(this.state.base64Image === ''){
      this.showToast('Please select a photo.', 'warning')
      return
    }
    if(this.state.title === ''){
      this.showToast('Please fill in the title.', 'warning')
      return
    }
    this.isLoading(true)
    this.uploadImage(this.state.base64Image)
    .then(url => {
      console.log(url)
      this.setState({imageURL: url})
      this.upload(this.state.marker)
    })
    .then(() => {
      this.props.navigation.goBack()
    })
    .catch(error => {
      this.isLoading(false)
      console.log(error)
    })
  }

  getImage = data => {
    this.setState({
      base64Image: data
    })
    console.log(this.state.base64Image)
  }

  uploadImage = (base64Image) => {
    let uploadBlob = ''
    const imageRef = storage.ref('photo/'+`${this.state.username}`).child(`${this.state.marker.timestamp}`)
    return Blob.build(base64Image, { type: 'image/jpeg;BASE64' })
    .then(blob => {
      uploadBlob = blob
      return imageRef.put(blob, { contentType: 'image/jpeg' })
    })
    .then(() => {
      uploadBlob.close()
      return imageRef.getDownloadURL()
    })
  }

  render() {
    return(
      <Container>
          <PicUpload getImage = {this.getImage}/>
            <Container style={styles.inputContainer}>
              <Content>
                <Input
                  placeholder='Title'
                  placeholderTextColor = 'lightgrey'
                  maxLength = {36}
                  value = {this.state.title}
                  onChangeText={text => this.setState({title: text})}
                  style = {styles.title}/>
                <Input
                  placeholder='More to describe (optional)'
                  placeholderTextColor = 'lightgrey'
                  value = {this.state.description}
                  onChangeText={text => this.setState({description: text})}
                  style = {styles.description}
                  multiline = {true}/>
                </Content>
            </Container>
          <Button full
           style = {styles.submitButton}
           disabled = {this.state.loading}
           onPress = {this.submit}>
            {((!this.state.loading) && (<Text>Submit</Text>)) ||
              ((this.state.loading) && (<Spinner color='white'/>))}
          </Button>
      </Container>

    )
  }
}

const styles = StyleSheet.create({
  inputContainer:{
    paddingHorizontal: 20,
    backgroundColor: 'white'
  },
  title: {
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    marginVertical: 10
  },
  description: {

  },
  submitButton: {
    backgroundColor: '#ff5064'
  }
})

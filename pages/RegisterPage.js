'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  AsyncStorage
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
  ActionSheet,
  Toast
} from 'native-base';

import { Col, Row, Grid } from "react-native-easy-grid";
import DatePicker from 'react-native-datepicker'
import RNFetchBlob from 'react-native-fetch-blob'

import Login from './LoginPage.js';
import firebaseApp from '../components/Firebase.js'
import AvatarUpload from '../components/AvatarUpload.js'

// For ActionSheet
var BUTTONS = ['Male', 'Female', 'Cancel']
var CANCEL_INDEX = 2

// For react-native-fetch-blob
const storage = firebaseApp.storage()
const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

export default class Register extends Component {

  static navigationOptions = {
    title: 'Register',
    headerBackTitleStyle: {color: 'black'},
    headerTintColor: 'black',
  }

  constructor(props){
    super(props);
    this.state = {
      user: {
        uid: '',
        email: '',
        password: '',
        gender: 'Please select',
        dob: this.props.date,
        nickname: '',
        avatarSource: ''
      },
      app: {
        err: '',
        loading: false,
        base64Avatar: ''
      }
    }
  }

  signup(){

    this.setState({
      app: {
        ...this.state.app,
        loading: true
    }})

    firebaseApp.auth().createUserWithEmailAndPassword(this.state.user.email, this.state.user.password)
    .then(() => {
      this.setState({
        user: {
          ...this.state.user,
          uid: firebaseApp.auth().currentUser.uid
        },
        app: {
          ...this.state.app,
          error: '',
          loading: false
        }
      })

      this.sendToFirebase()
      .then(() => Toast.show({
                  text: 'Account created successfully',
                  position: 'bottom',
                  buttonText: 'OK',
                  duration: 3000
                }))
      .catch(error => Toast.show({
                  text: error,
                  position: 'bottom',
                  buttonText: 'OK',
                  duration: 7000
                }))

      // Should jump to MainPage
    })
    .catch((error) => {

      Toast.show({
                  text: error.message,
                  position: 'bottom',
                  buttonText: 'OK',
                  duration: 7000
                })

      this.setState({
        app: {
          ...this.state.app,
          error: 'Create user failed.',
          loading: true
      }});
    });

    // Let the user correct the mistake
      this.setState({
        user: {
          ...this.state.user,
          password: '',
        },
        app: {
          ...this.state.app,
          loading: false,
        }
    });

  };


  sendToFirebase() {
    return new Promise((resolve,reject) => {

          // Send to storage
          let uploadBlob = ''
          const imageRef = storage.ref('avatar').child(`${this.state.user.uid}`)

          // Database reference
          const userDatabase = firebaseApp.database().ref(`users/${this.state.user.uid}`)

          if (this.state.app.base64Avatar != '') { // If the avatar is not selected, no need to upload it, use the default one in the cloud storage
            Blob.build(this.state.app.base64Avatar, { type: 'image/jpeg;BASE64' })
            .then((blob) => {
              uploadBlob = blob
              return imageRef.put(blob, { contentType: 'image/jpeg' })
            })
              .then(() => {
                uploadBlob.close()
                return imageRef.getDownloadURL()
              })
              .then((url) => {
                console.log('url: ' + url)
                this.setState({
                  user: {
                    ...this.state.user,
                    avatarSource: url
                  }
                })
                userDatabase.update({avatarSource: url})
              })
              .catch((error) => {
                reject(error)
              })
          }

          // Send to database

          userDatabase.update({
            uid: this.state.user.uid,
            email: this.state.user.email,
            gender: this.state.user.gender,
            dob: this.state.user.dob,
            nickname: this.state.user.nickname,
          })
          resolve()
    }
  )

  }

  getImage = (data) => {
    this.setState({
      app: {
        ...this.state.app,
        base64Avatar: data
      }
    })
  }

  render() {
    const {navigate} = this.props.navigation

    return (

      <Container>
        <Content contentContainerStyle={{flex: 1}} style={{padding: 10}}>
        <Grid style={{alignItems: 'center'}}>
         <Row>
          <Form style={{flex: 1}}>

            <Item style={{padding: 10}}>
              <AvatarUpload getImage = {this.getImage}/>
            </Item>

            <Item style={{height: 55, flexDirection: 'row', paddingRight: 14}}>
              <Icon active name='contacts' />
              <Label style={{flex: 1}}>Gender</Label>
              <Label style={{color: '#aaaaaa', fontSize: 16, marginRight: 10}}
                onPress={() =>
                ActionSheet.show(
                  {
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                  },
                  buttonIndex => {
                    if(buttonIndex!=2){
                      this.setState({
                      user: {
                        ...this.state.user,
                        gender: BUTTONS[buttonIndex]
                      }})
                    }
                  }
                )}>
                {this.state.user.gender}
              </Label>
            </Item>

            <Item style={{height: 55, flexDirection: 'row'}}>
              <Icon active name='calendar' />
              <Label style={{flex: 1}}>Birthday</Label>
              <DatePicker
                style={{flex: 1, justifyContent: 'flex-start'}}
                customStyles={{
                  dateInput:{borderWidth: 0},
                  dateText:{fontSize: 16},
                  placeholderText:{fontSize:16, color:'#aaaaaa'}
                }}
                date={this.state.user.dob}
                mode="date"
                placeholder="Please select"
                format="DD-MM-YYYY"
                minDate="01-01-1900"
                maxDate="31-12-2016"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                onDateChange={
                  (date) => {
                    this.setState({
                      user: {
                        ...this.state.user,
                        dob: date
                      }
                    })
                  }
                }/>
            </Item>


            <Item>
              <Icon active name='mail' />
              <Input
                placeholder='Email'
                value = {this.state.user.email}
                onChangeText={
                  (text) => this.setState({
                    user: {
                      ...this.state.user,
                      email: text
                    }
                  })
                }/>
            </Item>

            <Item>
              <Icon active name='happy' />
              <Input
                placeholder='Nickname'
                value = {this.state.user.nickname}
                onChangeText={
                  (text) => this.setState({
                    user: {
                      ...this.state.user,
                      nickname: text
                    }
                  })
                }/>
            </Item>

            <Item>
              <Icon active name='lock' />
              <Input
                placeholder='Password'
                value={this.state.user.password}
                onChangeText={
                  (text) => this.setState({
                    user: {
                      ...this.state.user,
                      password: text
                    }
                  })
                }
                secureTextEntry = {true} />
            </Item>
          </Form>
          </Row>
          </Grid>

          <Button block
            style={styles.OKbutton}
            onPress={
                this.signup.bind(this) // Shoud return a Promise and show a toast
            }>
            <Text>OK</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  OKbutton: {
    backgroundColor: '#7acc31'
  }
})

AppRegistry.registerComponent('Register', () => Register);

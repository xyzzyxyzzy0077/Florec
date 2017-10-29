'use strict'
import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  AsyncStorage
} from 'react-native'

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
  Toast,
  Spinner
} from 'native-base'

import { Col, Row, Grid } from "react-native-easy-grid"
import DatePicker from 'react-native-datepicker'
import RNFetchBlob from 'react-native-fetch-blob'

import Login from './LoginPage.js'
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

// User databse
const userDatabase = firebaseApp.database().ref('users')

export default class Register extends Component {

  static navigationOptions = {
    title: 'Register',
    headerBackTitleStyle: {color: 'black'},
    headerTintColor: 'black',
  }

  constructor(props){
    super(props)
    this.state = {
      user: {
        uid: 'empty',
        email: '',
        password: '',
        gender: 'Please select',
        dob: '',
        username: '',
        avatarSource: 'empty'
      },
      app: {
        err: '',
        loading: false,
        base64Avatar: ''
      }
    }
  }

  isLoading(bool) {
    this.setState({
      app: {
        ...this.state.app,
        loading: bool
      }
    })
  }

  signup(){

    this.isLoading(true)

    console.log('4. this.state.app.loading: ' + this.state.app.loading)

    this.checkFields()
    .then(() => {
      firebaseApp.auth().createUserWithEmailAndPassword(this.state.user.email, this.state.user.password)
      .then(() => {

          this.setState({
            user: {
              ...this.state.user,
              uid: firebaseApp.auth().currentUser.uid
            },
          })

          this.sendToFirebase()
          .then(() => Toast.show({
                      text: 'Account created successfully',
                      position: 'bottom',
                      buttonText: 'OK',
                      duration: 3000,
                      type: 'success'
                    }))
          .catch(error => Toast.show({
                      text: error,
                      position: 'bottom',
                      buttonText: 'OK',
                      duration: 7000,
                      type: 'warning'
                    }))
          .done(() => {
            this.isLoading(false)
            console.log('1. this.state.app.loading: ' + this.state.app.loading)
          })
          // Should jump to MainPage
      })
      .catch((error) => {

        Toast.show({
                    text: error.message,
                    position: 'bottom',
                    buttonText: 'OK',
                    duration: 7000,
                    type: 'warning'
                  })
        this.isLoading(false)
        console.log('5. this.state.app.loading: ' + this.state.app.loading)
      })
    })
    .catch((error) => {
      Toast.show({
                  text: error,
                  position: 'bottom',
                  buttonText: 'OK',
                  duration: 7000,
                  type: 'warning'
                })
      this.isLoading(false)
    })
  }

  checkFields() {
    return new Promise((resolve,reject) => {
      for(var key in this.state.user){
        console.log('Here uid is checked and it is ' + this.state.user.uid)
        if(this.state.user[key] == '' || this.state.user[key] == 'Please select'){
          console.log('The key got rejected is ' + key + ' and it is ' + this.state.user[key])
          reject(key != 'dob'? `Please fill in your ${key}` : 'Please fill in your birthday')
          return
        }
      }
      // Check the username is existing in user dabase
      userDatabase.once('value')
      .then( snapshot => {
        console.log('Now the username is: ' + this.state.user.username)
        if(snapshot.child(this.state.user.username).exists()){
          reject('Username already exists.')
          return
        } else {
          resolve()
          }
        })
      .catch(error => console.log(error))
    })
  }



  sendToFirebase() {
    return new Promise((resolve,reject) => {
          // Send to storage
          let uploadBlob = ''
          const imageRef = storage.ref('avatar').child(`${this.state.user.uid}`)

          // Database reference

          userDatabase.once('value')
          .then( snapshot => {
            console.log('Now the username is: ' + this.state.user.username)
            if(snapshot.child(this.state.user.username).exists()){
              reject('Username already exists.')
              return
            } else {
              userDatabase.child(this.state.user.username).update({
                uid: this.state.user.uid,
                email: this.state.user.email,
                gender: this.state.user.gender,
                dob: this.state.user.dob,
                username: this.state.user.username,
              })
            }
          })
          .catch(error => console.log(error))



          if (this.state.app.base64Avatar != '') { // If the avatar is not selected, no need to upload it, use the default one in the cloud storage
            Blob.build(this.state.app.base64Avatar, { type: 'image/jpeg;BASE64' })
            .then((blob) => {
              this.isLoading(true)
              console.log('2. this.state.app.loading: ' + this.state.app.loading)
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
                userDatabase.child(this.state.user.username).update({avatarSource: url})
                resolve()
              })
              .catch((error) => {
                reject(error)
              })
          } else {
            storage.ref('avatar').child('defaultAvatar.png').getDownloadURL()
            .then((data) => {
              this.isLoading(true)
              console.log('3. this.state.app.loading: ' + this.state.app.loading)
              userDatabase.child(this.state.user.username).update({avatarSource: data})
              resolve()
            })
            .catch(error => {
              reject(error)
            })
          }
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
                autoCapitalize = 'none'
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
                autoCapitalize = 'none'
                placeholder='Username'
                value = {this.state.user.username}
                maxLength = {20}
                onChangeText = {
                  (text) => this.setState({
                    user: {
                      ...this.state.user,
                      username: text
                    }
                  })
                }/>
            </Item>

            <Item>
              <Icon active name='lock' />
              <Input
                autoCapitalize = 'none'
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
            onPress={this.signup.bind(this)}>
            {((!this.state.app.loading) && (<Text>OK</Text>)) ||
              ((this.state.app.loading) && (<Spinner color='white'/>))}
          </Button>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  OKbutton: {
    backgroundColor: '#7acc31'
  }
})

AppRegistry.registerComponent('Register', () => Register)

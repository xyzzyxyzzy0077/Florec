'use strict'
import React, {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  Image,
  AsyncStorage,
  Dimensions
} from 'react-native'

import {
  Container,
  Header,
  Content,
  Icon,
  Button,
  Text,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Toast,
  ActionSheet
} from 'native-base'

import AvatarChange from '../components/AvatarChange.js'
import firebaseApp from '../components/Firebase.js'
const storage = firebaseApp.storage()

export default class Account extends Component {

  static navigationOptions = {
      headerTitle: 'Me'
  }

  constructor(props){

    super(props)
    this.state = {
      photoURL: '',
      username: '',
      gender: '',
      email: '',
      base64Avatar: ''
    }
  }

  componentWillMount() {
    firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          photoURL: user.photoURL,
          username: user.displayName,
          email: user.email
        })
        console.log(this.state.photoURL)
      } else {
        alert('No user signed in')
      }
    })
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

  changePassword = () => {
    firebaseApp.auth().sendPasswordResetEmail(this.state.email)
    .then(() => {
      this.showToast('A link to reset password has been send to your email. ', 'success')
    })
    .catch(error => this.showToast(error, 'warning'))
  }

  showSheet = () => {
    const BUTTONS = ['Confirm', 'Cancel']
    const CANCEL_INDEX = 1
    const DESTRUCTIVE_INDEX = 0
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: 'Do you wish to log out?'
      },
      buttonIndex => {
        this.logout(BUTTONS[buttonIndex])
      }
    )
  }

  logout = (buttonPressed) => {
    if(buttonPressed === 'Confirm'){
      AsyncStorage.removeItem('@UserData:Username')
      AsyncStorage.removeItem('@UserData:Email')
      firebaseApp.auth().signOut()
      .then(() => this.props.navigation.navigate('Login'))
      .catch(error => this.showToast(error, 'warning'))
    }
  }

  uploadAvatar = data => {
    let uploadBlob = ''
    this.showToast('Uploading new profile picture.', '')
    const imageRef = storage.ref('avatar').child(`${this.state.username}`)
    return Blob.build(data, { type: 'image/jpeg;BASE64' })
    .then(blob => {
      uploadBlob = blob
      return imageRef.put(blob, { contentType: 'image/jpeg' })
    })
    .then(() => {
      uploadBlob.close()
      return imageRef.getDownloadURL()
    })
    .then(async url => {
      this.setState({avatarSource: url})
      await AsyncStorage.setItem('@UserData:Avatar', this.state.avatarSource)
      this.showToast('Profile picture updated.', 'success')
    })
  }

  render(){

    return (
      <Container>
        <Content contentContainerStyle={{flex: 1}}>
          <List style={{flex: 1}}>
            <ListItem style={styles.listItem}>
              <Left style={styles.avatarContainer}>
                <AvatarChange
                 getImage = {this.uploadAvatar}
                 style={styles.avatar}
                 avatarSource={this.state.photoURL}/>
              </Left>
              <Body>
                <Text>{this.state.username}</Text>
                <Text note>Tap the profile picture to change</Text>
              </Body>
            </ListItem>
            <ListItem icon
              style={styles.listItem}
              onPress={this.changePassword}>
              <Left>
                <Icon name='lock' />
              </Left>
              <Body>
                <Text>Change Password</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>

            <ListItem itemDivider/>

            <ListItem icon
              style={styles.listItem}
              onPress ={() => {
                this.props.navigation.navigate('MyUploads', {username: this.state.username})
              }}>
              <Left>
                <Icon name='cloud-upload' />
              </Left>
            <Body>
              <Text>My Uploads</Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
            </ListItem>

          </List>

          <Button block danger
            style={styles.logoutButton}
            onPress={this.showSheet}>
            <Text>Log out</Text>
          </Button>
          </Content>
      </Container>
    );
  }
}


const styles = StyleSheet.create({
  listItem: {
    marginLeft: 0,
    paddingLeft: 15
  },
  logoutButton: {
    marginHorizontal: 10,
    marginBottom: Dimensions.get("window").height * 0.05
  },
  avatarContainer: {
    marginHorizontal: -80,
  },
  avatar: {
    width: Dimensions.get("window").width * 0.1,
    height: Dimensions.get("window").width * 0.1,
  }
});

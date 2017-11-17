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
  Thumbnail,
  Input,
  Spinner,
  Toast,
  Label
} from 'native-base'
import Moment from 'react-moment'
import 'moment-timezone'
import firebaseApp from '../components/Firebase.js'
const userDatabase = firebaseApp.database().ref('users')

import { Col, Row, Grid } from "react-native-easy-grid"

export default class Detail extends Component {

  static navigationOptions = {
    title: 'Detail',
    headerBackTitleStyle: {color: 'black'},
    headerTintColor: 'black'
  }

  constructor(props){
    super(props)
    this.state = {
      userAvatar: '',
      loading: true
    }
  }

  componentWillMount() {
    const { params } = this.props.navigation.state
    userDatabase.child(`${params.marker.username}`).once('value')
    .then(snapshot => {
      this.setState({
        userAvatar: snapshot.val().avatarSource,
        //loading: false
      })
      console.log(this.state.userAvatar)
    })
    .catch(error => console.log(error))
  }

  getAvatar = (username) => {
    return userDatabase.child(username).once('value')
  }


  render(){
     const { params } = this.props.navigation.state
    // if(this.state.loading == true) return (
    //   <Spinner/>
    // )
    return(
      <Container>
        <Content style={{backgroundColor: 'white'}}>
        <Grid >
          <Row>
            <Image style={styles.photo}
            defaultSource={require('../src/PicLoading1.gif')}
            source={{uri: params.marker.photo}}/>
          </Row>
          <Row style={{margin: 10}}>
            <Col size={1}>
              <Image style={styles.avatar}
               defaultSource={require('../src/defaultAvatar.png')}
               source={{uri:`${this.state.userAvatar}`}}/>
            </Col>
            <Col size={4}>
              <Row/>
              <Row>
                <Label>{params.marker.username}</Label>
              </Row>
              <Row>
                <Moment note element={Text} format="HH:mm DD-MMM YYYY">
                  {params.marker.timestamp.toISOString()}
                </Moment>
              </Row>
            </Col>
          </Row>
          <Row style ={{margin: 15}}>
            <Label style={{fontSize: 18}}>{params.marker.title}</Label>
          </Row>
          <Row>
            <Content style = {{height: 0, borderWidth:1, borderColor: 'lightgrey', borderStyle: 'dashed',}}/>
          </Row>
          <Row style ={{margin: 15}}>
            <Label>{params.marker.description}</Label>
          </Row>
        </Grid>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  photo: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30
  }
})

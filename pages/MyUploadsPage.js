import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
  Image,
  Dimensions,
  AsyncStorage
} from 'react-native'

import {
  Input,
  Text,
  Label,
  Container,
  Content,
  Button,
  Icon
} from 'native-base'

import Moment from 'react-moment'
import 'moment-timezone'

import firebaseApp from '../components/Firebase.js';
const markerDatabase = firebaseApp.database().ref('markers')
let currentQuery
let currentCallback

export default class MyUploads extends Component {

  static navigationOptions = ({navigation}) => ({
    title: `${navigation.state.params.username}'s Uploads`,
    headerTitleStyle: {color: 'black'},
    headerTintColor: 'black',
    headerBackTitle: null
  })

  constructor(props){
    super(props)
    this.state = {
      markers: []
    }
    this.renderItem = this.renderItem.bind(this)
  }

  componentWillMount() {
    this.getMarkers(markers => this.setState({markers}))
  }

  getMarkers = (callback, maxMessages = 10240) => {

    if (currentQuery && currentCallback) {
      currentQuery.off('value', currentCallback);
      currentQuery = null;
      currentCallback = null;
    }

    currentQuery = markerDatabase.child(`${this.props.navigation.state.params.username}`).limitToLast(maxMessages);
    currentCallback = callback;

    currentQuery.orderByChild('timestamp').once('value', snapshot => {
      const data = snapshot.val()
      const markers = []
      for (const key in data){
        const {title, coordinates, timestamp, photo, username,description} = data[key]
        markers.unshift({
          key,
          id: key,
          title,
          coordinates,
          photo,
          username,
          description,
          timestamp: timestamp ? new Date(timestamp) : new Date(1970, 0, 1)
        })
      }
      callback(markers);
    })
  }


  renderItem({item}) {
    const { params } = this.props.navigation.state
    return (
      <TouchableOpacity
       style={styles.row}
       onPress={() => this.props.navigation.navigate('Detail',{marker: item})}>
        <Image
         style={styles.pic}
         source={{uri: item.photo}}
         defaultSource={require('../src/PicLoading2.gif')} />
        <View style={styles.rowText}>
          <Text
            numberOfLines={1}
            style={styles.name}>
            {item.title}</Text>
          <Text note
            numberOfLines={1}
            style = {styles.message}>
            {item.description}</Text>
          </View>
          <View>
        {item.timestamp.getDate() == new Date().getDate() &&
         item.timestamp.getMonth() == new Date().getMonth() &&
         item.timestamp.getYear() == new Date().getYear() ?
          <Moment note element={Text} format='HH:mm'>
            {item.timestamp.toISOString()}
          </Moment>
          :
            item.timestamp.getYear() == new Date().getYear() ?
          <Moment note element={Text}
            format="DD MMM">
            {item.timestamp.toISOString()}
          </Moment>
          :
          <Moment note
            element={Text}
            format="DD MMM YYYY">
            {item.timestamp.toISOString()}
          </Moment>
        }
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.markers}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    marginHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rowText: {
    flex: 1,
  },
  pic: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  name: {
    flex: 2,
    fontSize: 17,
    justifyContent: 'center'
  },
  message: {
    flex:1,
    justifyContent: 'center'
  }

})

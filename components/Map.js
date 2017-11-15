import React, { PropTypes, Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  View,
  Image
} from 'react-native';

import {
  Container,
  Content,
  Icon,
  Button,
  Text,
  Left,
  Body,
  Right
} from 'native-base';

import MapView from 'react-native-maps'

import { getMarkers } from './HandlingPins.js'

export default class Map extends Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0022,
        longitudeDelta: 0.0048,
      },
      markers: [],
      tempMarker: {},
      selectedMarker: {}
    }
    this.renderTempMarker = this.renderTempMarker.bind(this)
  }

  componentDidMount() {
    this.getAndUpdateLocation()
    getMarkers(markers => this.setState({markers}))
  }

  getAndUpdateLocation() {
    navigator.geolocation.getCurrentPosition(
      data => {
        const region = {
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
          latitudeDelta: 0.0022,
          longitudeDelta: 0.0048,
        }
        this.setState({
          region
        })
      },
      (err) => {
        console.log('err', err);
      },
      {}
    )
  }

  onRegionChange = (region) => {
    if (!this.state.regionSet) return;
    this.setState({
      region
    });
  }


  //shouldComponentUpdate(nextProps) {
    //return this.props.event.id !== nextProps.event.id;
    //return true
  //}

  dropPin = (place) => {
    console.log(place.coordinate)
    this.setState({
      tempMarker:
        {
          coordinates: place.coordinate,
          timestamp: new Date().toISOString()
        }
    }, () => console.log(this.state.tempMarker))
  }

  animateToMarker = (ref) => {

    if(Object.getOwnPropertyNames(this.state.selectedMarker).length != 0){
      console.log(this.state.selectedMarker)

      this.map.animateToCoordinate(
        {
          latitude: this.state.selectedMarker.coordinate.latitude + this.state.region.latitudeDelta * 0.00001,
          longitude: this.state.selectedMarker.coordinate.longitude + this.state.region.latitudeDelta * 0.00001,
        },
        300
      )
      ref.showCallout()
    }

  }

  onCalloutPress = () => {
    alert('F')
  }

  onDragEnd = place => {
    console.log(place)
    this.setState({
      tempMarker:
        {
          coordinates: place.coordinate,
          timestamp: new Date().toISOString()
        }
    })
  }

  deleteTemp = () => {
    this.setState({
      tempMarker: {}
    })
  }

  renderTempMarker(t) {
    if (Object.getOwnPropertyNames(t).length != 0) {
      return <MapView.Marker
        ref={m => (this.m = m)}
        pinColor = {'red'}
        draggable = {true}
        coordinate={t.coordinates}
        identifier = {t.id}
        onSelect={e => this.setState({selectedMarker: e.nativeEvent}, () => this.animateToMarker())}
        //onDeselect={() => this.setState({selectedMarker:{}})}
        onDragEnd={e => this.onDragEnd(e.nativeEvent)}>
        <MapView.Callout style={styles.plainView}>
         <Content contentContainerStyle ={{flex: 1,flexDirection: 'column',justifyContent: 'space-between',}}>
           <Button iconRight block small style={styles.continueButton}
            onPress = {() => {
              this.props.navigation.navigate('UploadMarker', {tempMarker: this.state.tempMarker})
            }}>
              <Text style = {{color: 'white'}}>Continue</Text>
              <Icon style = {{color: 'white'}} name = 'arrow-dropright'/>
           </Button>
           <Button iconRight block small style={styles.cancelButton}
            onPress = {this.deleteTemp}>
              <Text style = {{color: 'white'}}>Cancel   </Text>
              <Icon style = {{color: 'white'}} name = 'close-circle'/>
           </Button>
         </Content>
        </MapView.Callout>
      </MapView.Marker>
    }
  }

  render() {
    return (
      <Container>
        <MapView
          ref={map => (this.map = map)}
          style={styles.map}
          region={this.state.region}
          showsUserLocation = {true}
          showsMyLocationButton = {true}
          followsUserLocation = {true}
          onMapReady={() => {
            this.setState({ regionSet: true });
          }}
          onRegionChange = {this.onRegionChange}
          onLongPress={e => this.dropPin(e.nativeEvent)}>

          {this.renderTempMarker(this.state.tempMarker)}

          {this.state.markers.map(marker => (
            <MapView.Marker
              key={marker.id}
              ref={marker.id}
              onPress={() => this.refs[marker.id].hideCallout()}
              onSelect={e => this.setState({selectedMarker: e.nativeEvent}, () => this.animateToMarker(this.refs[marker.id]))}
              Deselect={() => this.setState({selectedMarker:{}})}
              pinColor = {'green'}
              draggable = {false}
              coordinate={marker.coordinates}
              title={marker.title}
              identifier = {marker.id}>
              <MapView.Callout style={styles.plainView}>
               <View style={styles.customCallout}>
               <Image
                 style = {{width: 80, height: 80}}
                 resizeMode='cover'
                 source={require('../src/imagePlaceholder.png')}/>
               <View>
                 <Text style = {{}}>{marker.title}</Text>
                 <Text note style = {{}}>{marker.username}</Text>
               </View>
               </View>
              </MapView.Callout>
            </MapView.Marker>
          ))}
        </MapView>

        <Button
          onPress={() => this.getAndUpdateLocation()}
          style={styles.locateButton}>
          <Icon name="locate" style = {{color:'black'}}/>
        </Button>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: Dimensions.get("window").height * 0.05,
  },
  map: {
    flex:1
  },
  locateButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    bottom: Dimensions.get("window").height * 0.08,
    right: Dimensions.get("window").width * 0.08,
    height: 53,
    borderRadius: 100,
    backgroundColor: 'white',
    shadowColor: 'grey',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  },
  photoButton: {
    width: 80,
    backgroundColor: '#ff5064',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  plainView: {
  },
  continueButton: {
    backgroundColor: '#ff5064',
    marginBottom: 5
  },
  cancelButton: {
    backgroundColor: 'grey'
  },
  customCallout: {
    flex: 1,
    flexDirection: 'row',
    width: Dimensions.get('window').width*0.8
  }
})

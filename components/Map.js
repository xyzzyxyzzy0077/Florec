import React, { PropTypes, Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  View
} from 'react-native';

import {
  Container,
  Content,
  Icon,
  Button,
  Text
} from 'native-base';

import MapView from 'react-native-maps'

import { uploadMarker, getMarkers } from './HandlingPins.js'

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
      markers: []
    }
  }

  componentWillMount() {
    this.getAndUpdateLocation()
    getMarkers(markers => this.setState({markers}))
  }

  getAndUpdateLocation() {
    navigator.geolocation.getCurrentPosition(
      (data) => {
      const region = {
        latitude: data.coords.latitude,
        longitude: data.coords.longitude,
        latitudeDelta: 0.0022,
        longitudeDelta: 0.0048,
      }
        this.setState({
          region
        });
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
      markers:[
        ...this.state.markers,
        {
          id: 'TEMP',
          title: 'test',
          coordinates: place.coordinate
        }
      ]
    })
  }

  onCalloutPress = () => {
    alert('F')
  }

  onDragEnd = place => {
    console.log(place)
  }


  upload = async (marker) => {
    marker.id = 'Whatever'
    await uploadMarker({
      UID: 'lalala',
      marker
    })
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
          onLongPress={e => this.dropPin(e.nativeEvent)}
          onMarkerPress={() => {
            this.map.animateToCoordinate(
              {
                latitude: this.state.region.latitude + this.state.region.latitudeDelta * 0.0001,
                longitude: this.state.region.longitude + this.state.region.longitudeDelta * 0.0001
              },
              0
            )
          }}>


          {this.state.markers.map(marker => (
            <MapView.Marker
              ref={m => (this.m = m)}
              pinColor = {marker.id == 'TEMP' ? 'red' : 'green'}
              draggable = {marker.id == 'TEMP'}
              coordinate={marker.coordinates}
              title={marker.title}
              identifier = {marker.id}
              //onCalloutPress={this.onCalloutPress}
              //onDeselect={() => this.m.showCallout()}
              onDragEnd={e => this.onDragEnd(e.nativeEvent)}>
              <MapView.Callout style={styles.plainView}>
               <Content>
                 <Button
                  iconRight
                  transparent
                  onPress = {() => this.upload(marker)}>
                  <Text style = {{color: '#ff5064'}}>Continue</Text>
                  <Icon style = {{color: '#ff5064'}} name = 'arrow-forward'/>
                 </Button>
               </Content>
              </MapView.Callout>
            </MapView.Marker>
          ))}
        </MapView>

        <View style={styles.buttonContainer}>
          <Button rounded
            onPress={() => {}}
            style={styles.photoButton}>
            <Icon name="camera"/>
          </Button>
        </View>
        <Button
          onPress={() => this.getAndUpdateLocation()}
          style={styles.locateButton}>
          <Icon name="locate"/>
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
    bottom: Dimensions.get("window").height * 0.18,
    right: Dimensions.get("window").width * 0.08,
    height: 53,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  photoButton: {
    width: 80,
    backgroundColor: '#ff5064',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  plainView: {
  }
})

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
      markers: [{
        title: 'test1',
        coordinates: {
          latitude: 31.2295,
          longitude: 121.4728,
        },
      },
      {
        title: 'test2',
        coordinates: {
          latitude: 31.2291,
          longitude: 121.4723,
        },
      },]
    }
  }

  componentWillMount() {
    this.getAndUpdateLocation()
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
    return(
      <MapView.Marker
        coordinate={place.coordinate}>
        <MapView.Callout style={styles.plainView}>
         <View>
           <Text>This is a plain view</Text>
         </View>
       </MapView.Callout>
      </MapView.Marker>
    )
  }


  render() {
    const { event } = this.props
    return (
      <Container>
        <MapView
          ref="map"
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


          {this.state.markers.map(marker => (
            <MapView.Marker
              coordinate={marker.coordinates}
              title={marker.title}>
              <MapView.Callout style={styles.plainView}>
               <View>
                 <Text>{marker.title}</Text>
               </View>
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

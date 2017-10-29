import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Dimensions
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
    }
  }

  componentDidMount() {
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
        };

        this.setState({
          region
        });
      },
      (err) => {
        console.log('err', err);
      },
      {}
    );
  }

  onRegionChangeComplete(region) {
    this.setState({ region });
  }

  render() {
    return (
      <Container>
        <MapView
          style={styles.map}
          region={this.state.region}
          showsUserLocation = {true}
          showsMyLocationButton = {true}
          followsUserLocation = {true}>

          <MapView.Marker
            coordinate={{
              latitude: 31.2295,
              longitude: 121.4728,
            }}/>

        </MapView>

        <Button rounded
          onPress={() => this.getAndUpdateLocation()}
          style={styles.locateButton}>
          <Icon name="locate"/>
        </Button>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  map: {
    flex:1
  },
  locateButton: {
    position: 'absolute',
    bottom: Dimensions.get("window").height * 0.05,
    right: Dimensions.get("window").width * 0.08,
    height: 53,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
})

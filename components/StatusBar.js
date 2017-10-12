'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native'

class StatusBar extends Component {
  render() {
    return (
      <View>
        <View style={styles.statusbar}/>
        <View style={styles.navbar}>
          <Text style={styles.navbarTitle}>{this.props.title}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navbar: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    justifyContent: 'center',
    height: 44,
    flexDirection: 'row'
  },
  navbarTitle: {
    color: '#444',
    fontSize: 16,
    fontWeight: "500"
  },
  statusbar: {
    backgroundColor: '#fff',
    height: 22,
  },
})

module.exports = StatusBar;

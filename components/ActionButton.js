'use strict';

import React, {Component} from 'react';
import ReactNative from 'react-native';

const {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} = ReactNative;

class ActionButton extends Component {
  render() {
    return (
      <View style={styles.action}>
        <TouchableHighlight
          underlayColor='#24CE84'
          onPress={this.props.onPress}>
          <Text style={styles.actionText}>{this.props.title}</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  actionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  action: {
    backgroundColor: '#24CE84',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
})

module.exports = ActionButton;

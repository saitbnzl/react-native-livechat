import React, { Component } from 'react';
import { View, Dimensions, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';

const backImage = require('../../../assets/left-arrow-mini.png');

const { height, width } = Dimensions.get('window');
const totalSize = num => (Math.sqrt((height * height) + (width * width)) * num) / 100;

export default class NavigationBar extends Component {
  render() {
    return (
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.back} onPress={this.props.closeChat}>
          <Image key={Math.random()} source={backImage} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.title}>{this.props.chatTitle}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navBar: {
    height: Platform.OS === 'ios' ? height / 11 : height / 12,
    backgroundColor: '#eee',
    borderBottomColor: '#b2b2b2',
    borderBottomWidth: 1,
    flexDirection: 'row',
    backgroundColor: '#d0391c',
    alignItems: 'center'
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    height: height / 40, width: height / 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    resizeMode: 'contain',
    tintColor: 'white'
  },
  backText: {
    color: 'white', fontSize: totalSize(2), paddingLeft: width / 50, fontFamily: 'Poppins-Medium',
  },
  title: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: totalSize(2),
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});

NavigationBar.propTypes = {
  closeChat: PropTypes.func.isRequired,
  chatTitle: PropTypes.string.isRequired,
};

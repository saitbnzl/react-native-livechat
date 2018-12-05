import React from 'react';
import { StyleSheet, Text, Dimensions, Platform, View, ScrollView, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { GiftedChat, Message, InputToolbar } from 'react-native-gifted-chat';
import NavigationBar from './NavigationBar/NavigationBar';
import { init } from '@livechat/livechat-visitor-sdk';

const { height, width } = Dimensions.get('window');
const totalSize = num => (Math.sqrt((height * height) + (width * width)) * num) / 100;

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      onlineStatus: false,
      typingText: null,
      isTyping: false,
      users: {
        system: {
          name: 'system',
          _id: 'system',
        },
      },
    };
    GLOBAL.visitorSDK.on('new_message', this.handleNewMessage.bind(this));
    GLOBAL.visitorSDK.on('agent_changed', this.handleAgentChanged.bind(this));
    GLOBAL.visitorSDK.on('status_changed', this.handleStateChange.bind(this));
    GLOBAL.visitorSDK.on('typing_indicator', this.handleTypingIndicator.bind(this));
    GLOBAL.visitorSDK.on('chat_ended', this.handleChatEnded.bind(this));
    GLOBAL.visitorSDK.on('visitor_data', this.hendleVisitorData.bind(this));

    this.handleInputTextChange = this.handleInputTextChange.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
  }

  getVisitor = () => {
    const visitorId = Object.keys(this.state.users).find(userId => this.state.users[userId].type === 'visitor');
    return this.state.users[visitorId];
  };

  handleNewMessage = (newMessage) => {
    this.addMessage(newMessage);
  };

  addMessage = (message) => {
    this.setState({
      messages: [{
        text: message.text,
        _id: message.id,
        createdAt: message.timestamp,
        user: this.state.users[message.authorId],
      }, ...this.state.messages],
    });
  };

  handleAgentChanged = (newAgent) => {
    this.addUser(newAgent, 'agent');
  };

  hendleVisitorData = (visitorData) => {
    this.addUser(visitorData, 'visitor');
  };

  handleStateChange = (statusData) => {
    console.log("state changed", statusData)
    this.setState({
      onlineStatus: statusData.status === 'online',
    });
  };

  handleInputTextChange = (text) => {
    GLOBAL.visitorSDK.setSneakPeek({ text });
  };

  handleChatEnded = () => {
    this.setState({
      messages: [{
        text: 'Sohbet kapalı',
        _id: String(Math.random()),
        createdAt: Date.now(),
        user: {
          _id: 'system',
        },
      }, ...this.state.messages],
    });
  };

  handleSend = (messages) => {
    GLOBAL.visitorSDK.sendMessage({
      customId: String(Math.random()),
      text: messages[0].text,
    });
  };

  handleTypingIndicator = (typingData) => {
    console.log("typing", typingData)
    this.setState({ isTyping: typingData.isTyping })
  };

  addUser = (newUser, type) => {
    this.setState({
      users: Object.assign({}, this.state.users, {
        [newUser.id]: {
          _id: newUser.id,
          type: type,
          name: newUser.name || newUser.type,
          avatar: newUser.avatarUrl ? 'https://' + newUser.avatarUrl : null,
        },
      }),
    });
  };

  closeChat = () => {
    this.props.closeChat();
  };

  renderFooter = () => {
    if (this.state.isTyping)
      return (
        <View style={{ marginBottom: 10, marginTop: 10, paddingRight: 15, width, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Text style={{ color: '#cecece', fontFamily: 'Poppins' }} >Pencere Destek yazıyor...</Text>
        </View>
      );
    else return null
  };

  render() {
    if (this.props.isChatOn) {
      console.log("render chat", this.state)
      return (
        <ScrollView
          scrollEnabled={false}
          contentContainerStyle={[styles.container, this.props.containerStyle]}
          ref={(ref) => { this.chat = ref; }}
        >
          {/* <NavigationBar chatTitle={this.props.chatTitle} closeChat={this.closeChat} /> */}
          <Text style={{position: 'absolute', backgroundColor:'white', alignSelf:'center', fontFamily: 'Poppins', color: '#cecece', flex: 1, textAlign: 'center', marginTop: 10}} onPress={() => Keyboard.dismiss()}>
            {this.state.onlineStatus ? this.props.greeting : this.props.noAgents}
          </Text>
          <GiftedChat
            messages={this.state.messages}
            onSend={this.handleSend}
            onInputTextChanged={this.handleInputTextChange}
            user={this.getVisitor()}
            renderInputToolbar={(props) =>
                <InputToolbar {...props} style={{ marginBottom: 500 }} />
            }
            renderFooter={this.renderFooter}
            {...this.props}
          />
        </ScrollView>
      );
    }
    return null;
  }
}

Chat.propTypes = {
  license: PropTypes.number.isRequired,
  chatTitle: PropTypes.string.isRequired,
  closeChat: PropTypes.func.isRequired,
  isChatOn: PropTypes.bool.isRequired,
  greeting: PropTypes.string.isRequired,
  noAgents: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  hide: {
    width: 0,
    height: 0,
    position: 'absolute',
  },
  container: {
    width,
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#fff',
  },
  navigation: {
    flex: 1,
  },
  systemMessage: {
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
  status: {
    fontFamily: 'Poppins',
    textAlign: 'center',
    fontSize: totalSize(1.8),
    fontWeight: '500',
    color: 'gray',
    padding: 5,
  },
});

import React, { Component } from 'react';
import GuerillaRadio from './GuerillaRadio';
import {
  StyleSheet,
  Button,
  FlatList,
  View,
  Text,
  Image,
  TextInput,
  Keyboard
} from 'react-native';
const uuidv4 = require('uuid/v4');


function Item({ message }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>
        {message}
      </Text>
    </View>
  )
}

class App extends Component {
  state = {};
  guerillaRadio;
  constructor(params) {
    super(params);
    this.state.messageToSend = null;
    this.state.receivedMessages = [];
    this.state.refresh = false;
    this.state.username = "anonymous";
    this.guerillaRadio = new GuerillaRadio(this);
    this.guerillaRadio.broadcast();
    this.guerillaRadio.listenForPeers();
    this.guerillaRadio.listenForMessage(this.state.receivedMessages);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerCenter}>
          <Image
            style={styles.image}
            source={require('./library/components/logo.png')}
          />
          <Text>
            Username:
          </Text>
          <TextInput
            style={styles.textInputStyle}
            placeholder="enter your username"
            onChangeText={(username) => this.setState({ username })}
            value={this.state.username}
          />
          <Text>
            Connected Peers: {this.guerillaRadio.getPeersLength()}
          </Text>
          <Button
            style={styles.bottom}
            title="Clear Messages"
            onPress={() => {
              this.setState({
                receivedMessages: []
              });
              this.guerillaRadio.saveMessages([]);
              Keyboard.dismiss();
            }
            }
          />
        </View>
        <Text>
          Messages:
        </Text>
        <FlatList
          data={this.state.receivedMessages}
          renderItem={({ item }) => <Item message={item.text} />}
          keyExtractor={item => item.id}
          extraData={this.state.refresh}
        />
        <View>
          <TextInput
            style={styles.textInputStyle}
            placeholder="type your message"
            onChangeText={(messageToSend) => this.setState({ messageToSend })}
            value={this.state.messageToSend}
          />
          <Button
            style={styles.bottom}
            title="Send"
            onPress={() => {
              this.guerillaRadio.sendMessage(
                this.state.messageToSend,
                this.state.receivedMessages,
                this.state.username
              );
              this.state.messageToSend = "";
              Keyboard.dismiss();
            }
            }
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerCenter: {
    alignItems: 'center',
  },
  textInputStyle: {
    height: 40,
    textAlign: 'center',
    marginBottom: 10
  },
  image: {
    alignItems: 'center',
    alignContent: 'center',
    marginBottom: 20
  },
  title: {
    textAlign: 'left',
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    marginVertical: 2,
    marginHorizontal: 10,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
    alignItems: 'center'
  }
});

export default App;

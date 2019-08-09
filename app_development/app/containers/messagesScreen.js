import React, { Component } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Container, Text } from "native-base";
import MessagesHeader from "../components/messagesHeader";

export default class MessagesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //state property here
    };
  }

  render() {
    goBack = () => {
      this.props.navigation.goBack();
    }
    
    const { navigation } = this.props;
    const number = navigation.getParam('number', 'NO-NUMBER');
    const messages = navigation.getParam('messageList', 'NO-MESSAGES');
    const statuses = navigation.getParam('statuses', 'NO-STATUSES');
    let displayedMessages = [];

    for (let msgIdx = 0; msgIdx < messages.length; msgIdx++) {
      displayedMessages.push(
        <TouchableOpacity
          onpress={() => console.log('TODO: Warning Education System for Phishing Messages')} 
          style={[statuses[msgIdx] ? styles.phishingMessage : styles.cleanMessage]}
          key={number + msgIdx}>
          <View>
            <Text>
              {messages[msgIdx]}
            </Text>
          </View>
        </TouchableOpacity>
      )
    }

    return (
      <Container>
        <View>
          <MessagesHeader 
          goBack = {this.props.navigation.goBack}
          number = {number} />
          <ScrollView
            contentContainerStyle={styles.messageBlock}
            ref={ref => this.scrollView = ref}
            onContentSizeChange={()=>{        
            this.scrollView.scrollToEnd({animated: false});}}>
            {displayedMessages}
          </ScrollView>
        </View>
      </Container>
    );
  }
}

/*
//Internal StyleSheet here
*/
const styles = StyleSheet.create({
  cleanMessage: {
    backgroundColor: '#53bcff',
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
    width: "90%",
  },
  messageBlock: {
    alignItems: "center",
    paddingBottom: 80,
  },
  phishingMessage: {
    backgroundColor: "#ff6666",
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
    width: "90%",
  },
});

module.export = MessagesScreen; //module export statement

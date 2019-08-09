import React, { Component } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Container, Text } from "native-base";
import HomeHeader from "../components/homeHeader";
import MessagesManager from "../managers/messagesManager";
import {PermissionsAndroid} from 'react-native';

async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

export default class DebugScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messagesItems: [
        {
          "Name": "Delta", 
          "Number": "94445555", 
          "Messages": [
            "Hi there!!",
            "Text 012 8455 9455 for free porn videos now!!!!",
            "Waiting for you, ya? ;)"
          ],
          "Statuses": [
            false,
            true,
            false
          ],
          "Warnings": [
            [],
            [
              "Phishing keywords detected!",
              "Contact number detected! Unless you know who the number belongs to, do not reply nor call such numbers."
            ],
            []
          ]
        }
      ],
    };
  }

  componentDidMount() {
    requestCameraPermission();
    MessagesManager._resetMessages();
    this.addToMessages({
      "Name": "Alpha", 
      "Number": "91112222", 
      "Messages": [
        "We have detected suspicious activity in your POSB account. Please confirm device immediately, follow this link posb-bank.-com/sg/online-banking/?6584550465",
        "Hello! :)",
        "All your POSB transactions are suspended. You must confirm your device immediately. Follow posb-security.com/sg/online/?6584550465",
        "Hi there!!",
        "Text 012 8455 9455 for free porn videos now!!!!",
        "Waiting for you, ya? ;)",
        "Hello, are you there???",
        "Hey man, what's up?",
        "Your account has been compromised! Reply HELP to 85355 to find out what happened!!!",
        "Yo, you alright man?",
        "The topic of voyeurism has grabbed the attention of Singaporeans in recent months, but the compulsive viewing of Internet pornography, which goes largely unnoticed, could be a bigger problem here. Text 65355 to subscribe and find out more!"
      ],
      "Statuses": [
        true, 
        false,
        true,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        false
      ],
      "Warnings": [
        [
          "URL detected! Do not click on any links, even if it looks safe. If you suspect your account was genuinely compromised, contact the relevant organization via an official number you can trust."
        ],
        [],
        [
          "URL detected! Do not click on any links, even if it looks safe. If you suspect your account was genuinely compromised, contact the relevant organization via an official number you can trust."
        ]
      ]
    });
    this.addToMessages({
      "Name": "Bravo", 
      "Number": "92223333", 
      "Messages": [
        "We have detected suspicious activity in your POSB account. Please confirm device immediately, follow this link posb-bank.-com/sg/online-banking/?6584550465",
        "Hello! :)",
        "All your POSB transactions are suspended. You must confirm your device immediately. Follow posb-security.com/sg/online/?6584550465",
      ],
      "Statuses": [
        true,
        false,
        true
      ],
      "Warnings": [
        [],
        [
          "Phishing keywords detected!",
          "Contact number detected! Unless you know who the number belongs to, do not reply nor call such numbers."
        ],
        []
      ]
    });
    this.addToMessages({
      "Name": "Charlie", 
      "Number": "93334444", 
      "Messages": [
        "Hi there!!",
        "Text 012 8455 9455 for free porn videos now!!!!",
        "Waiting for you, ya? ;)"
      ],
      "Statuses": [
        false,
        true,
        false
      ],
      "Warnings": [
        [],
        [
          "Phishing keywords detected!",
          "Contact number detected! Unless you know who the number belongs to, do not reply nor call such numbers."
        ],
        []
      ]
    });
    this.getMessagesItems();
  }

  getMessagesItems() {
    //getAllListItems
    let messagesPromise = MessagesManager._retrieveMessagesItem();
    //console.log(cartPromise);

    messagesPromise
      .then(result => {
        console.log("getMessagesItems result", result);
        let messagesItems = JSON.parse(result);
        console.log("messagesItems", messagesItems);
        if (messagesItems.length > 0) {
          console.log("here");
          this.setState({ messagesItems: messagesItems });
          //this.updateTotalPriceTotalQty(messagesItems);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  /*
    React LifeCycle Methods: 
    e.g. componentWillMount(),
         componentDidMount
         
    additional JS functions 
    -> to change the state of component,
    -> call API to pass and receive data from backend
    -> any other functions etc.
  */


  addToMessages(messagesItem) {
    //let messagesItem = this.createMessagesItem();

    

    let messagesPromise = MessagesManager._retrieveMessagesItem();

    messagesPromise.then(result => {
      console.log("addToMessages result", result);

      let listMessagesItems = JSON.parse(result);
      let isExistingContact = false;

      //if cart is not empty
      if (listMessagesItems.length > 0) {
        for (let i = 0; i < listMessagesItems.length; i++) {
          console.log(
            "listMessagesItems",
            listMessagesItems[i]["Number"]
          );
          //update the listItem qty if found
          if (listMessagesItems[i]["Number"] == 1) {
            //remove item and replace it at the end
            isExistingContact = true;
            break;
          }
        }

        //add item if not found it
        if (!isExistingContact) {
          listMessagesItems.push(messagesItem);
          MessagesManager._storeMessagesItem(listMessagesItems);
        }
      }
      //cart is empty
      else {
        listMessagesItems.push(messagesItem);
        MessagesManager._storeMessagesItem(listMessagesItems);
      }
    });
    //console.log(MessagesManager._retrieveMessagesItem());
  }

  createMessagesItem(a) {
    return (messagesItem = a);
  }
  refresh = () => {
    this.addToMessages({
      "Name": "Charlie", 
      "Number": "93334444", 
      "Messages": [
        "Hi there!!",
        "Text 012 8455 9455 for free porn videos now!!!!",
        "Waiting for you, ya? ;)"
      ],
      "Statuses": [
        false,
        true,
        false
      ],
      "Warnings": [
        [],
        [
          "Phishing keywords detected!",
          "Contact number detected! Unless you know who the number belongs to, do not reply nor call such numbers."
        ],
        []
      ]
    });
    this.getMessagesItems();
    this.setState({ });
    console.log('refresh');
  }

  render() {
    console.log('rendered');
    console.log(this.state.messagesItems)
    let messageBlocks = [];
    let messages = this.state.messagesItems;
    let numOfMessages = messages.length;

    for (let msgIdx = 0; msgIdx < numOfMessages; msgIdx++) {
      let number = messages[msgIdx].Number;
      messageBlocks.push(
        <TouchableOpacity 
          onPress={() => this.props.navigation.navigate("Messages", { number: number})}
          style={styles.messageBlock}>
          <View>
            <Text style={styles.messageName}>
              {messages[msgIdx].Name}
            </Text>
            <Text style={styles.messageContent}>
              {messages[msgIdx].Content}
            </Text>
          </View>
        </TouchableOpacity>
      )
    };
    return (
      <Container>
        <View>
          <HomeHeader 
            refresh = {this.refresh}
          />
          <ScrollView>
            {messageBlocks}
          </ScrollView>

        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  messageName: {
    color: "black",
    fontSize: 18,
    marginLeft: 60,
    paddingTop: 10,
  },
  messageContent: {
    color: "grey",
    fontSize: 18,
    marginLeft: 60,
    paddingBottom: 10,
  },
  messageBlock: {
    borderColor: "grey",
    borderTopWidth: 0.25,
    borderBottomWidth: 0.25,
    height: 70,
  }
});

module.export = DebugScreen; //module export statement

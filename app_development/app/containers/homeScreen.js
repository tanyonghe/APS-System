import React, { Component } from "react";
import { PermissionsAndroid, View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Container, Text } from "native-base";
import HomeHeader from "../components/homeHeader";
import MessagesManager from "../managers/messagesManager";
import SmsListener from "react-native-android-sms-listener";
import * as pushNotifications from "../managers/notificationsManager";

pushNotifications.configure();

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messagesItems: [],
      lastMessage: "",
      subscription: ""
    };
  }

  
  componentDidMount() {
    //MessagesManager._deleteMessagesItem();
    //MessagesManager._resetMessages();
    this.requestReadSmsPermission();
    this.getMessagesItems();

    if (this.state.subscription === "") {
      let subscription = SmsListener.addListener(message => {
        this.addToMessages(message);
      });
      this.setState({ subscription: subscription });
    }
  }

  async requestReadSmsPermission() {
    try {
      var granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: "Phishing SMS Detector - Read SMS",
          message: "Require READ access to SMS to detect phishing messages"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("READ_SMS permissions granted", granted);
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          {
            title: "Phishing SMS Detector - Receive SMS",
            message: "Require RECEIVE access to SMS to detect incoming messages"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("RECEIVE_SMS permissions granted", granted);
        } 
        else {
          console.log("RECEIVE_SMS permissions denied");
        }
      } 
      else {
        console.log("READ_SMS permissions denied");
      }
    } 
    catch (err) {
      console.log(err);
    }
  }


  /* Creates a new dictionary entry for a particular sender. */
  createMessagesItem(originatingAddress, body, statuses, warnings) {
    return (messagesItem = {
      "Name": originatingAddress, 
      "Number": originatingAddress, 
      "Messages": body,
      "Statuses": statuses,
      "Warnings": warnings
    });
  }


  /* Function takes in react-native-android-sms-listener output as input and stores the message. */
  addToMessages = async (message) => {
    let originatingAddress = message.originatingAddress;
    let body = message.body;

    // if message is not repeatedly received due to an error or a bug
    if (this.state.lastMessage !== body) {
      this.setState({ lastMessage: body });

      // send GET request to deployed model and update status as phishing or clean
      let status = false;
      let predictorSite = "http://apssystem.pythonanywhere.com/predict/";
      let bodyURIEncoded = encodeURIComponent(message.body).replace(/%2F/g, '%252F');
      let fetchPromise  = await fetch(predictorSite + bodyURIEncoded)
      let fetchJson = await fetchPromise.json();
      if (fetchJson.phishing === '1') {
        status = true;
        pushNotifications.localNotification();
      }

      let warning = []; // TODO: Warning Education System
      let messagesItem = this.createMessagesItem(originatingAddress, [body], [status], [warning]);
      let messagesPromise = MessagesManager._retrieveMessagesItem();

      messagesPromise.then(result => {
        let listMessagesItems = JSON.parse(result);
        let isExistingContact = false;

        // if message box is not empty
        if (listMessagesItems.length > 0) {
          for (let i = 0; i < listMessagesItems.length; i++) {
            msgItem = listMessagesItems[i]

            // if sender has an existing message thread
            if (msgItem.Number == originatingAddress) {
              msgItem.Messages.push(body);
              msgItem.Statuses.push(status);
              msgItem.Warnings.push(warning);
              messagesItem = this.createMessagesItem(originatingAddress, msgItem.Messages, msgItem.Statuses, msgItem.Warnings);

              // message thread gets pushed to the back of the list to simulate sorting by date and time
              listMessagesItems.splice(i, 1);
              listMessagesItems.push(messagesItem);
              isExistingContact = true;
              MessagesManager._storeMessagesItem(listMessagesItems);

              this.getMessagesItems();
              console.log("addToMessages: Adding to existing contact messages");
              break;
            }
          }

          // add new message thread if no existing message thread by sender
          if (!isExistingContact) {
            listMessagesItems.push(messagesItem);
            MessagesManager._storeMessagesItem(listMessagesItems);
            this.getMessagesItems();
            console.log("addToMessages: Adding new message by new contact");
          }
        }

        // message box is empty
        else {
          listMessagesItems.push(messagesItem);
          MessagesManager._storeMessagesItem(listMessagesItems);
          this.getMessagesItems();
          console.log("addToMessages: adding to empty list");
        }
      });
    }
  }

  /* Retrieves the list of stored message threads. */
  getMessagesItems() {
    let messagesPromise = MessagesManager._retrieveMessagesItem();

    messagesPromise
      .then(result => {
        let messagesItems = JSON.parse(result);
        if (messagesItems.length > 0) {
          this.setState({ messagesItems: messagesItems });
        }
      })
      .catch(error => {
        MessagesManager._resetMessages();
        console.log(error);
      });
  }


  refresh = () => {
    this.addToMessages({
      originatingAddress: '+6598765432',
      body: "Hello, thank you for using APS System! :)"
      //body: "Dear customer, we have detected suspicious transactions on your credit card. Key in your details at www.credit-card-checker.com to review your activity now!"
    });
    this.getMessagesItems();
    this.setState({ messagesItems: this.state.messagesItems });
    console.log('App is refreshed');
  }


  render() {
    let messagesItems = this.state.messagesItems;
    let messageBlocks = [];
    let numOfMessages = messagesItems.length;
    let maxDisplayedLength = 36;

    // most recent message thread gets shown first
    for (let msgIdx = numOfMessages - 1; msgIdx >= 0; msgIdx--) {
      let number = messagesItems[msgIdx].Number;
      let messages = messagesItems[msgIdx].Messages;
      let statuses = messagesItems[msgIdx].Statuses;
      let displayedMsg = messages.slice(-1).pop();
      let trailingDots = "";
      if (displayedMsg.length > maxDisplayedLength) {
        trailingDots = "..."
      }
      messageBlocks.push(
        <TouchableOpacity 
          onPress={() => this.props.navigation.navigate("Messages", { number: number, messageList: messages, statuses: statuses})}
          style={styles.messageBlock}
          key={number}>
          <View>
            <Text style={styles.messageName}>
              {messagesItems[msgIdx].Number}
            </Text>
            <Text style={styles.messageContent}>
              {displayedMsg.substring(0, maxDisplayedLength) + trailingDots}
            </Text>
          </View>
        </TouchableOpacity>
      )
    }

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


/* Internal stylesheet is stored here. */
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

module.export = HomeScreen; // module export statement

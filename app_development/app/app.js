import React, { Component } from "react";
import { createAppContainer, createStackNavigator } from "react-navigation";
import HomeScreen from "./containers/homeScreen";
import MessagesScreen from "./containers/messagesScreen";
import DebugScreen from "./containers/debugScreen";

const MyStackNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Messages: MessagesScreen,
    Debug: DebugScreen
  },
  {
    headerMode: "none",
    initialRouteName: "Home"
  }
);

const AppContainer = createAppContainer(MyStackNavigator);

export default class APSSystem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //state property here
    };
  }

  render() {
    return <AppContainer />;
  }
}

import React, { Component } from "react";
import { StyleSheet } from "react-native";
import {
  Body,
  Title,
  Header,
  Left,
  Right,
  Button,
  Icon
} from "native-base";

export default class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //state property here
    };
  }

  render() {

    return (
      <Header style={{ 
        backgroundColor: "#3667bf" }}>
        <Left>
          <Button transparent>
            <Icon 
              ios="ios-menu" 
              android="md-menu" 
              style={{ color: "white" }} />
          </Button>
        </Left>
        <Body style={{ flex: 3, paddingLeft: 20 }}>
          <Title 
            style={styles.appTitle}
            onPress={() => this.props.refresh()} >
            APS System
          </Title>
        </Body>
        <Right>
          <Button transparent>
            <Icon
              type="FontAwesome"
              name="search"
              style={{ color: "white" }}
            />
          </Button>
        </Right>
      </Header>
    );
  }
}

/*
//Internal StyleSheet here
*/
const styles = StyleSheet.create({
  appTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  }
});

module.export = HomeHeader; //module export statement

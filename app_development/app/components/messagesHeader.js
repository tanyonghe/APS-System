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


export default class MessagesHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //state property here
    };
  }

  render() {

    return (
      <Header style={{ backgroundColor: '#3667bf'}}>
        <Left>
          <Button transparent>
            <Icon 
              type="FontAwesome" 
              name="arrow-left" 
              style={{ color: "white" }}
              onPress={() => this.props.goBack()} />
          </Button>
        </Left>
        <Body style={{ flex: 3, paddingLeft: 20 }}>
          <Title style={styles.appTitle}>
            {this.props.number}
          </Title>
        </Body>
        <Right>
          <Button transparent>
            <Icon
              type="FontAwesome"
              name="ellipsis-v"
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
    fontSize: 24,
  }
});

module.export = MessagesHeader; //module export statement

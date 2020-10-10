import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Page } from "../styles";

export class Spinner extends React.Component {
  render() {
    return (
      <View style={Page.spinner}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
}
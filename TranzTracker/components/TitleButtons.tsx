import { Ionicons } from '@expo/vector-icons'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import React from 'react'
import { Text, View } from 'react-native'
import { grey, isDark, Page, Title } from '../styles'

type TitleButtonsProps = {
  stackProps: StackHeaderLeftButtonProps
}

type IconProps = {
  name: string
}

function Icon(props: IconProps) {
  return (
    <Ionicons name={props.name} color={isDark ? grey : 'black'} size={35} />
  )
}

export class TitleButtons extends React.Component<TitleButtonsProps> {
  render() {
    return (
      <View style={Title.container}>
        <View style={Title.buttonContainer}>
          <Icon name="md-bus" />
        </View>

        <View style={Title.buttonContainer}>
          <Icon name="md-bus" />
        </View>

        <View style={Title.buttonContainer}>
          <Icon name="md-bus" />
        </View>
      </View>
    )
  }
}
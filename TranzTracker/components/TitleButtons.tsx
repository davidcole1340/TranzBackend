import { Ionicons } from '@expo/vector-icons'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { BusListContext, BusListContextType } from '../context/BusListContext'
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
  static contextType = BusListContext
  context!: React.ContextType<typeof BusListContext>

  render() {
    return (
      <View style={Title.container}>
        {/* <View style={Title.buttonContainer}>
          <Icon name="md-bus" />
        </View> */}
        {this.context.loading ? <View style={Title.buttonContainer}>
          <ActivityIndicator size="large" />
        </View> : null}
      </View>
    )
  }
}
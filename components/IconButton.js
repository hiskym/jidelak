import { View, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function IconButton({icon, onPress}) {
  return (
    <TouchableOpacity onPress={onPress}>
        <View className="mx-5">
            <Ionicons name={icon} size={24} color="black" />
        </View>
    </TouchableOpacity>
  )
}
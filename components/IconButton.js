import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function IconButton({ icon, onPress, color }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="mx-5">
        <Ionicons name={icon} size={24} color={!color ? '#0F172A' : color} />
      </View>
    </TouchableOpacity>
  )
}
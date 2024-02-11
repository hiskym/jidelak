import { View, Text, Image } from 'react-native'
import React from 'react'

export default function FavoriteCard({ name, id, image, description }) {
    return (
        // bude ziskavat name, image, description
        <View className="border border-slate-300 rounded-lg bg-slate-200 flex flex-col p-2 my-2 w-48 h-80 max-h-80 items-center justify-center">
            <Image style={{ width: 150, height: 150, borderRadius: 20 }} source={{ uri: image }} />
            <Text className="text-2xl">{name}</Text>
            <Text className="text-sm">{description}</Text>
        </View>
    )
}
import { View, Text, Image } from 'react-native'
import React from 'react'

export default function RecipeCard({ name, image }) {
    return (
        <View className={`border border-slate-100 rounded-lg flex-col w-[165px] h-60 items-center shadow-md bg-white overflow-hidden m-2`}>
                <Image style={{ width: '100%', height: '70%', resizeMode: 'cover'}} source={{ uri: image }} />
                <View className="w-full border-slate-200 border-t-[1px] opacity-70"></View>
                <View className="px-1 pb-2 pt-1 bg-white h-[30%] flex justify-center">
                    <Text className="text-base font-bold text-center text-slate-900">{name}</Text>
            </View>
        </View>
    )
}
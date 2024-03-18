import { View, Text, Modal, TouchableOpacity} from 'react-native'
import React from 'react'
import { useState } from 'react'
import IconButton from '../components/IconButton'
import Terms from './Terms'

// tbd
export default function About() {

  const [modalOpen, setModalOpen] = useState(false)

  return (
    <View className="p-3 m-2 items-center flex flex-col justify-between h-full">
      <Modal visible={modalOpen} animationType="slide" className="bg-slate-100">
          <View className="flex-col flex-1 justify-between m-5 mt-20 items-center">
            <IconButton
              icon='close'
              onPress={() => setModalOpen(false)}
            />
            <Terms />
          </View>
      </Modal>

      <Text className="leading-6 text-slate-900">
        Aplikace Jídelák vznikla jako bakalářská práce v React Native. Veškerá doporučení v aplikaci jsou čistě informativní a měli byste je nejdříve konzultovat s lékařem nebo svým výživovým poradcem. 
        Registrací v aplikaci  
          <TouchableOpacity onPress={() => setModalOpen(true)}>
            <Text className="text-blue-500">souhlasíte s podmínkami používání aplikace.</Text>
          </TouchableOpacity>
        </Text>
      
      <Text className="mb-10">&copy; Jan Vlček 2024</Text>
    </View>
  )
}
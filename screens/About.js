import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react'
import IconButton from '../components/IconButton'
import Terms from './Terms'
import PrivacyPolicy from './PrivacyPolicy'

export default function About() {

  const [modalTermsOpen, setModalTermsOpen] = useState(false)
  const [modalPrivacyOpen, setModalPrivacyOpen] = useState(false)

  return (
    <View className="p-3 m-2 items-center flex flex-col justify-between h-full">
      <Modal visible={modalTermsOpen} animationType="slide" className="bg-slate-100">
        <View className="flex-col flex-1 justify-between m-5 mt-20 items-center">
          <IconButton
            icon='close'
            onPress={() => setModalTermsOpen(false)}
          />
          <Terms />
        </View>
      </Modal>

      <Modal visible={modalPrivacyOpen} animationType="slide" className="bg-slate-100">
        <View className="flex-col flex-1 justify-between m-5 mt-20 items-center">
          <IconButton
            icon='close'
            onPress={() => setModalPrivacyOpen(false)}
          />
          <PrivacyPolicy />
        </View>
      </Modal>

      <Text className="leading-6 text-slate-900">
        Aplikace Jídelák vznikla jako bakalářská práce v React Native a klade si za cíl svým uživatelům pomoci se správou receptů, přípravou jídel a plánováním jídel. Veškerá doporučení v aplikaci jsou čistě informativní a měli byste je nejdříve konzultovat s lékařem nebo svým výživovým poradcem.
        Registrací v aplikaci souhlasíte s:
      </Text>
      <View className="">
        <TouchableOpacity onPress={() => setModalTermsOpen(true)} className="mb-5">
          <Text className="text-blue-500">Smluvní podmínky aplikace</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalPrivacyOpen(true)}>
          <Text className="text-blue-500">Zásady ochrany osobních údajů.</Text>
        </TouchableOpacity>
      </View>


      <Text className="mb-10">&copy; Jan Vlček 2024</Text>
    </View>
  )
}
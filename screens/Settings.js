import { View, Text, ScrollView, TouchableWithoutFeedback, Keyboard, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Formik } from 'formik';
import * as yup from 'yup'
import { useUserStore } from '../store/UserStore';
import { getUsername } from '../utils/userUtils';
import { updatePassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { usersRef } from '../firebaseConfig';
import { deleteAccount } from '../utils/userUtils';

const userSchema = yup.object({
  password: yup.string().required('Musíte si zvolit heslo').min(8, 'Heslo je moc krátké'),
  username: yup.string().required('Zadejte své jméno').min(3),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Hesla nejsou stejná').required('Musíte zadat heslo znovu')
})

export default function Settings({ navigation }) {

  const { user, setUser } = useUserStore();

  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const [currentUserName, setCurrentUsername] = useState('');

  useEffect(() => {
    if (user && user.uid) {
      getUsername(user.uid, setCurrentUsername);
    }

  }, [user])

  const changeUserData = async (username, password) => {
    try {
      const userDoc = doc(usersRef, user.uid)

      await setDoc(userDoc, { name: username })
      await updatePassword(user, password);

      Alert.alert('Povedlo se!', 'Povedlo vám změnit údaje.', [
        {
          text: 'OK',
        }
      ])
    } catch (error) {
      console.error(error)
      Alert.alert('Chyba!', 'Zkuste to znovu později.', [
        {
          text: 'OK',
        }
      ])
    }
  }

  const handleChangeData = (username, password) => {
    Alert.alert('Aktualizovat', 'Opravdu chcete změnit své údaje?', [
      {
        text: 'Zrušit'
      },
      {
        text: 'OK',
        onPress: () => changeUserData(username, password)
      }
    ])
  }

  const handleDelete = (user, userId) => {
    Alert.alert('Smazat účet', 'Opravdu chcete smazat účet? Toto nelze vrátit zpět.', [
      {
        text: 'Zrušit'
      },
      {
        text: 'OK',
        onPress: async () => {
          await deleteAccount(user, userId)
          setUser(null)
          navigation.goBack();
        }
      }
    ])
  }

  return (
    <ScrollView className="flex flex-auto">
      <View className="bg-teal-50 shadow-sm w-full rounded-b-2xl pb-5 h-max mb-2 items-center py-5">
        <Text className="text-base text-slate-900">Tady si můžeš změnit své údaje 😊</Text>

      </View>
      <View className="w-[90%] mx-auto">
        <Formik
          initialValues={{ username: username, password: password, confirmPassword: confirmPassword }}
          validationSchema={userSchema}
          onSubmit={(values, actions) => {
            actions.resetForm();
            handleChangeData(values.username, values.password)
          }}
        >
          {(props) => (
            <View className="items-center mt-2">
              <Text className="text-slate-900">Uživatelské jméno</Text>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex w-full h-16 m-2">
                  <TextInput
                    value={props.values.username}
                    placeholder={currentUserName ? currentUserName : 'Jan Novák'}
                    autoCapitalize='none'
                    onChangeText={props.handleChange('username')}
                    onBlur={props.handleBlur('username')}
                    className="border border-stone-500 pl-2.5 h-16 text-lg rounded-lg" />
                </View>
              </TouchableWithoutFeedback>
              <Text className="text-red-600">{props.touched.username && props.errors.username}</Text>
              <Text className="text-slate-900">Heslo</Text>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex w-full h-16 m-2">
                  <TextInput
                    secureTextEntry={true}
                    value={props.values.password}
                    placeholder='&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;'
                    autoCapitalize='none'
                    onChangeText={props.handleChange('password')}
                    onBlur={props.handleBlur('password')}
                    className="border border-stone-500 pl-2.5 h-16 text-lg rounded-lg" />
                </View>
              </TouchableWithoutFeedback>
              <Text className="text-red-600">{props.touched.password && props.errors.password}</Text>
              <Text className="text-slate-900">Heslo znovu pro potvrzení</Text>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex w-full h-16 m-2">
                  <TextInput
                    secureTextEntry={true}
                    value={props.values.confirmPassword}
                    placeholder='&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;'
                    autoCapitalize='none'
                    onChangeText={props.handleChange('confirmPassword')}
                    onBlur={props.handleBlur('confirmPassword')}
                    className="border border-stone-500 pl-2.5 h-16 text-lg rounded-lg" />
                </View>
              </TouchableWithoutFeedback>
              <Text className="text-red-600 mb-5">{props.touched.confirmPassword && props.errors.confirmPassword}</Text>
              <TouchableOpacity onPress={props.handleSubmit} className="bg-teal-600 rounded-xl py-3 px-5">
                <Text className="text-xl text-white font-bold">Změnit údaje</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
      <View className="items-center mt-20">
        <TouchableOpacity onPress={()=> handleDelete(user, user.uid)} className="rounded-xl py-3 px-5 border-red-600 border">
          <Text className="text-xl text-red-600 font-bold text-center ">Smazat účet</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
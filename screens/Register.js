import { View, Text, TouchableOpacity, TextInput, Alert, Keyboard, TouchableWithoutFeedback, ScrollView, Modal } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { FIREBASE_AUTH, usersRef } from '../firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { Formik } from 'formik';
import * as yup from 'yup';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconButton from '../components/IconButton';
import About from './About';

const loginSchema = yup.object({
  email: yup.string().email('Špatně zadaný email').required('Pro registraci je nutné zadat email.'),
  password: yup.string().required('Musíte si zvolit heslo').min(8, 'Heslo je moc krátké'),
  confirmpassword: yup.string().oneOf([yup.ref('password')], 'Hesla nejsou stejná'),
  username: yup.string().required('Zadejte své jméno').min(3)
})

export default function Register({ navigation }) {

  const [modalOpen, setModalOpen] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const auth = FIREBASE_AUTH;

  const signUp = async (email, username, password) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      // console.log(response);
      await sendEmailVerification(response.user);

      const userDoc = doc(usersRef, response.user.uid)

      await setDoc(userDoc, { name: username })

      await AsyncStorage.setItem('user', JSON.stringify(response));

      Alert.alert('Registrace úspěsná!', 'Na email byl odeslán potvrzovací odkaz.', [
        {
          text: 'OK',
        }
      ])
      navigation.push("Survey")
    } catch (error) {

      if (error.message === "Firebase: Error (auth/email-already-in-use).") {
        error.message = "Email je již využíván. "
      }
      console.log(error.message);
      Alert.alert('Registrace nezdařila!', error.message, [
        {
          text: 'OK'
        }
      ])
    }
  }

  const handleRegistration = (email, username, password) => {
    Alert.alert('Registrovat se', 'Registrací souhlasíte s podmínkami používání aplikace. Můžete si je kdykoliv znovu přečíst v aplikaci v sekci Více.', [
      {
        text: 'Zrušit'
      },
      {
        text: 'Souhlasím',
        onPress: () => signUp(email, username, password)
      }
    ])
  }

  return (
    <ScrollView className="flex flex-auto m-5">
      <Modal visible={modalOpen} animationType="slide" className="bg-slate-100">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-col flex-1 justify-between m-5 mt-20 items-center">
            <IconButton
              icon='close'
              onPress={() => setModalOpen(false)}
            />
            <About />
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Formik
        initialValues={{ email: email, username: username, password: password, confirmPassword: confirmPassword }}
        validationSchema={loginSchema}
        onSubmit={(values, actions) => {
          actions.resetForm();
          handleRegistration(values.email, values.username, values.password)
        }}
      >
        {(props) => (
          <View className="items-center mt-2">
            <Text className="text-base mb-2">Zde se můžete bezplatně zaregistrovat 😊 </Text>
            <View className="items-center my-5">
              <IconButton icon='information-circle' onPress={() => setModalOpen(true)} />
            </View>
            <Text className="text-slate-900">Váš e-mail</Text>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="flex w-full h-16 m-2">
                <TextInput
                  value={props.values.email}
                  placeholder='muj@email.cz'
                  autoCapitalize='none'
                  onChangeText={props.handleChange('email')}
                  onBlur={props.handleBlur('email')}
                  className="border border-stone-500 pl-2.5 h-16 text-lg rounded-lg" />
              </View>
            </TouchableWithoutFeedback>
            <Text className="text-red-600">{props.touched.email && props.errors.email}</Text>
            <Text className="text-slate-900">Uživatelské jméno</Text>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="flex w-full h-16 m-2">
                <TextInput
                  value={props.values.username}
                  placeholder='Jan Novák'
                  autoCapitalize='none'
                  onChangeText={props.handleChange('username')}
                  onBlur={props.handleBlur('username')}
                  className="border border-stone-500 pl-2.5 h-16 text-lg rounded-lg" />
              </View>
            </TouchableWithoutFeedback>
            <Text className="text-slate-900">Heslo</Text>
            <Text className="text-red-600">{props.touched.username && props.errors.username}</Text>
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
              <Text className="text-xl text-white font-bold">Zaregistrovat se</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <View className="border-[0.5px] my-10 border-slate-400" />
      <View className="items-center">
        <Text className="text-base m-2 text-slate-900">Již máte účet?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text className="text-xl text-blue-500 font-bold">Přihlášení</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  )
}
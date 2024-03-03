import { View, Text, TouchableOpacity, Button, TextInput, Alert } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { FIREBASE_AUTH, usersRef } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Formik } from 'formik';
import * as yup from 'yup';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loginSchema = yup.object({
  email: yup.string().email('Špatně zadaný email').required('Pro registraci je nutné zadat email.'),
  password: yup.string().required('Musíte si zvolit heslo').min(8),
  username: yup.string().required('Zadejte své jméno').min(3)
})

export default function Register({navigation}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const auth = FIREBASE_AUTH;

    const signUp = async (email, username, password) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);

            const userDoc = doc(usersRef, response.user.uid)

            await setDoc(userDoc, { name: username })

            await AsyncStorage.setItem('user', JSON.stringify(response));

            Alert.alert('Registrace úspěsná!', 'Na email byl odeslán potvrzovací odkaz.', [
              {
                text:'OK'
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
                text:'OK'
              }
            ])
        }
    }
    
  return (
    <View className="flex flex-auto m-5">
            <Formik
                initialValues={{ email: email, username: username, password: password }}
                validationSchema={loginSchema}
                onSubmit={(values, actions) => {
                    // actions.resetForm();
                    signUp(values.email, values.username, values.password)
                }}
            >
                {(props) => (
                    <View className="gap-5 items-center mt-5">
                        <TextInput
                            value={props.values.email}
                            placeholder='muj@email.cz'
                            autoCapitalize='none'
                            onChangeText={props.handleChange('email')}
                            onBlur={props.handleBlur('email')}
                            className="border border-stone-300 p-2.5 text-lg rounded-lg w-full h-16" />
                        <Text className="text-red-600">{props.touched.email && props.errors.email}</Text>
                        <TextInput
                            value={props.values.username}
                            placeholder='Jan Novák'
                            autoCapitalize='none'
                            onChangeText={props.handleChange('username')}
                            onBlur={props.handleBlur('username')}
                            className="border border-stone-300 p-2.5 text-lg rounded-lg w-full h-16" />
                        <Text className="text-red-600">{props.touched.username && props.errors.username}</Text>
                        <TextInput
                            secureTextEntry={true}
                            value={props.values.password}
                            placeholder='&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;'
                            autoCapitalize='none'
                            onChangeText={props.handleChange('password')}
                            onBlur={props.handleBlur('password')}
                            className="border border-stone-300 p-2.5 text-lg rounded-lg w-full h-16" />
                        <Text className="text-red-600 mb-5">{props.touched.password && props.errors.password}</Text>
                        <TouchableOpacity onPress={props.handleSubmit}>
                        <Text className="text-xl text-blue-500 font-bold">Zaregistrovat se</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
            <View className="items-center my-10">
                <Text>Již máte účet?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text className="text-xl text-blue-500 font-bold">Přihlášení</Text>
                </TouchableOpacity>
            </View>

        </View>
  )
}
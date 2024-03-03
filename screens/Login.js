import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Formik } from 'formik';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loginSchema = yup.object({
    email: yup.string().email('Účet buď neexistuje nebo není správně zadaný').required('Zadejte email'),
    password: yup.string().required('Musíte zadat heslo')
})

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = FIREBASE_AUTH;

    const signIn = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            await AsyncStorage.setItem('user', JSON.stringify(response));
            // console.log(response);
            navigation.push("Root")
        } catch (error) {
            if (error.message === 'Firebase: Error (auth/invalid-credential).') {
                error.message = "Neplatné přihlašovací údaje."
            }
            console.log(error.message);
            
            Alert.alert('Přihlášení se nezdařilo', error.message, [
                {
                  text:'OK'
                }
              ])
        }
    }



    return (
        <View className="flex flex-auto m-5">
            <Formik
                initialValues={{ email: email, password: password }}
                validationSchema={loginSchema}
                onSubmit={(values, actions) => {
                    // actions.resetForm();
                    signIn(values.email, values.password)
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
                            className="border border-stone-500 p-2.5 text-lg rounded-lg w-full h-16" />
                        <Text className="text-red-600">{props.touched.email && props.errors.email}</Text>
                        <TextInput
                            secureTextEntry={true}
                            value={props.values.password}
                            placeholder='&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;'
                            autoCapitalize='none'
                            onChangeText={props.handleChange('password')}
                            onBlur={props.handleBlur('password')}
                            className="border border-stone-500 p-2.5 text-lg rounded-lg w-full h-16" />
                        <Text className="text-red-600 mb-5">{props.touched.password && props.errors.password}</Text>
                        <TouchableOpacity onPress={props.handleSubmit}>
                        <Text className="text-xl text-blue-500 font-bold">Přihlásit se</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
            <View className="items-center my-10">
                <Text>Ještě nemáte účet?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                        <Text className="text-xl text-blue-500 font-bold">Vytvořit účet</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}
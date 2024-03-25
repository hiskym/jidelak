import { View, Text, TouchableOpacity, TextInput, Alert, Keyboard, TouchableWithoutFeedback, ScrollView, Modal } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Formik } from 'formik';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconButton from '../components/IconButton';
import PasswordReset from './PasswordReset';

const loginSchema = yup.object({
    email: yup.string().email('Účet buď neexistuje nebo není správně zadaný').required('Zadejte email'),
    password: yup.string().required('Musíte zadat heslo')
})

export default function Login({ navigation }) {

    const [modalOpen, setModalOpen] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = FIREBASE_AUTH;

    const signIn = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            await AsyncStorage.setItem('user', JSON.stringify(response));

            navigation.push("Root")
        } catch (error) {
            if (error.message === 'Firebase: Error (auth/invalid-credential).') {
                error.message = "Neplatné přihlašovací údaje."
            }
            console.log(error.message);

            Alert.alert('Přihlášení se nezdařilo', error.message, [
                {
                    text: 'OK'
                }
            ])
        }
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
                        <PasswordReset />
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <Formik
                initialValues={{ email: email, password: password }}
                validationSchema={loginSchema}
                onSubmit={(values, actions) => {
                    actions.resetForm();
                    signIn(values.email, values.password)
                }}
            >
                {(props) => (

                    <View className="items-center mt-2">
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View className="flex w-full h-16 m-2">
                                <TextInput
                                    value={props.values.email}
                                    placeholder='muj@email.cz'
                                    placeholderTextColor={'gray'}
                                    autoCapitalize='none'
                                    onChangeText={props.handleChange('email')}
                                    onBlur={props.handleBlur('email')}
                                    className="border border-stone-500 pl-2.5 h-16 text-lg rounded-lg" />
                            </View>
                        </TouchableWithoutFeedback>
                        <Text className="text-red-600 mb-2">{props.touched.email && props.errors.email}</Text>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View className="flex w-full h-16 m-2">
                                <TextInput
                                    secureTextEntry={true}
                                    value={props.values.password}
                                    placeholder='&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;'
                                    placeholderTextColor={'gray'}
                                    autoCapitalize='none'
                                    onChangeText={props.handleChange('password')}
                                    onBlur={props.handleBlur('password')}
                                    className="border border-stone-500 pl-2.5 h-16 text-lg rounded-lg " />
                            </View>
                        </TouchableWithoutFeedback>
                        <Text className="text-red-600 mb-5">{props.touched.password && props.errors.password}</Text>
                        <TouchableOpacity onPress={props.handleSubmit} className="bg-teal-600 rounded-xl py-3 px-5">
                            <Text className="text-xl text-white font-bold">Přihlásit se</Text>
                        </TouchableOpacity>


                    </View>
                )}
            </Formik>
            <View className="border-[0.5px] my-10 border-slate-400" />
            <View className="items-center">
                <Text className="text-base m-2 text-slate-900">Ještě nemáte svůj účet?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                    <Text className="text-xl text-blue-500 font-bold">Vytvořit účet</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalOpen(true)}>
                    <Text className="text-base text-blue-500 mt-10 font-bold">Zapomenuté heslo</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    )
}
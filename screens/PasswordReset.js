import { View, Text, TouchableWithoutFeedback, TextInput, Alert, Keyboard, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Formik } from 'formik';
import * as yup from 'yup';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const resetSchema = yup.object({
    email: yup.string().email('Špatně zadaný email').required('Je nutné zadat email.'),
})

export default function PasswordReset() {

    const [email, setEmail] = useState('');

    const resetPassword = async (email) => {
        try {
            const auth = getAuth()
            await sendPasswordResetEmail(auth, email)

            Alert.alert('Reset hesla', 'Na zadaný email byl odeslán odkaz na změnu hesla.', [
                {
                    text: 'OK',
                }
            ])
        } catch (error) {
            if (error.message) {
                error.message = "Email je již využíván. "
            }
            console.log(error.message)
        }
    }

    const handleReset = (email) => {
        Alert.alert('Reset hesla', 'Opravdu chcete resetovat heslo?', [
            {
                text: 'Zrušit'
            },
            {
                text: 'Ano',
                onPress: () => resetPassword(email)
            }
        ])
    }

    return (
        <View className="flex flex-auto m-5 w-full">
            <Formik
                initialValues={{ email: email }}
                validationSchema={resetSchema}
                onSubmit={(values, actions) => {
                    actions.resetForm();
                    handleReset(values.email)
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
                                    className="border border-stone-500 pl-2.5 h-16 text-lg rounded-lg text-slate-900" />
                            </View>
                        </TouchableWithoutFeedback>
                        <Text className="text-red-600 mb-2">{props.touched.email && props.errors.email}</Text>

                        <TouchableOpacity onPress={props.handleSubmit} className="bg-teal-600 rounded-xl py-3 px-5">
                            <Text className="text-xl text-white font-bold">Obnovit heslo</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </View>
    )
}
import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { Formik } from 'formik';
import * as yup from 'yup'
import IconButton from '../components/IconButton';

const itemSchema = yup.object({
    amount: yup.number().required('Je nutné zadat množství').min(1).typeError('Množství musí být číslo'),
    title: yup.string().required('Je nutné zadat název').min(1),
    unit: yup.string().required('Je nutné zadat jednotku').min(1)
})

export default function ShoppingListForm({addToCart}) {
    return (
        <View className="flex flex-auto">
            <Formik
                initialValues={{ amount: '', title: '', unit: '' }}
                validationSchema={itemSchema}
                onSubmit={(values, actions) => {
                    actions.resetForm();
                    addToCart({title: values.title.toLowerCase(), amount: parseFloat(values.amount), unit: values.unit.toLowerCase()});
                }}
            >
                {(props) => (
                    <View className="gap-5 items-center mt-5">
                        <Text className="text-lg">Přidání položky do nákupního seznamu</Text>
                        <TextInput
                            placeholder='Název položky'
                            onChangeText={props.handleChange('title')}
                            value={props.values.title}
                            onBlur={props.handleBlur('title')}
                            className="border border-stone-300 p-2.5 text-lg rounded-lg w-full"
                        />
                        <Text className="text-red-600">{props.touched.title && props.errors.title}</Text>
                        <TextInput
                            placeholder='Množství'
                            onChangeText={props.handleChange('amount')}
                            value={props.values.amount}
                            onBlur={props.handleBlur('amount')}
                            className="border border-stone-300 p-2.5 text-lg rounded-lg w-full"
                        />
                        <Text className="text-red-600">{props.touched.amount && props.errors.amount}</Text>
                        <TextInput
                            placeholder='Jednotka množství (např. g)'
                            onChangeText={props.handleChange('unit')}
                            value={props.values.unit}
                            onBlur={props.handleBlur('unit')}
                            className="border border-stone-300 p-2.5 text-lg rounded-lg w-full"
                        />
                        <Text className="text-red-600 mb-5">{props.touched.unit && props.errors.unit}</Text>
                        <IconButton icon={"send"} onPress={props.handleSubmit} />
                    </View>
                )}
            </Formik>
        </View>
    )
}
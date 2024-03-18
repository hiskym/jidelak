import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { Formik } from 'formik';
import * as yup from 'yup'
import IconButton from '../components/IconButton';
import { unitValues } from '../utils/PickerValues';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../styles/GlobalStyles';

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
                    <View className="items-center mt-5">
                        <Text className="text-lg mb-2 text-slate-900">Přidání položky do nákupního seznamu</Text>
                        <TextInput
                            placeholder='Název položky'
                            onChangeText={props.handleChange('title')}
                            value={props.values.title}
                            onBlur={props.handleBlur('title')}
                            className="border border-stone-500 pl-2 h-16 text-lg rounded-lg w-full"
                            placeholderTextColor={'gray'}
                        />
                        <Text className="text-red-600 my-2">{props.touched.title && props.errors.title}</Text>
                        <TextInput
                            placeholder='Množství'
                            onChangeText={props.handleChange('amount')}
                            value={props.values.amount}
                            onBlur={props.handleBlur('amount')}
                            className="border border-stone-500 pl-2 h-16 text-lg rounded-lg w-full"
                            placeholderTextColor={'gray'}
                        />
                        <Text className="text-red-600 my-2">{props.touched.amount && props.errors.amount}</Text>
                        <Picker
                            selectedValue={props.values.unit}
                            onValueChange={(unitValue) => {
                                props.setFieldValue('unit', unitValue)
                            }}
                            style={styles.pickerSurvey}
                            >
                            {unitValues.map((unitValue, key) => (
                                <Picker.Item key={key} label={unitValue.label} value={unitValue.value} />
                            ))}
                        </Picker>
                        <Text className="text-red-600 mt-2 mb-5">{props.touched.unit && props.errors.unit}</Text>
                        <IconButton icon={"send"} onPress={props.handleSubmit} />
                    </View>
                )}
            </Formik>
        </View>
    )
}
import { View, Text, Button, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup';
import { usersRef } from '../firebaseConfig';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useUserStore } from '../store/UserStore';
import { Picker } from '@react-native-picker/picker';

// dotaznik, aby se cloveku vytvoril sam jidelnicek

const surveySchema = yup.object({
  activity: yup.string().required('Zvolte stupeň aktivity'),
  //alergies mozna zmenit na array, respektive picker?
  alergies: yup.string().required('Zvolte své alergie'),
  age: yup.number().required('Zadejte svůj věk').min(1).typeError('Věk musí být číslo'),
  weight: yup.number().required('Zadejte svoji váhu v kg').min(1).typeError('Váha musí být číslo'),
  height: yup.number().required('Zadejte svoji výšku cm').min(1).typeError('Výška musí být číslo'),
  gender: yup.string().required('Zvolte svoje biologické pohlaví (muž nebo žena)'),
  goal: yup.string().required('Zvolte svůj cíl'),
  diet: yup.string().required('Zvolte preferovaný způsob stravování'),
})

export default function Survey({navigation}) {

  const { user } = useUserStore();

  const [alergies, setAlergies] = useState('');

  const [diet, setDiet] = useState(''); //musi byt array

  const [macros, setMacros] = useState({});

  const [age, setAge] = useState(0);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [activity, setActivity] = useState('');
  const [goal, setGoal] = useState('');
  const [gender, setGender] = useState('');

  const calculate = async (weight, height, age, gender, activity, goal) => {
    try {

      let activityCalories = 0;

      let goalCalories = 0;

      let basalCalories = 0;

      if (gender === 'female') {
        basalCalories = (655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age));
      } else if (gender === 'male') {
        basalCalories = (66.5 + (13.75 * weight) + (5.003 * height) - (6.755 * age));
      }

      activityCalories = calculateActiveCalories(basalCalories, activity)

      goalCalories = calculateGoalCalories(goalCalories, activityCalories, goal)

      return calculateMacros(goalCalories);

    } catch (error) {
      console.log('Error calculating:', error)
      return null
    }

  }

  const calculateActiveCalories = (basalCalories, activity) => {
    if (activity === 'zero') {
      activityCalories = basalCalories * 1.2;
    } else if (activity === 'light') {
      activityCalories = basalCalories * 1.375;
    } else if (activity === 'moderate') {
      activityCalories = basalCalories * 1.55;
    } else if (activity === 'heavy') {
      activityCalories = basalCalories * 1.725;
    }
    return activityCalories;
  }

  const calculateGoalCalories = (goalCalories, activityCalories, goal) => {
    if (goal === 'cut') {
      goalCalories = activityCalories - 300;
    } else if (goal === 'maintain') {
      goalCalories = activityCalories;
    } else if (goal === 'bulk') {
      goalCalories = activityCalories + 300;
    }
    return goalCalories;
  }

  const calculateMacros = (goalCalories) => {

    const updatedMacros = {
      calories: Math.round(goalCalories),
      proteins: Math.round((goalCalories * 0.25) / 4),
      carbs: Math.round((goalCalories * 0.25) / 2),
      fats: Math.round((goalCalories * 0.25) / 9),
      fiber: Math.round(goalCalories / 100)
    };

    setMacros(updatedMacros);
    return updatedMacros;
  }

  const handleUserInfo = async (activity, alergies, age, weight, height, gender, goal, diet) => {
    try {

      const calculatedMacros = await calculate(weight, height, age, gender, activity, goal);

      if (calculatedMacros) {
        const userDoc = doc(usersRef, user.uid)
        await updateDoc(userDoc, {
          activity: activity,
          alergies: alergies,
          age: age,
          weight: weight,
          height: height,
          gender: gender,
          goal: goal,
          diet: diet,
          macros: calculatedMacros
        })
        Alert.alert(
          'Vaše kalorické hodnoty',
          `Na základě zadaných údajů vám byly vypočítány tyto denní nutriční hodnoty:
  Kalorie: ${calculatedMacros.calories} kcal
  Sacharidy: ${calculatedMacros.carbs} g
  Tuky: ${calculatedMacros.fats} g
  Bílkoviny: ${calculatedMacros.proteins} g
  Vláknina: ${calculatedMacros.fiber} g
  Hodnoty si můžete kdykoliv přepočítat v nastavení aplikace.`,
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('Macros set.')
                navigation.goBack()
              }
            }
          ])
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleCancel = () => {
    Alert.alert(
      'Jste si jistí?',
      'Opravdu nechcete vyplnit anonymní dotazník? Můžete ho kdykoliv znovu vyplnit v nastavení.',
      [
        {
          text: 'Zrušit',
          onPress: () => { console.log('canceled')
          }
        },
        {
          text: 'OK',
          onPress: () => {
            navigation.push('Root')
          }
        }
      ])
  }

  return (
    <ScrollView className="flex flex-auto">
      <View className="gap-2 m-2 ">
        <Text className="text-center mt-2 text-lg">Pro správné fungování aplikace je nutné vyplnit následující pole. 😊</Text>
        <Text className="text-center text-lg">Pokud je nevyplníte, není možné dostávat doporučení a individualizované jídelníčky.</Text>
      </View>

      <Formik
        initialValues={{ activity: activity, alergies: alergies, age: age, weight: weight, height: height, gender: gender, goal: goal, diet: diet }}
        validationSchema={surveySchema}
        onSubmit={(values, actions) => {
          handleUserInfo(values.activity, values.alergies, parseFloat(values.age), parseFloat(values.weight), parseFloat(values.height), values.gender, values.goal, values.diet)
          actions.resetForm();
        }}
      >
        {(props) => (
          <View className="items-center mt-2 w-full p-4">
            <Picker
              selectedValue={props.values.activity}
              onValueChange={props.handleChange('activity')}
              style={styles.picker}
            >
              <Picker.Item label="Zvolte stupeň aktivity" value="" />
              <Picker.Item label="Žádná" value="zero" />
              <Picker.Item label="1-2 tréninky týdně" value="light" />
              <Picker.Item label="3-5 tréninků týdně" value="moderate" />
              <Picker.Item label="6-7 tréninků týdně" value="heavy" />
            </Picker>

            <Text className="text-red-600">{props.touched.activity && props.errors.activity}</Text>
            <TextInput
              value={props.values.alergies}
              placeholder='alergie'
              autoCapitalize='none'
              onChangeText={props.handleChange('alergies')}
              onBlur={props.handleBlur('alergies')}
              className="border border-stone-500 p-2.5 text-lg rounded-lg w-full h-16" />
            <Text className="text-red-600">{props.touched.alergies && props.errors.alergies}</Text>
            <TextInput
              value={props.values.age}
              placeholder='Věk'
              autoCapitalize='none'
              onChangeText={props.handleChange('age')}
              onBlur={props.handleBlur('age')}
              className="border border-stone-500 p-2.5 text-lg rounded-lg w-full h-16" />
            <Text className="text-red-600">{props.touched.age && props.errors.age}</Text>
            <TextInput
              value={props.values.weight}
              placeholder='Váha'
              autoCapitalize='none'
              onChangeText={props.handleChange('weight')}
              onBlur={props.handleBlur('weight')}
              className="border border-stone-500 p-2.5 text-lg rounded-lg w-full h-16" />
            <Text className="text-red-600">{props.touched.weight && props.errors.weight}</Text>
            <TextInput
              value={props.values.height}
              placeholder='výška'
              autoCapitalize='none'
              onChangeText={props.handleChange('height')}
              onBlur={props.handleBlur('height')}
              className="border border-stone-500 p-2.5 text-lg rounded-lg w-full h-16" />
            <Text className="text-red-600">{props.touched.height && props.errors.height}</Text>
            <Picker
              selectedValue={props.values.gender}
              onValueChange={props.handleChange('gender')}
              style={styles.picker}
            >
              <Picker.Item label="Zvolte své biologické pohlaví" value="" />
              <Picker.Item label="muž" value="male" />
              <Picker.Item label="žena" value="female" />
            </Picker>
            <Text className="text-red-600">{props.touched.gender && props.errors.gender}</Text>
            <Picker
              selectedValue={props.values.goal}
              onValueChange={props.handleChange('goal')}
              style={styles.picker}
            >
              <Picker.Item label="Zvolte svůj cíl" value="" />
              <Picker.Item label="zhubnout" value="cut" />
              <Picker.Item label="udržet se" value="maintain" />
              <Picker.Item label="nabrat" value="bulk" />
            </Picker>
            <Text className="text-red-600">{props.touched.goal && props.errors.goal}</Text>
            <TextInput
              value={props.values.diet}
              placeholder='dieta'
              autoCapitalize='none'
              onChangeText={props.handleChange('diet')}
              onBlur={props.handleBlur('diet')}
              className="border border-stone-500 p-2.5 text-lg rounded-lg w-full h-16" />
            <Text className="text-red-600">{props.touched.diet && props.errors.diet}</Text>
            <View className="flex flex-row gap-5">
              <TouchableOpacity onPress={() => handleCancel()}>
                <Text className="text-xl text-red-500 font-bold">Nechci vyplnit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={props.handleSubmit}>
                <Text className="text-xl text-blue-500 font-bold">Nastavit údaje</Text>
              </TouchableOpacity>
            </View>
            
          </View>
        )}
      </Formik>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  picker: {
    height: 64, 
    width: '100%', 
    borderColor: 'rgb(120 113 108)', 
    borderWidth: 1, 
    borderRadius: 8, 
    alignContent: 'center', 
    justifyContent: 'center', 
    overflow: 'hidden',
  }
})
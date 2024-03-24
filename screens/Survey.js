import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup';
import { usersRef } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { useUserStore } from '../store/UserStore';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../styles/GlobalStyles';
import { activities, goalValues, ageValues, weightValues, heightValues, genderValues, dietValues } from '../utils/PickerValues';

const surveySchema = yup.object({
  activity: yup.string().required('Zvolte stupeň aktivity'),
  // alergies: yup.string().required('Zvolte své alergie').typeError('Zadejte své alergie'),
  age: yup.number().required('Zadejte svůj věk').min(1, 'Věk musí být alespoň 13 let').typeError('Věk musí být číslo'),
  weight: yup.number().required('Zadejte svoji váhu v kg').min(1, 'Váha musí být alespoň 20 kg').typeError('Váha musí být číslo'),
  height: yup.number().required('Zadejte svoji výšku cm').min(1, 'Výška musí být alespoň 100 cm').typeError('Výška musí být číslo'),
  gender: yup.string().required('Zvolte svoje biologické pohlaví (muž nebo žena)'),
  goal: yup.string().required('Zvolte svůj cíl'),
  diet: yup.string().required('Zvolte preferovaný způsob stravování').typeError('Zadejte svou dietu'),
})

export default function Survey({ navigation }) {

  const { user } = useUserStore();

  const [alergies, setAlergies] = useState([]);

  const [diet, setDiet] = useState([]);

  const [macros, setMacros] = useState({});

  const [age, setAge] = useState(0);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [activity, setActivity] = useState('');
  const [goal, setGoal] = useState('');
  const [gender, setGender] = useState('');

  const [open, setOpen] = useState(false);

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
                // console.log('Macros set.')
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
          onPress: () => {
            console.log('canceled')
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
      <View className="p-3 items-center bg-teal-50 mb-4 rounded-b-2xl shadow-sm">
        <Text className="text-center mt-2 text-lg text-slate-900">Pro správné fungování aplikace je nutné vyplnit následující pole. 😊</Text>
        <Text className="text-center text-lg text-slate-900">Pokud je nevyplníte, není možné dostávat doporučení a individualizované jídelníčky.</Text>
        <Text className="text-center text-lg text-slate-900">V každém poli musíte vybrat jednu z hodnot.</Text>
      </View>

      <Formik
        initialValues={{ activity: activity, alergies: alergies, age: age, weight: weight, height: height, gender: gender, goal: goal, diet: diet }}
        validationSchema={surveySchema}
        onSubmit={(values, actions) => {
          handleUserInfo(
            values.activity,
            // values.alergies.split(','), //alergies for later use
            values.alergies,
            parseFloat(values.age),
            parseFloat(values.weight),
            parseFloat(values.height),
            values.gender, values.goal,
            values.diet.split(',')
          )
          actions.resetForm();
        }}
      >
        {(props) => (
          <View className="items-center w-full px-4 pb-4">
            <Picker
              selectedValue={props.values.activity}
              onValueChange={props.handleChange('activity')}
              style={styles.pickerSurvey}
              mode='dropdown'
            >
              {activities.map((activity, key) => (
                <Picker.Item key={key} label={activity.label} value={activity.value} />
              ))}
            </Picker>
            <Text className="text-red-600">{props.touched.activity && props.errors.activity}</Text>

            {/* alergies for later use */}
            {/* <Picker
              selectedValue={props.values.alergies}
              onValueChange={props.handleChange('alergies')}
              style={styles.pickerSurvey}
            >
              {alergiesValues.map((alergy, key) => (
                <Picker.Item key={key} label={alergy.label} value={alergy.value.join(',')} />
              ))}
            </Picker>
            <Text className="text-red-600">{props.touched.alergies && props.errors.alergies}</Text> */}

            <Picker
              selectedValue={props.values.age}
              onValueChange={(ageValue) => {
                props.setFieldValue('age', ageValue)
              }}
              style={styles.pickerSurvey}
            >
              {ageValues.map((ageValue, key) => (
                <Picker.Item key={key} label={ageValue.label} value={ageValue.value} />
              ))}
            </Picker>
            <Text className="text-red-600">{props.touched.age && props.errors.age}</Text>

            <Picker
              selectedValue={props.values.weight}
              onValueChange={(weightValue) => {
                props.setFieldValue('weight', weightValue)
              }}
              style={styles.pickerSurvey}
            >
              {weightValues.map((weightValue, key) => (
                <Picker.Item key={key} label={weightValue.label} value={weightValue.value} />
              ))}
            </Picker>
            <Text className="text-red-600">{props.touched.weight && props.errors.weight}</Text>

            <Picker
              selectedValue={props.values.height}
              onValueChange={(heightValue) => {
                props.setFieldValue('height', heightValue)
              }}
              style={styles.pickerSurvey}
            >
              {heightValues.map((heightValue, key) => (
                <Picker.Item key={key} label={heightValue.label} value={heightValue.value} />
              ))}
            </Picker>
            <Text className="text-red-600">{props.touched.height && props.errors.height}</Text>

            <Picker
              selectedValue={props.values.gender}
              onValueChange={props.handleChange('gender')}
              style={styles.pickerSurvey}
            >
              {genderValues.map((gender, key) => (
                <Picker.Item key={key} label={gender.label} value={gender.value} />
              ))}
            </Picker>
            <Text className="text-red-600">{props.touched.gender && props.errors.gender}</Text>

            <Picker
              selectedValue={props.values.goal}
              onValueChange={props.handleChange('goal')}
              style={styles.pickerSurvey}
            >
              {goalValues.map((goal, key) => (
                <Picker.Item key={key} label={goal.label} value={goal.value} />
              ))}
            </Picker>
            <Text className="text-red-600">{props.touched.goal && props.errors.goal}</Text>

            <Picker
              selectedValue={props.values.diet}
              onValueChange={props.handleChange('diet')}
              style={styles.pickerSurvey}
            >
              {dietValues.map((diet, key) => (
                <Picker.Item key={key} label={diet.label} value={diet.value} />
              ))}
            </Picker>
            <Text className="text-red-600">{props.touched.diet && props.errors.diet}</Text>

            <View className="flex flex-row mb-5">
              <TouchableOpacity onPress={() => handleCancel()} className="bg-red-500 rounded-xl p-3 mr-2">
                <Text className="text-xl text-white font-bold">Nechci vyplnit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={props.handleSubmit} className="bg-teal-600 rounded-xl p-3 ml-2">
                <Text className="text-xl text-white font-bold">Nastavit údaje</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}
      </Formik>
    </ScrollView>
  )
}